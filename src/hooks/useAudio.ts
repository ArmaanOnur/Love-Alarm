import { useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

export function useAudio() {
  const alarmSoundRef = useRef<Audio.Sound | null>(null);
  const matchSoundRef = useRef<Audio.Sound | null>(null);

  const loadAlarm = useCallback(async () => {
    if (alarmSoundRef.current) return;
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/alarm.mp3'),
      { shouldPlay: false, isLooping: true, volume: 0.8 },
    );
    alarmSoundRef.current = sound;
  }, []);

  const playAlarm = useCallback(async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
      });
      await loadAlarm();
      await alarmSoundRef.current?.replayAsync();
    } catch (err) {
      console.warn('[Audio] playAlarm error:', err);
    }
  }, [loadAlarm]);

  const stopAlarm = useCallback(async () => {
    try {
      await alarmSoundRef.current?.stopAsync();
    } catch {
      // ignore
    }
  }, []);

  const playMatch = useCallback(async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/match.mp3'),
        { shouldPlay: true, volume: 1.0 },
      );
      matchSoundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (err) {
      console.warn('[Audio] playMatch error:', err);
    }
  }, []);

  const unloadAll = useCallback(async () => {
    await alarmSoundRef.current?.unloadAsync();
    await matchSoundRef.current?.unloadAsync();
    alarmSoundRef.current = null;
    matchSoundRef.current = null;
  }, []);

  return { playAlarm, stopAlarm, playMatch, unloadAll };
}
