import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Pressable,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import type { NearbyUser } from '../../types/user';

interface UserBrowseCardProps {
  user: NearbyUser;
  onHeart: (userId: string) => void;
  onPass: (userId: string) => void;
}

export function UserBrowseCard({ user, onHeart, onPass }: UserBrowseCardProps) {
  return (
    <View style={[styles.card, Shadows.md]}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initials}>
              {user.name?.slice(0, 2).toUpperCase() ?? '?'}
            </Text>
          </View>
        )}

        {/* Distance badge */}
        {user.distance !== undefined && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>
              {user.distance < 1 ? '< 1' : Math.round(user.distance)}km
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name}</Text>
          {user.isPremium && <Text style={styles.premiumBadge}>👑</Text>}
        </View>

        {user.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
        )}

        {/* Mood and interests */}
        <View style={styles.metaRow}>
          {user.mood && <Text style={styles.mood}>{user.mood}</Text>}
          {user.interests && user.interests.length > 0 && (
            <Text style={styles.interests} numberOfLines={1}>
              {user.interests.slice(0, 2).join(', ')}
            </Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statEmoji}>💘</Text>
            <Text style={styles.statText}>{user.loveScore ?? 0}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statText}>{user.streakCount ?? 0}</Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.passButton]}
          onPress={() => onPass(user.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.passIcon}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.heartButton]}
          onPress={() => onHeart(user.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.heartIcon}>💘</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.base,
  },
  avatarContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: Colors.background,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize['3xl'],
  },
  distanceBadge: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    backgroundColor: `${Colors.background}dd`,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  distanceText: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
  },
  info: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  name: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
  },
  premiumBadge: {
    fontSize: Typography.fontSize.base,
  },
  bio: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * 1.4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mood: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  interests: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.base,
    paddingTop: Spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statEmoji: {
    fontSize: 16,
  },
  statText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
  },
  actions: {
    flexDirection: 'row',
    padding: Spacing.base,
    gap: Spacing.base,
    justifyContent: 'center',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passButton: {
    backgroundColor: `${Colors.error}20`,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  passIcon: {
    fontSize: 24,
    color: Colors.error,
  },
  heartButton: {
    backgroundColor: Colors.primary,
  },
  heartIcon: {
    fontSize: 24,
  },
});
