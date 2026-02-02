/**
 * Firestore Appliance Service
 * Manages appliances in Firestore
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

export interface Appliance {
  id: string;
  userId: string;
  deviceId: string;
  name: string;
  category: string;
  ratedPower: number;
  icon: string;
  portNumber: number; // Hardware port (1-8)
  isActive: boolean;
  currentPower?: number;
  usageMinutes?: number;
  lastDetected?: Date;
  createdAt: Date;
  updatedAt: Date;
}

class FirestoreApplianceService {
  private collectionName = 'appliances';

  /**
   * Add a new appliance
   */
  async addAppliance(appliance: Omit<Appliance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appliance> {
    try {
      const applianceRef = doc(collection(firestore, this.collectionName));
      const now = new Date();

      const newAppliance: Appliance = {
        ...appliance,
        id: applianceRef.id,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(applianceRef, {
        ...newAppliance,
        lastDetected: appliance.lastDetected ? Timestamp.fromDate(appliance.lastDetected) : null,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });

      return newAppliance;
    } catch (error) {
      console.error('Error adding appliance:', error);
      throw error;
    }
  }

  /**
   * Get all appliances for a device
   */
  async getDeviceAppliances(deviceId: string): Promise<Appliance[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('deviceId', '==', deviceId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          lastDetected: data.lastDetected?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Appliance;
      });
    } catch (error) {
      console.error('Error getting appliances:', error);
      return [];
    }
  }

  /**
   * Get all appliances for a user
   */
  async getUserAppliances(userId: string): Promise<Appliance[]> {
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
          lastDetected: data.lastDetected?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Appliance;
      });
    } catch (error) {
      console.error('Error getting user appliances:', error);
      return [];
    }
  }

  /**
   * Get active appliances
   */
  async getActiveAppliances(deviceId: string): Promise<Appliance[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('deviceId', '==', deviceId),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          lastDetected: data.lastDetected?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Appliance;
      });
    } catch (error) {
      console.error('Error getting active appliances:', error);
      return [];
    }
  }

  /**
   * Update appliance
   */
  async updateAppliance(applianceId: string, updates: Partial<Appliance>): Promise<void> {
    try {
      const applianceRef = doc(firestore, this.collectionName, applianceId);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Remove fields that shouldn't be updated
      delete updateData.id;
      delete updateData.userId;
      delete updateData.deviceId;
      delete updateData.createdAt;

      if (updates.lastDetected) {
        updateData.lastDetected = Timestamp.fromDate(updates.lastDetected);
      }

      await updateDoc(applianceRef, updateData);
    } catch (error) {
      console.error('Error updating appliance:', error);
      throw error;
    }
  }

  /**
   * Delete appliance
   */
  async deleteAppliance(applianceId: string): Promise<void> {
    try {
      const applianceRef = doc(firestore, this.collectionName, applianceId);
      await deleteDoc(applianceRef);
    } catch (error) {
      console.error('Error deleting appliance:', error);
      throw error;
    }
  }

  /**
   * Create default appliances for a device
   */
  async createDefaultAppliances(userId: string, deviceId: string): Promise<Appliance[]> {
    const defaultAppliances = [
      { name: 'Air Conditioner', category: 'cooling', ratedPower: 1500, icon: '❄️', portNumber: 1 },
      { name: 'Refrigerator', category: 'cooling', ratedPower: 150, icon: '🧊', portNumber: 2 },
      { name: 'Electric Fan', category: 'cooling', ratedPower: 75, icon: '🌀', portNumber: 3 },
      { name: 'Television', category: 'entertainment', ratedPower: 100, icon: '📺', portNumber: 4 },
      { name: 'Water Heater', category: 'heating', ratedPower: 1200, icon: '🚿', portNumber: 5 },
      { name: 'Rice Cooker', category: 'cooking', ratedPower: 400, icon: '🍚', portNumber: 6 },
      { name: 'Computer', category: 'electronics', ratedPower: 200, icon: '💻', portNumber: 7 },
      { name: 'Lights', category: 'lighting', ratedPower: 60, icon: '💡', portNumber: 8 },
    ];

    const createdAppliances: Appliance[] = [];

    for (const app of defaultAppliances) {
      const appliance = await this.addAppliance({
        userId,
        deviceId,
        ...app,
        isActive: false,
        currentPower: 0,
        usageMinutes: 0,
      });
      createdAppliances.push(appliance);
    }

    return createdAppliances;
  }
}

export const firestoreApplianceService = new FirestoreApplianceService();
