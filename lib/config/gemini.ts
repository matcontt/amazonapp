import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'TU_NUEVA_API_KEY_AQUI') {
  console.warn('⚠️ [GEMINI] API Key no configurada');
  console.warn('ℹ️ [GEMINI] Obtén tu key en: https://makersuite.google.com/app/apikey');
} else {
  console.log('✅ [GEMINI] API Key configurada correctamente');
}

export const genAI = (API_KEY && API_KEY !== 'TU_NUEVA_API_KEY_AQUI') 
  ? new GoogleGenerativeAI(API_KEY) 
  : null;

export const getGeminiModel = () => {
  if (!genAI) {
    console.warn('⚠️ [GEMINI] Modelo no disponible');
    return null;
  }
  try {
    // CAMBIO IMPORTANTE: gemini-pro ya no existe, usar gemini-1.5-flash
    return genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });
  } catch (error) {
    console.error('❌ [GEMINI] Error inicializando modelo:', error);
    return null;
  }
};

export const isGeminiEnabled = (): boolean => {
  const enabled = genAI !== null;
  if (enabled) {
    console.log('✅ [GEMINI] Servicio habilitado y listo');
  }
  return enabled;
};