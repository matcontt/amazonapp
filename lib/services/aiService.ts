import { getGeminiModel, isGeminiEnabled } from '@/lib/config/gemini';
import { Product } from '@/lib/types/product';
import { CartItem } from '@/lib/types/cart';

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: La solicitud tardó demasiado')), ms)
    ),
  ]);
};

const formatProductsForAI = (products: Product[]): string => {
  return products.map(p => {
    const discountInfo = p.discount 
      ? `🔥 DESCUENTO ${p.discount}% (antes $${p.originalPrice})` 
      : 'Sin descuento';
    
    return `**ID: ${p.id}**
**Título:** ${p.title}
**Precio:** $${p.price}
**Categoría:** ${p.category}
**Rating:** ⭐${p.rating.rate}/5 (${p.rating.count} reviews)
${discountInfo}`;
  }).join('\n\n---\n\n');
};

const formatChatHistory = (messages: Array<{ text: string; isUser: boolean }>): string => {
  return messages
    .slice(-10)
    .map(msg => `${msg.isUser ? '👤 Usuario' : '🤖 Asistente'}: ${msg.text}`)
    .join('\n');
};

export interface PurchaseIntent {
  detected: boolean;
  productIds: number[];
  productNames: string[];
}

export interface AIResponse {
  text: string;
  purchaseIntent?: PurchaseIntent;
  mentionedProducts?: number[]; // IDs de productos mencionados en la respuesta del AI
}

// MEJORADO: Extrae SOLO los IDs que el AI menciona en su respuesta
const extractProductIdsFromAIResponse = (aiResponse: string): number[] => {
  const ids: number[] = [];
  
  // Buscar patrones como "ID: 5", "producto 5", "ID 5"
  const patterns = [
    /\*\*ID:\s*(\d+)\*\*/gi,  // **ID: 5**
    /ID:\s*(\d+)/gi,           // ID: 5
    /producto\s+(\d+)/gi,      // producto 5
    /\bid\s*(\d+)\b/gi,        // id 5
  ];
  
  patterns.forEach(pattern => {
    const matches = aiResponse.matchAll(pattern);
    for (const match of matches) {
      const id = parseInt(match[1]);
      if (!isNaN(id) && id > 0 && id <= 20 && !ids.includes(id)) {
        ids.push(id);
      }
    }
  });
  
  console.log('🔍 [AI] IDs extraídos de la respuesta:', ids);
  return ids;
};

// MEJORADO: Detecta intención de compra basándose SOLO en el mensaje del usuario
const detectPurchaseIntent = (
  userMessage: string, 
  aiResponse: string,
  mentionedProducts: number[]
): PurchaseIntent => {
  const message = userMessage.toLowerCase();
  
  // Palabras clave de compra
  const buyKeywords = [
    'comprar', 'agregar', 'añadir', 'añade', 'agrega',
    'carrito', 'quiero', 'me interesa', 'lo llevo', 
    'dame', 'adquirir', 'necesito', 'llevar', 'compro'
  ];
  
  const hasBuyIntent = buyKeywords.some(keyword => message.includes(keyword));
  
  if (!hasBuyIntent) {
    return { detected: false, productIds: [], productNames: [] };
  }
  
  console.log('🛒 [AI] Intención de compra detectada en:', message);
  
  const productIds: number[] = [];
  
  // CASO 1: Referencias posicionales (primero, segundo, último, etc.)
  const positionalMatches = {
    'primer': 0,
    'primero': 0,
    'primera': 0,
    '1ro': 0,
    'segundo': 1,
    'segunda': 1,
    '2do': 1,
    'tercer': 2,
    'tercero': 2,
    'tercera': 2,
    '3ro': 2,
    'cuarto': 3,
    'último': mentionedProducts.length - 1,
    'ultima': mentionedProducts.length - 1,
  };
  
  let foundPositional = false;
  for (const [keyword, index] of Object.entries(positionalMatches)) {
    if (message.includes(keyword)) {
      const productId = mentionedProducts[index as number];
      if (productId && !productIds.includes(productId)) {
        productIds.push(productId);
        foundPositional = true;
        console.log(`📍 [AI] Detectado por posición "${keyword}": ID ${productId}`);
      }
    }
  }
  
  // CASO 2: IDs específicos mencionados por el usuario (ej: "comprar el 5")
  if (!foundPositional) {
    const userIdMatches = message.match(/\b(?:el|id|producto)[:\s]*(\d+)\b/gi);
    if (userIdMatches) {
      userIdMatches.forEach(match => {
        const id = parseInt(match.match(/\d+/)?.[0] || '');
        if (!isNaN(id) && mentionedProducts.includes(id) && !productIds.includes(id)) {
          productIds.push(id);
          console.log(`🆔 [AI] Detectado por ID mencionado: ${id}`);
        }
      });
    }
  }
  
  // CASO 3: "comprar ese/eso/este" - usa el último producto mencionado
  if (!foundPositional && productIds.length === 0) {
    const genericRefs = ['ese', 'eso', 'este', 'esto', 'lo', 'la'];
    if (genericRefs.some(ref => message.includes(ref)) && mentionedProducts.length > 0) {
      const lastProduct = mentionedProducts[mentionedProducts.length - 1];
      if (!productIds.includes(lastProduct)) {
        productIds.push(lastProduct);
        console.log(`👉 [AI] Detectado por referencia genérica: ID ${lastProduct}`);
      }
    }
  }
  
  // CASO 4: Si no se detectó nada específico pero hay intención de compra,
  // usar SOLO el primer producto mencionado
  if (productIds.length === 0 && mentionedProducts.length > 0) {
    productIds.push(mentionedProducts[0]);
    console.log(`⚠️ [AI] Sin referencia clara, usando primer producto: ID ${mentionedProducts[0]}`);
  }
  
  return {
    detected: productIds.length > 0,
    productIds: [...new Set(productIds)],
    productNames: [],
  };
};

