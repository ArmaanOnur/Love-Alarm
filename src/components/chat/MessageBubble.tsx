import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { formatTime } from '../../utils/formatters';
import type { Message } from '../../types/message';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return (
    <View style={[styles.row, isMine ? styles.rowRight : styles.rowLeft]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
        {message.type === 'emoji' ? (
          <Text style={styles.emoji}>{message.content}</Text>
        ) : message.type === 'gift' ? (
          <Text style={styles.gift}>{message.metadata?.giftType ?? '🎁'}</Text>
        ) : (
          <Text style={[styles.text, isMine ? styles.textMine : styles.textTheirs]}>
            {message.content}
          </Text>
        )}

        <View style={styles.meta}>
          <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
          {isMine && (
            <Text style={styles.readStatus}>{message.isRead ? '✓✓' : '✓'}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: Spacing.base, marginBottom: Spacing.xs },
  rowLeft: { alignItems: 'flex-start' },
  rowRight: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    gap: 2,
  },
  bubbleMine: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: BorderRadius.sm,
  },
  bubbleTheirs: {
    backgroundColor: Colors.surfaceElevated,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  text: { fontFamily: Typography.fontFamily.regular, fontSize: Typography.fontSize.base, lineHeight: 22 },
  textMine: { color: '#fff' },
  textTheirs: { color: Colors.textPrimary },
  emoji: { fontSize: 36 },
  gift: { fontSize: 32 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },
  time: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: Typography.fontFamily.regular },
  readStatus: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
});
