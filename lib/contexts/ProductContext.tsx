import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types/product';
import { productService } from '@/lib/services/productService';
import { translationService } from '@/lib/services/translationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProductContextType {
  products: Product[];
  categories: string[];
  loading: boolean;
  translating: boolean; // NUEVO
  error: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  filteredProducts: Product[];
  translationsEnabled: boolean; // NUEVO
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  refreshProducts: () => Promise<void>;
  getProductById: (id: number) => Product | undefined;
  toggleTranslations: () => Promise<void>; // NUEVO
  retranslate: () => Promise<void>; // NUEVO
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const TRANSLATIONS_KEY = '@amazonapp:translations_enabled';

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]); // NUEVO
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false); // NUEVO
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [translationsEnabled, setTranslationsEnabled] = useState(true); // NUEVO

  // Cargar preferencia de traducciones
  useEffect(() => {
    loadTranslationPreference();
  }, []);

  // Cargar productos y categorías al iniciar
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadTranslationPreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(TRANSLATIONS_KEY);
      if (saved !== null) {
        setTranslationsEnabled(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error cargando preferencia de traducciones:', error);
    }
  };

  const loadInitialData = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // Cargar productos de la API
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(forceRefresh),
        productService.getCategories(),
      ]);

      setOriginalProducts(productsData);

      // Verificar si hay traducciones en cache
      const hasCached = await translationService.hasCachedTranslations();
      
      if (hasCached) {
        console.log('📦 [PRODUCTS] Aplicando traducciones desde cache...');
        const translatedProducts = await applyTranslations(productsData);
        setProducts(translatedProducts);
      } else {
        // Mostrar productos en inglés primero
        setProducts(productsData);
        
        // Traducir en background
        console.log('🌍 [PRODUCTS] Iniciando traducción de productos...');
        translateProductsInBackground(productsData);
      }

      setCategories(categoriesData);
      
      const discountCount = productsData.filter(p => p.discount).length;
      console.log(`✅ Datos iniciales cargados: ${productsData.length} productos (${discountCount} con descuento)`);
    } catch (err: any) {
      console.error('❌ Error cargando datos:', err);
      setError('Error al cargar productos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const translateProductsInBackground = async (productsToTranslate: Product[]) => {
    try {
      setTranslating(true);

      const translations = await translationService.translateProducts(
        productsToTranslate.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
        }))
      );

      // Aplicar traducciones a los productos
      const translatedProducts = productsToTranslate.map(product => {
        const translation = translations.get(product.id);
        if (translation) {
          return {
            ...product,
            title: translation.title,
            description: translation.description,
          };
        }
        return product;
      });

      setProducts(translatedProducts);
      console.log('✅ [PRODUCTS] Traducciones aplicadas correctamente');
    } catch (error) {
      console.error('❌ Error traduciendo productos:', error);
    } finally {
      setTranslating(false);
    }
  };

  const applyTranslations = async (productsToTranslate: Product[]): Promise<Product[]> => {
    const translations = await translationService.translateProducts(
      productsToTranslate.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
      }))
    );

    return productsToTranslate.map(product => {
      const translation = translations.get(product.id);
      if (translation) {
        return {
          ...product,
          title: translation.title,
          description: translation.description,
        };
      }
      return product;
    });
  };

  const toggleTranslations = async () => {
    try {
      const newValue = !translationsEnabled;
      setTranslationsEnabled(newValue);
      await AsyncStorage.setItem(TRANSLATIONS_KEY, JSON.stringify(newValue));

      if (newValue) {
        // Activar traducciones
        setTranslating(true);
        const translated = await applyTranslations(originalProducts);
        setProducts(translated);
        setTranslating(false);
      } else {
        // Desactivar traducciones (volver a inglés)
        setProducts(originalProducts);
      }
    } catch (error) {
      console.error('Error toggling translations:', error);
    }
  };

  const retranslate = async () => {
    try {
      await translationService.clearCache();
      setTranslating(true);
      const translated = await applyTranslations(originalProducts);
      setProducts(translated);
      setTranslating(false);
    } catch (error) {
      console.error('Error re-traduciendo:', error);
      setTranslating(false);
    }
  };

  const refreshProducts = async () => {
    await loadInitialData(true);
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find(p => p.id === id);
  };

  // Filtrar productos según categoría y búsqueda
  const filteredProducts = products.filter(product => {
    if (selectedCategory === '🔥 Ofertas') {
      const hasDiscount = !!product.discount;
      const matchesSearch = !searchQuery || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return hasDiscount && matchesSearch;
    }
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        translating,
        error,
        selectedCategory,
        searchQuery,
        filteredProducts,
        translationsEnabled,
        setSelectedCategory,
        setSearchQuery,
        refreshProducts,
        getProductById,
        toggleTranslations,
        retranslate,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

