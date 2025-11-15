import '@/global.css';
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
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}
