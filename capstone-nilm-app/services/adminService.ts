/**
 * Admin Service (client)
 * Admin-only operations for managing users and rooms.
 */

import { apiFetch } from '@/config/api';

export interface AdminUser {
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone?: string;
  role_name: string;
  status_name: string;
  created_at: string;
}

export interface AdminRoom {
  room_id: number;
  room_name: string;
  room_rate_per_kwh: number;
  room_status: string;
  tenant_id?: number | null;
  tenant_name?: string | null;
  tenant_email?: string | null;
  device_id?: number | null;
  device_name?: string | null;
  device_identifier?: string | null;
}

class AdminService {
  async getUsers(): Promise<AdminUser[]> {
    const resp = await apiFetch<{ users: AdminUser[] }>('/admin/users');
    return resp.users || [];
  }

  async updateUser(userId: number, data: { role?: string; status?: string }): Promise<void> {
    await apiFetch(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getRooms(): Promise<AdminRoom[]> {
    const resp = await apiFetch<{ rooms: AdminRoom[] }>('/admin/rooms');
    return resp.rooms || [];
  }

  async createRoom(payload: {
    roomName: string;
    tenantId?: number | null;
    deviceId?: number | null;
    ratePerKwh?: number;
    status?: string;
  }): Promise<AdminRoom> {
    const resp = await apiFetch<{ room: AdminRoom }>('/admin/rooms', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return resp.room;
  }

  async updateRoom(roomId: number, data: Partial<AdminRoom> & {
    tenantId?: number | null;
    deviceId?: number | null;
    ratePerKwh?: number;
    status?: string;
  }): Promise<void> {
    await apiFetch(`/admin/rooms/${roomId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        roomName: data.room_name,
        tenantId: data.tenant_id,
        deviceId: data.device_id,
        ratePerKwh: data.room_rate_per_kwh,
        status: data.room_status,
      }),
    });
  }

  async createUser(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: string;
    status?: string;
  }): Promise<AdminUser> {
    const resp = await apiFetch<{ user: AdminUser }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return resp.user;
  }

  async deleteUser(userId: number): Promise<void> {
    await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' });
  }
}

export const adminService = new AdminService();

