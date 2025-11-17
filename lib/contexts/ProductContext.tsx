import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types/product';
import { productService } from '@/lib/services/productService';

interface ProductContextType {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  filteredProducts: Product[];
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  refreshProducts: () => Promise<void>;
  getProductById: (id: number) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cargar productos y categorías al iniciar
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(forceRefresh),
        productService.getCategories(),
      ]);

      setProducts(productsData);
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

  const refreshProducts = async () => {
    await loadInitialData(true); // Forzar refresh (ignorar cache)
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find(p => p.id === id);
  };

  // Filtrar productos según categoría y búsqueda
  const filteredProducts = products.filter(product => {
    // Filtro especial para categoría "Ofertas"
    if (selectedCategory === '🔥 Ofertas') {
      const hasDiscount = !!product.discount;
      const matchesSearch = !searchQuery || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return hasDiscount && matchesSearch;
    }
    
    // Filtro normal por categoría
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
        error,
        selectedCategory,
        searchQuery,
        filteredProducts,
        setSelectedCategory,
        setSearchQuery,
        refreshProducts,
        getProductById,
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

