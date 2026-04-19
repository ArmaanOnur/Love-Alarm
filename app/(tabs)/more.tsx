import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useUserStore } from '../../src/store/userStore';
import { logout } from '../../src/services/auth';

type MenuHref =
  | '/profile'
  | '/badges'
  | '/history'
  | '/premium'
  | '/settings'
  | '/matches'
  | '/(tabs)/browse';

interface MenuItem {
  icon: string;
  label: string;
  href: MenuHref;
  highlight?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: '🔍', label: 'Keşfet', href: '/(tabs)/browse' },
  { icon: '💘', label: 'Eşleşmeler', href: '/matches' },
  { icon: '👤', label: 'Profilim', href: '/profile' },
  { icon: '🏅', label: 'Rozetlerim', href: '/badges' },
  { icon: '📖', label: 'Alarm Geçmişi', href: '/history' },
  { icon: '👑', label: 'Premium', href: '/premium', highlight: true },
  { icon: '⚙️', label: 'Ayarlar', href: '/settings' },
];

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { user, clearUser } = useUserStore();

  const handleLogout = async () => {
    await logout();
    clearUser();
    router.replace('/(auth)/welcome');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Daha Fazla</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        {/* Profile card */}
        <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/profile')} activeOpacity={0.8}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={{ fontSize: 28 }}>👤</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name ?? 'Kullanıcı'}</Text>
            <Text style={styles.profileSub}>
              {user?.isPremium ? '👑 Premium Üye' : 'Ücretsiz Üye'}
              {' · '}❤️ {user?.loveScore ?? 0} puan
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Menu items */}
        <View style={styles.menu}>
          {MENU_ITEMS.map(({ icon, label, href, highlight }) => (
            <TouchableOpacity
              key={href}
              style={[styles.menuItem, highlight && styles.menuItemHighlight]}
              onPress={() => router.push(href)}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{icon}</Text>
              <Text style={[styles.menuLabel, highlight && styles.menuLabelHighlight]}>{label}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Love Alarm v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.lg },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize['2xl'] },
  profileCard: { flexDirection: 'row', alignItems: 'center', margin: Spacing.base, padding: Spacing.base, backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.xl, gap: Spacing.md, ...Shadows.sm },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  avatarPlaceholder: { backgroundColor: Colors.surfaceBorder, alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flex: 1 },
  profileName: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.lg },
  profileSub: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, marginTop: 2 },
  arrow: { color: Colors.textMuted, fontSize: 20 },
  menu: { marginHorizontal: Spacing.base, gap: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg, gap: Spacing.md },
  menuItemHighlight: { backgroundColor: `${Colors.accent}15`, borderWidth: 1, borderColor: `${Colors.accent}30` },
  menuIcon: { fontSize: 22, width: 32 },
  menuLabel: { flex: 1, color: Colors.textPrimary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.base },
  menuLabelHighlight: { color: Colors.accent, fontFamily: Typography.fontFamily.bold },
  logoutBtn: { margin: Spacing['2xl'], alignItems: 'center', padding: Spacing.base, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.surfaceBorder },
  logoutText: { color: Colors.error, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
  version: { textAlign: 'center', color: Colors.textMuted, fontSize: Typography.fontSize.xs, marginBottom: Spacing.lg },
});
