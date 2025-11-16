import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import ThemedText from './ThemedText';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface CategoryChipProps extends TouchableOpacityProps {
  label: string;
  isSelected?: boolean;
}

export default function CategoryChip({ 
  label, 
  isSelected = false,
  ...props 
}: CategoryChipProps) {
  const { theme } = useTheme();
  const isDark = theme.includes('dark');
  const isChristmas = theme.includes('christmas');

  const bgColor = isSelected
    ? isChristmas
      ? isDark ? 'bg-navy-gold' : 'bg-navy-red'
      : 'bg-blue-600'
    : isDark
      ? 'bg-gray-700'
      : 'bg-gray-200';

  const textColor = isSelected ? 'text-white' : isDark ? 'text-white' : 'text-gray-900';

  return (
    <TouchableOpacity
      className={`px-4 py-2 rounded-full mr-2 ${bgColor}`}
      {...props}
    >
      <ThemedText 
        variant="caption" 
        className={`font-semibold ${textColor}`}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
