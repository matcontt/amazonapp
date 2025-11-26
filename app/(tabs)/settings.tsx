import { ScrollView, Alert, Switch, View, ActivityIndicator } from 'react-native';
import { useRef } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useProducts } from '@/lib/contexts/ProductContext';
import { useRouter } from 'expo-router';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ThemeSelector from '@/components/ThemeSelector';
import ThemedButton from '@/components/ThemedButton';
import '@/global.css';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const { translationsEnabled, translating, toggleTranslations, retranslate } = useProducts();
  const router = useRouter();
  const isDark = theme.includes('dark');
  
  // useRef para prevenir doble toggle
  const isTogglingRef = useRef(false);

  const handleToggle = () => {
    if (isTogglingRef.current || translating) {
      console.log('⏱️ Toggle ignorado (ya en proceso)');
      return;
    }
    
    isTogglingRef.current = true;
    console.log('🔄 Toggle activado:', !translationsEnabled);
    
    toggleTranslations();
    
    // Reset después de 1 segundo
    setTimeout(() => {
      isTogglingRef.current = false;
    }, 1000);
  };

  const handleRetranslate = () => {
    Alert.alert(
      'Re-traducir Productos',
      '¿Deseas volver a traducir todos los productos? Esto puede tardar unos segundos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Re-traducir', 
          onPress: retranslate
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  return (
    <ThemedView variant="screen" className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView className="p-6 pt-16">
          {/* Header */}
          <ThemedText variant="title" className="mb-2">
            ⚙️ Configuraciones
          </ThemedText>
          
          <ThemedText variant="body" color="secondary" className="mb-6">
            Personaliza tu experiencia
          </ThemedText>

          {/* Usuario Info */}
          {user && (
            <ThemedView variant="section" className="p-4 rounded-2xl mb-4">
              <ThemedText variant="subtitle" className="mb-2">
                👤 {user.displayName || 'Usuario'}
              </ThemedText>
              <ThemedText variant="caption" color="secondary">
                {user.email}
              </ThemedText>
            </ThemedView>
          )}

          {/* Sección de Traducciones */}
          <ThemedView variant="card" className="rounded-2xl p-4 mb-4">
            <ThemedText variant="subtitle" className="mb-4">
              🌍 Idioma de Productos
            </ThemedText>

            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1 mr-4">
                <ThemedText variant="body" className="mb-1">
                  Traducir al Español
                </ThemedText>
                <ThemedText variant="caption" color="secondary">
                  {translationsEnabled 
                    ? 'Productos en español' 
                    : 'Productos en inglés'
                  }
                </ThemedText>
              </View>
              <Switch
                value={translationsEnabled}
                onValueChange={handleToggle}
                disabled={translating}
                trackColor={{ 
                  false: isDark ? '#4B5563' : '#D1D5DB',
                  true: '#10B981' 
                }}
                thumbColor={translationsEnabled ? '#FFFFFF' : '#F3F4F6'}
                ios_backgroundColor={isDark ? '#4B5563' : '#D1D5DB'}
              />
            </View>

            {translating && (
              <View className="flex-row items-center py-2 px-3 bg-blue-100 rounded-lg">
                <ActivityIndicator size="small" color="#2563EB" />
                <ThemedText variant="caption" className="ml-2 text-blue-700">
                  {translationsEnabled 
                    ? 'Traduciendo productos al español...' 
                    : 'Cargando productos en inglés...'
                  }
                </ThemedText>
              </View>
            )}

            {translationsEnabled && !translating && (
              <ThemedButton
                title="🔄 Re-traducir Todo"
                variant="outline"
                onPress={handleRetranslate}
                className="mt-2"
              />
            )}
          </ThemedView>

          {/* Sección de Temas */}
          <ThemedView variant="card" className="rounded-2xl p-4 mb-4">
            <ThemedText variant="subtitle" className="mb-4">
              🎨 Tema de la App
            </ThemedText>

            <ThemeSelector />
          </ThemedView>

          {/* Info del tema actual */}
          <ThemedView variant="section" className="rounded-2xl p-4 mb-4">
            <ThemedText variant="body" className="font-semibold mb-2">
              ℹ️ Tema Activo
            </ThemedText>
            <ThemedText variant="body" color="secondary">
              Actualmente usando: <ThemedText className="font-bold">{theme}</ThemedText>
            </ThemedText>
            
            {theme.includes('christmas') && (
              <ThemedView className="mt-3 pt-3 border-t border-gray-300">
                <ThemedText variant="caption" color="secondary">
                  🎄 ¡Disfruta de la experiencia navideña!
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          {/* Logout Button */}
          <ThemedButton
            title="Cerrar Sesión"
            variant="outline"
            onPress={handleLogout}
            icon="🚪"
          />

          {/* Footer */}
          <ThemedView className="mt-8 items-center">
            <ThemedText variant="caption" color="secondary">
              Amazon App v1.0.0
            </ThemedText>
            <ThemedText variant="caption" color="secondary" className="mt-1">
              Hecho con ❤️ y Expo SDK 54
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}