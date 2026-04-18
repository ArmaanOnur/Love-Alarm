import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { timeAgo, truncate } from '../../utils/formatters';
import type { Match } from '../../types/message';

interface ConversationListProps {
  matches: Match[];
  onPress: (matchId: string) => void;
  typingMatchIds?: Set<string>;
}

export function ConversationList({ matches, onPress, typingMatchIds }: ConversationListProps) {
  if (matches.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>💘</Text>
        <Text style={styles.emptyTitle}>Henüz eşleşme yok</Text>
        <Text style={styles.emptySubtitle}>Alarm'ı açık tut ve kalp at!</Text>
      </View>
    );
  }

  return (
    <View>
      {matches.map((match) => {
        const isTyping = typingMatchIds?.has(match.id);
        return (
          <TouchableOpacity
            key={match.id}
            style={styles.row}
            onPress={() => onPress(match.id)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarWrap}>
              {match.user.avatarUrl ? (
                <Image source={{ uri: match.user.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={{ fontSize: 22 }}>👤</Text>
                </View>
              )}
              {match.unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{match.unreadCount}</Text>
                </View>
              )}
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>{match.user.name}</Text>
              <Text style={[styles.preview, isTyping && styles.typing]} numberOfLines={1}>
                {isTyping ? '✍️ Yazıyor...' : match.lastMessage ? truncate(match.lastMessage.content, 45) : 'Merhaba de! 👋'}
              </Text>
            </View>

            <View style={styles.meta}>
              <Text style={styles.time}>
                {match.lastMessage ? timeAgo(match.lastMessage.createdAt) : timeAgo(match.matchedAt)}
              </Text>
              {match.unreadCount > 0 && <View style={styles.dot} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: Spacing.md },
  avatarWrap: { position: 'relative' },
  avatar: { width: 54, height: 54, borderRadius: 27 },
  avatarPlaceholder: { backgroundColor: Colors.surfaceBorder, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, backgroundColor: Colors.primary, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontFamily: Typography.fontFamily.bold },
  info: { flex: 1 },
  name: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
  preview: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, marginTop: 2 },
  typing: { color: Colors.primary, fontStyle: 'italic' },
  meta: { alignItems: 'flex-end', gap: 4 },
  time: { color: Colors.textMuted, fontSize: Typography.fontSize.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: Spacing.sm },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.lg },
  emptySubtitle: { color: Colors.textSecondary, fontSize: Typography.fontSize.base },
});
