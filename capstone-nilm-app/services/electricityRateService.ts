/**
 * Electricity Rate Service (client)
 * Calls the Node/Express backend API which talks to MySQL.
 */

import { apiFetch } from '@/config/api';

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
  async getCurrentRate(userId?: string): Promise<ElectricityRate | null> {
    try {
      if (!userId) {
        return {
          id: 'default-rate',
          userId: '',
          ratePerKwh: 12.0,
          currency: 'PHP',
          effectiveDate: new Date(),
          createdAt: new Date(),
        };
      }

      const resp = await apiFetch<{ ratePerKwh: number; currency: string }>(`/users/${userId}/rate`, { method: 'GET' });
      return {
        id: 'room-rate',
        userId,
        ratePerKwh: resp.ratePerKwh,
        currency: resp.currency || 'PHP',
        effectiveDate: new Date(),
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error getting current rate:', error);
      return {
        id: 'fallback-rate',
        userId: userId || '',
        ratePerKwh: 12.0,
        currency: 'PHP',
        effectiveDate: new Date(),
        createdAt: new Date(),
      };
    }
  }

  async addRate(userId: string, rateData: Omit<ElectricityRate, 'id' | 'userId' | 'createdAt'>): Promise<ElectricityRate> {
    await apiFetch(`/users/${userId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ ratePerKwh: rateData.ratePerKwh }),
    });

    return {
      id: 'room-rate',
      userId,
      ...rateData,
      createdAt: new Date(),
    };
  }

  async getAllRates(userId: string): Promise<ElectricityRate[]> {
    const r = await this.getCurrentRate(userId);
    return r ? [r] : [];
  }
}

export const electricityRateService = new ElectricityRateService();

