import { TextInput, View } from 'react-native';
import { useTheme } from '@/lib/contexts/ThemeContext';
import ThemedText from './ThemedText';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'Buscar productos...' 
}: SearchBarProps) {
  const { theme } = useTheme();
  const isDark = theme.includes('dark');
  const isChristmas = theme.includes('christmas');

  const borderColor = isChristmas 
    ? isDark ? 'border-navy-gold/50' : 'border-navy-green/50'
    : isDark ? 'border-gray-600' : 'border-gray-300';

  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? '#FFFFFF' : '#1F2937';

  return (
    <View className={`flex-row items-center ${bgColor} ${borderColor} border-2 rounded-xl px-4 py-3 mb-4`}>
      <ThemedText className="mr-2">🔍</ThemedText>
      <TextInput
        className="flex-1 text-base"
        style={{ color: textColor }}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}