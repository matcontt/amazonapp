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
  
  // Estilo especial para categoría "Ofertas"
  const isOffers = label === '🔥 Ofertas';

  const bgColor = isSelected
    ? isOffers
      ? 'bg-red-500'  // Rojo brillante para Ofertas
      : isChristmas
        ? isDark ? 'bg-navy-gold' : 'bg-navy-red'
        : 'bg-blue-600'
    : isOffers
      ? 'bg-red-100'  // Rojo suave cuando no está seleccionado
      : isDark
        ? 'bg-gray-700'
        : 'bg-gray-200';

  const textColor = isSelected || isOffers 
    ? 'text-white' 
    : isDark ? 'text-white' : 'text-gray-900';

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
