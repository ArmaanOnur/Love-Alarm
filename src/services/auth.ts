import api from './api';
import { saveTokens, saveUser, clearTokens } from './storage';
import type { AuthUser } from '../types/user';
import type { ApiResponse } from '../types/api';

export async function sendOtp(phone: string): Promise<void> {
  await api.post('/auth/send-otp', { phone });
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<AuthUser> {
  const { data } = await api.post<ApiResponse<AuthUser>>(
    '/auth/verify-otp',
    { phone, code },
  );
  const auth = data.data;
  await saveTokens(auth.accessToken, auth.refreshToken);
  await saveUser(auth.user);
  return auth;
}

export async function refreshTokens(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const { data } = await api.post<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  >('/auth/refresh', { refreshToken });
  await saveTokens(data.data.accessToken, data.data.refreshToken);
  return data.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore network errors on logout
  } finally {
    await clearTokens();
  }
}
