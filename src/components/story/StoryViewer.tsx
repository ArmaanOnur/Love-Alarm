import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Dimensions, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StoryProgressBar } from './StoryProgressBar';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { storyTimeLeft } from '../../utils/formatters';
import type { StoryGroup } from '../../types/alarm';

const { width: W, height: H } = Dimensions.get('window');

interface StoryViewerProps {
  group: StoryGroup;
  onClose: () => void;
  onNext: () => void;
}

export function StoryViewer({ group, onClose, onNext }: StoryViewerProps) {
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const story = group.stories[index];

  const handleNext = () => {
    if (index < group.stories.length - 1) {
      setIndex((i) => i + 1);
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Background media */}
      {story.mediaUrl ? (
        <Image source={{ uri: story.mediaUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.textBg]} />
      )}

      {/* Dim overlay */}
      <View style={styles.overlay} />

      {/* Progress + header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <StoryProgressBar
          count={group.stories.length}
          currentIndex={index}
          duration={5000}
          onComplete={handleNext}
        />
        <View style={styles.userRow}>
          {group.user.avatarUrl && (
            <Image source={{ uri: group.user.avatarUrl }} style={styles.avatar} />
          )}
          <View>
            <Text style={styles.name}>{group.user.name}</Text>
            <Text style={styles.time}>{storyTimeLeft(story.expiresAt)}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Text overlay */}
      {story.textContent && (
        <View style={styles.textContent}>
          <Text style={styles.storyText}>{story.textContent}</Text>
        </View>
      )}

      {/* Tap zones */}
      <View style={styles.tapZones}>
        <TouchableOpacity style={styles.tapLeft} onPress={handlePrev} activeOpacity={1} />
        <TouchableOpacity style={styles.tapRight} onPress={handleNext} activeOpacity={1} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: W, height: H, backgroundColor: Colors.background },
  textBg: { backgroundColor: Colors.surfaceElevated },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingHorizontal: Spacing.sm, gap: Spacing.sm },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xs },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: Colors.primary },
  name: { color: Colors.textPrimary, fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.fontSize.sm },
  time: { color: 'rgba(255,255,255,0.6)', fontSize: Typography.fontSize.xs },
  closeBtn: { marginLeft: 'auto', padding: 8 },
  closeText: { color: '#fff', fontSize: 18 },
  textContent: { position: 'absolute', bottom: 100, left: 0, right: 0, alignItems: 'center', paddingHorizontal: Spacing['2xl'] },
  storyText: { color: '#fff', fontFamily: Typography.fontFamily.bold, fontSize: Typography.fontSize.xl, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  tapZones: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', marginTop: 120 },
  tapLeft: { flex: 1 },
  tapRight: { flex: 1 },
});
