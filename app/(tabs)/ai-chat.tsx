import { ScrollView, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useAI } from '@/lib/contexts/AIContext';
import { useProducts } from '@/lib/contexts/ProductContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
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
    // Scroll al final cuando hay nuevos mensajes
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loadingChat) return;
    
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
        {/* Header */}
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
              Pregúntame lo que quieras
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

        {/* Chat */}
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
                Puedo ayudarte a encontrar productos, darte recomendaciones y más
              </ThemedText>

              {/* Preguntas sugeridas */}
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

        {/* Input */}
        <ThemedView className="p-4 border-t" style={{ borderTopColor: isDark ? '#374151' : '#E5E7EB' }}>
          <View className="flex-row items-center">
            <TextInput
              className={`flex-1 p-3 rounded-xl mr-2 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
              }`}
              placeholder="Escribe tu mensaje..."
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              editable={!loadingChat}
            />
            <ThemedButton
              title="Enviar"
              onPress={handleSend}
              disabled={!input.trim() || loadingChat}
              className="px-6"
            />
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}