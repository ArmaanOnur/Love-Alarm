import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface QRShareProps {
  userId: string;
  userName: string;
}

export function QRShare({ userId, userName }: QRShareProps) {
  const profileUrl = `lovealarm://profile/${userId}`;

  const handleShare = async () => {
    await Share.share({
      message: `Love Alarm'da ${userName} profilini gör: ${profileUrl}`,
      url: profileUrl,
      title: 'Love Alarm Profili',
    });
  };

  // QR code as simple emoji placeholder (real QR would use react-native-qrcode-svg)
  return (
    <View style={styles.card}>
      <View style={styles.qrBox}>
        <Text style={styles.qrEmoji}>📱</Text>
        <Text style={styles.qrHint}>QR Kodu</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.url} numberOfLines={1}>{profileUrl}</Text>
      </View>
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
        <Text style={styles.shareBtnText}>Paylaş</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.xl, padding: Spacing.base, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, ...Shadows.sm },
  qrBox: { width: 60, height: 60, backgroundColor: Colors.surfaceBorder, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  qrEmoji: { fontSize: 28 },
  qrHint: { color: Colors.textMuted, fontSize: 9 },
  info: { flex: 1 },
  name: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.base },
  url: { color: Colors.textMuted, fontSize: Typography.fontSize.xs, marginTop: 2 },
  shareBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg },
  shareBtnText: { color: '#fff', fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.sm },
});
