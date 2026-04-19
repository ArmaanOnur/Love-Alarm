import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, FlatList
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Gradients } from '../../src/constants/theme';
import { sendOtp } from '../../src/services/auth';
import { isValidPhone, normalizePhone } from '../../src/utils/validators';
import { useUIStore } from '../../src/store/uiStore';

// Kapsamlı ülke listesi. İhtiyacınıza göre tüm dünya ülkelerini buraya ekleyebilirsiniz.
const COUNTRIES = [
  { code: '+90', flag: '🇹🇷', name: 'Türkiye' },
  { code: '+1', flag: '🇺🇸', name: 'ABD / Kanada' },
  { code: '+44', flag: '🇬🇧', name: 'İngiltere' },
  { code: '+49', flag: '🇩🇪', name: 'Almanya' },
  { code: '+33', flag: '🇫🇷', name: 'Fransa' },
  { code: '+39', flag: '🇮🇹', name: 'İtalya' },
  { code: '+34', flag: '🇪🇸', name: 'İspanya' },
  { code: '+7', flag: '🇷🇺', name: 'Rusya' },
  { code: '+31', flag: '🇳🇱', name: 'Hollanda' },
  { code: '+32', flag: '🇧🇪', name: 'Belçika' },
  { code: '+41', flag: '🇨🇭', name: 'İsviçre' },
  { code: '+43', flag: '🇦🇹', name: 'Avusturya' },
  { code: '+46', flag: '🇸🇪', name: 'İsveç' },
  { code: '+47', flag: '🇳🇴', name: 'Norveç' },
  { code: '+45', flag: '🇩🇰', name: 'Danimarka' },
  { code: '+82', flag: '🇰🇷', name: 'Güney Kore' }, // Yeni eklendi
  { code: '+81', flag: '🇯🇵', name: 'Japonya' },
  { code: '+86', flag: '🇨🇳', name: 'Çin' },
  { code: '+91', flag: '🇮🇳', name: 'Hindistan' },
  { code: '+971', flag: '🇦🇪', name: 'BAE' },
  { code: '+966', flag: '🇸🇦', name: 'Suudi Arabistan' },
];

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isModalVisible, setModalVisible] = useState(false);

  const { showToast } = useUIStore();
  const insets = useSafeAreaInsets();

  const handleSend = async () => {
    // Validasyonu sadece telefon numarası üzerinden veya birleştirilmiş numara üzerinden yapabilirsiniz.
    if (!isValidPhone(phone)) {
      showToast({ type: 'error', message: 'Lütfen geçerli bir telefon numarası giriniz.' });
      return;
    }

    setLoading(true);
    try {
      // Ülke kodu ile telefon numarasını birleştirerek gönderiyoruz
      const fullPhoneNumber = `${selectedCountry.code}${phone}`;
      const normalized = normalizePhone(fullPhoneNumber);

      await sendOtp(normalized);
      router.push({ pathname: '/(auth)/verify', params: { phone: normalized } });
    } catch {
      showToast({ type: 'error', message: 'SMS gönderilemedi. Lütfen tekrar dene.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <LinearGradient colors={['#0D0D1A', '#0D0D1A']} style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.emoji}>📱</Text>
          <Text style={styles.title}>Telefon Numaranı Gir</Text>
          <Text style={styles.subtitle}>Doğrulama kodu göndereceğiz.</Text>

          <View style={styles.inputRow}>
            {/* Ülke Kodu Seçici Butonu */}
            <TouchableOpacity
              style={styles.countryCode}
              activeOpacity={0.7}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.flag}>{selectedCountry.flag}</Text>
              <Text style={styles.code}>{selectedCountry.code}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="5XX XXX XX XX"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={15} // Uluslararası numaralar daha uzun olabilir
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, (!phone || loading) && styles.btnDisabled]}
            onPress={handleSend}
            disabled={!phone || loading}
            activeOpacity={0.85}
          >
            <LinearGradient colors={Gradients.primary} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Kod Gönder</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Ülke Seçimi Modalı */}
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Ülke Seçin</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseText}>Kapat</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={COUNTRIES}
                keyExtractor={(item) => item.code + item.name}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => {
                      setSelectedCountry(item);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.itemFlag}>{item.flag}</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCode}>{item.code}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: Spacing['2xl'] },
  back: { paddingVertical: Spacing.sm },
  backText: { color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.base },
  content: { flex: 1, justifyContent: 'center', gap: Spacing.xl },
  emoji: { fontSize: 48, textAlign: 'center' },
  title: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize['2xl'], textAlign: 'center' },
  subtitle: { color: Colors.textSecondary, fontSize: Typography.fontSize.base, textAlign: 'center', marginTop: -Spacing.md },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden'
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    borderRightWidth: 1,
    borderRightColor: Colors.surfaceBorder
  },
  flag: { fontSize: 20 },
  code: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
  dropdownIcon: { color: Colors.textMuted, fontSize: 10, marginLeft: 2 },
  input: { flex: 1, color: Colors.textPrimary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.lg, paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg },

  btn: { borderRadius: BorderRadius.xl, overflow: 'hidden' },
  btnDisabled: { opacity: 0.5 },
  btnGradient: { paddingVertical: Spacing.lg, alignItems: 'center' },
  btnText: { color: '#fff', fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.md },

  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0D0D1A', // Mevcut temanın arka plan rengi
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    height: '70%',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
  },
  modalCloseText: {
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.base,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  itemFlag: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  itemName: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.base,
  },
  itemCode: {
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.base,
  },
});