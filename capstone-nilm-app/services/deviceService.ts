/**
 * Device Service
 * Manages IoT devices in Firestore
 */

import { firestore } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';

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
  private collectionName = 'devices';

  /**
   * Register a new device
   */
  async registerDevice(userId: string, deviceData: Omit<Device, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Device> {
    try {
      const deviceRef = doc(collection(firestore, this.collectionName));
      const now = new Date();

      const device: Device = {
        id: deviceRef.id,
        userId,
        ...deviceData,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(deviceRef, {
        ...device,
        createdAt: Timestamp.fromDate(device.createdAt),
        updatedAt: Timestamp.fromDate(device.updatedAt),
        lastSeen: Timestamp.fromDate(device.lastSeen),
      });

      return device;
    } catch (error) {
      console.error('Error registering device:', error);
      throw error;
    }
  }

  /**
   * Get all devices for a user
   */
  async getUserDevices(userId: string): Promise<Device[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastSeen: data.lastSeen?.toDate() || new Date(),
        } as Device;
      });
    } catch (error) {
      console.error('Error getting user devices:', error);
      throw error;
    }
  }

  /**
   * Get a single device
   */
  async getDevice(deviceId: string): Promise<Device | null> {
    try {
      const deviceRef = doc(firestore, this.collectionName, deviceId);
      const snapshot = await getDoc(deviceRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data();
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastSeen: data.lastSeen?.toDate() || new Date(),
      } as Device;
    } catch (error) {
      console.error('Error getting device:', error);
      throw error;
    }
  }

  /**
   * Update device status
   */
  async updateDeviceStatus(deviceId: string, isOnline: boolean): Promise<void> {
    try {
      const deviceRef = doc(firestore, this.collectionName, deviceId);
      await updateDoc(deviceRef, {
        isOnline,
        lastSeen: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  }

  /**
   * Update device info
   */
  async updateDevice(deviceId: string, updates: Partial<Device>): Promise<void> {
    try {
      const deviceRef = doc(firestore, this.collectionName, deviceId);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Remove fields that shouldn't be updated
      delete updateData.id;
      delete updateData.userId;
      delete updateData.createdAt;

      await updateDoc(deviceRef, updateData);
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }

  /**
   * Delete a device
   */
  async deleteDevice(deviceId: string): Promise<void> {
    try {
      const deviceRef = doc(firestore, this.collectionName, deviceId);
      await deleteDoc(deviceRef);
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  }

  /**
   * Create mock device for testing
   */
  async createMockDevice(userId: string): Promise<Device> {
    return this.registerDevice(userId, {
      name: 'Smart Energy Monitor',
      type: 'energy_monitor',
      macAddress: 'AA:BB:CC:DD:EE:FF',
      ipAddress: '192.168.1.100',
      firmwareVersion: '1.0.0',
      isOnline: true,
      lastSeen: new Date(),
      location: 'Main Breaker',
    });
  }
}

export const deviceService = new DeviceService();
