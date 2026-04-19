import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows, Typography, Gradients } from '../../constants/theme';

interface AlarmButtonProps {
  isActive: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function AlarmButton({ isActive, onPress, disabled }: AlarmButtonProps) {
  const scale = useSharedValue(1);
  const outerRing1 = useSharedValue(1);
  const outerRing2 = useSharedValue(1);
  const outerOpacity1 = useSharedValue(0.6);
  const outerOpacity2 = useSharedValue(0.3);
  const innerGlow = useSharedValue(0);

  const startPulse = useCallback(() => {
    outerRing1.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 1000, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 0 }),
      ),
      -1,
      false,
    );
    outerRing2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withDelay(400, withTiming(1.9, { duration: 1000, easing: Easing.out(Easing.ease) })),
        withTiming(1, { duration: 0 }),
      ),
      -1,
      false,
    );
    outerOpacity1.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000 }),
        withTiming(0.6, { duration: 0 }),
      ),
      -1,
      false,
    );
    outerOpacity2.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 0 }),
        withTiming(0, { duration: 1000 }),
        withTiming(0.3, { duration: 0 }),
      ),
      -1,
      false,
    );
    innerGlow.value = withTiming(1, { duration: 400 });
  }, []);

  const stopPulse = useCallback(() => {
    cancelAnimation(outerRing1);
    cancelAnimation(outerRing2);
    cancelAnimation(outerOpacity1);
    cancelAnimation(outerOpacity2);
    outerRing1.value = withTiming(1);
    outerRing2.value = withTiming(1);
    outerOpacity1.value = withTiming(0);
    outerOpacity2.value = withTiming(0);
    innerGlow.value = withTiming(0, { duration: 400 });
  }, []);

  useEffect(() => {
    if (isActive) startPulse();
    else stopPulse();
    return () => stopPulse();
  }, [isActive]);

  const handlePress = () => {
    scale.value = withSpring(0.92, { damping: 8 }, () => {
      scale.value = withSpring(1, { damping: 10 });
    });
    onPress();
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: outerRing1.value }],
    opacity: outerOpacity1.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: outerRing2.value }],
    opacity: outerOpacity2.value,
  }));

  return (
    <View style={styles.wrapper}>
      {/* Pulse rings */}
      <Animated.View style={[styles.ring, ring2Style]} />
      <Animated.View style={[styles.ring, ring1Style]} />

      {/* Main button */}
      <Animated.View style={[styles.buttonWrap, buttonStyle]}>
        <Pressable onPress={handlePress} disabled={disabled} style={styles.pressable}>
          <LinearGradient
            colors={isActive ? Gradients.primary : ['#2A2A45', '#1E1E35']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.heart}>{isActive ? '💘' : '🤍'}</Text>
            <Text style={styles.label}>
              {isActive ? 'Alarm Açık' : 'Alarm Kapalı'}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const BUTTON_SIZE = 180;

const styles = StyleSheet.create({
  wrapper: {
    width: BUTTON_SIZE + 80,
    height: BUTTON_SIZE + 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: BUTTON_SIZE + 60,
    height: BUTTON_SIZE + 60,
    borderRadius: (BUTTON_SIZE + 60) / 2,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.alarmPulse,
  },
  buttonWrap: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    ...Shadows.glow,
  },
  pressable: { flex: 1 },
  gradient: {
    flex: 1,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heart: { fontSize: 52 },
  label: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
    letterSpacing: 0.5,
  },
});
