import { ScrollView } from "react-native";
import { useTheme } from '@/lib/contexts/ThemeContext';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ProductCard from '@/components/ProductCard';
import '@/global.css';

export default function IndexScreen() {
  const { theme } = useTheme();
  const isChristmas = theme.includes('christmas');

  // Datos de ejemplo (después vendrán de la API)
  const mockProducts = [
    { id: 1, title: 'Producto Premium', description: 'Descripción del producto', price: 29.99 },
    { id: 2, title: 'Oferta Especial', description: 'Descripción del producto', price: 59.99 },
    { id: 3, title: 'Nuevo Lanzamiento', description: 'Descripción del producto', price: 89.99 },
  ];

  return (
    <ThemedView variant="screen" className="flex-1">
      <ScrollView>
        {/* Header */}
        <ThemedView className="p-6 pt-16">
          <ThemedText variant="title" color="primary" className="text-center">
            {isChristmas ? '🎄 Amazon Navidad 🎁' : 'Amazon App'}
          </ThemedText>
          
          {isChristmas && (
            <ThemedText variant="body" color="secondary" className="text-center mt-2">
              ¡Ofertas especiales de temporada!
            </ThemedText>
          )}
        </ThemedView>

        {/* Card de bienvenida */}
        <ThemedView className="px-6">
          <ThemedView variant="section" className="p-6 rounded-2xl mb-4">
            <ThemedText variant="subtitle" className="mb-2">
              ¡Bienvenido! 👋
            </ThemedText>
            <ThemedText variant="body" color="secondary">
              {isChristmas 
                ? 'Descubre nuestras ofertas navideñas especiales'
                : 'Explora miles de productos'}
            </ThemedText>
          </ThemedView>

          {/* Sección de productos */}
          <ThemedText variant="subtitle" color="accent" className="mb-4">
            {isChristmas ? '🎁 Ofertas Navideñas' : 'Productos Destacados'}
          </ThemedText>

          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={isChristmas ? `🎁 ${product.title}` : product.title}
              description={product.description}
              price={product.price}
              onPress={() => console.log('Producto presionado:', product.id)}
            />
          ))}
        </ThemedView>

        {/* Footer decorativo navideño */}
        {isChristmas && (
          <ThemedView className="items-center py-8">
            <ThemedText className="text-4xl">❄️ 🎅 ⛄ 🎄 ❄️</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}
