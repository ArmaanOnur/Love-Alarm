import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface UndoToastProps {
  visible: boolean;
  onUndo: () => void;
  message?: string;
}

export function UndoToast({ visible, onUndo, message = 'Kalp geri alındı' }: UndoToastProps) {
  const translateY = useSharedValue(visible ? 0 : 100);

  React.useEffect(() => {
    translateY.value = withSpring(visible ? 0 : 100, { damping: 14 });
  }, [visible]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View style={[styles.container, style]} pointerEvents={visible ? 'auto' : 'none'}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onUndo} style={styles.btn}>
        <Text style={styles.btnText}>GERİ AL</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', bottom: 100, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10,
  },
  message: { color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.sm },
  btn: { paddingHorizontal: Spacing.sm },
  btnText: { color: Colors.primary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.sm },
});
