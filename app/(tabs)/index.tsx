import { ScrollView, View, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useProducts } from '@/lib/contexts/ProductContext';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ProductCard from '@/components/ProductCard';
import CategoryChip from '@/components/CategoryChip';
import SearchBar from '@/components/SearchBar';
import SnowAnimation from '@/components/SnowAnimation';
import '@/global.css';

export default function IndexScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { 
    filteredProducts, 
    categories, 
    loading, 
    error, 
    selectedCategory, 
    searchQuery,
    setSelectedCategory, 
    setSearchQuery,
    refreshProducts 
  } = useProducts();
  
  const isChristmas = theme.includes('christmas');

  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  if (loading && filteredProducts.length === 0) {
    return (
      <ThemedView variant="screen" className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <ThemedText variant="body" color="secondary" className="mt-4">
          Cargando productos...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView variant="screen" className="flex-1 items-center justify-center p-6">
        <ThemedText variant="subtitle" className="text-red-500 text-center mb-4">
          {error}
        </ThemedText>
        <ThemedText 
          variant="body" 
          color="accent" 
          className="underline"
          onPress={refreshProducts}
        >
          Reintentar
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView variant="screen" className="flex-1">
      <SnowAnimation enabled={isChristmas} />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshProducts} />
        }
      >
        {/* Header */}
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
          {/* Buscador */}
          <SearchBar 
            value={searchQuery} 
            onChangeText={setSearchQuery}
          />

          {/* Categorías */}
          <View className="mb-4">
            <ThemedText variant="subtitle" className="mb-3">
              📂 Categorías
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <CategoryChip
                label="Todas"
                isSelected={!selectedCategory}
                onPress={() => setSelectedCategory(null)}
              />
              {categories.map((category) => (
                <CategoryChip
                  key={category}
                  label={category}
                  isSelected={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Productos */}
          <ThemedText variant="subtitle" color="accent" className="mb-4">
            {isChristmas ? '🎁 Ofertas Navideñas' : 'Productos Destacados'} 
            {' '}({filteredProducts.length})
          </ThemedText>

          {filteredProducts.length === 0 ? (
            <ThemedView variant="section" className="p-6 rounded-2xl items-center">
              <ThemedText variant="body" color="secondary" className="text-center">
                No se encontraron productos {searchQuery && `con "${searchQuery}"`}
              </ThemedText>
            </ThemedView>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={isChristmas ? `🎁 ${product.title}` : product.title}
                description={product.description}
                price={product.price}
                imageUrl={product.image}
                rating={product.rating.rate}
                ratingCount={product.rating.count}
                onPress={() => handleProductPress(product.id)}
              />
            ))
          )}
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
