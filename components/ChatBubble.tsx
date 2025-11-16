import { View } from 'react-native';
import ThemedText from './ThemedText';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface ChatBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatBubble({ text, isUser, timestamp }: ChatBubbleProps) {
  const { theme } = useTheme();
  const isDark = theme.includes('dark');
  const isChristmas = theme.includes('christmas');

  return (
    <View className={`mb-3 ${isUser ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-[80%] p-3 rounded-2xl ${
          isUser
            ? isChristmas
              ? isDark ? 'bg-navy-gold' : 'bg-navy-red'
              : 'bg-blue-600'
            : isDark
              ? 'bg-gray-700'
              : 'bg-gray-200'
        }`}
      >
        <ThemedText 
          variant="body" 
          className={isUser ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}
        >
          {text}
        </ThemedText>
      </View>
      <ThemedText variant="caption" color="secondary" className="mt-1 px-2">
        {timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
      </ThemedText>
    </View>
  );
}

