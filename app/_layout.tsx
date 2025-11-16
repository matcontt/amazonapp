import '@/global.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ProductProvider } from '@/lib/contexts/ProductContext';
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
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}