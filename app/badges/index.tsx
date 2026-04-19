import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useUserStore } from '../../src/store/userStore';

// Badge definitions
interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'engagement' | 'social' | 'profile' | 'premium';
}

const BADGE_CATALOG: Record<string, BadgeInfo> = {
  first_heart: {
    id: 'first_heart',
    name: 'Kalp Sevenlik',
    description: 'İlk kalbini gönder',
    icon: '💘',
    category: 'engagement',
  },
  streak_7: {
    id: 'streak_7',
    name: '7 Gün Seri',
    description: '7 gün arka arkaya alarm aç',
    icon: '🔥',
    category: 'engagement',
  },
  streak_30: {
    id: 'streak_30',
    name: '30 Gün Seri',
    description: '30 gün arka arkaya alarm aç',
    icon: '⚡',
    category: 'engagement',
  },
  match_master: {
    id: 'match_master',
    name: 'Eşleşme Ustası',
    description: '10 eşleşme gerçekleştir',
    icon: '💑',
    category: 'social',
  },
  chatty: {
    id: 'chatty',
    name: 'Sohbet Kurdu',
    description: '50 mesaj gönder',
    icon: '💬',
    category: 'social',
  },
  profile_complete: {
    id: 'profile_complete',
    name: 'Profil Tamamlayıcı',
    description: 'Tüm profil alanlarını doldur',
    icon: '✨',
    category: 'profile',
  },
  super_heart: {
    id: 'super_heart',
    name: 'Süper Kalp',
    description: 'İlk super heart gönder',
    icon: '⭐',
    category: 'premium',
  },
  premium_member: {
    id: 'premium_member',
    name: 'Premium Üye',
    description: 'Premium üyeliğe katıl',
    icon: '👑',
    category: 'premium',
  },
};

const BADGE_CATEGORIES = [
  { key: 'engagement', label: 'Katılım', icon: '📊' },
  { key: 'social', label: 'Sosyal', icon: '👥' },
  { key: 'profile', label: 'Profil', icon: '👤' },
  { key: 'premium', label: 'Premium', icon: '👑' },
];

export default function BadgesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const earnedBadgeIds = user?.badges || [];

  const BadgeCard = ({ badge, earned }: { badge: BadgeInfo; earned: boolean }) => (
    <View
      style={[
        styles.badgeCard,
        earned ? styles.badgeCardEarned : styles.badgeCardLocked,
      ]}
    >
      <Text style={[styles.badgeIcon, !earned && styles.badgeIconLocked]}>
        {badge.icon}
      </Text>
      <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>
        {badge.name}
      </Text>
      <Text style={[styles.badgeDescription, !earned && styles.badgeDescriptionLocked]}>
        {badge.description}
      </Text>
      {!earned && (
        <View style={styles.lockedBadge}>
          <Text style={styles.lockedText}>🔒</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient colors={['#1A0D2E', Colors.background]} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rozetlerim</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{earnedBadgeIds.length}</Text>
            <Text style={styles.statLabel}>Kazanıldı</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{Object.keys(BADGE_CATALOG).length}</Text>
            <Text style={styles.statLabel}>Toplam</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>
              {Math.round((earnedBadgeIds.length / Object.keys(BADGE_CATALOG).length) * 100)}%
            </Text>
            <Text style={styles.statLabel}>Tamamlama</Text>
          </View>
        </View>

        {/* Badges by category */}
        {BADGE_CATEGORIES.map((category) => {
          const categoryBadges = Object.values(BADGE_CATALOG).filter(
            (b) => b.category === category.key,
          );
          return (
            <View key={category.key} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryTitle}>{category.label}</Text>
                <View style={styles.categoryCount}>
                  <Text style={styles.categoryCountText}>
                    {categoryBadges.filter((b) => earnedBadgeIds.includes(b.id)).length}/{categoryBadges.length}
                  </Text>
                </View>
              </View>
              <View style={styles.badgeGrid}>
                {categoryBadges.map((badge) => {
                  const earned = earnedBadgeIds.includes(badge.id);
                  return (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      earned={earned}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Empty state if no badges */}
        {earnedBadgeIds.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>Henüz Rozet Kazanmadınız</Text>
            <Text style={styles.emptyDescription}>
              Alarm'u açarak, kalp göndererek ve eşleşerek rozetler kazanın!
            </Text>
          </View>
        )}
      </ScrollView>
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
    gap: Spacing['2xl'],
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...Shadows.sm,
  },
  stat: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statNum: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xl,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.surfaceBorder,
  },
  categorySection: {
    gap: Spacing.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryIcon: {
    fontSize: Typography.fontSize.lg,
  },
  categoryTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
  },
  categoryCount: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  categoryCountText: {
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  badgeCardEarned: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  badgeCardLocked: {
    borderColor: Colors.surfaceBorder,
    backgroundColor: Colors.background,
    opacity: 0.6,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  badgeIconLocked: {
    opacity: 0.4,
  },
  badgeName: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: Colors.textSecondary,
  },
  badgeDescription: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  badgeDescriptionLocked: {
    color: Colors.textMuted,
  },
  lockedBadge: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.background}90`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    gap: Spacing.base,
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
});
