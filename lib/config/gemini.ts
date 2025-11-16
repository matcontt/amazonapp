import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY no configurada. Las funciones de AI estarán deshabilitadas.');
}

export const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const getGeminiModel = () => {
  if (!genAI) {
    // NO lanzar error, solo retornar null
    return null;
  }
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

export const isGeminiEnabled = (): boolean => {
  return genAI !== null;
};