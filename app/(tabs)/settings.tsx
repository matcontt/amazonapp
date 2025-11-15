import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import ThemeSelector from '@/components/ThemeSelector';
import '@/global.css';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { ScrollView } from 'react-native';

export default function SettingsScreen() {
  const { theme } = useTheme();

  return (
    <ThemedView variant="screen" className="flex-1">
      <ScrollView>
        <ThemedView className="p-6 pt-16">
          {/* Header */}
          <ThemedText variant="title" className="mb-2">
            ⚙️ Configuraciones
          </ThemedText>
          
          <ThemedText variant="body" color="secondary" className="mb-6">
            Personaliza tu experiencia
          </ThemedText>

          {/* Sección de Temas */}
          <ThemedView variant="card" className="rounded-2xl p-4 mb-4">
            <ThemedText variant="subtitle" className="mb-4">
              🎨 Tema de la App
            </ThemedText>

            <ThemeSelector />
          </ThemedView>

          {/* Info del tema actual */}
          <ThemedView variant="section" className="rounded-2xl p-4">
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