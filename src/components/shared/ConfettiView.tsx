import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface ConfettiPieceProps {
  index: number;
  emoji: string;
}

function ConfettiPiece({ index, emoji }: ConfettiPieceProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const delay = index * 60;
    const xDir = (Math.random() - 0.5) * 200;
    const yEnd = -(100 + Math.random() * 150);

    translateX.value = withDelay(delay, withSpring(xDir, { damping: 8 }));
    translateY.value = withDelay(delay, withSequence(
      withSpring(yEnd, { damping: 6 }),
      withDelay(400, withTiming(300, { duration: 600 })),
    ));
    opacity.value = withDelay(delay, withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(700, withTiming(0, { duration: 400 })),
    ));
    scale.value = withDelay(delay, withSpring(1, { damping: 8 }));
    rotate.value = withDelay(delay, withSpring((Math.random() - 0.5) * 720));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.piece, style]}>{emoji}</Animated.Text>
  );
}

interface ConfettiViewProps {
  visible: boolean;
  message?: string;
}

const EMOJIS = ['💘', '❤️', '✨', '🎉', '💕', '🌸', '💫', '🎊'];

export function ConfettiView({ visible, message = 'Eşleştin! 💘' }: ConfettiViewProps) {
  if (!visible) return null;

  const pieces = Array.from({ length: 16 }, (_, i) => ({
    index: i,
    emoji: EMOJIS[i % EMOJIS.length],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.center}>
        {pieces.map(({ index, emoji }) => (
          <ConfettiPiece key={index} index={index} emoji={emoji} />
        ))}
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 300,
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  piece: { position: 'absolute', fontSize: 24 },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
  },
});
