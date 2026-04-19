import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { formatDistance, getProximityTier } from '../../utils/haversine';
import type { NearbyUser } from '../../types/user';

interface NearbyUserCardProps {
  user: NearbyUser;
  onHeart: (userId: string) => void;
}

function nearbyMeters(user: NearbyUser): number {
  if (user.distanceMeters != null) return user.distanceMeters;
  if (user.distance != null) return Math.round(user.distance * 1000);
  return 0;
}

export function NearbyUserCard({ user, onHeart }: NearbyUserCardProps) {
  const meters = nearbyMeters(user);
  const tier = getProximityTier(meters);
  const tierColor = { near: Colors.near, medium: Colors.warning, far: Colors.primary }[tier];

  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        {user.avatarUrl && !user.isAnonymous ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarBlur]}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
        )}
        <View style={[styles.distanceBadge, { backgroundColor: tierColor }]}>
          <Text style={styles.distanceText}>{formatDistance(meters)}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{user.isAnonymous ? 'Bilinmeyen' : user.name}</Text>
        {user.mood && <Text style={styles.mood}>✨ {user.mood}</Text>}
        {user.interests.length > 0 && (
          <View style={styles.tags}>
            {user.interests.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.heartBtn, user.hasHeartedMe && styles.heartBtnActive]}
        onPress={() => onHeart(user.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.heartIcon}>{user.hasHeartedMe ? '💘' : '🤍'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarBlur: { backgroundColor: Colors.surfaceBorder, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 24 },
  distanceBadge: {
    position: 'absolute', bottom: -4, right: -4,
    paddingHorizontal: 5, paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  distanceText: { color: '#fff', fontSize: 9, fontFamily: Typography.fontFamily.bold },
  info: { flex: 1 },
  name: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
  mood: { color: Colors.textSecondary, fontSize: Typography.fontSize.xs, marginTop: 2 },
  tags: { flexDirection: 'row', gap: 4, marginTop: 4 },
  tag: { backgroundColor: Colors.surfaceBorder, paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.full },
  tagText: { color: Colors.textSecondary, fontSize: Typography.fontSize.xs },
  heartBtn: { padding: 10, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceBorder },
  heartBtnActive: { backgroundColor: `${Colors.primary}33` },
  heartIcon: { fontSize: 22 },
});
