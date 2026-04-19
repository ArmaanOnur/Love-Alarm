import { useCallback } from 'react';
import { useAlarmStore } from '../store/alarmStore';
import { useHaptic } from './useHaptic';
import { useAudio } from './useAudio';
import api from '../services/api';
import { emitAlarmStart, emitAlarmStop } from '../services/socket';

export function useAlarm() {
  const { isActive, setActive, setNearbyUsers } = useAlarmStore();
  const { triggerHeavy, triggerMedium } = useHaptic();
  const { playAlarm, stopAlarm: stopAudio } = useAudio();

  const startAlarm = useCallback(async () => {
    try {
      await api.post('/alarm/start');
      emitAlarmStart();
      setActive(true);
      triggerHeavy();
      playAlarm();
    } catch (err) {
      console.error('[Alarm] Failed to start:', err);
    }
  }, [setActive, triggerHeavy, playAlarm]);

  const stopAlarm = useCallback(async () => {
    try {
      await api.post('/alarm/stop');
      emitAlarmStop();
      setActive(false);
      setNearbyUsers([]);
      triggerMedium();
      await stopAudio();
    } catch (err) {
      console.error('[Alarm] Failed to stop:', err);
    }
  }, [setActive, setNearbyUsers, triggerMedium, stopAudio]);

  const toggleAlarm = useCallback(async () => {
    if (isActive) {
      await stopAlarm();
    } else {
      await startAlarm();
    }
  }, [isActive, startAlarm, stopAlarm]);

  return { isActive, startAlarm, stopAlarm, toggleAlarm };
}
