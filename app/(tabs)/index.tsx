import ProductCard from '@/components/ProductCard';
import SnowAnimation from '@/components/SnowAnimation';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import '@/global.css';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { ScrollView } from "react-native";

export default function IndexScreen() {
  const { theme } = useTheme();
  const isChristmas = theme.includes('christmas');

  const mockProducts = [
    { id: 1, title: 'Producto Premium', description: 'Descripción del producto', price: 29.99 },
    { id: 2, title: 'Oferta Especial', description: 'Descripción del producto', price: 59.99 },
    { id: 3, title: 'Nuevo Lanzamiento', description: 'Descripción del producto', price: 89.99 },
  ];

  return (
    <ThemedView variant="screen" className="flex-1">
      {/* Animación de nieve solo en temas navideños */}
      <SnowAnimation enabled={isChristmas} />
      
      <ScrollView>
        <ThemedView className="p-6 pt-16">
          <ThemedText 
            variant="title" 
            color="primary" 
            className="text-center"
            style={isChristmas ? { fontFamily: 'Pacifico_400Regular' } : {}}
          >
            {isChristmas ? '🎄 Amazon Navidad 🎁' : 'Amazon App'}
          </ThemedText>
          
          {isChristmas && (
            <ThemedText variant="body" color="secondary" className="text-center mt-2">
              ¡Ofertas especiales de temporada!
            </ThemedText>
          )}
        </ThemedView>

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

        {isChristmas && (
          <ThemedView className="items-center py-8">
            <ThemedText className="text-4xl">❄️ 🎅 ⛄ 🎄 ❄️</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}
