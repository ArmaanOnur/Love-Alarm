import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Gradients } from '../../src/constants/theme';
import { useUIStore } from '../../src/store/uiStore';
import api from '../../src/services/api';
import type { UserProfile } from '../../src/types/user';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { showToast } = useUIStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}`).then(({ data }) => setProfile(data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const sendHeart = async () => {
    try {
      await api.post(`/hearts/${id}`);
      showToast({ type: 'heart', message: `${profile?.name ?? 'Kişi'}ye kalp attın! 💘` });
    } catch {
      showToast({ type: 'error', message: 'Kalp gönderilemedi.' });
    }
  };

  if (loading) return <View style={styles.loading}><ActivityIndicator color={Colors.primary} size="large" /></View>;
  if (!profile) return <View style={styles.loading}><Text style={{ color: Colors.textSecondary }}>Profil bulunamadı.</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient colors={['#1A0D2E', Colors.background]} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Geri</Text></TouchableOpacity>
      </LinearGradient>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.avatarWrap}>
          {profile.avatarUrl ? <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} /> : <View style={[styles.avatar, styles.avatarPlaceholder]}><Text style={{ fontSize: 52 }}>👤</Text></View>}
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        {profile.mood && <Text style={styles.mood}>✨ {profile.mood}</Text>}
        {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
        <View style={styles.stats}>
          <View style={styles.stat}><Text style={styles.statNum}>{profile.loveScore}</Text><Text style={styles.statLabel}>Love Score</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.stat}><Text style={styles.statNum}>{profile.streakCount}</Text><Text style={styles.statLabel}>Seri</Text></View>
        </View>
        {profile.interests.length > 0 && (
          <View style={styles.tags}>
            {profile.interests.map((tag) => <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}
          </View>
        )}
        <TouchableOpacity onPress={sendHeart} style={styles.heartBtn}>
          <LinearGradient colors={Gradients.primary} style={styles.heartGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.heartBtnText}>💘 Kalp At</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.lg },
  back: { color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.base },
  content: { padding: Spacing['2xl'], gap: Spacing.xl, alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: Colors.primary },
  avatarPlaceholder: { backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  name: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize['2xl'] },
  mood: { color: Colors.textSecondary, fontSize: Typography.fontSize.base },
  bio: { color: Colors.textSecondary, fontSize: Typography.fontSize.base, textAlign: 'center', lineHeight: 22 },
  stats: { flexDirection: 'row', backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.xl, padding: Spacing.base, justifyContent: 'space-around', width: '100%', alignItems: 'center' },
  stat: { alignItems: 'center', gap: 2 },
  statNum: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.xl },
  statLabel: { color: Colors.textSecondary, fontSize: Typography.fontSize.xs },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.surfaceBorder },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
  tag: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.full },
  tagText: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
  heartBtn: { width: '100%', borderRadius: BorderRadius.xl, overflow: 'hidden' },
  heartGrad: { paddingVertical: Spacing.lg, alignItems: 'center' },
  heartBtnText: { color: '#fff', fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.md },
});
