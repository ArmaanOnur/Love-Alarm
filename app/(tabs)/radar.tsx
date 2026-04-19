import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Gradients } from '../../src/constants/theme';
import { useAlarmStore } from '../../src/store/alarmStore';

export default function RadarScreen() {
  const insets = useSafeAreaInsets();
  const { nearbyUsers, isActive } = useAlarmStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Radar</Text>
        <Text style={styles.subtitle}>Yakınındaki aktif kullanıcılar</Text>
      </View>

      <View style={styles.radarWrap}>
        {/* Animated radar rings */}
        <View style={styles.ring3} />
        <View style={styles.ring2} />
        <View style={styles.ring1} />
        <LinearGradient colors={Gradients.primary} style={styles.center}>
          <Text style={styles.centerText}>{nearbyUsers.length}</Text>
          <Text style={styles.centerLabel}>yakın</Text>
        </LinearGradient>

        {/* User dots */}
        {nearbyUsers.slice(0, 8).map((u, i) => {
          const angle = (i / Math.max(nearbyUsers.length, 1)) * 2 * Math.PI;
          const meters =
            u.distanceMeters ?? (u.distance != null ? u.distance * 1000 : 10);
          const dist = Math.min(meters / 10, 0.95);
          const radius = dist * 130;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <View key={u.id} style={[styles.dot, { transform: [{ translateX: x }, { translateY: y }] }]}>
              <Text style={styles.dotEmoji}>💘</Text>
            </View>
          );
        })}
      </View>

      {!isActive && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Alarm'ı açarak radar'ı etkinleştir 👆</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.lg },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize['2xl'] },
  subtitle: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, marginTop: 2 },
  radarWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring3: { position: 'absolute', width: 300, height: 300, borderRadius: 150, borderWidth: 1, borderColor: `${Colors.primary}15` },
  ring2: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 1, borderColor: `${Colors.primary}25` },
  ring1: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 1, borderColor: `${Colors.primary}40` },
  center: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  centerText: { color: '#fff', fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.xl },
  centerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
  dot: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  dotEmoji: { fontSize: 20 },
  hint: { paddingBottom: 100, alignItems: 'center' },
  hintText: { color: Colors.textMuted, fontSize: Typography.fontSize.sm },
});
