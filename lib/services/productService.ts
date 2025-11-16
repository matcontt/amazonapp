import axios from 'axios';
import { Product } from '@/lib/types/product';

const API_URL = 'https://fakestoreapi.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const productService = {
  // Obtener todos los productos
  getAllProducts: async (): Promise<Product[]> => {
    try {
      console.log('📦 Fetching todos los productos...');
      const response = await api.get<Product[]>('/products');
      console.log(`✅ ${response.data.length} productos obtenidos`);
      return response.data;
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
      console.log(`✅ Producto obtenido: ${response.data.title}`);
      return response.data;
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
      console.log(`✅ ${response.data.length} productos obtenidos`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching categoría ${category}:`, error);
      throw error;
    }
  },

  // Obtener todas las categorías
  getCategories: async (): Promise<string[]> => {
    try {
      console.log('📂 Fetching categorías...');
      const response = await api.get<string[]>('/products/categories');
      console.log(`✅ ${response.data.length} categorías obtenidas`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching categorías:', error);
      throw error;
    }
  },

  // Obtener productos limitados
  getLimitedProducts: async (limit: number): Promise<Product[]> => {
    try {
      console.log(`📦 Fetching ${limit} productos...`);
      const response = await api.get<Product[]>(`/products?limit=${limit}`);
      console.log(`✅ ${response.data.length} productos obtenidos`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching productos limitados:', error);
      throw error;
    }
  },
};
