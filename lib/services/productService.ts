import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/lib/types/product';

const API_URL = 'https://fakestoreapi.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// IDs fijos de productos que SIEMPRE tendrán descuento
const DISCOUNTED_PRODUCT_IDS = [1, 3, 5, 7, 9, 11, 15, 18];

// Descuentos específicos por producto (consistentes)
const DISCOUNT_MAP: Record<number, number> = {
  1: 35,  // Backpack
  3: 25,  // Men's Cotton Jacket
  5: 40,  // Women's Necklace
  7: 20,  // Women's Ring
  9: 45,  // WD 2TB Hard Drive
  11: 30, // Men's T-Shirt
  15: 15, // Women's Jacket
  18: 50, // MBJ Women's Jacket
};

// Función para aplicar descuentos FIJOS
const addDiscountsToProducts = (products: Product[]): Product[] => {
  return products.map(product => {
    // Solo aplicar descuento si el ID está en la lista
    if (DISCOUNTED_PRODUCT_IDS.includes(product.id)) {
      const discount = DISCOUNT_MAP[product.id] || 20;
      const originalPrice = product.price;
      const discountedPrice = originalPrice * (1 - discount / 100);
      
      console.log(`🔥 [DISCOUNT] ID ${product.id}: ${product.title} - ${discount}% OFF`);
      
      return {
        ...product,
        discount,
        originalPrice,
        price: Math.round(discountedPrice * 100) / 100,
      };
    }
    
    return product;
  });
};

// Cache de productos para evitar recalcular
const CACHE_KEY = '@amazonapp:products_with_discounts';
const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutos

export const productService = {
  // Obtener todos los productos con cache
  getAllProducts: async (forceRefresh: boolean = false): Promise<Product[]> => {
    try {
      // Intentar obtener del cache primero
      if (!forceRefresh) {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const { products, timestamp } = JSON.parse(cached);
          const now = Date.now();
          
          // Si el cache no ha expirado, usarlo
          if (now - timestamp < CACHE_EXPIRY) {
            console.log('📦 [CACHE] Usando productos cacheados');
            return products;
          }
        }
      }

      console.log('📦 [API] Fetching productos desde FakeStore...');
      const response = await api.get<Product[]>('/products');
      const productsWithDiscounts = addDiscountsToProducts(response.data);
      
      // Guardar en cache
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
        products: productsWithDiscounts,
        timestamp: Date.now(),
      }));
      
      const discountCount = productsWithDiscounts.filter(p => p.discount).length;
      console.log(`✅ ${productsWithDiscounts.length} productos obtenidos (${discountCount} con descuento)`);
      
      return productsWithDiscounts;
    } catch (error) {
      console.error('❌ Error fetching productos:', error);
      throw error;
    }
  },

  // Obtener producto por ID
  getProductById: async (id: number): Promise<Product> => {
    try {
      console.log(`📦 Fetching producto ${id}...`);
      const response = await api.get<Product>(`/products/${id}`);
      const [productWithDiscount] = addDiscountsToProducts([response.data]);
      console.log(`✅ Producto obtenido: ${productWithDiscount.title}`);
      return productWithDiscount;
    } catch (error) {
      console.error(`❌ Error fetching producto ${id}:`, error);
      throw error;
    }
  },

  // Obtener productos por categoría
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      console.log(`📦 Fetching productos de categoría: ${category}...`);
      const response = await api.get<Product[]>(`/products/category/${category}`);
      const productsWithDiscounts = addDiscountsToProducts(response.data);
      console.log(`✅ ${productsWithDiscounts.length} productos obtenidos`);
      return productsWithDiscounts;
    } catch (error) {
      console.error(`❌ Error fetching categoría ${category}:`, error);
      throw error;
    }
  },

  // Obtener todas las categorías (incluyendo "Ofertas")
  getCategories: async (): Promise<string[]> => {
    try {
      console.log('📂 Fetching categorías...');
      const response = await api.get<string[]>('/products/categories');
      
      // Agregar categoría "Ofertas" al inicio
      const categoriesWithOffers = ['🔥 Ofertas', ...response.data];
      console.log(`✅ ${categoriesWithOffers.length} categorías obtenidas (incluyendo Ofertas)`);
      return categoriesWithOffers;
    } catch (error) {
      console.error('❌ Error fetching categorías:', error);
      throw error;
    }
  },

  // NUEVO: Obtener solo productos con descuento
  getDiscountedProducts: async (): Promise<Product[]> => {
    try {
      const allProducts = await productService.getAllProducts();
      const discounted = allProducts.filter(p => p.discount);
      console.log(`🔥 ${discounted.length} productos en oferta`);
      return discounted;
    } catch (error) {
      console.error('❌ Error fetching productos con descuento:', error);
      throw error;
    }
  },

  // Obtener productos limitados
  getLimitedProducts: async (limit: number): Promise<Product[]> => {
    try {
      console.log(`📦 Fetching ${limit} productos...`);
      const response = await api.get<Product[]>(`/products?limit=${limit}`);
      const productsWithDiscounts = addDiscountsToProducts(response.data);
      console.log(`✅ ${productsWithDiscounts.length} productos obtenidos`);
      return productsWithDiscounts;
    } catch (error) {
      console.error('❌ Error fetching productos limitados:', error);
      throw error;
    }
  },

  // NUEVO: Limpiar cache (útil para forzar actualización)
  clearCache: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      console.log('🗑️ Cache de productos limpiado');
    } catch (error) {
      console.error('❌ Error limpiando cache:', error);
    }
  },
};
