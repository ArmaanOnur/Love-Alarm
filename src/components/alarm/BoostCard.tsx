import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Gradients } from '../../constants/theme';

interface BoostCardProps {
  isActive: boolean;
  minutesRemaining?: number;
  onActivate: () => void;
}

export function BoostCard({ isActive, minutesRemaining, onActivate }: BoostCardProps) {
  return (
    <LinearGradient
      colors={isActive ? Gradients.gold : ['#1E1E35', '#2A2A45']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}
    >
      <View style={styles.left}>
        <Text style={styles.icon}>⚡</Text>
        <View>
          <Text style={styles.title}>Boost {isActive ? 'Aktif' : 'Et'}</Text>
          <Text style={styles.subtitle}>
            {isActive
              ? `${minutesRemaining ?? 0} dakika kaldı`
              : '30 dakika daha fazla görün'}
          </Text>
        </View>
      </View>
      {!isActive && (
        <TouchableOpacity style={styles.btn} onPress={onActivate} activeOpacity={0.8}>
          <Text style={styles.btnText}>Başlat</Text>
        </TouchableOpacity>
      )}
      {isActive && <Text style={styles.activeEmoji}>🚀</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.xl, padding: Spacing.base, gap: Spacing.md },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  icon: { fontSize: 28 },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.base },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontFamily: Typography.fontFamily.regular, fontSize: Typography.fontSize.sm },
  btn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg },
  btnText: { color: '#fff', fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.sm },
  activeEmoji: { fontSize: 28 },
});
