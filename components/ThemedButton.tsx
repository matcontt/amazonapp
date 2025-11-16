import { useTheme } from '@/lib/contexts/ThemeContext';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import ThemedText from './ThemedText';

interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function ThemedButton({ 
  title, 
  variant = 'primary',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props 
}: ThemedButtonProps) {
  const { theme } = useTheme();
  const isDark = theme.includes('dark');
  const isChristmas = theme.includes('christmas');

  const getButtonStyle = () => {
    if (disabled || loading) {
      return 'bg-gray-400 opacity-60';
    }

    switch (variant) {
      case 'primary':
        return isChristmas 
          ? isDark ? 'bg-navy-gold' : 'bg-navy-red'
          : 'bg-blue-600';
      
      case 'secondary':
        return isDark ? 'bg-gray-700' : 'bg-gray-200';
      
      case 'outline':
        return `border-2 ${
          isChristmas 
            ? isDark ? 'border-navy-gold' : 'border-navy-red'
            : 'border-blue-600'
        }`;
      
      default:
        return 'bg-blue-600';
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return 'text-gray-300';
    
    if (variant === 'outline') {
      return isChristmas 
        ? isDark ? 'text-navy-gold' : 'text-navy-red'
        : 'text-blue-600';
    }

    return variant === 'secondary' 
      ? isDark ? 'text-white' : 'text-gray-900'
      : 'text-white';
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center py-4 px-6 rounded-xl ${getButtonStyle()} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'secondary' ? (isDark ? '#FFFFFF' : '#1F2937') : '#FFFFFF'} />
      ) : (
        <>
          {icon && <ThemedText className="mr-2">{icon}</ThemedText>}
          <ThemedText 
            variant="body" 
            className={`font-semibold ${getTextColor()}`}
          >
            {title}
          </ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
}