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

// Helper para formatear productos con información relevante
const formatProductsForAI = (products: Product[]): string => {
  return products.map(p => {
    const discountInfo = p.discount 
      ? `🔥 DESCUENTO ${p.discount}% (antes $${p.originalPrice})` 
      : 'Sin descuento';
    
    return `ID: ${p.id}
Título: ${p.title}
Precio: $${p.price}
Categoría: ${p.category}
Rating: ⭐${p.rating.rate}/5 (${p.rating.count} reviews)
${discountInfo}`;
  }).join('\n\n');
};

// Helper para formatear historial de chat
const formatChatHistory = (messages: Array<{ text: string; isUser: boolean }>): string => {
  return messages
    .slice(-10) // Solo últimos 10 mensajes para no saturar el contexto
    .map(msg => `${msg.isUser ? 'Usuario' : 'Asistente'}: ${msg.text}`)
    .join('\n');
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
        return allProducts
          .filter(p => !cartItems.some(item => item.productId === p.id))
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      }

      const model = getGeminiModel();
      if (!model) {
        console.warn('⚠️ [AI] Modelo no disponible');
        return [];
      }

      const cartSummary = cartItems.map(item => {
        const product = allProducts.find(p => p.id === item.productId);
        return `- ${item.title} ($${item.price}) x${item.quantity}${
          product?.discount ? ` [${product.discount}% OFF]` : ''
        }`;
      }).join('\n');

      const productsInfo = formatProductsForAI(allProducts.slice(0, 20));

      const prompt = `Eres un experto en recomendaciones de productos. Analiza el carrito del usuario y recomienda 3 productos complementarios.

CARRITO ACTUAL:
${cartSummary}

PRODUCTOS DISPONIBLES:
${productsInfo}

INSTRUCCIONES:
1. Recomienda productos que complementen lo que ya tiene en el carrito
2. Prioriza productos con descuento cuando sea relevante
3. Considera diferentes categorías para diversificar
4. NO recomiendes productos que ya estén en el carrito

Responde SOLO con los IDs separados por comas (ejemplo: 5,12,18)`;

      console.log('🤖 [AI] Solicitando recomendaciones con contexto completo...');
      
      const result = await withTimeout(model.generateContent(prompt), 12000);
      const response = await result.response;
      const text = response.text().trim();
      
      console.log('🤖 [AI] Respuesta recibida:', text);

      const recommendedIds = text
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id) && !cartItems.some(item => item.productId === id));

      const recommendations = allProducts.filter(p => recommendedIds.includes(p.id));
      console.log(`✅ [AI] ${recommendations.length} recomendaciones generadas`);
      
      return recommendations.slice(0, 3);
    } catch (error: any) {
      console.error('❌ [AI] Error en recomendaciones:', error.message);
      
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

      const lowerQuery = query.toLowerCase();
      const basicResults = products.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );

      console.log(`🔍 [AI] Búsqueda encontró ${basicResults.length} resultados`);
      return basicResults;

    } catch (error: any) {
      console.error('❌ [AI] Error en búsqueda:', error.message);
      return products;
    }
  },

  // NUEVO: Chat con memoria conversacional
  chatWithAI: async (
    message: string, 
    products: Product[], 
    chatHistory: Array<{ text: string; isUser: boolean }>
  ): Promise<string> => {
    try {
      if (!isGeminiEnabled()) {
        return '🤖 El asistente AI no está disponible. Por favor, configura tu API Key de Gemini en el archivo .env\n\nObtén una gratis en: https://makersuite.google.com/app/apikey';
      }

      const model = getGeminiModel();
      if (!model) {
        return '🤖 Asistente AI temporalmente no disponible. Intenta de nuevo en unos momentos.';
      }

      // Productos con descuento
      const discountedProducts = products.filter(p => p.discount);
      const discountInfo = discountedProducts.length > 0
        ? `\n\n🔥 PRODUCTOS EN OFERTA (${discountedProducts.length}):\n` + 
          discountedProducts.slice(0, 5).map(p => 
            `- ${p.title}: $${p.price} (antes $${p.originalPrice}) - ${p.discount}% OFF`
          ).join('\n')
        : '';

      const productsInfo = formatProductsForAI(products.slice(0, 15));
      const history = chatHistory.length > 0 
        ? `\n\nCONVERSACIÓN PREVIA:\n${formatChatHistory(chatHistory)}\n`
        : '';

      const prompt = `Eres un asistente virtual amigable y experto de Amazon App. Tienes acceso al catálogo completo de productos y puedes responder sobre descuentos, categorías, precios, y hacer recomendaciones personalizadas.

CATÁLOGO DE PRODUCTOS:
${productsInfo}${discountInfo}${history}

Usuario: ${message}

INSTRUCCIONES:
- Responde de forma concisa (máximo 3-4 oraciones)
- Si preguntan por descuentos, menciona específicamente cuáles productos tienen oferta
- Si preguntan por categorías, lista las disponibles
- Si piden recomendaciones, sugiere productos relevantes con sus precios
- Mantén el contexto de la conversación anterior
- Usa emojis para hacer la conversación más amigable

Respuesta:`;

      console.log('💬 [AI] Enviando mensaje con contexto completo y memoria...');
      console.log(`📊 [AI] Historial: ${chatHistory.length} mensajes previos`);
      
      const result = await withTimeout(model.generateContent(prompt), 15000);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ [AI] Respuesta generada con memoria');
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
        return product.discount 
          ? `🎁 ¡Regalo perfecto con ${product.discount}% de descuento!`
          : '🎁 ¡Regalo perfecto para esta temporada!';
      }

      const model = getGeminiModel();
      if (!model) {
        return '🎁 ¡Excelente opción para regalar!';
      }

      const discountInfo = product.discount 
        ? `Tiene ${product.discount}% de descuento (antes $${product.originalPrice})`
        : 'Precio regular';

      const prompt = `Crea una descripción breve (1-2 oraciones) de por qué este producto es un buen regalo navideño:

Producto: ${product.title}
Precio: $${product.price}
${discountInfo}

Usa emojis navideños y sé entusiasta. Si tiene descuento, menciónalo.`;

      console.log('🎁 [AI] Generando sugerencia de regalo...');
      
      const result = await withTimeout(model.generateContent(prompt), 8000);
      const response = await result.response;
      const text = response.text();
      
      return text;
      
    } catch (error: any) {
      console.error('❌ [AI] Error generando sugerencia:', error.message);
      return product.discount
        ? `🎁 ¡Aprovecha ${product.discount}% OFF en este regalo perfecto! 🎄`
        : '🎁 ¡Perfecto para regalar en esta temporada festiva! 🎄';
    }
  },
};

