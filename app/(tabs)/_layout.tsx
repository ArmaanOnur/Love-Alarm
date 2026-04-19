import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography } from '../../src/constants/theme';
import { useChatStore } from '../../src/store/chatStore';
import { useUIStore } from '../../src/store/uiStore';

function TabIcon({ emoji, label, focused, badgeCount }: { emoji: string; label: string; focused: boolean; badgeCount?: number }) {
  return (
    <View style={tabStyles.wrap}>
      <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
        <Text style={tabStyles.emoji}>{emoji}</Text>
        {(badgeCount ?? 0) > 0 && (
          <View style={tabStyles.badge}>
            <Text style={tabStyles.badgeText}>{badgeCount! > 9 ? '9+' : badgeCount}</Text>
          </View>
        )}
      </View>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 2 },
  iconWrap: { width: 44, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16, position: 'relative' },
  iconWrapActive: { backgroundColor: `${Colors.primary}22` },
  emoji: { fontSize: 22 },
  badge: { position: 'absolute', top: 0, right: 2, backgroundColor: Colors.primary, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  badgeText: { color: '#fff', fontSize: 9, fontFamily: Typography.fontFamily.bold },
  label: { color: Colors.textMuted, fontSize: 10, fontFamily: Typography.fontFamily.medium },
  labelActive: { color: Colors.primary },
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { matches } = useChatStore();
  const { unreadNotificationCount } = useUIStore();
  const totalUnread = matches.reduce((sum, m) => sum + m.unreadCount, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.surfaceBorder,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="alarm"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💘" label="Alarm" focused={focused} /> }}
      />
      {/* Keşfet: rehberdeki 5 sekmeden ayrı; Daha Fazla veya doğrudan `/(tabs)/browse` ile açılır */}
      <Tabs.Screen
        name="browse"
        options={{
          href: null,
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" label="Keşfet" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Mesajlar" focused={focused} badgeCount={totalUnread} /> }}
      />
      <Tabs.Screen
        name="radar"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📡" label="Radar" focused={focused} /> }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔔" label="Bildirimler" focused={focused} badgeCount={unreadNotificationCount} /> }}
      />
      <Tabs.Screen
        name="more"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" label="Daha Fazla" focused={focused} /> }}
      />
    </Tabs>
  );
}
