import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Gradients } from '../../src/constants/theme';
import { AvatarUpload } from '../../src/components/profile/AvatarUpload';
import { InterestTags } from '../../src/components/profile/InterestTags';
import { MoodSelector } from '../../src/components/profile/MoodSelector';
import { QRShare } from '../../src/components/profile/QRShare';
import { useUserStore } from '../../src/store/userStore';
import { useUIStore } from '../../src/store/uiStore';
import api from '../../src/services/api';
import type { Mood } from '../../src/types/user';

export default function MyProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useUserStore();
  const { showToast } = useUIStore();
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [mood, setMood] = useState<Mood | undefined>(user?.mood);
  const [saving, setSaving] = useState(false);

  const handleAvatarUpload = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const { data } = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser(data.data);
      showToast({ type: 'success', message: 'Avatar güncellendi!' });
    } catch (err) {
      console.error('[Profile] Avatar upload failed:', err);
      showToast({ type: 'error', message: 'Avatar yüklenemedi.' });
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/me', { name, bio, interests, mood });
      updateUser(data.data);
      showToast({ type: 'success', message: 'Profil güncellendi!' });
    } catch {
      showToast({ type: 'error', message: 'Kaydetme başarısız.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient colors={['#1A0D2E', Colors.background]} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profilim</Text>
        <TouchableOpacity onPress={save} disabled={saving}>
          {saving ? <ActivityIndicator color={Colors.primary} /> : <Text style={styles.saveText}>Kaydet</Text>}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <AvatarUpload currentUrl={user?.avatarUrl} name={user?.name} size={100} onImageSelected={handleAvatarUpload} />

        <View style={styles.stats}>
          <View style={styles.stat}><Text style={styles.statNum}>{user?.loveScore ?? 0}</Text><Text style={styles.statLabel}>Love Score</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={styles.statNum}>{user?.streakCount ?? 0}</Text><Text style={styles.statLabel}>Seri</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={styles.statNum}>{interests.length}</Text><Text style={styles.statLabel}>İlgi</Text></View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} maxLength={50} placeholderTextColor={Colors.textMuted} placeholder="Adın" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Hakkımda</Text>
          <TextInput style={[styles.input, styles.bioInput]} value={bio} onChangeText={setBio} multiline maxLength={200} placeholderTextColor={Colors.textMuted} placeholder="Kendini anlat..." />
        </View>

        <MoodSelector selected={mood} onChange={setMood} />
        <InterestTags selected={interests} onChange={setInterests} />
        {user && <QRShare userId={user.id} userName={user.name} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.lg },
  back: { color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.base },
  headerTitle: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.lg },
  saveText: { color: Colors.primary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.base },
  content: { padding: Spacing['2xl'], gap: Spacing.xl },
  stats: { flexDirection: 'row', backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.xl, padding: Spacing.base, justifyContent: 'space-around', alignItems: 'center' },
  stat: { alignItems: 'center', gap: 2 },
  statNum: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.xl },
  statLabel: { color: Colors.textSecondary, fontSize: Typography.fontSize.xs },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.surfaceBorder },
  field: { gap: Spacing.sm },
  label: { color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.sm },
  input: { backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.surfaceBorder, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, color: Colors.textPrimary, fontFamily: Typography.fontFamily.regular, fontSize: Typography.fontSize.base },
  bioInput: { minHeight: 90, textAlignVertical: 'top' },
});
