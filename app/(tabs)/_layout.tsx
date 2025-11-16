import '@/global.css';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useCart } from '@/lib/contexts/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { View, Text } from 'react-native';

export default function TabsLayout() {
  const { theme } = useTheme();
  const { cart } = useCart();
  const isDark = theme.includes('dark');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#FFD700' : '#FF0000',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="cart" size={size} color={color} />
              {cart.itemCount > 0 && (
                <View 
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -10,
                    backgroundColor: '#FF0000',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {cart.itemCount > 99 ? '99+' : cart.itemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}