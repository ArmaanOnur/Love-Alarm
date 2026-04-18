import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface StreakBannerProps {
  streak: number;
}

export function StreakBanner({ streak }: StreakBannerProps) {
  if (streak < 2) return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.text}>{streak} günlük seri!</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>+{Math.min(streak * 5, 50)} puan</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}22`,
    borderWidth: 1,
    borderColor: `${Colors.warning}44`,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  fire: { fontSize: 20 },
  text: {
    flex: 1,
    color: Colors.warning,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.sm,
  },
  badge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  badgeText: { color: Colors.textInverse, fontSize: Typography.fontSize.xs, fontFamily: Typography.fontFamily.bold },
});
