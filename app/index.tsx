import { useAuth } from '@/lib/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import ThemedText from '@/components/ThemedText';

export default function Index() {
  const { user, loading } = useAuth();

  console.log('📍 app/index.tsx - loading:', loading, 'user:', user?.email || 'ninguno');

  // Mostrar loading mientras se carga el auth
  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#F0F8FF' 
      }}>
        <ActivityIndicator size="large" color="#FF0000" />
        <ThemedText className="mt-4 text-gray-600">
          Cargando...
        </ThemedText>
      </View>
    );
  }

  // Redirigir según estado de auth
  if (user) {
    console.log('✅ Usuario autenticado, redirigiendo a tabs');
    return <Redirect href="/(tabs)" />;
  }

  console.log('ℹ️ Usuario no autenticado, redirigiendo a login');
  return <Redirect href="/(auth)/login" />;
}
