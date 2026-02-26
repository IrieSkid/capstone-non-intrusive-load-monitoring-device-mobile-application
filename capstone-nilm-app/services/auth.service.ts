/**
 * Authentication Service (client)
 * Calls the Node/Express backend API which talks to MySQL.
 */

import { apiFetch } from '@/config/api';
import { User, UserRegistrationData, UserUpdateData } from '@/types/user.types';

export async function registerUser(data: UserRegistrationData): Promise<User> {
  const resp = await apiFetch<{ user: User }>('/auth/register', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(data),
  });
  return resp.user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  return await apiFetch<{ user: User; token: string }>('/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const resp = await apiFetch<{ user: User }>('/auth/me', {
      method: 'GET',
      auth: false,
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.user;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  // JWT logout is client-side: remove token from AsyncStorage (done in AuthContext)
}

export async function resetPassword(email: string): Promise<void> {
  await apiFetch('/auth/reset-password', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ email }),
  });
}

export async function getCurrentUserData(userId: string): Promise<User | null> {
  try {
    const resp = await apiFetch<{ user: User }>('/auth/me', { method: 'GET' });
    return resp?.user?.id === userId ? resp.user : null;
  } catch {
    return null;
  }
}

export async function updateUserProfile(userId: string, data: UserUpdateData): Promise<void> {
  await apiFetch(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
    }),
  });
}

