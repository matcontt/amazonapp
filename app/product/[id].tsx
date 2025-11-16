import { ScrollView, View, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProducts } from '@/lib/contexts/ProductContext';
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
  const { theme } = useTheme();
  const isChristmas = theme.includes('christmas');
  const isDark = theme.includes('dark');

  const product = getProductById(Number(id));

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
        {/* Header con botón volver */}
        <View className="flex-row items-center p-4 pt-16">
          <ThemedButton
            title="← Volver"
            variant="outline"
            onPress={() => router.back()}
            className="mr-auto"
          />
        </View>

        {/* Imagen del producto */}
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

        {/* Información del producto */}
        <ThemedView className="px-6 pb-6">
          {/* Categoría */}
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

          {/* Título */}
          <ThemedText variant="title" color="primary" className="mb-3">
            {product.title}
          </ThemedText>

          {/* Rating */}
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

          {/* Precio */}
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
              
              {isChristmas && (
                <ThemedText className="text-4xl">🎁</ThemedText>
              )}
            </View>
          </ThemedView>

          {/* Descripción */}
          <ThemedView variant="card" className="p-4 rounded-xl mb-4">
            <ThemedText variant="subtitle" className="mb-3">
              📝 Descripción
            </ThemedText>
            <ThemedText variant="body" color="secondary" className="leading-6">
              {product.description}
            </ThemedText>
          </ThemedView>

          {/* Botones de acción */}
          <ThemedButton
            title={isChristmas ? "🎁 Agregar al Carrito" : "Agregar al Carrito"}
            onPress={() => console.log('Agregar al carrito:', product.id)}
            className="mb-3"
          />

          <ThemedButton
            title="Comprar Ahora"
            variant="outline"
            onPress={() => console.log('Comprar:', product.id)}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
