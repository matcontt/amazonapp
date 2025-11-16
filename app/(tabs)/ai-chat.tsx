import { ScrollView, View, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useAI } from '@/lib/contexts/AIContext';
import { useProducts } from '@/lib/contexts/ProductContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { isGeminiEnabled } from '@/lib/config/gemini';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';
import ChatBubble from '@/components/ChatBubble';
import SnowAnimation from '@/components/SnowAnimation';
import '@/global.css';

export default function AIChatScreen() {
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const { messages, loadingChat, sendMessage, clearChat } = useAI();
  const { products } = useProducts();
  const { theme } = useTheme();
  const isChristmas = theme.includes('christmas');
  const isDark = theme.includes('dark');

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loadingChat) return;
    
    if (!isGeminiEnabled()) {
      Alert.alert(
        '⚠️ AI No Disponible',
        'Para usar el chatbot AI, configura tu GEMINI_API_KEY en el archivo .env\n\nObtén una gratis en: https://makersuite.google.com/app/apikey'
      );
      return;
    }
    
    const message = input.trim();
    setInput('');
    await sendMessage(message, products);
  };

  const suggestedQuestions = [
    '¿Qué productos tienen descuento?',
    'Recomiéndame algo para regalar',
    '¿Tienen productos de electrónica?',
    'Quiero algo económico',
  ];

  return (
    <ThemedView variant="screen" className="flex-1">
      <SnowAnimation enabled={isChristmas} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ThemedView className="p-6 pt-16 flex-row items-center justify-between">
          <View>
            <ThemedText 
              variant="title" 
              color="primary"
              style={isChristmas ? { fontFamily: 'Pacifico_400Regular' } : {}}
            >
              {isChristmas ? '🤖 Asistente Navideño' : '🤖 Asistente AI'}
            </ThemedText>
            <ThemedText variant="caption" color="secondary">
              {isGeminiEnabled() ? 'Pregúntame lo que quieras' : 'AI no configurada'}
            </ThemedText>
          </View>
          
          {messages.length > 0 && (
            <ThemedButton
              title="Limpiar"
              variant="outline"
              onPress={clearChat}
            />
          )}
        </ThemedView>

        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.length === 0 ? (
            <View className="flex-1 justify-center items-center py-8">
              <ThemedText className="text-6xl mb-4">🤖</ThemedText>
              <ThemedText variant="subtitle" className="text-center mb-2">
                ¡Hola! Soy tu asistente de compras
              </ThemedText>
              <ThemedText variant="body" color="secondary" className="text-center mb-6">
                {isGeminiEnabled() 
                  ? 'Puedo ayudarte a encontrar productos, darte recomendaciones y más'
                  : 'Para activar el AI, agrega tu GEMINI_API_KEY en .env'
                }
              </ThemedText>

              {isGeminiEnabled() && (
                <View className="w-full">
                  <ThemedText variant="caption" color="secondary" className="mb-2">
                    Prueba preguntar:
                  </ThemedText>
                  {suggestedQuestions.map((question, index) => (
                    <ThemedButton
                      key={index}
                      title={question}
                      variant="outline"
                      onPress={() => setInput(question)}
                      className="mb-2"
                    />
                  ))}
                </View>
              )}
            </View>
          ) : (
            messages.map((message) => (
              <ChatBubble
                key={message.id}
                text={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))
          )}

          {loadingChat && (
            <View className="items-start mb-3">
              <View className={`p-3 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <ThemedText variant="body">
                  🤖 Escribiendo...
                </ThemedText>
              </View>
            </View>
          )}
        </ScrollView>

        <ThemedView className="p-4 border-t" style={{ borderTopColor: isDark ? '#374151' : '#E5E7EB' }}>
          <View className="flex-row items-center">
            <TextInput
              className={`flex-1 p-3 rounded-xl mr-2 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
              }`}
              placeholder={isGeminiEnabled() ? "Escribe tu mensaje..." : "AI no disponible..."}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              editable={!loadingChat && isGeminiEnabled()}
            />
            <ThemedButton
              title="Enviar"
              onPress={handleSend}
              disabled={!input.trim() || loadingChat || !isGeminiEnabled()}
              className="px-6"
            />
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}