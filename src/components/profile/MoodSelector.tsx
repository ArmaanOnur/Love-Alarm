import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import type { Mood } from '../../types/user';

const MOODS: { key: Mood; emoji: string; label: string }[] = [
  { key: 'happy', emoji: '😊', label: 'Mutlu' },
  { key: 'romantic', emoji: '🥰', label: 'Romantik' },
  { key: 'adventurous', emoji: '🤩', label: 'Maceraperest' },
  { key: 'chill', emoji: '😌', label: 'Sakin' },
  { key: 'curious', emoji: '🤔', label: 'Meraklı' },
  { key: 'mysterious', emoji: '😏', label: 'Gizemli' },
  { key: 'playful', emoji: '😄', label: 'Eğlenceli' },
  { key: 'creative', emoji: '🎨', label: 'Yaratıcı' },
];

interface MoodSelectorProps {
  selected?: Mood;
  onChange: (mood: Mood) => void;
}

export function MoodSelector({ selected, onChange }: MoodSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ruh Hali</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {MOODS.map(({ key, emoji, label }) => {
          const active = selected === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onChange(key)}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{emoji}</Text>
              <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
  row: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: 2 },
  chip: { alignItems: 'center', gap: 4, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.xl, backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.surfaceBorder, minWidth: 72 },
  chipActive: { backgroundColor: `${Colors.primary}22`, borderColor: Colors.primary },
  emoji: { fontSize: 24 },
  label: { color: Colors.textSecondary, fontSize: Typography.fontSize.xs, fontFamily: Typography.fontFamily.medium },
  labelActive: { color: Colors.primary },
});
