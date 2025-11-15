import { View, TouchableOpacity } from 'react-native';
import { useTheme, Theme } from '@/lib/contexts/ThemeContext';
import ThemedText from './ThemedText';

interface ThemeOption {
  label: string;
  value: Theme;
  emoji: string;
}

const themeOptions: ThemeOption[] = [
  { label: 'Claro', value: 'light', emoji: '☀️' },
  { label: 'Oscuro', value: 'dark', emoji: '🌙' },
  { label: 'Navidad Claro', value: 'christmas-light', emoji: '🎄' },
  { label: 'Navidad Oscuro', value: 'christmas-dark', emoji: '🎅' },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const isDark = theme.includes('dark');

  return (
    <View>
      {themeOptions.map((option) => {
        const isSelected = theme === option.value;
        
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => setTheme(option.value)}
            className={`flex-row items-center justify-between p-4 rounded-xl mb-2 ${
              isSelected
                ? 'bg-navy-gold/20 border-2 border-navy-gold'
                : isDark 
                  ? 'bg-gray-700' 
                  : 'bg-gray-100'
            }`}
          >
            <View className="flex-row items-center">
              <ThemedText className="text-2xl mr-3">{option.emoji}</ThemedText>
              <ThemedText 
                variant="body"
                className={`font-medium ${
                  isSelected ? 'text-navy-gold' : ''
                }`}
              >
                {option.label}
              </ThemedText>
            </View>
            
            {isSelected && (
              <ThemedText className="text-navy-gold text-xl">✓</ThemedText>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}