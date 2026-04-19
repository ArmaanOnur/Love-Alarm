import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Gradients } from '../../src/constants/theme';
import { AlarmButton } from '../../src/components/alarm/AlarmButton';
import { NearbyUserCard } from '../../src/components/alarm/NearbyUserCard';
import { StreakBanner } from '../../src/components/alarm/StreakBanner';
import { BoostCard } from '../../src/components/alarm/BoostCard';
import { DailyTasks } from '../../src/components/alarm/DailyTasks';
import { UndoToast } from '../../src/components/alarm/UndoToast';
import { ConfettiView } from '../../src/components/shared/ConfettiView';
import { StoryRing } from '../../src/components/story/StoryRing';
import { useAlarmStore } from '../../src/store/alarmStore';
import { useUserStore } from '../../src/store/userStore';
import { useUIStore } from '../../src/store/uiStore';
import { useSocket } from '../../src/hooks/useSocket';
import { useLocation } from '../../src/hooks/useLocation';
import { useHaptic } from '../../src/hooks/useHaptic';
import api from '../../src/services/api';
import { emitAlarmStart, emitAlarmStop } from '../../src/services/socket';
import type { StoryGroup } from '../../src/types/alarm';

export default function AlarmScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const { isActive, nearbyUsers, streakCount, boostActive, dailyTasks, setActive, completeTask } = useAlarmStore();
  const { showToast } = useUIStore();
  const { triggerAlarm, triggerMedium } = useHaptic();
  const [showConfetti, setShowConfetti] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false);
  const [lastHearted, setLastHearted] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useSocket({
    onMatch: () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    },
  });

  const { requestAndStart, stopWatch } = useLocation();

  const toggleAlarm = async () => {
    if (isActive) {
      try {
        await api.post('/alarm/stop');
      } catch (err) {
        console.error('[Alarm] Failed to stop:', err);
        showToast({ type: 'error', message: 'Alarm kapatma başarısız. Lütfen tekrar deneyin.' });
        return;
      }
      emitAlarmStop();
      stopWatch();
      setActive(false);
      triggerMedium();
    } else {
      const granted = await requestAndStart();
      if (!granted) {
        showToast({ type: 'error', message: 'Konum izni gerekli!' });
        return;
      }
      try {
        await api.post('/alarm/start');
      } catch (err) {
        console.error('[Alarm] Failed to start:', err);
        showToast({ type: 'error', message: 'Alarm açma başarısız. Lütfen tekrar deneyin.' });
        return;
      }
      emitAlarmStart();
      setActive(true);
      triggerAlarm();
      showToast({ type: 'heart', message: 'Alarm açıldı! 💘 Etrafı tarıyorum...' });
    }
  };

  const heartUser = async (userId: string) => {
    try {
      await api.post(`/hearts/${userId}`);
      setLastHearted(userId);
      setUndoVisible(true);
      setTimeout(() => setUndoVisible(false), 4000);
    } catch {
      showToast({ type: 'error', message: 'Kalp gönderilemedi.' });
    }
  };

  const undoHeart = async () => {
    if (!lastHearted) return;
    try {
      await api.delete(`/hearts/${lastHearted}`);
      setUndoVisible(false);
      setLastHearted(null);
      showToast({ type: 'info', message: 'Kalp geri alındı.' });
    } catch (err) {
      console.error('[Alarm] Undo heart failed:', err);
      showToast({ type: 'error', message: 'Kalp geri alınamadı.' });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Mock story groups for UI
  const mockStories: StoryGroup[] = nearbyUsers.slice(0, 5).map((u) => ({
    user: {
      ...u,
      phone: '',
      loveScore: 0,
      streakCount: 0,
      isPremium: false,
      isGhost: false,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    },
    stories: [],
    hasUnviewed: true,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient colors={['#1A0D2E', Colors.background]} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.greeting}>Merhaba, {user?.name?.split(' ')[0] ?? 'Sevgili'} 👋</Text>
        <Text style={styles.subtitle}>{isActive ? `${nearbyUsers.length} kişi yakında 💘` : 'Alarmı aç ve yakınlıkları keşfet'}</Text>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Stories row */}
        {mockStories.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesRow}>
            {mockStories.map((g) => (
              <StoryRing key={g.user.id} group={g} onPress={() => {}} />
            ))}
          </ScrollView>
        )}

        {/* Streak banner */}
        {streakCount >= 2 && <StreakBanner streak={streakCount} />}

        {/* Main alarm button */}
        <View style={styles.alarmCenter}>
          <AlarmButton isActive={isActive} onPress={toggleAlarm} />
        </View>

        {/* Nearby users */}
        {isActive && nearbyUsers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yakınındakiler</Text>
            {nearbyUsers.map((u) => (
              <NearbyUserCard key={u.id} user={u} onHeart={heartUser} />
            ))}
          </View>
        )}

        {isActive && nearbyUsers.length === 0 && (
          <View style={styles.emptyNearby}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>Tarıyorum... Yakınında kimse yok.</Text>
          </View>
        )}

        {/* Boost */}
        <BoostCard
          isActive={boostActive}
          onActivate={() => router.push('/premium')}
        />

        {/* Daily tasks */}
        {dailyTasks.length > 0 && (
          <View style={styles.section}>
            <DailyTasks tasks={dailyTasks} onComplete={completeTask} />
          </View>
        )}
      </ScrollView>

      <UndoToast visible={undoVisible} onUndo={undoHeart} />
      <ConfettiView visible={showConfetti} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.lg },
  greeting: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.xl },
  subtitle: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, marginTop: 2 },
  content: { padding: Spacing.base, gap: Spacing.lg },
  storiesRow: { paddingVertical: Spacing.sm, gap: Spacing.md },
  alarmCenter: { alignItems: 'center', paddingVertical: Spacing.lg },
  section: { gap: Spacing.sm },
  sectionTitle: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
  emptyNearby: { alignItems: 'center', paddingVertical: Spacing['3xl'], gap: Spacing.md },
  emptyEmoji: { fontSize: 40 },
  emptyText: { color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.base },
});
