import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, BorderRadius, Typography, Spacing } from '../../constants/theme';
import { useUIStore } from '../../store/uiStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function ToastItem({
  id,
  message,
  type,
}: {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'heart';
}) {
  const { dismissToast } = useUIStore();
  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 14, stiffness: 180 });
    opacity.value = withTiming(1, { duration: 200 });
  }, []);

  const dismiss = () => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(-80, { duration: 250 }, (finished) => {
      if (finished) runOnJS(dismissToast)(id);
    });
  };

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const bgColor = {
    success: Colors.success,
    error: Colors.error,
    info: Colors.secondary,
    heart: Colors.primary,
  }[type];

  const icon = { success: '✅', error: '❌', info: 'ℹ️', heart: '💘' }[type];

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bgColor }, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message} numberOfLines={2}>{message}</Text>
      <TouchableOpacity onPress={dismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.close}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function Toast() {
  const { toasts } = useUIStore();
  if (toasts.length === 0) return null;
  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH - Spacing['2xl'] * 2,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  icon: { fontSize: 18 },
  message: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
  },
  close: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
});
