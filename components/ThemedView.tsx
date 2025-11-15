import { View, ViewProps } from 'react-native';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface ThemedViewProps extends ViewProps {
  variant?: 'screen' | 'card' | 'section';
}

export default function ThemedView({ 
  variant = 'screen', 
  className = '', 
  style,
  children,
  ...props 
}: ThemedViewProps) {
  const { theme } = useTheme();
  const isDark = theme.includes('dark');
  const isChristmas = theme.includes('christmas');

  const getBackgroundClass = () => {
    switch (variant) {
      case 'screen':
        return isDark ? 'bg-dark-snow' : 'bg-snow-pattern';
      
      case 'card':
        if (isChristmas) {
          return isDark 
            ? 'bg-gray-800 border border-navy-gold/30' 
            : 'bg-white border border-navy-red/20';
        }
        return isDark ? 'bg-gray-800' : 'bg-white';
      
      case 'section':
        if (isChristmas) {
          return isDark
            ? 'bg-navy-green/20 border-2 border-navy-gold'
            : 'bg-navy-red/10 border-2 border-navy-green';
        }
        return isDark ? 'bg-gray-800' : 'bg-white';
      
      default:
        return '';
    }
  };

  const cardShadow = variant === 'card' || variant === 'section' ? {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } : {};

  return (
    <View 
      className={`${getBackgroundClass()} ${className}`}
      style={[cardShadow, style]}
      {...props}
    >
      {children}
    </View>
  );
}