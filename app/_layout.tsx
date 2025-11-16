import '@/global.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ProductProvider } from '@/lib/contexts/ProductContext';
import { CartProvider } from '@/lib/contexts/CartContext';
import { AIProvider } from '@/lib/contexts/AIContext';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import useFonts from '@/lib/hooks/useFonts';
import { Stack } from "expo-router";
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <AIProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen 
                  name="product/[id]" 
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_right',
                  }}
                />
              </Stack>
            </AIProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
