import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

const ALL_INTERESTS = [
  '🎵 Müzik', '🎮 Oyun', '📚 Kitap', '🎬 Film', '✈️ Seyahat',
  '🍕 Yemek', '🏋️ Spor', '🎨 Sanat', '📸 Fotoğraf', '🐾 Hayvanlar',
  '🌿 Doğa', '💃 Dans', '🧘 Yoga', '☕ Kahve', '🎭 Tiyatro',
  '🚴 Bisiklet', '🎸 Enstrüman', '🌙 Gece', '☀️ Sabah', '🔬 Bilim',
];

interface InterestTagsProps {
  selected: string[];
  maxSelect?: number;
  onChange: (interests: string[]) => void;
}

export function InterestTags({ selected, maxSelect = 8, onChange }: InterestTagsProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) onChange(selected.filter((t) => t !== tag));
    else if (selected.length < maxSelect) onChange([...selected, tag]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>İlgi Alanları</Text>
        <Text style={styles.count}>{selected.length}/{maxSelect}</Text>
      </View>
      <View style={styles.tags}>
        {ALL_INTERESTS.map((tag) => {
          const active = selected.includes(tag);
          return (
            <TouchableOpacity key={tag} onPress={() => toggle(tag)} style={[styles.tag, active && styles.tagActive]} activeOpacity={0.7}>
              <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
  count: { color: Colors.textMuted, fontSize: Typography.fontSize.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.surfaceBorder },
  tagActive: { backgroundColor: `${Colors.primary}22`, borderColor: Colors.primary },
  tagText: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, fontFamily: Typography.fontFamily.medium },
  tagTextActive: { color: Colors.primary },
});
