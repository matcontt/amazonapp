import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
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

  const bubbleColor = isUser
    ? isChristmas
      ? isDark ? 'bg-navy-gold' : 'bg-navy-red'
      : 'bg-blue-600'
    : isDark
      ? 'bg-gray-700'
      : 'bg-gray-200';

  const textColor = isUser ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1F2937';

  return (
    <View className={`mb-3 ${isUser ? 'items-end' : 'items-start'}`}>
      <View className={`max-w-[85%] p-3 rounded-2xl ${bubbleColor}`}>
        {isUser ? (
          <ThemedText variant="body" className={isUser ? 'text-white' : ''}>
            {text}
          </ThemedText>
        ) : (
          <Markdown
            style={{
              body: {
                color: textColor,
                fontSize: 15,
                lineHeight: 22,
              },
              strong: {
                fontWeight: 'bold',
                color: isChristmas ? '#FFD700' : '#2563EB',
              },
              em: {
                fontStyle: 'italic',
              },
              bullet_list: {
                marginVertical: 4,
              },
              ordered_list: {
                marginVertical: 4,
              },
              list_item: {
                flexDirection: 'row',
                marginVertical: 2,
              },
              code_inline: {
                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                paddingHorizontal: 4,
                paddingVertical: 2,
                borderRadius: 4,
                fontFamily: 'monospace',
                fontSize: 13,
              },
            }}
          >
            {text}
          </Markdown>
        )}
      </View>
      <ThemedText variant="caption" color="secondary" className="mt-1 px-2">
        {timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
      </ThemedText>
    </View>
  );
}