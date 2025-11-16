import { ScrollView, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/lib/contexts/CartContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ThemedButton from '@/components/ThemedButton';
import CartItemCard from '@/components/CartItemCard';
import SnowAnimation from '@/components/SnowAnimation';
import '@/global.css';

export default function CartScreen() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { theme } = useTheme();
  const isChristmas = theme.includes('christmas');

  const handleCheckout = () => {
    Alert.alert(
      '🎉 ¡Compra exitosa!',
      `Total: $${cart.total.toFixed(2)}\n\nGracias por tu compra. ¡Tu pedido llegará pronto!`,
      [
        {
          text: 'Continuar Comprando',
          onPress: () => router.push('/(tabs)'),
        },
        {
          text: 'OK',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vaciar Carrito',
      '¿Estás seguro que deseas eliminar todos los productos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Vaciar', 
          style: 'destructive',
          onPress: clearCart 
        },
      ]
    );
  };

  return (
    <ThemedView variant="screen" className="flex-1">
      <SnowAnimation enabled={isChristmas} />

      <ScrollView>
        {/* Header */}
        <ThemedView className="p-6 pt-16">
          <ThemedText 
            variant="title" 
            color="primary" 
            className="text-center"
            style={isChristmas ? { fontFamily: 'Pacifico_400Regular' } : {}}
          >
            {isChristmas ? '🛒 Mi Carrito 🎁' : '🛒 Mi Carrito'}
          </ThemedText>
          
          {cart.itemCount > 0 && (
            <ThemedText variant="body" color="secondary" className="text-center mt-2">
              {cart.itemCount} {cart.itemCount === 1 ? 'producto' : 'productos'}
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView className="px-6">
          {cart.items.length === 0 ? (
            // Carrito vacío
            <ThemedView variant="section" className="p-8 rounded-2xl items-center">
              <ThemedText className="text-6xl mb-4">🛒</ThemedText>
              <ThemedText variant="subtitle" className="mb-2 text-center">
                Tu carrito está vacío
              </ThemedText>
              <ThemedText variant="body" color="secondary" className="text-center mb-6">
                ¡Agrega productos para empezar a comprar!
              </ThemedText>
              <ThemedButton
                title="Ver Productos"
                onPress={() => router.push('/(tabs)')}
              />
            </ThemedView>
          ) : (
            <>
              {/* Lista de productos */}
              <View className="mb-4">
                {cart.items.map((item) => (
                  <CartItemCard
                    key={item.productId}
                    item={item}
                    onIncrement={() => updateQuantity(item.productId, item.quantity + 1)}
                    onDecrement={() => updateQuantity(item.productId, item.quantity - 1)}
                    onRemove={() => removeFromCart(item.productId)}
                  />
                ))}
              </View>

              {/* Resumen */}
              <ThemedView variant="section" className="p-6 rounded-2xl mb-4">
                <View className="flex-row justify-between items-center mb-4">
                  <ThemedText variant="body" color="secondary">
                    Subtotal ({cart.itemCount} items)
                  </ThemedText>
                  <ThemedText variant="subtitle">
                    ${cart.total.toFixed(2)}
                  </ThemedText>
                </View>

                <View className="flex-row justify-between items-center mb-4">
                  <ThemedText variant="body" color="secondary">
                    Envío
                  </ThemedText>
                  <ThemedText variant="body" className="text-green-600 font-semibold">
                    GRATIS
                  </ThemedText>
                </View>

                <View className="border-t border-gray-300 pt-4">
                  <View className="flex-row justify-between items-center">
                    <ThemedText variant="subtitle">
                      Total
                    </ThemedText>
                    <ThemedText 
                      variant="title" 
                      color="accent"
                      style={{ fontSize: 28 }}
                    >
                      ${cart.total.toFixed(2)}
                    </ThemedText>
                  </View>
                </View>
              </ThemedView>

              {/* Botones */}
              <ThemedButton
                title={isChristmas ? "🎁 Finalizar Compra" : "Finalizar Compra"}
                onPress={handleCheckout}
                className="mb-3"
              />

              <ThemedButton
                title="Vaciar Carrito"
                variant="outline"
                onPress={handleClearCart}
              />
            </>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}