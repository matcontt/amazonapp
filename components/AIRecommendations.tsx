import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAI } from '@/lib/contexts/AIContext';
import ThemedView from './ThemedView';
import ThemedText from './ThemedText';
import ProductCard from './ProductCard';

export default function AIRecommendations() {
  const router = useRouter();
  const { recommendations, loadingRecommendations } = useAI();

  if (loadingRecommendations) {
    return (
      <ThemedView className="p-6 items-center">
        <ActivityIndicator size="small" />
        <ThemedText variant="caption" color="secondary" className="mt-2">
          🤖 Generando recomendaciones con AI...
        </ThemedText>
      </ThemedView>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <View className="mb-4">
      <ThemedText variant="subtitle" className="px-6 mb-3">
        🤖 Recomendado para ti con AI
      </ThemedText>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {recommendations.map((product) => (
          <View key={product.id} style={{ width: 280, marginRight: 12 }}>
            <ProductCard
              title={product.title}
              description={product.description}
              price={product.price}
              imageUrl={product.image}
              rating={product.rating.rate}
              ratingCount={product.rating.count}
              onPress={() => router.push(`/product/${product.id}`)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