export const aiService = {
  getCartRecommendations: async (
    cartItems: CartItem[],
    allProducts: Product[]
  ): Promise<Product[]> => {
    try {
      if (cartItems.length === 0 || allProducts.length === 0) {
        return [];
      }

      if (!isGeminiEnabled()) {
        return allProducts
          .filter(p => !cartItems.some(item => item.productId === p.id))
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      }

      const model = getGeminiModel();
      if (!model) return [];

      const cartSummary = cartItems.map(item => {
        const product = allProducts.find(p => p.id === item.productId);
        return `- **${item.title}** ($${item.price}) x${item.quantity}${
          product?.discount ? ` [${product.discount}% OFF]` : ''
        }`;
      }).join('\n');

      const productsInfo = formatProductsForAI(allProducts.slice(0, 20));

      const prompt = `Eres un experto en recomendaciones de productos. Analiza el carrito del usuario y recomienda 3 productos complementarios.

**CARRITO ACTUAL:**
${cartSummary}

**PRODUCTOS DISPONIBLES:**
${productsInfo}

**INSTRUCCIONES:**
1. Recomienda productos que complementen lo que ya tiene en el carrito
2. Prioriza productos con descuento cuando sea relevante
3. Considera diferentes categorías para diversificar
4. NO recomiendes productos que ya estén en el carrito

Responde SOLO con los IDs separados por comas (ejemplo: 5,12,18)`;

      const result = await withTimeout(model.generateContent(prompt), 12000);
      const response = await result.response;
      const text = response.text().trim();
      
      const recommendedIds = text
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id) && !cartItems.some(item => item.productId === id));

      const recommendations = allProducts.filter(p => recommendedIds.includes(p.id));
      return recommendations.slice(0, 3);
    } catch (error: any) {
      console.error('❌ [AI] Error en recomendaciones:', error.message);
      return allProducts
        .filter(p => !cartItems.some(item => item.productId === p.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    }
  },

  chatWithAI: async (
    message: string, 
    products: Product[], 
    chatHistory: Array<{ text: string; isUser: boolean }>
  ): Promise<AIResponse> => {
    try {
      if (!isGeminiEnabled()) {
        return {
          text: '🤖 El asistente AI no está disponible. Por favor, configura tu API Key de Gemini en el archivo .env\n\nObtén una gratis en: https://makersuite.google.com/app/apikey',
        };
      }

      const model = getGeminiModel();
      if (!model) {
        return {
          text: '🤖 Asistente AI temporalmente no disponible. Intenta de nuevo en unos momentos.',
        };
      }

      const discountedProducts = products.filter(p => p.discount);
      const discountInfo = discountedProducts.length > 0
        ? `\n\n**🔥 PRODUCTOS EN OFERTA (${discountedProducts.length}):**\n` + 
          discountedProducts.slice(0, 8).map((p, index) => 
            `${index + 1}. **${p.title}** - $${p.price} (antes $${p.originalPrice}) - ${p.discount}% OFF *(ID: ${p.id})*`
          ).join('\n')
        : '';

      const productsInfo = formatProductsForAI(products.slice(0, 15));
      const history = chatHistory.length > 0 
        ? `\n\n**CONVERSACIÓN PREVIA:**\n${formatChatHistory(chatHistory)}\n`
        : '';

      const prompt = `Eres un asistente virtual amigable y experto de Amazon App. Tienes acceso al catálogo completo y puedes ayudar con compras.

**CATÁLOGO DE PRODUCTOS:**
${productsInfo}${discountInfo}${history}

**Usuario:** ${message}

**INSTRUCCIONES CRÍTICAS:**
- Responde en **formato Markdown** usando negrita (**texto**), listas numeradas, etc.
- Máximo 4-5 oraciones, sé conciso
- SIEMPRE menciona el **ID** de cada producto que recomiendes (formato: **ID: 5**)
- Si el usuario quiere comprar, confirma QUÉ producto específico quiere
- Si preguntan por descuentos, enumera productos con formato: "1. **Producto** - **X% OFF** (ID: Y)"
- Usa listas numeradas cuando muestres varios productos
- Mantén contexto de conversación previa
- Usa emojis estratégicamente 📦 🎁 💰

**Respuesta:**`;

      console.log('💬 [AI] Enviando mensaje con contexto completo...');
      
      const result = await withTimeout(model.generateContent(prompt), 15000);
      const response = await result.response;
      const text = response.text();
      
      // Extraer IDs mencionados en la respuesta del AI
      const mentionedProducts = extractProductIdsFromAIResponse(text);
      
      // Detectar intención de compra
      const purchaseIntent = detectPurchaseIntent(message, text, mentionedProducts);
      
      if (purchaseIntent.detected) {
        console.log('🛒 [AI] Intención de compra detectada:', purchaseIntent.productIds);
        console.log('📋 [AI] Productos mencionados en respuesta:', mentionedProducts);
      }
      
      return {
        text,
        mentionedProducts,
        purchaseIntent: purchaseIntent.detected ? purchaseIntent : undefined,
      };
      
    } catch (error: any) {
      console.error('❌ [AI] Error en chat:', error.message);
      
      if (error.message.includes('Timeout')) {
        return {
          text: '⏱️ La solicitud tardó demasiado. Por favor, intenta de nuevo con una pregunta más específica.',
        };
      }
      
      return {
        text: 'Lo siento, no puedo responder en este momento. Por favor, intenta de nuevo o reformula tu pregunta.',
      };
    }
  },
};