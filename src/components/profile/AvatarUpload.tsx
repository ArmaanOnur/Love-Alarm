import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface AvatarUploadProps {
  currentUrl?: string;
  name?: string;
  size?: number;
  onImageSelected: (uri: string) => void;
}

export function AvatarUpload({ currentUrl, name, size = 100, onImageSelected }: AvatarUploadProps) {
  const [localUri, setLocalUri] = useState<string | undefined>(currentUrl);

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setLocalUri(uri);
      onImageSelected(uri);
    }
  };

  const initials = name ? name.slice(0, 2).toUpperCase() : '?';

  return (
    <TouchableOpacity onPress={pick} activeOpacity={0.85} style={{ alignSelf: 'center' }}>
      <View style={[styles.ring, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]}>
        {localUri ? (
          <Image source={{ uri: localUri }} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.initials, { fontSize: size * 0.32 }]}>{initials}</Text>
          </View>
        )}
      </View>
      <View style={styles.cameraBtn}>
        <Text style={styles.cameraIcon}>📷</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ring: { borderWidth: 3, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadows.md },
  avatar: {},
  placeholder: { backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  initials: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.bold },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.primary, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.background },
  cameraIcon: { fontSize: 14 },
});
