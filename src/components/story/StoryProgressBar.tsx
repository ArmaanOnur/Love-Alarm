import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';

interface StoryProgressBarProps {
  count: number;
  currentIndex: number;
  duration?: number; // ms per story
  onComplete: () => void;
}

export function StoryProgressBar({
  count,
  currentIndex,
  duration = 5000,
  onComplete,
}: StoryProgressBarProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration,
      easing: Easing.linear,
    }, (finished) => {
      if (finished) {
        if (currentIndex < count - 1) {
          // parent handles index increment via onComplete
        }
      }
    });

    const timer = setTimeout(onComplete, duration);
    return () => {
      clearTimeout(timer);
      progress.value = 0;
    };
  }, [currentIndex, duration]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.track}>
          {i < currentIndex ? (
            <View style={[styles.fill, { width: '100%' }]} />
          ) : i === currentIndex ? (
            <Animated.View style={[styles.fill, fillStyle]} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 8,
  },
  track: {
    flex: 1,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.textPrimary,
    borderRadius: 2,
  },
});
