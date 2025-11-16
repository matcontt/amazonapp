import { View, TouchableOpacity, TouchableOpacityProps, Image } from 'react-native';
import ThemedView from './ThemedView';
import ThemedText from './ThemedText';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface ProductCardProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  rating?: number;
  ratingCount?: number;
}

export default function ProductCard({ 
  title, 
  description, 
  price,
  imageUrl,
  rating,
  ratingCount,
  ...props 
}: ProductCardProps) {
  const { theme } = useTheme();
  const isDark = theme.includes('dark');
  const isChristmas = theme.includes('christmas');

  return (
    <TouchableOpacity {...props}>
      <ThemedView variant="card" className="p-4 rounded-xl mb-3">
        <View className="flex-row items-center">
          {/* Imagen del producto */}
          <View 
            className={`w-20 h-20 rounded-lg mr-4 items-center justify-center overflow-hidden ${
              isChristmas 
                ? 'bg-navy-gold/30' 
                : isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: 70, height: 70 }}
                resizeMode="contain"
              />
            ) : (
              <ThemedText variant="caption" color="secondary">
                📦
              </ThemedText>
            )}
          </View>
          
          <View className="flex-1">
            <ThemedText variant="body" className="font-semibold mb-1" numberOfLines={2}>
              {title}
            </ThemedText>
            
            {description && (
              <ThemedText variant="caption" color="secondary" numberOfLines={2}>
                {description}
              </ThemedText>
            )}
            
            <View className="flex-row items-center mt-2">
              <ThemedText variant="price" color="accent">
                ${price.toFixed(2)}
              </ThemedText>
              
              {rating && (
                <View className="flex-row items-center ml-3">
                  <ThemedText className="text-yellow-500 mr-1">⭐</ThemedText>
                  <ThemedText variant="caption" color="secondary">
                    {rating.toFixed(1)} ({ratingCount})
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}