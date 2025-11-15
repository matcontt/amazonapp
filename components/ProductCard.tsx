import { useTheme } from '@/lib/contexts/ThemeContext';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';

interface ProductCardProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export default function ProductCard({ 
  title, 
  description, 
  price,
  imageUrl,
  ...props 
}: ProductCardProps) {
  const { theme } = useTheme();
  const isDark = theme.includes('dark');
  const isChristmas = theme.includes('christmas');

  return (
    <TouchableOpacity {...props}>
      <ThemedView variant="card" className="p-4 rounded-xl mb-3 flex-row items-center">
        {/* Placeholder para imagen */}
        <View 
          className={`w-20 h-20 rounded-lg mr-4 items-center justify-center ${
            isChristmas 
              ? 'bg-navy-gold/30' 
              : isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          {/* Aquí irá la imagen real después */}
          <ThemedText variant="caption" color="secondary">
            📦
          </ThemedText>
        </View>
        
        <View className="flex-1">
          <ThemedText variant="body" className="font-semibold mb-1">
            {title}
          </ThemedText>
          
          {description && (
            <ThemedText variant="caption" color="secondary" numberOfLines={2}>
              {description}
            </ThemedText>
          )}
          
          <ThemedText variant="price" color="accent" className="mt-1">
            ${price.toFixed(2)}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}