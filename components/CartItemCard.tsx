import { View, Image, TouchableOpacity } from 'react-native';
import ThemedView from './ThemedView';
import ThemedText from './ThemedText';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { CartItem } from '@/lib/types/cart';

interface CartItemCardProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export default function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemCardProps) {
  const { theme } = useTheme();
  const isDark = theme.includes('dark');
  const isChristmas = theme.includes('christmas');

  return (
    <ThemedView variant="card" className="p-4 rounded-xl mb-3">
      <View className="flex-row">
        {/* Imagen */}
        <View 
          className={`w-20 h-20 rounded-lg mr-4 overflow-hidden ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </View>

        {/* Info */}
        <View className="flex-1">
          <ThemedText variant="body" className="font-semibold mb-1" numberOfLines={2}>
            {item.title}
          </ThemedText>
          
          <ThemedText variant="price" color="accent" className="mb-2">
            ${item.price.toFixed(2)}
          </ThemedText>

          {/* Controles de cantidad */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={onDecrement}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isDark ? 'bg-gray-600' : 'bg-gray-200'
                }`}
              >
                <ThemedText className="font-bold">−</ThemedText>
              </TouchableOpacity>

              <ThemedText className="mx-4 font-bold">
                {item.quantity}
              </ThemedText>

              <TouchableOpacity
                onPress={onIncrement}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isChristmas 
                    ? isDark ? 'bg-navy-gold' : 'bg-navy-red'
                    : 'bg-blue-600'
                }`}
              >
                <ThemedText className="text-white font-bold">+</ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onRemove}>
              <ThemedText className="text-red-500">🗑️</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
