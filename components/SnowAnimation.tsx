import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

interface SnowAnimationProps {
  enabled?: boolean;
}

const { height } = Dimensions.get('window');

export default function SnowAnimation({ enabled = true }: SnowAnimationProps) {
  if (!enabled) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {[...Array(12)].map((_, i) => (
        <Snowflake key={i} index={i} />
      ))}
    </View>
  );
}

function Snowflake({ index }: { index: number }) {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Reset position
      translateY.setValue(-50);
      translateX.setValue(0);

      // Animación de caída
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height + 50,
          duration: 8000 + index * 500, // Diferentes velocidades
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 30,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -30,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Repetir cuando termina
        startAnimation();
      });
    };

    // Delay inicial diferente para cada copo
    const timer = setTimeout(() => {
      startAnimation();
    }, index * 800);

    return () => clearTimeout(timer);
  }, []);

  const emoji = index % 3 === 0 ? '❄️' : index % 3 === 1 ? '⭐' : '✨';
  const size = 20 + (index % 3) * 8;
  const leftPercent = (index * 8.5) % 100;
  const opacity = 0.4 + (index % 5) * 0.12;

  return (
    <Animated.Text
      style={[
        styles.snowflake,
        {
          left: `${leftPercent}%` as any, // Type assertion para evitar error TS
          fontSize: size,
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  snowflake: {
    position: 'absolute',
    top: 0,
  },
});