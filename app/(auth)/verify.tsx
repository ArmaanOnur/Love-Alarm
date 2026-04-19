import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Gradients } from '../../src/constants/theme';
import { verifyOtp, sendOtp } from '../../src/services/auth';
import { useUserStore } from '../../src/store/userStore';
import { useUIStore } from '../../src/store/uiStore';

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const refs = useRef<TextInput[]>([]);
  const { setUser } = useUserStore();
  const { showToast } = useUIStore();
  const insets = useSafeAreaInsets();

  const handleChange = (val: string, idx: number) => {
    const next = [...code];
    next[idx] = val.slice(-1);
    setCode(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
    if (next.every((d) => d !== '')) verify(next.join(''));
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === 'Backspace' && !code[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const verify = async (fullCode: string) => {
    setLoading(true);
    try {
      const auth = await verifyOtp(phone, fullCode);
      setUser(auth.user);
      if (!auth.user.name) {
        router.replace('/(auth)/onboarding');
      } else {
        router.replace('/(tabs)/alarm');
      }
    } catch {
      showToast({ type: 'error', message: 'Hatalı kod. Tekrar dene.' });
      setCode(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      await sendOtp(phone);
      showToast({ type: 'success', message: 'Kod tekrar gönderildi!' });
    } catch {
      showToast({ type: 'error', message: 'Gönderilemedi, tekrar dene.' });
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <LinearGradient colors={['#0D0D1A', '#0D0D1A']} style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.emoji}>🔐</Text>
          <Text style={styles.title}>Doğrulama Kodu</Text>
          <Text style={styles.subtitle}>{phone} numarasına gönderilen 6 haneli kodu gir.</Text>

          <View style={styles.codeRow}>
            {code.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(r) => { if (r) refs.current[idx] = r; }}
                style={[styles.codeInput, digit && styles.codeInputFilled]}
                value={digit}
                onChangeText={(v) => handleChange(v, idx)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.lg }} />}

          <TouchableOpacity onPress={resend} disabled={resending} style={styles.resendBtn}>
            <Text style={styles.resendText}>
              {resending ? 'Gönderiliyor...' : 'Kodu tekrar gönder'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing['2xl'] },
  back: { paddingVertical: Spacing.sm },
  backText: { color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.base },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.xl },
  emoji: { fontSize: 56 },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize['2xl'] },
  subtitle: { color: Colors.textSecondary, fontSize: Typography.fontSize.base, textAlign: 'center', lineHeight: 22 },
  codeRow: { flexDirection: 'row', gap: Spacing.sm },
  codeInput: { width: 48, height: 56, borderRadius: BorderRadius.lg, backgroundColor: Colors.surfaceElevated, borderWidth: 2, borderColor: Colors.surfaceBorder, textAlign: 'center', color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.xl },
  codeInputFilled: { borderColor: Colors.primary },
  resendBtn: { paddingVertical: Spacing.sm },
  resendText: { color: Colors.primary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
});
