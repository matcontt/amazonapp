import React, { createContext, useContext, useState, ReactNode } from 'react';
import { aiService } from '@/lib/services/aiService';
import { Product } from '@/lib/types/product';
import { CartItem } from '@/lib/types/cart';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIContextType {
  recommendations: Product[];
  loadingRecommendations: boolean;
  messages: Message[];
  loadingChat: boolean;
  getRecommendations: (cartItems: CartItem[], products: Product[]) => Promise<void>;
  sendMessage: (message: string, products: Product[]) => Promise<void>;
  clearChat: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const getRecommendations = async (cartItems: CartItem[], products: Product[]) => {
    try {
      setLoadingRecommendations(true);
      const recs = await aiService.getCartRecommendations(cartItems, products);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const sendMessage = async (message: string, products: Product[]) => {
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      setLoadingChat(true);
      
      // CAMBIO IMPORTANTE: Pasar historial de mensajes al AI
      const chatHistory = messages.map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
      }));
      
      console.log(`💬 [AI Context] Enviando mensaje con ${chatHistory.length} mensajes previos`);
      const response = await aiService.chatWithAI(message, products, chatHistory);
      
      // Agregar respuesta del AI
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      
      console.log(`✅ [AI Context] Nueva respuesta agregada. Total mensajes: ${messages.length + 2}`);
    } catch (error) {
      console.error('Error en chat:', error);
      
      // Agregar mensaje de error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ Ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoadingChat(false);
    }
  };

  const clearChat = () => {
    console.log('🗑️ [AI Context] Limpiando chat');
    setMessages([]);
  };

  return (
    <AIContext.Provider
      value={{
        recommendations,
        loadingRecommendations,
        messages,
        loadingChat,
        getRecommendations,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};