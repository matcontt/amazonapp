import { Stack } from "expo-router";
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import '@/global.css'; // Importa global.css para estilos Tailwind

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Asegura que ningún header se muestre en toda la app
        }}
      />
    </ThemeProvider>
  );
}