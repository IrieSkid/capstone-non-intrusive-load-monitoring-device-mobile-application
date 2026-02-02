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

export interface ApplianceConsumption {
  applianceId: string;
  applianceName: string;
  totalKwh: number;
  totalCost: number;
  avgPower: number;
  runtime: number;      // Total minutes
  percentage: number;   // % of total consumption
}

export interface ConsumptionSummary {
  id: string;
  userId: string;
  deviceId: string;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  // Device totals
  totalEnergyKwh: number;
  totalCost: number;
  averagePower: number;
  peakPower: number;
  ratePerKwh: number;
  // Per-appliance breakdown
  applianceBreakdown?: ApplianceConsumption[];
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
        applianceBreakdown: summary.applianceBreakdown || [],
      });

      console.log('📊 Created consumption summary with', summary.applianceBreakdown?.length || 0, 'appliances');
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
          applianceBreakdown: data.applianceBreakdown || [],
        } as ConsumptionSummary;
      });
    } catch (error) {
      console.error('Error getting summaries:', error);
      return [];
    }
  }

  /**
   * Generate daily summary from readings (called by background task)
   */
  async generateDailySummary(
    userId: string,
    deviceId: string,
    readings: any[]
  ): Promise<ConsumptionSummary | null> {
    if (readings.length === 0) return null;

    try {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      // Calculate device totals
      const latestReading = readings[readings.length - 1];
      const totalKwh = latestReading.energy || 0;
      const peakPower = Math.max(...readings.map(r => r.power));
      const avgPower = readings.reduce((sum, r) => sum + r.power, 0) / readings.length;
      const totalCost = totalKwh * 12; // ₱12 per kWh

      // Aggregate appliance data
      const applianceMap = new Map<string, ApplianceConsumption>();

      readings.forEach(reading => {
        if (reading.applianceReadings) {
          reading.applianceReadings.forEach((app: any) => {
            const existing = applianceMap.get(app.applianceId) || {
              applianceId: app.applianceId,
              applianceName: app.applianceName,
              totalKwh: 0,
              totalCost: 0,
              avgPower: 0,
              runtime: 0,
              percentage: 0,
            };

            // Accumulate data
            if (app.isActive) {
              existing.totalKwh += (app.power / 1000) * (3 / 3600); // 3 seconds to kWh
              existing.avgPower = (existing.avgPower + app.power) / 2;
              existing.runtime = Math.max(existing.runtime, app.runtime);
            }

            applianceMap.set(app.applianceId, existing);
          });
        }
      });

      // Calculate percentages and costs
      const applianceBreakdown: ApplianceConsumption[] = Array.from(applianceMap.values()).map(app => ({
        ...app,
        totalCost: app.totalKwh * 12,
        percentage: totalKwh > 0 ? (app.totalKwh / totalKwh) * 100 : 0,
      }));

      // Create summary
      return await this.createSummary({
        userId,
        deviceId,
        period: 'daily',
        startDate,
        endDate,
        totalEnergyKwh: totalKwh,
        totalCost,
        peakPower,
        averagePower: avgPower,
        ratePerKwh: 12,
        applianceBreakdown,
      });
    } catch (error) {
      console.error('Error generating daily summary:', error);
      return null;
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
          applianceBreakdown: data.applianceBreakdown || [],
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
