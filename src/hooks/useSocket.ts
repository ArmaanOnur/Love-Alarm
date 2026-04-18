import { useEffect, useRef, useCallback } from 'react';
import { connectSocket, getSocket } from '../services/socket';
import { useAlarmStore } from '../store/alarmStore';
import type { NearbyUser } from '../types/user';
import type { Message } from '../types/message';
import type { ProximityEvent } from '../types/alarm';

interface UseSocketOptions {
  onNewMessage?: (message: Message) => void;
  onMatch?: (userId: string) => void;
  onHeartReceived?: (fromUserId: string) => void;
}

export function useSocket(options?: UseSocketOptions) {
  const { setNearbyUsers } = useAlarmStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let mounted = true;

    (async () => {
      const socket = await connectSocket();
      if (!mounted) return;

      // ── Proximity events ──────────────────────────────
      socket.on('proximity:update', (event: ProximityEvent) => {
        setNearbyUsers(event.nearbyUsers);
      });

      // ── Chat events ──────────────────────────────────
      socket.on('message:new', (message: Message) => {
        options?.onNewMessage?.(message);
      });

      // ── Match events ─────────────────────────────────
      socket.on('match:new', ({ userId }: { userId: string }) => {
        options?.onMatch?.(userId);
      });

      // ── Heart events ─────────────────────────────────
      socket.on('heart:received', ({ fromUserId }: { fromUserId: string }) => {
        options?.onHeartReceived?.(fromUserId);
      });
    })();

    return () => {
      mounted = false;
      const socket = getSocket();
      socket?.off('proximity:update');
      socket?.off('message:new');
      socket?.off('match:new');
      socket?.off('heart:received');
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const emit = useCallback((event: string, data?: unknown) => {
    getSocket()?.emit(event, data);
  }, []);

  return { emit };
}
