import { Stack } from "expo-router";
import { ThemeProvider } from '@/lib/contexts/ThemeContext'; // Cambia el path a @/lib/...

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}