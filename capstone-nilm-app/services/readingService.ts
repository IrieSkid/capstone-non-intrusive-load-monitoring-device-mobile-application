/**
 * Reading Service (client)
 * Calls the Node/Express backend API which talks to MySQL.
 */

import { apiFetch } from '@/config/api';
import { RealtimeReading, ApplianceStatus } from './realtimeDataService';

class ReadingService {
  async saveReading(deviceId: string, reading: RealtimeReading, appliances: ApplianceStatus[]): Promise<void> {
    try {
      await apiFetch(`/devices/${deviceId}/readings`, {
        method: 'POST',
        body: JSON.stringify({ reading, appliances }),
      });
    } catch (error) {
      console.error('Error saving reading:', error);
    }
  }

  async getRecentReadings(deviceId: string, limitCount: number = 100): Promise<RealtimeReading[]> {
    try {
      const resp = await apiFetch<{ readings: any[] }>(
        `/devices/${deviceId}/readings/recent?limit=${encodeURIComponent(String(limitCount))}`,
        { method: 'GET' }
      );

      return (resp.readings || []).map((row) => ({
        voltage: parseFloat(row.reading_detail_voltage) || 0,
        current: parseFloat(row.reading_detail_current) || 0,
        power: parseFloat(row.reading_detail_power_w) || 0,
        powerFactor: parseFloat(row.reading_detail_power_factor) || 0,
        frequency: parseFloat(row.reading_detail_frequency) || 60,
        energy: parseFloat(row.reading_detail_energy_kwh) || 0,
        timestamp: new Date(row.timestamp),
        applianceReadings: [],
      })) as any;
    } catch (error) {
      console.error('Error getting readings:', error);
      return [];
    }
  }

  async getReadingsByDateRange(deviceId: string, startDate: Date, endDate: Date): Promise<RealtimeReading[]> {
    try {
      const resp = await apiFetch<{ readings: any[] }>(
        `/devices/${deviceId}/readings?start=${encodeURIComponent(startDate.toISOString())}&end=${encodeURIComponent(
          endDate.toISOString()
        )}`,
        { method: 'GET' }
      );

      return (resp.readings || []).map((row) => ({
        voltage: parseFloat(row.reading_detail_voltage) || 0,
        current: parseFloat(row.reading_detail_current) || 0,
        power: parseFloat(row.reading_detail_power_w) || 0,
        powerFactor: parseFloat(row.reading_detail_power_factor) || 0,
        frequency: parseFloat(row.reading_detail_frequency) || 60,
        energy: parseFloat(row.reading_detail_energy_kwh) || 0,
        timestamp: new Date(row.timestamp),
        applianceReadings: [],
      })) as any;
    } catch (error) {
      console.error('Error getting readings by date range:', error);
      return [];
    }
  }

  async getAveragePower(deviceId: string, startDate: Date, endDate: Date): Promise<number> {
    const readings: any[] = await this.getReadingsByDateRange(deviceId, startDate, endDate);
    if (readings.length === 0) return 0;
    const sum = readings.reduce((acc, r) => acc + (r.power || 0), 0);
    return sum / readings.length;
  }
}

export const readingService = new ReadingService();

