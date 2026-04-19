import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useUserStore } from '../../src/store/userStore';
import { useUIStore } from '../../src/store/uiStore';
import api from '../../src/services/api';

interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

const PREMIUM_FEATURES = [
  { icon: '🚀', title: 'Boost Aktivesi', description: 'Haftada 1 serbest boost' },
  { icon: '⭐', title: 'Süper Kalp', description: 'Sınırsız süper kalp gönder' },
  { icon: '👻', title: 'Hayalet Modu', description: 'Anonim olarak tara' },
  { icon: '👁️', title: 'Profil Görüntülemeciler', description: 'Seni kimin ziyaret ettiğini gör' },
  { icon: '💬', title: 'Mesaj Önceliği', description: 'Mesajlarınız öne çıksın' },
  { icon: '🎨', title: 'Özel Profil Sayfası', description: 'Renkli profil dekorasyonları' },
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useUserStore();
  const { showToast } = useUIStore();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/premium/plans');
      setPlans(data.data || []);
    } catch (err) {
      console.error('[Premium] Fetch plans failed:', err);
      showToast({ type: 'error', message: 'Planlar yüklenemedi.' });
      // Fallback plans
      setPlans([
        {
          id: 'monthly',
          name: '1 Ay',
          price: 99,
          currency: '₺',
          duration: 'monthly',
          features: PREMIUM_FEATURES.map(f => f.title),
        },
        {
          id: 'yearly',
          name: '1 Yıl',
          price: 990,
          currency: '₺',
          duration: 'yearly',
          features: PREMIUM_FEATURES.map(f => f.title),
          popular: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (user?.isPremium) {
      showToast({ type: 'info', message: 'Zaten premium üyesiniz!' });
      return;
    }

    Alert.alert(
      'Premium Üyelik',
      'İnternet üzerinden başarılı bir şekilde ödeme yapılacak. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', onPress: () => {}, style: 'cancel' },
        {
          text: 'Onayla',
          onPress: async () => {
            setSubscribing(true);
            try {
              const { data } = await api.post('/premium/subscribe', { planId });
              updateUser({ ...user, isPremium: true });
              showToast({ type: 'success', message: 'Premium üyeliğe hoş geldiniz! 👑' });
              setTimeout(() => {
                router.back();
              }, 1500);
            } catch (err) {
              console.error('[Premium] Subscribe failed:', err);
              showToast({ type: 'error', message: 'Abonelik başarısız oldu. Lütfen tekrar deneyin.' });
            } finally {
              setSubscribing(false);
            }
          },
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
        <Text style={styles.headerTitle}>Premium</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Planlar yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
          {/* Status banner */}
          {user?.isPremium && (
            <LinearGradient
              colors={[Colors.accent, `${Colors.accent}dd`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumBanner}
            >
              <Text style={styles.premiumBannerTitle}>👑 Premium Üyesiniz!</Text>
              <Text style={styles.premiumBannerText}>Tüm özelliklere erişiminiz var.</Text>
            </LinearGradient>
          )}

          {/* Features grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Premium Neler Sunar?</Text>
            <View style={styles.featuresGrid}>
              {PREMIUM_FEATURES.map((feature, idx) => (
                <View key={idx} style={styles.featureCard}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          {!user?.isPremium && (
            <>
              {/* Plans */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Planları Seç</Text>
                <View style={styles.plansContainer}>
                  {plans.map((plan) => (
                    <TouchableOpacity
                      key={plan.id}
                      style={[
                        styles.planCard,
                        plan.popular && styles.planCardPopular,
                      ]}
                      onPress={() => handleSubscribe(plan.id)}
                      disabled={subscribing}
                    >
                      {plan.popular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularBadgeText}>POPÜLER</Text>
                        </View>
                      )}
                      <Text style={styles.planName}>{plan.name}</Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>{plan.price}</Text>
                        <Text style={styles.currency}>{plan.currency}</Text>
                      </View>
                      <Text style={styles.pricePeriod}>
                        {plan.duration === 'monthly' ? '/ay' : '/yıl'}
                      </Text>

                      <View style={styles.divider} />

                      <TouchableOpacity
                        style={[
                          styles.subscribeButton,
                          plan.popular && styles.subscribeButtonPopular,
                        ]}
                        onPress={() => handleSubscribe(plan.id)}
                        disabled={subscribing}
                      >
                        <Text
                          style={[
                            styles.subscribeButtonText,
                            plan.popular && styles.subscribeButtonTextPopular,
                          ]}
                        >
                          {subscribing ? 'İşleniyor...' : 'Abone Ol'}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Terms */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  Abone olarak{' '}
                  <Text style={styles.termsLink}>Şartlar ve Koşulları</Text>
                  {' '}kabul etmiş olursunuz.
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      )}
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.base,
  },
  premiumBanner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  premiumBannerTitle: {
    color: Colors.background,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
  },
  premiumBannerText: {
    color: Colors.background,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
  },
  section: {
    gap: Spacing.base,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.base,
  },
  featureCard: {
    width: '48%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadows.sm,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  featureDescription: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  plansContainer: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  planCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    ...Shadows.sm,
  },
  planCardPopular: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: `${Colors.primary}10`,
  },
  popularBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  popularBadgeText: {
    color: Colors.background,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xs,
  },
  planName: {
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.base,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: Spacing.base,
  },
  price: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize['2xl'],
  },
  currency: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
  },
  pricePeriod: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.surfaceBorder,
    marginVertical: Spacing.base,
  },
  subscribeButton: {
    width: '100%',
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  subscribeButtonPopular: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  subscribeButtonText: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
  },
  subscribeButtonTextPopular: {
    color: Colors.background,
  },
  termsContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  termsText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  termsLink: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
});
