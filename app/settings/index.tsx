import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/constants/theme';
import { useUserStore } from '../../src/store/userStore';
import { useUIStore } from '../../src/store/uiStore';
import api from '../../src/services/api';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUserStore();
  const { showToast } = useUIStore();
  const [loading, setLoading] = useState(false);

  // Notification preferences
  const [notifAlarm, setNotifAlarm] = useState(true);
  const [notifHearts, setNotifHearts] = useState(true);
  const [notifMatches, setNotifMatches] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);

  // Privacy settings
  const [shareLocation, setShareLocation] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await api.put('/users/me/settings', {
        notifications: {
          alarm: notifAlarm,
          hearts: notifHearts,
          matches: notifMatches,
          messages: notifMessages,
        },
        privacy: {
          shareLocation,
          profileVisible,
          allowMessages,
        },
      });
      showToast({ type: 'success', message: 'Ayarlar kaydedildi!' });
    } catch (err) {
      console.error('[Settings] Save failed:', err);
      showToast({ type: 'error', message: 'Ayarlar kaydedilemedi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Bu işlem geri alınamaz. Tüm verileriniz silinecektir.',
      [
        { text: 'İptal', onPress: () => {}, style: 'cancel' },
        {
          text: 'Sil',
          onPress: async () => {
            try {
              setLoading(true);
              await api.delete('/users/me');
              showToast({ type: 'success', message: 'Hesap silindi.' });
              // Navigate to welcome screen
              router.replace('/(auth)/welcome');
            } catch (err) {
              console.error('[Settings] Delete account failed:', err);
              showToast({ type: 'error', message: 'Hesap silinemedi.' });
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient colors={['#1A0D2E', Colors.background]} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Bildirim Tercihleri</Text>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Alarm Bildirimleri</Text>
              <Text style={styles.settingDescription}>Yakınlardaki kullanıcılardan bildir</Text>
            </View>
            <Switch
              value={notifAlarm}
              onValueChange={setNotifAlarm}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Kalp Bildirimleri</Text>
              <Text style={styles.settingDescription}>Biri kalp gönderdiğinde bildir</Text>
            </View>
            <Switch
              value={notifHearts}
              onValueChange={setNotifHearts}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Eşleşme Bildirimleri</Text>
              <Text style={styles.settingDescription}>Karşılıklı eşleşme olduğunda bildir</Text>
            </View>
            <Switch
              value={notifMatches}
              onValueChange={setNotifMatches}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
            />
          </View>

          <View style={[styles.settingItem, styles.lastItem]}>
            <View>
              <Text style={styles.settingLabel}>Mesaj Bildirimleri</Text>
              <Text style={styles.settingDescription}>Yeni mesaj geldiğinde bildir</Text>
            </View>
            <Switch
              value={notifMessages}
              onValueChange={setNotifMessages}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
            />
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Gizlilik Ayarları</Text>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Konum Paylaş</Text>
              <Text style={styles.settingDescription}>Diğer kullanıcıların seni bulabilmesi için</Text>
            </View>
            <Switch
              value={shareLocation}
              onValueChange={setShareLocation}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Profili Görünür Yap</Text>
              <Text style={styles.settingDescription}>Profili diğerleri görebilsin</Text>
            </View>
            <Switch
              value={profileVisible}
              onValueChange={setProfileVisible}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
            />
          </View>

          <View style={[styles.settingItem, styles.lastItem]}>
            <View>
              <Text style={styles.settingLabel}>Mesaj Al</Text>
              <Text style={styles.settingDescription}>Eşleşmelere mesaj gönderebilsin</Text>
            </View>
            <Switch
              value={allowMessages}
              onValueChange={setAllowMessages}
              trackColor={{ false: Colors.surfaceBorder, true: Colors.primary }}
            />
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Uygulama</Text>
          <TouchableOpacity style={[styles.buttonItem, styles.lastItem]}>
            <Text style={styles.settingLabel}>Versiyon</Text>
            <Text style={styles.settingDescription}>Love Alarm v1.0.0</Text>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Hesap</Text>
          <TouchableOpacity
            style={[styles.dangerButton, styles.lastItem]}
            onPress={handleDeleteAccount}
            disabled={loading}
          >
            <Text style={styles.dangerButtonText}>Hesabı Sil</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSaveSettings}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
  },
  back: {
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.base,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
  },
  content: {
    padding: Spacing['2xl'],
    gap: Spacing['2xl'],
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  lastItem: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  buttonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  settingLabel: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.base,
  },
  settingDescription: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.background,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
  },
  dangerButton: {
    backgroundColor: `${Colors.error}20`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  dangerButtonText: {
    color: Colors.error,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.base,
  },
});
