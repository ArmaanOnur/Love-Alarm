import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useUIStore } from '../../src/store/uiStore';
import api from '../../src/services/api';

interface AlarmRecord {
  id: string;
  startedAt: string;
  endedAt?: string;
  nearbyCount: number;
  matchCount?: number;
  locationName?: string;
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useUIStore();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<AlarmRecord[]>([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/alarms/history?limit=50&offset=0');
      setHistory(data.data || []);
    } catch (err) {
      console.error('[History] Fetch failed:', err);
      showToast({ type: 'error', message: 'Geçmiş yüklenemedi.' });
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins}m önce`;
    if (diffHours < 24) return `${diffHours}h önce`;
    if (diffDays < 7) return `${diffDays}d önce`;

    return date.toLocaleDateString('tr-TR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (startedAt: string, endedAt?: string) => {
    const start = new Date(startedAt);
    const end = endedAt ? new Date(endedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m`;
    return `${diffHours}h ${diffMins % 60}m`;
  };

  const HistoryItem = ({ item }: { item: AlarmRecord }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <View>
          <Text style={styles.itemDate}>{formatDate(item.startedAt)}</Text>
          <Text style={styles.itemDuration}>
            ⏱️ {calculateDuration(item.startedAt, item.endedAt)}
          </Text>
        </View>
        <Text style={styles.itemEmoji}>⏰</Text>
      </View>

      <View style={styles.itemStats}>
        <View style={styles.itemStat}>
          <Text style={styles.itemStatIcon}>👥</Text>
          <View>
            <Text style={styles.itemStatLabel}>Yakında</Text>
            <Text style={styles.itemStatValue}>{item.nearbyCount} kişi</Text>
          </View>
        </View>
        <View style={styles.itemStat}>
          <Text style={styles.itemStatIcon}>💘</Text>
          <View>
            <Text style={styles.itemStatLabel}>Eşleşme</Text>
            <Text style={styles.itemStatValue}>{item.matchCount || 0}</Text>
          </View>
        </View>
      </View>

      {item.locationName && (
        <Text style={styles.itemLocation}>📍 {item.locationName}</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient colors={['#1A0D2E', Colors.background]} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alarm Geçmişi</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Geçmiş yükleniyor...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyTitle}>Henüz Geçmiş Yok</Text>
          <Text style={styles.emptyDescription}>
            Alarm'u açarak tarih yazın!
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={HistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          scrollEnabled
        />
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
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
  },
  content: {
    padding: Spacing['2xl'],
    gap: Spacing.base,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.base,
  },
  historyItem: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    gap: Spacing.base,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    ...Shadows.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemDate: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.base,
  },
  itemDuration: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemStats: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  itemStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  itemStatIcon: {
    fontSize: 20,
  },
  itemStatLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
  },
  itemStatValue: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
  },
  itemLocation: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.base,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
  },
  emptyDescription: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
});
