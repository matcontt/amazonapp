import { getGeminiModel, isGeminiEnabled } from '@/lib/config/gemini';
import { Product } from '@/lib/types/product';
import { CartItem } from '@/lib/types/cart';

// Timeout helper
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: La solicitud tardó demasiado')), ms)
    ),
  ]);
};

export const aiService = {
  getCartRecommendations: async (
    cartItems: CartItem[],
    allProducts: Product[]
  ): Promise<Product[]> => {
    try {
      if (cartItems.length === 0 || allProducts.length === 0) {
        console.log('ℹ️ [AI] Sin items en carrito o productos disponibles');
        return [];
      }

      if (!isGeminiEnabled()) {
        console.log('ℹ️ [AI] Usando recomendaciones básicas (Gemini deshabilitado)');
        const categories = [...new Set(cartItems.map(item => {
          const product = allProducts.find(p => p.id === item.productId);
          return product?.category;
        }))].filter(Boolean) as string[];
        
        return allProducts
          .filter(p => 
            categories.includes(p.category) && 
            !cartItems.some(item => item.productId === p.id)
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      }

      const model = getGeminiModel();
      if (!model) {
        console.warn('⚠️ [AI] Modelo no disponible');
        return [];
      }

      const cartSummary = cartItems.map(item => item.title).join(', ');
      const productsList = allProducts
        .map(p => `${p.id}: ${p.title} (${p.category})`)
        .join('\n');

      const prompt = `Eres un asistente de compras. El usuario tiene en su carrito: ${cartSummary}

Productos disponibles:
${productsList}

Recomienda 3 IDs de productos complementarios. Responde SOLO los IDs separados por comas.
Ejemplo: 5,12,18`;

      console.log('🤖 [AI] Solicitando recomendaciones a Gemini...');
      
      // Timeout de 10 segundos
      const result = await withTimeout(model.generateContent(prompt), 10000);
      const response = await result.response;
      const text = response.text().trim();
      
      console.log('🤖 [AI] Respuesta recibida:', text.substring(0, 50));

      const recommendedIds = text
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id) && !cartItems.some(item => item.productId === id));

      const recommendations = allProducts.filter(p => recommendedIds.includes(p.id));
      console.log(`✅ [AI] ${recommendations.length} recomendaciones generadas`);
      
      return recommendations.slice(0, 3);
    } catch (error: any) {
      console.error('❌ [AI] Error en recomendaciones:', error.message);
      
      // Fallback: productos aleatorios
      console.log('ℹ️ [AI] Usando fallback: productos aleatorios');
      return allProducts
        .filter(p => !cartItems.some(item => item.productId === p.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    }
  },

  intelligentSearch: async (
    query: string,
    products: Product[]
  ): Promise<Product[]> => {
    try {
      if (!query.trim() || products.length === 0) {
        return products;
      }

      // Siempre usar búsqueda básica primero (más rápido y confiable)
      const lowerQuery = query.toLowerCase();
      const basicResults = products.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );

      console.log(`🔍 [AI] Búsqueda básica encontró ${basicResults.length} resultados`);
      return basicResults;

    } catch (error: any) {
      console.error('❌ [AI] Error en búsqueda:', error.message);
      return products;
    }
  },

  chatWithAI: async (message: string, products: Product[]): Promise<string> => {
    try {
      if (!isGeminiEnabled()) {
        return '🤖 El asistente AI no está disponible. Por favor, configura tu API Key de Gemini en el archivo .env\n\nObtén una gratis en: https://makersuite.google.com/app/apikey';
      }

      const model = getGeminiModel();
      if (!model) {
        return '🤖 Asistente AI temporalmente no disponible. Intenta de nuevo en unos momentos.';
      }

      const productsSummary = products.slice(0, 15)
        .map(p => `- ${p.title}: $${p.price}`)
        .join('\n');

      const prompt = `Eres un asistente virtual amigable de Amazon App.

Productos disponibles:
${productsSummary}

Usuario: ${message}

Responde de forma breve y útil (máximo 2-3 oraciones).`;

      console.log('💬 [AI] Enviando mensaje a Gemini...');
      
      const result = await withTimeout(model.generateContent(prompt), 10000);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ [AI] Respuesta recibida');
      return text;
      
    } catch (error: any) {
      console.error('❌ [AI] Error en chat:', error.message);
      
      if (error.message.includes('Timeout')) {
        return '⏱️ La solicitud tardó demasiado. Por favor, intenta de nuevo con una pregunta más específica.';
      }
      
      return 'Lo siento, no puedo responder en este momento. Por favor, intenta de nuevo o reformula tu pregunta.';
    }
  },

  generateGiftSuggestion: async (product: Product): Promise<string> => {
    try {
      if (!isGeminiEnabled()) {
        return '🎁 ¡Regalo perfecto para esta temporada!';
      }

      const model = getGeminiModel();
      if (!model) {
        return '🎁 ¡Excelente opción para regalar!';
      }

      const prompt = `Crea una descripción breve (1-2 oraciones) de por qué este producto es un buen regalo navideño:

Producto: ${product.title}
Precio: $${product.price}

Usa emojis navideños y sé entusiasta.`;

      console.log('🎁 [AI] Generando sugerencia de regalo...');
      
      const result = await withTimeout(model.generateContent(prompt), 8000);
      const response = await result.response;
      const text = response.text();
      
      return text;
      
    } catch (error: any) {
      console.error('❌ [AI] Error generando sugerencia:', error.message);
      return '🎁 ¡Perfecto para regalar en esta temporada festiva! 🎄';
    }
  },
};