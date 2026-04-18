import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { formatDuration } from '../../utils/formatters';

interface VoiceMessageProps {
  uri: string;
  duration: number; // seconds
  isMine: boolean;
}

export function VoiceMessage({ uri, duration, isMine }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  const toggle = async () => {
    if (isPlaying) {
      await soundRef.current?.pauseAsync();
      setIsPlaying(false);
      return;
    }

    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setPosition(Math.floor((status.positionMillis ?? 0) / 1000));
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPosition(0);
          soundRef.current?.unloadAsync();
          soundRef.current = null;
        }
      });
    }

    await soundRef.current.playAsync();
    setIsPlaying(true);
  };

  const progress = duration > 0 ? position / duration : 0;
  const barColor = isMine ? 'rgba(255,255,255,0.5)' : Colors.surfaceBorder;
  const fillColor = isMine ? '#fff' : Colors.primary;

  return (
    <View style={[styles.container, isMine ? styles.mine : styles.theirs]}>
      <TouchableOpacity onPress={toggle} style={styles.playBtn}>
        <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
      </TouchableOpacity>

      <View style={styles.waveform}>
        <View style={[styles.track, { backgroundColor: barColor }]}>
          <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: fillColor }]} />
        </View>
      </View>

      <Text style={[styles.time, isMine && styles.timeMine]}>
        {formatDuration(isPlaying ? position : duration)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm, borderRadius: BorderRadius.xl, minWidth: 180 },
  mine: { backgroundColor: Colors.primary },
  theirs: { backgroundColor: Colors.surfaceElevated },
  playBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 16 },
  waveform: { flex: 1 },
  track: { height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  time: { color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium, fontSize: Typography.fontSize.xs, minWidth: 36 },
  timeMine: { color: 'rgba(255,255,255,0.8)' },
});
