/**
 * API client for the Expo app (React Native / Web)
 *
 * Configure the base URL via env:
 * - EXPO_PUBLIC_API_URL=http://<your-lan-ip>:3001
 *
 * IMPORTANT:
 * - On Android/iOS devices, `localhost` points to the device, not your PC.
 * - Use your machine's LAN IP (e.g. http://192.168.1.10:3001).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_API_URL = 'http://localhost:3001';

export function getApiBaseUrl(): string {
  // Expo supports EXPO_PUBLIC_* at runtime
  const fromEnv = (process.env.EXPO_PUBLIC_API_URL || '').trim();
  return fromEnv || DEFAULT_API_URL;
}

export type ApiErrorShape = {
  error: string;
  details?: any;
};

async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('@auth_token');
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as any),
  };

  // Default JSON content-type when body is provided and not FormData
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.auth !== false) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, { ...options, headers });

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const msg =
      (data && typeof data === 'object' && (data as any).error) ||
      `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data as T;
}

function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

