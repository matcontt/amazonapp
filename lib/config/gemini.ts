import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY no configurada');
}

export const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const getGeminiModel = () => {
  if (!genAI) {
    throw new Error('Gemini API no está configurada');
  }
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};
