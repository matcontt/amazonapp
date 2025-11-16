import { useTheme } from '@/lib/contexts/ThemeContext';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import ThemedText from './ThemedText';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function ThemedInput({ 
  label, 
  error, 
  icon,
  className = '',
  ...props 
}: ThemedInputProps) {
  const { theme } = useTheme();
  const isDark = theme.includes('dark');
  const isChristmas = theme.includes('christmas');

  const borderColor = error 
    ? 'border-red-500' 
    : isChristmas 
      ? isDark ? 'border-navy-gold/50' : 'border-navy-green/50'
      : isDark ? 'border-gray-600' : 'border-gray-300';

  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? '#FFFFFF' : '#1F2937';

  return (
    <View className="mb-4">
      {label && (
        <ThemedText variant="body" color="secondary" className="mb-2 ml-1">
          {label}
        </ThemedText>
      )}
      
      <View className={`flex-row items-center ${bgColor} ${borderColor} border-2 rounded-xl px-4`}>
        {icon && <View className="mr-3">{icon}</View>}
        
        <TextInput
          className={`flex-1 py-3 text-base ${className}`}
          style={{ color: textColor }}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          {...props}
        />
      </View>

      {error && (
        <ThemedText variant="caption" className="text-red-500 mt-1 ml-1">
          {error}
        </ThemedText>
      )}
    </View>
  );
}
