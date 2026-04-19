import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Gradients } from '../../src/constants/theme';
import { AvatarUpload } from '../../src/components/profile/AvatarUpload';
import { InterestTags } from '../../src/components/profile/InterestTags';
import { MoodSelector } from '../../src/components/profile/MoodSelector';
import { useUserStore } from '../../src/store/userStore';
import { useUIStore } from '../../src/store/uiStore';
import api from '../../src/services/api';
import type { Mood } from '../../src/types/user';

const STEPS = ['Adın', 'Fotoğrafın', 'İlgi Alanların'];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [interests, setInterests] = useState<string[]>([]);
  const [mood, setMood] = useState<Mood | undefined>();
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUserStore();
  const { showToast } = useUIStore();
  const insets = useSafeAreaInsets();

  const next = () => {
    if (step === 0 && !name.trim()) {
      showToast({ type: 'error', message: 'Lütfen adını gir.' });
      return;
    }
    if (step < STEPS.length - 1) { setStep((s) => s + 1); return; }
    finish();
  };

  const finish = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/users/me', { name: name.trim(), interests, mood });
      updateUser(data.data);
      router.replace('/(tabs)/alarm');
    } catch {
      showToast({ type: 'error', message: 'Profil kaydedilemedi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0D0D1A', '#0D0D1A']} style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      {/* Step dots */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <Text style={styles.stepLabel}>Adım {step + 1} / {STEPS.length}</Text>
      <Text style={styles.title}>{STEPS[step]}</Text>

      <View style={styles.body}>
        {step === 0 && (
          <TextInput
            style={styles.nameInput}
            placeholder="Adın nedir?"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
            maxLength={50}
            autoFocus
          />
        )}
        {step === 1 && (
          <View style={styles.centered}>
            <AvatarUpload name={name} currentUrl={avatarUri} onImageSelected={setAvatarUri} size={120} />
            <MoodSelector selected={mood} onChange={setMood} />
          </View>
        )}
        {step === 2 && (
          <InterestTags selected={interests} onChange={setInterests} maxSelect={8} />
        )}
      </View>

      <TouchableOpacity onPress={next} disabled={loading} style={styles.btn}>
        <LinearGradient colors={Gradients.primary} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{step < STEPS.length - 1 ? 'Devam →' : 'Başla 🎉'}</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing['2xl'], gap: Spacing.lg },
  dots: { flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center', paddingTop: Spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.surfaceBorder },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  stepLabel: { color: Colors.textMuted, fontSize: Typography.fontSize.sm, textAlign: 'center' },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize['2xl'], textAlign: 'center' },
  body: { flex: 1, justifyContent: 'center', gap: Spacing.xl },
  centered: { alignItems: 'center', gap: Spacing.xl },
  nameInput: { backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.surfaceBorder, paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, color: Colors.textPrimary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.lg },
  btn: { borderRadius: BorderRadius.xl, overflow: 'hidden' },
  btnGradient: { paddingVertical: Spacing.lg, alignItems: 'center' },
  btnText: { color: '#fff', fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.md },
});
