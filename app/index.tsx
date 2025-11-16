import { useAuth } from '@/lib/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import ThemedText from '@/components/ThemedText';
import { useEffect, useState } from 'react';

export default function Index() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Pequeño delay para asegurar que todo esté cargado
      setTimeout(() => {
        setIsReady(true);
        console.log('📍 [INDEX] Ready:', { isAuthenticated, email: user?.email || 'ninguno' });
      }, 100);
    }
  }, [loading, user]);

  if (!isReady || loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#F0F8FF' 
      }}>
        <ActivityIndicator size="large" color="#FF0000" />
        <ThemedText className="mt-4 text-gray-600">
          Iniciando...
        </ThemedText>
      </View>
    );
  }

  if (isAuthenticated) {
    console.log('✅ [INDEX] Redirigiendo a tabs (usuario autenticado)');
    return <Redirect href="/(tabs)" />;
  }

  console.log('ℹ️ [INDEX] Redirigiendo a login (sin autenticación)');
  return <Redirect href="/(auth)/login" />;
}