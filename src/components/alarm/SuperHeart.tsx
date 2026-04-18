import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface SuperHeartProps {
  onSend: () => void;
  disabled?: boolean;
}

export function SuperHeart({ onSend, disabled }: SuperHeartProps) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const handlePress = () => {
    scale.value = withSequence(withSpring(1.3, { damping: 5 }), withSpring(1));
    rotate.value = withSequence(withTiming(-15, { duration: 100 }), withTiming(15, { duration: 100 }), withTiming(0, { duration: 100 }));
    onSend();
  };

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={style}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={[styles.btn, disabled && styles.disabled]}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>💖</Text>
        <Text style={styles.label}>Süper Kalp</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: `${Colors.secondary}22`, borderWidth: 1, borderColor: Colors.secondary, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, ...Shadows.sm },
  disabled: { opacity: 0.4 },
  icon: { fontSize: 20 },
  label: { color: Colors.secondary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.sm },
});
