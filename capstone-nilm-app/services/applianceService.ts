/**
 * Appliance Service (client)
 * Calls the Node/Express backend API which talks to MySQL.
 */

import { apiFetch } from '@/config/api';

export interface Appliance {
  id: string;
  userId: string;
  deviceId: string;
  name: string;
  category: string;
  ratedPower: number;
  icon: string;
  portNumber?: number;
  isActive: boolean;
  currentPower?: number;
  voltage?: number;
  current?: number;
  powerFactor?: number;
  usageMinutes?: number;
  lastDetected?: Date;
  createdAt: Date;
  updatedAt: Date;
}

class ApplianceService {
  async addAppliance(appliance: Omit<Appliance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appliance> {
    const resp = await apiFetch<{ appliance: any }>(`/devices/${appliance.deviceId}/appliances`, {
      method: 'POST',
      body: JSON.stringify({
        userId: appliance.userId,
        name: appliance.name,
        category: appliance.category,
        ratedPower: appliance.ratedPower,
        icon: appliance.icon,
        portNumber: appliance.portNumber,
        isActive: appliance.isActive,
      }),
    });
    return this.mapFromApi(resp.appliance);
  }

  async getDeviceAppliances(deviceId: string): Promise<Appliance[]> {
    const resp = await apiFetch<{ appliances: any[] }>(`/devices/${deviceId}/appliances`, { method: 'GET' });
    return (resp.appliances || []).map((a) => this.mapFromApi(a));
  }

  async getUserAppliances(userId: string): Promise<Appliance[]> {
    const resp = await apiFetch<{ appliances: any[] }>(`/users/${userId}/appliances`, { method: 'GET' });
    return (resp.appliances || []).map((a) => this.mapFromApi(a));
  }

  async getActiveAppliances(deviceId: string): Promise<Appliance[]> {
    const all = await this.getDeviceAppliances(deviceId);
    return all.filter((a) => a.isActive);
  }

  async updateAppliance(applianceId: string, updates: Partial<Appliance>): Promise<void> {
    await apiFetch(`/appliances/${applianceId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: updates.name,
        ratedPower: updates.ratedPower,
        icon: updates.icon,
        portNumber: updates.portNumber,
        isActive: updates.isActive,
      }),
    });
  }

  async deleteAppliance(applianceId: string): Promise<void> {
    await apiFetch(`/appliances/${applianceId}`, { method: 'DELETE' });
  }

  async createDefaultAppliances(userId: string, deviceId: string): Promise<Appliance[]> {
    const resp = await apiFetch<{ appliances: any[] }>(`/devices/${deviceId}/appliances/defaults`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    return (resp.appliances || []).map((a) => this.mapFromApi(a));
  }

  private mapFromApi(row: any): Appliance {
    return {
      id: (row.appliance_id ?? row.id)?.toString(),
      userId: (row.appliance_user_id ?? row.userId)?.toString(),
      deviceId: (row.appliance_device_id ?? row.deviceId)?.toString(),
      name: row.name,
      category: row.category,
      ratedPower: typeof row.ratedPower === 'string' ? parseFloat(row.ratedPower) : row.ratedPower ?? 0,
      icon: row.icon || '⚡',
      portNumber: row.portNumber ?? undefined,
      isActive: row.isActive === 1 || row.isActive === true,
      usageMinutes: row.usageMinutes !== undefined ? Number(row.usageMinutes) : undefined,
      lastDetected: row.lastDetected ? new Date(row.lastDetected) : undefined,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    };
  }
}

export const applianceService = new ApplianceService();
// Backwards compatibility alias
export const firestoreApplianceService = applianceService;

