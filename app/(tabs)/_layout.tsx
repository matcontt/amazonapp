import { Tabs } from "expo-router";
import { useTheme } from '@/lib/contexts/ThemeContext';
import '@/global.css'; // Importa global.css para aplicar estilos Tailwind

export default function TabsLayout() {
  const { theme } = useTheme(); // Usamos theme, aunque aún no aplicamos estilos

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerShown: false, // Deshabilita el header para esta pantalla específicamente
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuraciones',
          headerShown: false, // Deshabilita el header para esta pantalla
        }}
      />
    </Tabs>
  );
}