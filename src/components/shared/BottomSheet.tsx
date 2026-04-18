import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, BorderRadius } from '../../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapHeight?: number; // fraction of screen, e.g. 0.6
}

export function BottomSheet({
  visible,
  onClose,
  children,
  snapHeight = 0.6,
}: BottomSheetProps) {
  const sheetHeight = SCREEN_HEIGHT * snapHeight;
  const translateY = useSharedValue(sheetHeight);
  const backdropOpacity = useSharedValue(0);

  const open = useCallback(() => {
    translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
    backdropOpacity.value = withTiming(1, { duration: 300 });
  }, []);

  const close = useCallback(() => {
    translateY.value = withTiming(sheetHeight, { duration: 280 });
    backdropOpacity.value = withTiming(0, { duration: 280 }, (done) => {
      if (done) runOnJS(onClose)();
    });
  }, [onClose, sheetHeight]);

  useEffect(() => {
    if (visible) open();
    else close();
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={close}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.sheet, { height: sheetHeight }, sheetStyle]}>
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surfaceBorder,
    alignSelf: 'center',
    marginBottom: 8,
  },
});
