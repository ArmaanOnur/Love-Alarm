import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Gradients } from '../../constants/theme';
import { getProximityTier } from '../../utils/haversine';

interface ProximityBarProps {
  distanceMeters: number;
  maxMeters?: number;
}

export function ProximityBar({ distanceMeters, maxMeters = 10 }: ProximityBarProps) {
  const clamped = Math.min(distanceMeters, maxMeters);
  const fillFraction = 1 - clamped / maxMeters;
  const tier = getProximityTier(distanceMeters);
  const tierColor = { near: Colors.near, medium: Colors.warning, far: Colors.primary }[tier];
  const tierLabel = { near: 'Çok Yakın!', medium: 'Yakın', far: '10m İçinde' }[tier];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Yakınlık</Text>
        <Text style={[styles.distance, { color: tierColor }]}>
          {Math.round(distanceMeters)}m — {tierLabel}
        </Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={tier === 'near' ? Gradients.success : tier === 'medium' ? Gradients.gold : Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${fillFraction * 100}%` }]}
        />
      </View>
      <View style={styles.markers}>
        {['10m', '7m', '5m', '2m', '0m'].map((l) => (
          <Text key={l} style={styles.marker}>{l}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.base, gap: Spacing.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.sm },
  distance: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.sm },
  track: { height: 8, backgroundColor: Colors.surfaceBorder, borderRadius: BorderRadius.full, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: BorderRadius.full },
  markers: { flexDirection: 'row', justifyContent: 'space-between' },
  marker: { color: Colors.textMuted, fontSize: Typography.fontSize.xs, fontFamily: Typography.fontFamily.regular },
});
