import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, RefreshControl, ActivityIndicator, FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useUIStore } from '../../src/store/uiStore';
import api from '../../src/services/api';
import type { NearbyUser } from '../../src/types/user';
import { UserBrowseCard } from '../../src/components/browse/UserBrowseCard';
import { BrowseFilterBar } from '../../src/components/browse/BrowseFilterBar';

interface BrowseFilters {
  distanceMax: number;
  ageMin: number;
  ageMax: number;
  interests: string[];
  sortBy: 'distance' | 'recent' | 'new';
}

export default function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useUIStore();
  const [users, setUsers] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BrowseFilters>({
    distanceMax: 10,
    ageMin: 18,
    ageMax: 50,
    interests: [],
    sortBy: 'distance',
  });

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/users/nearby', {
        params: {
          distance: filters.distanceMax,
          ageMin: filters.ageMin,
          ageMax: filters.ageMax,
          interests: filters.interests.join(','),
          sortBy: filters.sortBy,
          limit: 50,
          offset: 0,
        },
      });
      setUsers(data.data || []);
    } catch (err) {
      console.error('[Browse] Fetch users failed:', err);
      showToast({ type: 'error', message: 'Kullanıcılar yüklenemedi.' });
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
  }, [fetchUsers]);

  const handleHeart = async (userId: string) => {
    try {
      await api.post(`/hearts/${userId}`);
      showToast({ type: 'heart', message: 'Kalp gönderildi! 💘' });
      // Remove from browse list after hearting
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error('[Browse] Heart failed:', err);
      showToast({ type: 'error', message: 'Kalp gönderilemedi.' });
    }
  };

  const handlePass = async (userId: string) => {
    // Just remove from browse list
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleFilterChange = (newFilters: BrowseFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
    setLoading(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient colors={['#1A0D2E', Colors.background]} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.greeting}>Keşfet 🔍</Text>
        <Text style={styles.subtitle}>Yakınındaki kişileri gözat</Text>
      </LinearGradient>

      {loading && users.length === 0 ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Kullanıcılar aranıyor...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Kullanıcı Bulunamadı</Text>
          <Text style={styles.emptyDescription}>
            Filtreleri değiştirerek daha fazla kullanıcı bul
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <BrowseFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            isExpanded={showFilters}
            onToggle={setShowFilters}
          />
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <UserBrowseCard
                user={item}
                onHeart={handleHeart}
                onPass={handlePass}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />}
            scrollEnabled
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
  },
  greeting: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize['2xl'],
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
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
    maxWidth: 280,
  },
  listContent: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
});
