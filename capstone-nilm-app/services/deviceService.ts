/**
 * Device Service (client)
 * Calls the Node/Express backend API which talks to MySQL.
 */

import { apiFetch } from '@/config/api';

export interface Device {
  id: string;
  userId: string;
  name: string;
  type: string;
  macAddress: string;
  ipAddress?: string;
  firmwareVersion?: string;
  isOnline: boolean;
  lastSeen: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

class DeviceService {
  async registerDevice(
    userId: string,
    deviceData: Omit<Device, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Device> {
    const resp = await apiFetch<{ device: any }>(`/users/${userId}/devices`, {
      method: 'POST',
      body: JSON.stringify({ name: deviceData.name, macAddress: deviceData.macAddress }),
    });
    return this.mapDeviceFromApi(resp.device, userId);
  }

  async getUserDevices(userId: string): Promise<Device[]> {
    const resp = await apiFetch<{ devices: any[] }>(`/users/${userId}/devices`, { method: 'GET' });
    return (resp.devices || []).map((d) => this.mapDeviceFromApi(d, userId));
  }

  async getDevice(deviceId: string): Promise<Device | null> {
    try {
      const resp = await apiFetch<{ device: any }>(`/devices/${deviceId}`, { method: 'GET' });
      return this.mapDeviceFromApi(resp.device);
    } catch {
      return null;
    }
  }

  async updateDeviceStatus(deviceId: string, isOnline: boolean): Promise<void> {
    await apiFetch(`/devices/${deviceId}`, { method: 'PATCH', body: JSON.stringify({ isOnline }) });
  }

  async updateDevice(deviceId: string, updates: Partial<Device>): Promise<void> {
    await apiFetch(`/devices/${deviceId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: updates.name,
        macAddress: updates.macAddress,
        isOnline: updates.isOnline,
      }),
    });
  }

  async deleteDevice(deviceId: string): Promise<void> {
    await apiFetch(`/devices/${deviceId}`, { method: 'DELETE' });
  }

  async createMockDevice(userId: string): Promise<Device> {
    const resp = await apiFetch<{ device: any }>(`/users/${userId}/devices/mock`, { method: 'POST' });
    return this.mapDeviceFromApi(resp.device, userId);
  }

  private mapDeviceFromApi(row: any, fallbackUserId: string = ''): Device {
    return {
      id: (row.device_id ?? row.id)?.toString(),
      userId: (row.user_id ?? fallbackUserId)?.toString() || '',
      name: row.device_name ?? row.name,
      type: 'energy_monitor',
      macAddress: row.device_identifier ?? row.macAddress,
      isOnline: (row.device_status ?? row.status) === 'online' || row.isOnline === true,
      lastSeen: row.device_last_seen ? new Date(row.device_last_seen) : new Date(),
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      updatedAt: row.device_last_seen ? new Date(row.device_last_seen) : row.created_at ? new Date(row.created_at) : new Date(),
    };
  }
}

export const deviceService = new DeviceService();

