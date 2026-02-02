/**
 * Device Type Definitions
 * Based on the Firestore schema from database design
 */

export type DeviceStatus = 'active' | 'inactive' | 'maintenance';

export interface Device {
  id: string;
  userId: string;
  deviceName: string;
  macAddress: string;
  ipAddress?: string;
  status: DeviceStatus;
  location?: string;
  registeredAt: Date;
  lastSeenAt?: Date;
  firmwareVersion?: string;
  isActive: boolean;
}

export interface DeviceRegistrationData {
  deviceName: string;
  macAddress: string;
  location?: string;
}

export interface DeviceUpdateData {
  deviceName?: string;
  location?: string;
  status?: DeviceStatus;
}
