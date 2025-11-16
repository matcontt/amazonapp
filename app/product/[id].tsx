import { ScrollView, View, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProducts } from '@/lib/contexts/ProductContext';
import { useCart } from '@/lib/contexts/CartContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';
import SnowAnimation from '@/components/SnowAnimation';
import '@/global.css';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProductById } = useProducts();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { theme } = useTheme();
  const isChristmas = theme.includes('christmas');
  const isDark = theme.includes('dark');

  const product = getProductById(Number(id));
  const inCart = product ? isInCart(product.id) : false;
  const quantity = product ? getItemQuantity(product.id) : 0;

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product);
      Alert.alert(
        '✅ Agregado al carrito',
        `${product.title}\nCantidad: ${quantity + 1}`,
        [
          { text: 'Seguir Comprando' },
          { text: 'Ir al Carrito', onPress: () => router.push('/(tabs)/cart') }
        ]
      );
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      if (!inCart) {
        await addToCart(product);
      }
      router.push('/(tabs)/cart');
    }
  };

  if (!product) {
    return (
      <ThemedView variant="screen" className="flex-1 items-center justify-center">
        <ThemedText variant="subtitle" className="text-red-500 mb-4">
          Producto no encontrado
        </ThemedText>
        <ThemedButton
          title="Volver"
          variant="outline"
          onPress={() => router.back()}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView variant="screen" className="flex-1">
      <SnowAnimation enabled={isChristmas} />
      
      <ScrollView>
        <View className="flex-row items-center p-4 pt-16">
          <ThemedButton
            title="← Volver"
            variant="outline"
            onPress={() => router.back()}
            className="mr-auto"
          />
        </View>

        <View className="items-center p-6">
          <View 
            className={`w-full h-64 rounded-2xl items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Image
              source={{ uri: product.image }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <ThemedView className="px-6 pb-6">
          <View className="mb-3">
            <View 
              className={`self-start px-3 py-1 rounded-full ${
                isChristmas 
                  ? isDark ? 'bg-navy-gold/20' : 'bg-navy-red/20'
                  : 'bg-blue-100'
              }`}
            >
              <ThemedText variant="caption" color="accent" className="font-semibold">
                {product.category.toUpperCase()}
              </ThemedText>
            </View>
          </View>

          <ThemedText variant="title" color="primary" className="mb-3">
            {product.title}
          </ThemedText>

          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center mr-4">
              <ThemedText className="text-yellow-500 text-xl mr-1">⭐</ThemedText>
              <ThemedText variant="body" className="font-semibold">
                {product.rating.rate.toFixed(1)}
              </ThemedText>
            </View>
            <ThemedText variant="caption" color="secondary">
              ({product.rating.count} reseñas)
            </ThemedText>
          </View>

          <ThemedView variant="section" className="p-4 rounded-xl mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <ThemedText variant="caption" color="secondary" className="mb-1">
                  Precio
                </ThemedText>
                <ThemedText 
                  variant="title" 
                  color="accent"
                  style={{ fontSize: 32 }}
                >
                  ${product.price.toFixed(2)}
                </ThemedText>
              </View>
              
              {inCart && (
                <View className="items-center">
                  <ThemedText variant="caption" color="secondary" className="mb-1">
                    En carrito
                  </ThemedText>
                  <ThemedText variant="subtitle" color="accent">
                    {quantity} {quantity === 1 ? 'unidad' : 'unidades'}
                  </ThemedText>
                </View>
              )}
            </View>
          </ThemedView>

          <ThemedView variant="card" className="p-4 rounded-xl mb-4">
            <ThemedText variant="subtitle" className="mb-3">
              📝 Descripción
            </ThemedText>
            <ThemedText variant="body" color="secondary" className="leading-6">
              {product.description}
            </ThemedText>
          </ThemedView>

          <ThemedButton
            title={inCart ? "➕ Agregar más al Carrito" : (isChristmas ? "🎁 Agregar al Carrito" : "Agregar al Carrito")}
            onPress={handleAddToCart}
            className="mb-3"
          />

          <ThemedButton
            title="Comprar Ahora"
            variant="outline"
            onPress={handleBuyNow}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}