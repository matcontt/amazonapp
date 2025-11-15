import { useFonts as useExpoFonts, Pacifico_400Regular } from '@expo-google-fonts/pacifico';

export default function useFonts() {
  const [fontsLoaded] = useExpoFonts({
    Pacifico_400Regular,
  });

  return fontsLoaded;
}