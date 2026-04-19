import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { useUIStore } from '../../src/store/uiStore';
import { timeAgo } from '../../src/utils/formatters';

const TYPE_ICONS: Record<string, string> = {
  alarm: '💘', heart: '❤️', match: '🎉', message: '💬', story: '📖', boost: '⚡',
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationsRead } = useUIStore();

  React.useEffect(() => {
    markNotificationsRead();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Bildirimler</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyText}>Henüz bildirim yok</Text>
          </View>
        ) : (
          notifications.map((n) => (
            <TouchableOpacity key={n.id} style={[styles.item, !n.isRead && styles.itemUnread]} activeOpacity={0.7}>
              <Text style={styles.icon}>{TYPE_ICONS[n.type] ?? '🔔'}</Text>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{n.title}</Text>
                <Text style={styles.itemBody}>{n.body}</Text>
                <Text style={styles.itemTime}>{timeAgo(n.createdAt)}</Text>
              </View>
              {!n.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.lg },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize['2xl'] },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.md, gap: Spacing.md },
  itemUnread: { backgroundColor: `${Colors.primary}08` },
  icon: { fontSize: 28, width: 40, textAlign: 'center' },
  itemContent: { flex: 1, gap: 2 },
  itemTitle: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
  itemBody: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
  itemTime: { color: Colors.textMuted, fontSize: Typography.fontSize.xs },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  empty: { paddingTop: 80, alignItems: 'center', gap: Spacing.md },
  emptyEmoji: { fontSize: 48 },
  emptyText: { color: Colors.textSecondary, fontSize: Typography.fontSize.base },
});
