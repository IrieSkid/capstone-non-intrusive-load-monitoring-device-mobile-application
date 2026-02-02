/**
 * Electricity Rate Service
 * Manages electricity rates in Firestore
 */

import { firestore } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';

export interface ElectricityRate {
  id: string;
  userId: string;
  ratePerKwh: number;
  currency: string;
  effectiveDate: Date;
  endDate?: Date;
  distributor?: string;
  notes?: string;
  createdAt: Date;
}

class ElectricityRateService {
  private collectionName = 'electricityRates';

  /**
   * Add a new electricity rate
   */
  async addRate(userId: string, rateData: Omit<ElectricityRate, 'id' | 'userId' | 'createdAt'>): Promise<ElectricityRate> {
    try {
      const rateRef = doc(collection(firestore, this.collectionName));
      
      const rate: ElectricityRate = {
        id: rateRef.id,
        userId,
        ...rateData,
        createdAt: new Date(),
      };

      await setDoc(rateRef, {
        ...rate,
        effectiveDate: Timestamp.fromDate(rate.effectiveDate),
        endDate: rate.endDate ? Timestamp.fromDate(rate.endDate) : null,
        createdAt: Timestamp.fromDate(rate.createdAt),
      });

      return rate;
    } catch (error) {
      console.error('Error adding rate:', error);
      throw error;
    }
  }

  /**
   * Get current rate for user
   */
  async getCurrentRate(userId: string): Promise<ElectricityRate | null> {
    try {
      const now = new Date();
      const q = query(
        collection(firestore, this.collectionName),
        where('userId', '==', userId),
        where('effectiveDate', '<=', Timestamp.fromDate(now)),
        orderBy('effectiveDate', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Return default rate if none exists
        return this.createDefaultRate(userId);
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        ...data,
        id: doc.id,
        effectiveDate: data.effectiveDate?.toDate() || new Date(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as ElectricityRate;
    } catch (error) {
      console.error('Error getting current rate:', error);
      return null;
    }
  }

  /**
   * Get all rates for user
   */
  async getAllRates(userId: string): Promise<ElectricityRate[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('userId', '==', userId),
        orderBy('effectiveDate', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          effectiveDate: data.effectiveDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
        } as ElectricityRate;
      });
    } catch (error) {
      console.error('Error getting rates:', error);
      return [];
    }
  }

  /**
   * Create default rate for user
   */
  private async createDefaultRate(userId: string): Promise<ElectricityRate> {
    const defaultRate = {
      ratePerKwh: 10.5,
      currency: 'PHP',
      effectiveDate: new Date(),
      distributor: 'Default Provider',
      notes: 'Default electricity rate',
    };

    return this.addRate(userId, defaultRate);
  }
}

export const electricityRateService = new ElectricityRateService();
