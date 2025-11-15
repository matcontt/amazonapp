import { Text, TextProps } from 'react-native';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface ThemedTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'price';
  color?: 'primary' | 'secondary' | 'accent' | 'default';
}

export default function ThemedText({ 
  variant = 'body',
  color = 'default',
  className = '',
  children,
  ...props 
}: ThemedTextProps) {
  const { theme } = useTheme();
  const isDark = theme.includes('dark');
  const isChristmas = theme.includes('christmas');

  const getVariantClass = () => {
    switch (variant) {
      case 'title':
        return 'text-3xl font-bold';
      case 'subtitle':
        return 'text-xl font-semibold';
      case 'body':
        return 'text-base';
      case 'caption':
        return 'text-sm';
      case 'price':
        return 'text-lg font-bold';
      default:
        return '';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'primary':
        if (isChristmas) {
          return isDark ? 'text-navy-gold' : 'text-navy-red';
        }
        return isDark ? 'text-white' : 'text-gray-900';
      
      case 'secondary':
        return isDark ? 'text-gray-300' : 'text-gray-600';
      
      case 'accent':
        if (isChristmas) {
          return isDark ? 'text-navy-gold' : 'text-navy-green';
        }
        return 'text-blue-600';
      
      case 'default':
      default:
        return isDark ? 'text-white' : 'text-gray-900';
    }
  };

  return (
    <Text 
      className={`${getVariantClass()} ${getColorClass()} ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
}