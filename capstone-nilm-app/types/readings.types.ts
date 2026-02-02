/**
 * Readings Type Definitions
 * Based on the Firestore schema from database design
 */

export interface RealTimeReading {
  id: string;
  deviceId: string;
  applianceId?: string;
  voltageRms: number;
  currentRms: number;
  powerWatts: number;
  energyKwh: number;
  powerFactor: number;
  frequency?: number;
  recordedAt: Date;
}

export interface ConsumptionSummary {
  id: string;
  userId: string;
  deviceId?: string;
  applianceId?: string;
  electricityRateId: string;
  periodType: 'daily' | 'weekly' | 'monthly';
  periodStart: Date;
  periodEnd: Date;
  totalKwh: number;
  totalCostPhp: number;
  readingCount: number;
  createdAt: Date;
}

export interface ElectricityRate {
  id: string;
  name: string;
  pesoPerKwh: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  isActive: boolean;
  description?: string;
  createdAt: Date;
}
