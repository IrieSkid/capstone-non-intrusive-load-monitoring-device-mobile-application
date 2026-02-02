/**
 * Consumption Summary Service
 * Manages consumption summaries in Firestore
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
  Timestamp 
} from 'firebase/firestore';

export interface ConsumptionSummary {
  id: string;
  userId: string;
  deviceId: string;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalEnergyKwh: number;
  totalCost: number;
  averagePower: number;
  peakPower: number;
  ratePerKwh: number;
  createdAt: Date;
}

class ConsumptionSummaryService {
  private collectionName = 'consumptionSummaries';

  /**
   * Create a consumption summary
   */
  async createSummary(summary: Omit<ConsumptionSummary, 'id' | 'createdAt'>): Promise<ConsumptionSummary> {
    try {
      const summaryRef = doc(collection(firestore, this.collectionName));
      
      const newSummary: ConsumptionSummary = {
        ...summary,
        id: summaryRef.id,
        createdAt: new Date(),
      };

      await setDoc(summaryRef, {
        ...newSummary,
        startDate: Timestamp.fromDate(summary.startDate),
        endDate: Timestamp.fromDate(summary.endDate),
        createdAt: Timestamp.fromDate(newSummary.createdAt),
      });

      return newSummary;
    } catch (error) {
      console.error('Error creating summary:', error);
      throw error;
    }
  }

  /**
   * Get summaries by period
   */
  async getSummariesByPeriod(
    userId: string,
    period: 'hourly' | 'daily' | 'weekly' | 'monthly',
    startDate?: Date,
    endDate?: Date
  ): Promise<ConsumptionSummary[]> {
    try {
      let q = query(
        collection(firestore, this.collectionName),
        where('userId', '==', userId),
        where('period', '==', period)
      );

      if (startDate) {
        q = query(q, where('startDate', '>=', Timestamp.fromDate(startDate)));
      }

      if (endDate) {
        q = query(q, where('endDate', '<=', Timestamp.fromDate(endDate)));
      }

      q = query(q, orderBy('startDate', 'desc'));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        } as ConsumptionSummary;
      });
    } catch (error) {
      console.error('Error getting summaries:', error);
      return [];
    }
  }

  /**
   * Get device summaries
   */
  async getDeviceSummaries(deviceId: string): Promise<ConsumptionSummary[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('deviceId', '==', deviceId),
        orderBy('startDate', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
        } as ConsumptionSummary;
      });
    } catch (error) {
      console.error('Error getting device summaries:', error);
      return [];
    }
  }

  /**
   * Calculate monthly cost
   */
  async getMonthlyTotalCost(userId: string, year: number, month: number): Promise<number> {
    const summaries = await this.getSummariesByPeriod(userId, 'daily');
    
    return summaries
      .filter(s => {
        const date = s.startDate;
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .reduce((total, s) => total + s.totalCost, 0);
  }
}

export const consumptionSummaryService = new ConsumptionSummaryService();
