import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Gradients } from '../../src/constants/theme';
import { useUserStore } from '../../src/store/userStore';

const { height: H } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { isAuthenticated } = useUserStore();

  const heartScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);
  const btnTranslate = useSharedValue(30);

  useEffect(() => {
    if (isAuthenticated) { router.replace('/(tabs)/alarm'); return; }
    heartScale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 120 }));
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    btnOpacity.value = withDelay(1100, withTiming(1, { duration: 500 }));
    btnTranslate.value = withDelay(1100, withSpring(0, { damping: 14 }));
  }, [isAuthenticated]);

  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.value }] }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const subtitleStyle = useAnimatedStyle(() => ({ opacity: subtitleOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value, transform: [{ translateY: btnTranslate.value }] }));

  return (
    <LinearGradient colors={['#0D0D1A', '#1A0D2E', '#0D0D1A']} style={styles.container}>
      {/* Ambient blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <Animated.View style={[styles.heartWrap, heartStyle]}>
        <Text style={styles.heartEmoji}>💘</Text>
        <View style={styles.pulse1} />
        <View style={styles.pulse2} />
      </Animated.View>

      <Animated.Text style={[styles.title, titleStyle]}>Love Alarm</Animated.Text>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        10 metre yakınındaki biri seni seviyorsa{'\n'}alarm çalıyor 💫
      </Animated.Text>

      <Animated.View style={[styles.btnWrap, btnStyle]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(auth)/phone')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={Gradients.primary} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.btnText}>Başlamak İçin Giriş Yap</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.terms}>Devam ederek Gizlilik Politikası'nı kabul etmiş olursunuz.</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing['2xl'] },
  blob: { position: 'absolute', borderRadius: 999 },
  blob1: { width: 300, height: 300, top: -60, left: -100, backgroundColor: `${Colors.primary}15` },
  blob2: { width: 250, height: 250, bottom: 60, right: -80, backgroundColor: `${Colors.secondary}15` },
  heartWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: Spacing['3xl'] },
  heartEmoji: { fontSize: 90, zIndex: 1 },
  pulse1: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: `${Colors.primary}40` },
  pulse2: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 1, borderColor: `${Colors.primary}20` },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.extraBold, fontSize: Typography.fontSize['4xl'], letterSpacing: -1, marginBottom: Spacing.md },
  subtitle: { color: Colors.textSecondary, fontFamily: Typography.fontFamily.regular, fontSize: Typography.fontSize.base, textAlign: 'center', lineHeight: 24, marginBottom: Spacing['4xl'] },
  btnWrap: { width: '100%', gap: Spacing.md },
  primaryBtn: { borderRadius: BorderRadius.xl, overflow: 'hidden' },
  btnGradient: { paddingVertical: Spacing.lg, alignItems: 'center', borderRadius: BorderRadius.xl },
  btnText: { color: '#fff', fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.md },
  terms: { color: Colors.textMuted, fontSize: Typography.fontSize.xs, textAlign: 'center' },
});
