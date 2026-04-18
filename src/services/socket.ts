import { io, Socket } from 'socket.io-client';
import { getTokens } from './storage';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
  if (socket?.connected) return socket;

  const tokens = await getTokens();

  socket = io(SOCKET_URL, {
    auth: { token: tokens?.accessToken ?? '' },
    transports: ['websocket'],
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    timeout: 10000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Error:', err.message);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// ── Typed emitters ────────────────────────────────────────────────

export function emitLocation(lat: number, lon: number, geohash: string): void {
  socket?.emit('location:update', { lat, lon, geohash });
}

export function emitAlarmStart(): void {
  socket?.emit('alarm:start');
}

export function emitAlarmStop(): void {
  socket?.emit('alarm:stop');
}

export function emitJoinChat(matchId: string): void {
  socket?.emit('chat:join', { matchId });
}

export function emitLeaveChat(matchId: string): void {
  socket?.emit('chat:leave', { matchId });
}

export function emitTyping(matchId: string): void {
  socket?.emit('chat:typing', { matchId });
}
