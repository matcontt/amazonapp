import { View, Text } from "react-native";
import { useTheme } from '@/lib/contexts/ThemeContext';
import '@/global.css';

export default function IndexScreen() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Pantalla de Inicio (Tema: {theme})</Text>
    </View>
  );
}