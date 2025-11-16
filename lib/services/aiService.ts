import { getGeminiModel } from '@/lib/config/gemini';
import { Product } from '@/lib/types/product';
import { CartItem } from '@/lib/types/cart';

export const aiService = {
  // Obtener recomendaciones basadas en el carrito
  getCartRecommendations: async (
    cartItems: CartItem[],
    allProducts: Product[]
  ): Promise<Product[]> => {
    try {
      if (cartItems.length === 0 || allProducts.length === 0) {
        return [];
      }

      const model = getGeminiModel();
      
      const cartSummary = cartItems.map(item => item.title).join(', ');
      const productsList = allProducts
        .map(p => `${p.id}: ${p.title} (${p.category})`)
        .join('\n');

      const prompt = `
Eres un asistente de compras inteligente. El usuario tiene estos productos en su carrito:
${cartSummary}

Aquí está la lista completa de productos disponibles:
${productsList}

Recomienda 3 IDs de productos que complementen bien los productos del carrito.
Responde SOLO con los IDs separados por comas, sin texto adicional.
Ejemplo de respuesta: 5,12,18
      `.trim();

      console.log('🤖 Solicitando recomendaciones a Gemini...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      console.log('🤖 Respuesta de Gemini:', text);

      // Parsear IDs
      const recommendedIds = text
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id) && !cartItems.some(item => item.productId === id));

      // Retornar productos recomendados
      const recommendations = allProducts.filter(p => recommendedIds.includes(p.id));
      console.log(`✅ ${recommendations.length} recomendaciones generadas`);
      
      return recommendations.slice(0, 3);
    } catch (error) {
      console.error('❌ Error obteniendo recomendaciones:', error);
      return [];
    }
  },

  // Búsqueda inteligente con AI
  intelligentSearch: async (
    query: string,
    products: Product[]
  ): Promise<Product[]> => {
    try {
      if (!query.trim() || products.length === 0) {
        return products;
      }

      const model = getGeminiModel();
      
      const productsList = products
        .map(p => `${p.id}: ${p.title} - ${p.description.substring(0, 100)}`)
        .join('\n');

      const prompt = `
Eres un asistente de búsqueda. El usuario busca: "${query}"

Lista de productos:
${productsList}

Identifica qué productos coinciden mejor con la búsqueda del usuario.
Responde SOLO con los IDs de los productos más relevantes separados por comas (máximo 10).
Ejemplo: 1,5,8,12
      `.trim();

      console.log('🔍 Búsqueda inteligente con Gemini:', query);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      console.log('🤖 IDs encontrados:', text);

      const foundIds = text
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));

      const results = products.filter(p => foundIds.includes(p.id));
      console.log(`✅ ${results.length} productos encontrados`);
      
      return results;
    } catch (error) {
      console.error('❌ Error en búsqueda inteligente:', error);
      return [];
    }
  },

  // Chatbot de productos
  chatWithAI: async (
    message: string,
    products: Product[]
  ): Promise<string> => {
    try {
      const model = getGeminiModel();
      
      const productsSummary = products.slice(0, 20)
        .map(p => `- ${p.title}: $${p.price} (${p.category})`)
        .join('\n');

      const prompt = `
Eres un asistente virtual de una tienda online llamada Amazon App.
Estos son algunos de nuestros productos:
${productsSummary}

Usuario: ${message}

Responde de manera amigable, breve y útil. Si te preguntan por productos específicos, menciona los que tenemos.
Máximo 3 oraciones.
      `.trim();

      console.log('💬 Chat con Gemini:', message);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('🤖 Respuesta:', text.substring(0, 50) + '...');
      return text;
    } catch (error) {
      console.error('❌ Error en chat:', error);
      return 'Lo siento, no puedo responder en este momento. Por favor, intenta de nuevo.';
    }
  },

  // Generar descripción de regalo navideño
  generateGiftSuggestion: async (product: Product): Promise<string> => {
    try {
      const model = getGeminiModel();
      
      const prompt = `
Crea una descripción corta y atractiva de por qué este producto sería un buen regalo navideño:
Producto: ${product.title}
Precio: $${product.price}

Responde en máximo 2 oraciones, con emojis navideños.
      `.trim();

      console.log('🎁 Generando sugerencia de regalo...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('❌ Error generando sugerencia:', error);
      return '🎁 ¡Perfecto para regalar esta Navidad!';
    }
  },
};