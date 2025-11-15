import { Stack } from "expo-router";
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import '@/global.css';

export default function RootLayout() {
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