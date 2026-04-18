import { useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { buildLocationPayload } from '../services/proximity';
import { emitLocation } from '../services/socket';
import api from '../services/api';

const LOCATION_INTERVAL_MS = 5000; // 5 seconds
const LOCATION_DISTANCE_M = 5;    // 5 metres

type LocationCallback = (lat: number, lon: number) => void;

interface UseLocationReturn {
  requestAndStart: () => Promise<boolean>;
  stopWatch: () => void;
}

export function useLocation(onUpdate?: LocationCallback): UseLocationReturn {
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const sendToBackend = useCallback(async (lat: number, lon: number) => {
    const payload = buildLocationPayload(lat, lon);
    // Send via REST (reliable) and Socket (fast)
    emitLocation(payload.lat, payload.lon, payload.geohash);
    try {
      await api.put('/users/me/location', payload);
    } catch {
      // silent — socket already sent it
    }
    onUpdate?.(lat, lon);
  }, [onUpdate]);

  const requestAndStart = useCallback(async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return false;

    // Request background permission for alarm-while-closed
    await Location.requestBackgroundPermissionsAsync();

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: LOCATION_INTERVAL_MS,
        distanceInterval: LOCATION_DISTANCE_M,
      },
      (location) => {
        sendToBackend(location.coords.latitude, location.coords.longitude);
      },
    );

    return true;
  }, [sendToBackend]);

  const stopWatch = useCallback(() => {
    watchRef.current?.remove();
    watchRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { watchRef.current?.remove(); }, []);

  return { requestAndStart, stopWatch };
}
