import { ScrollView, View, TextInput, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAI } from '@/lib/contexts/AIContext';
import { useProducts } from '@/lib/contexts/ProductContext';
import { useCart } from '@/lib/contexts/CartContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { isGeminiEnabled } from '@/lib/config/gemini';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';
import ChatBubble from '@/components/ChatBubble';
import SnowAnimation from '@/components/SnowAnimation';
import { PurchaseIntent } from '@/lib/services/aiService';
import '@/global.css';

export default function AIChatScreen() {
  const [input, setInput] = useState('');
  const [purchaseIntent, setPurchaseIntent] = useState<PurchaseIntent | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  
  const { messages, loadingChat, sendMessage, clearChat } = useAI();
  const { products, getProductById } = useProducts();
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const router = useRouter();
  
  const isChristmas = theme.includes('christmas');
  const isDark = theme.includes('dark');

  // Listener para el teclado
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, purchaseIntent, keyboardHeight]);

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
    setPurchaseIntent(null);
    
    const response = await sendMessage(message, products);
    
    // Si hay intención de compra, guardarla
    if (response?.purchaseIntent?.detected) {
      console.log('🛒 [CHAT] Mostrando intención de compra:', response.purchaseIntent);
      setPurchaseIntent(response.purchaseIntent);
    }
  };

  const handleQuickBuy = async () => {
    if (!purchaseIntent || purchaseIntent.productIds.length === 0) return;

    try {
      const productsList = purchaseIntent.productIds
        .map(id => {
          const product = getProductById(id);
          return product ? `• ${product.title} ($${product.price})` : null;
        })
        .filter(Boolean)
        .join('\n');

      Alert.alert(
        '🛒 Confirmar Compra',
        `¿Agregar ${purchaseIntent.productIds.length === 1 ? 'este producto' : 'estos productos'} al carrito?\n\n${productsList}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Agregar',
            onPress: async () => {
              let addedCount = 0;
              
              for (const productId of purchaseIntent.productIds) {
                const product = getProductById(productId);
                if (product) {
                  await addToCart(product);
                  addedCount++;
                }
              }

              if (addedCount > 0) {
                Alert.alert(
                  '✅ ¡Listo!',
                  `${addedCount} ${addedCount === 1 ? 'producto agregado' : 'productos agregados'} al carrito`,
                  [
                    { text: 'Seguir Comprando', onPress: () => setPurchaseIntent(null) },
                    { 
                      text: 'Ver Carrito', 
                      onPress: () => router.push('/(tabs)/cart') 
                    }
                  ]
                );
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron agregar los productos al carrito');
    }
  };

  const suggestedQuestions = [
    '¿Qué productos tienen descuento?',
    'Recomiéndame algo para regalar',
    '¿Tienen productos de electrónica?',
    'Quiero comprar algo económico',
  ];

  return (
    <ThemedView variant="screen" className="flex-1">
      <SnowAnimation enabled={isChristmas} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        className="flex-1"
        style={{ flex: 1 }}
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
              {isGeminiEnabled() ? 'Pregúntame lo que quieras' : 'AI no configurada'}
            </ThemedText>
          </View>
          
          {messages.length > 0 && (
            <ThemedButton
              title="Limpiar"
              variant="outline"
              onPress={() => {
                clearChat();
                setPurchaseIntent(null);
              }}
            />
          )}
        </ThemedView>

        {/* Chat Messages */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-6"
          contentContainerStyle={{ 
            paddingBottom: Platform.OS === 'android' ? keyboardHeight + 20 : 20 
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
            <>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  text={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}

              {/* Botón de compra rápida */}
              {purchaseIntent && purchaseIntent.detected && (
                <View className="mt-4 mb-2">
                  <ThemedView variant="card" className="p-4 rounded-xl border-2 border-green-500">
                    <View className="flex-row items-center mb-2">
                      <ThemedText className="text-2xl mr-2">🛒</ThemedText>
                      <ThemedText variant="body" className="font-semibold flex-1">
                        {purchaseIntent.productIds.length === 1 
                          ? 'Producto detectado:' 
                          : `${purchaseIntent.productIds.length} productos detectados:`
                        }
                      </ThemedText>
                    </View>
                    
                    {purchaseIntent.productIds.map(id => {
                      const product = getProductById(id);
                      if (!product) return null;
                      return (
                        <View key={id} className="mb-2 ml-2">
                          <ThemedText variant="body" className="font-semibold">
                            • {product.title}
                          </ThemedText>
                          <ThemedText variant="caption" color="secondary">
                            ${product.price} {product.discount && `(${product.discount}% OFF)`}
                          </ThemedText>
                        </View>
                      );
                    })}
                    
                    <ThemedButton
                      title={`✓ Agregar ${purchaseIntent.productIds.length > 1 ? `${purchaseIntent.productIds.length} productos ` : ''}al Carrito`}
                      onPress={handleQuickBuy}
                      className="mt-3"
                    />
                  </ThemedView>
                </View>
              )}
            </>
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

        {/* Input Area */}
        <ThemedView 
          className="p-4 border-t" 
          style={{ 
            borderTopColor: isDark ? '#374151' : '#E5E7EB',
            paddingBottom: Platform.OS === 'ios' ? 4 : keyboardHeight > 0 ? 4 : 4,
          }}
        >
          <View className="flex-row items-center">
            <TextInput
              ref={inputRef}
              className={`flex-1 p-3 rounded-xl mr-2 ${
                isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
              }`}
              placeholder={isGeminiEnabled() ? "Escribe tu mensaje..." : "AI no disponible..."}
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => {
                Keyboard.dismiss();
                handleSend();
              }}
              editable={!loadingChat && isGeminiEnabled()}
              multiline
              maxLength={500}
              returnKeyType="send"
              blurOnSubmit={false}
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