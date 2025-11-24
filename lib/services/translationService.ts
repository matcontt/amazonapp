import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSLATION_API = 'https://api.mymemory.translated.net/get';
const CACHE_KEY = '@amazonapp:translations';
const CACHE_VERSION = 'v1'; // Incrementar si cambias lógica de traducción

interface TranslationCache {
  [key: string]: {
    title: string;
    description: string;
    timestamp: number;
  };
}

// Helper para limpiar texto antes de traducir
const cleanText = (text: string): string => {
  return text
    .replace(/\n+/g, ' ') // Reemplazar saltos de línea
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim()
    .substring(0, 500); // Limitar a 500 chars para API gratuita
};

// Traducir un texto individual
const translateText = async (text: string, fromLang: string = 'en', toLang: string = 'es'): Promise<string> => {
  try {
    const cleanedText = cleanText(text);
    
    const response = await axios.get(TRANSLATION_API, {
      params: {
        q: cleanedText,
        langpair: `${fromLang}|${toLang}`,
      },
      timeout: 8000,
    });

    if (response.data?.responseData?.translatedText) {
      return response.data.responseData.translatedText;
    }

    console.warn('⚠️ [TRANSLATION] Respuesta inválida, usando texto original');
    return text;
  } catch (error: any) {
    console.error('❌ [TRANSLATION] Error traduciendo:', error.message);
    return text; // Fallback al texto original
  }
};

// Delay entre requests para no saturar API gratuita
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const translationService = {
  // Traducir múltiples productos
  translateProducts: async (
    products: Array<{ id: number; title: string; description: string }>
  ): Promise<Map<number, { title: string; description: string }>> => {
    const translations = new Map<number, { title: string; description: string }>();

    try {
      // Cargar cache existente
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      let cache: TranslationCache = {};
      
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (parsed.version === CACHE_VERSION) {
          cache = parsed.data;
          console.log('📦 [TRANSLATION] Cache cargado con', Object.keys(cache).length, 'traducciones');
        } else {
          console.log('🔄 [TRANSLATION] Cache obsoleto, limpiando...');
        }
      }

      let translatedCount = 0;
      let fromCacheCount = 0;

      for (const product of products) {
        const cacheKey = `${product.id}`;

        // Verificar si ya está en cache
        if (cache[cacheKey]) {
          translations.set(product.id, {
            title: cache[cacheKey].title,
            description: cache[cacheKey].description,
          });
          fromCacheCount++;
          continue;
        }

        // Traducir título y descripción
        console.log(`🌍 [TRANSLATION] Traduciendo producto ${product.id}: ${product.title.substring(0, 30)}...`);
        
        const [translatedTitle, translatedDescription] = await Promise.all([
          translateText(product.title),
          translateText(product.description),
        ]);

        const translation = {
          title: translatedTitle,
          description: translatedDescription,
        };

        translations.set(product.id, translation);
        
        // Guardar en cache
        cache[cacheKey] = {
          ...translation,
          timestamp: Date.now(),
        };

        translatedCount++;

        // Delay de 300ms entre traducciones para no saturar API
        if (translatedCount < products.length) {
          await delay(300);
        }
      }

      // Guardar cache actualizado
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
        version: CACHE_VERSION,
        data: cache,
      }));

      console.log(`✅ [TRANSLATION] Completado: ${translatedCount} nuevas, ${fromCacheCount} desde cache`);

      return translations;
    } catch (error: any) {
      console.error('❌ [TRANSLATION] Error general:', error.message);
      
      // En caso de error, devolver textos originales
      products.forEach(product => {
        translations.set(product.id, {
          title: product.title,
          description: product.description,
        });
      });

      return translations;
    }
  },

  // Traducir un solo producto
  translateProduct: async (
    product: { id: number; title: string; description: string }
  ): Promise<{ title: string; description: string }> => {
    const translations = await translationService.translateProducts([product]);
    return translations.get(product.id) || {
      title: product.title,
      description: product.description,
    };
  },

  // Limpiar cache de traducciones
  clearCache: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      console.log('🗑️ [TRANSLATION] Cache limpiado');
    } catch (error) {
      console.error('❌ [TRANSLATION] Error limpiando cache:', error);
    }
  },

  // Verificar si hay traducciones en cache
  hasCachedTranslations: async (): Promise<boolean> => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return false;

      const parsed = JSON.parse(cached);
      return parsed.version === CACHE_VERSION && Object.keys(parsed.data).length > 0;
    } catch {
      return false;
    }
  },
};
