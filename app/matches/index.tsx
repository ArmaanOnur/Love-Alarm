import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing } from '../../src/constants/theme';
import { ConversationList } from '../../src/components/chat/ConversationList';
import { useChatStore } from '../../src/store/chatStore';
import { useUIStore } from '../../src/store/uiStore';
import api from '../../src/services/api';
import type { Match } from '../../src/types/message';

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const { matches, setMatches } = useChatStore();
  const { showToast } = useUIStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = useCallback(async () => {
    try {
      const { data } = await api.get<{ data: Match[] }>('/matches');
      setMatches(data.data ?? []);
    } catch (err) {
      console.error('[Matches] Load failed:', err);
      showToast({ type: 'error', message: 'Eşleşmeler yüklenemedi.' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setMatches, showToast]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMatches();
  }, [loadMatches]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient
        colors={['#1A0D2E', Colors.background]}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Eşleşmeler</Text>
        <View style={{ width: 48 }} />
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.muted}>Yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >
          <View style={styles.subHeader}>
            <Text style={styles.count}>{matches.length} kişi</Text>
          </View>
          <ConversationList
            matches={matches}
            typingMatchIds={new Set()}
            onPress={(id) => router.push(`/chat/${id}`)}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
  },
  back: {
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.base,
    width: 48,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
  },
  subHeader: { paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.sm },
  count: { color: Colors.textMuted, fontSize: Typography.fontSize.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  muted: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
});
