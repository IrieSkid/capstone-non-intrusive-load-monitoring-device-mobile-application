/**
 * Reading Service
 * Manages real-time sensor readings in Firestore
 */

import { firestore } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { RealtimeReading } from './realtimeDataService';

class ReadingService {
  private collectionName = 'realTimeReadings';

  /**
   * Save a reading to Firestore
   */
  async saveReading(deviceId: string, reading: RealtimeReading): Promise<void> {
    try {
      const readingRef = doc(collection(firestore, this.collectionName));
      
      await setDoc(readingRef, {
        deviceId,
        voltage: reading.voltage,
        current: reading.current,
        power: reading.power,
        powerFactor: reading.powerFactor,
        frequency: reading.frequency,
        energy: reading.energy,
        timestamp: Timestamp.fromDate(reading.timestamp),
      });
    } catch (error) {
      console.error('Error saving reading:', error);
      // Don't throw - we don't want to break the app if Firestore fails
    }
  }

  /**
   * Get recent readings for a device
   */
  async getRecentReadings(deviceId: string, limitCount: number = 100): Promise<RealtimeReading[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('deviceId', '==', deviceId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          voltage: data.voltage,
          current: data.current,
          power: data.power,
          powerFactor: data.powerFactor,
          frequency: data.frequency,
          energy: data.energy,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as RealtimeReading;
      });
    } catch (error) {
      console.error('Error getting readings:', error);
      return [];
    }
  }

  /**
   * Get readings for a date range
   */
  async getReadingsByDateRange(
    deviceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<RealtimeReading[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('deviceId', '==', deviceId),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate)),
        orderBy('timestamp', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          voltage: data.voltage,
          current: data.current,
          power: data.power,
          powerFactor: data.powerFactor,
          frequency: data.frequency,
          energy: data.energy,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as RealtimeReading;
      });
    } catch (error) {
      console.error('Error getting readings by date range:', error);
      return [];
    }
  }

  /**
   * Calculate average power for a period
   */
  async getAveragePower(deviceId: string, startDate: Date, endDate: Date): Promise<number> {
    const readings = await this.getReadingsByDateRange(deviceId, startDate, endDate);
    
    if (readings.length === 0) return 0;

    const sum = readings.reduce((acc, reading) => acc + reading.power, 0);
    return sum / readings.length;
  }
}

export const readingService = new ReadingService();
