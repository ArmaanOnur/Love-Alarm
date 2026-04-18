import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import type { StoryGroup } from '../../types/alarm';

interface StoryRingProps {
  group: StoryGroup;
  onPress: () => void;
  size?: number;
}

export function StoryRing({ group, onPress, size = 64 }: StoryRingProps) {
  const ringColor = group.hasUnviewed ? [Colors.primary, Colors.secondary] : [Colors.surfaceBorder, Colors.surfaceBorder];
  const innerSize = size - 6;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.wrapper}>
      <LinearGradient
        colors={ringColor as [string, string]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <View style={[styles.innerBorder, { width: innerSize, height: innerSize, borderRadius: innerSize / 2 }]}>
          {group.user.avatarUrl ? (
            <Image source={{ uri: group.user.avatarUrl }} style={[styles.avatar, { width: innerSize - 4, height: innerSize - 4, borderRadius: (innerSize - 4) / 2 }]} />
          ) : (
            <View style={[styles.avatarPlaceholder, { width: innerSize - 4, height: innerSize - 4, borderRadius: (innerSize - 4) / 2 }]}>
              <Text style={{ fontSize: size * 0.3 }}>👤</Text>
            </View>
          )}
        </View>
      </LinearGradient>
      <Text style={styles.name} numberOfLines={1}>{group.user.name.split(' ')[0]}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: Spacing.xs, width: 72 },
  ring: { padding: 3, alignItems: 'center', justifyContent: 'center' },
  innerBorder: { backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  avatar: {},
  avatarPlaceholder: { backgroundColor: Colors.surfaceBorder, alignItems: 'center', justifyContent: 'center' },
  name: { color: Colors.textSecondary, fontSize: 11, maxWidth: 68, textAlign: 'center' },
});
