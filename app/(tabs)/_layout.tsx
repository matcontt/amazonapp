import { Tabs } from "expo-router";
import { useTheme } from '@/lib/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons'; // Importa íconos
import '@/global.css'; // Importa global.css para aplicar estilos Tailwind

export default function TabsLayout() {
  const { theme } = useTheme(); // Usamos theme, aunque aún no aplicamos estilos

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Mantenemos headers ocultos
        tabBarIcon: () => null, // Placeholder por si no definimos íconos individuales
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuraciones',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}