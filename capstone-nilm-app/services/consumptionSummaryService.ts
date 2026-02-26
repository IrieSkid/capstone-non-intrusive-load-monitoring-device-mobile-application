/**
 * Consumption Summary Service (in-memory)
 *
 * This used to be Firestore-based. For the MySQL + mobile architecture,
 * summaries should be generated/stored server-side. This in-memory version
 * keeps the app working without Firebase.
 */

export interface ApplianceConsumption {
  applianceId: string;
  applianceName: string;
  category: string;
  totalKwh: number;
  totalCost: number;
  avgPower: number;
  avgVoltage: number;
  avgCurrent: number;
  avgPowerFactor: number;
  runtime: number;
  percentage: number;
}

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
  applianceBreakdown?: ApplianceConsumption[];
  createdAt: Date;
}

class ConsumptionSummaryService {
  private summaries: Map<string, ConsumptionSummary> = new Map();

  async createSummary(summary: Omit<ConsumptionSummary, 'id' | 'createdAt'>): Promise<ConsumptionSummary> {
    const id = `summary_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const created: ConsumptionSummary = { ...summary, id, createdAt: new Date() };
    this.summaries.set(id, created);
    return created;
  }

  async getSummariesByPeriod(
    userId: string,
    period: 'hourly' | 'daily' | 'weekly' | 'monthly',
    startDate?: Date,
    endDate?: Date
  ): Promise<ConsumptionSummary[]> {
    let items = Array.from(this.summaries.values()).filter((s) => s.userId === userId && s.period === period);
    if (startDate) items = items.filter((s) => s.startDate >= startDate);
    if (endDate) items = items.filter((s) => s.endDate <= endDate);
    return items.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  async getDeviceSummaries(deviceId: string): Promise<ConsumptionSummary[]> {
    return Array.from(this.summaries.values())
      .filter((s) => s.deviceId === deviceId)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  // Kept for compatibility with existing call sites
  async generateDailySummary(userId: string, deviceId: string, readings: any[]): Promise<ConsumptionSummary | null> {
    if (!readings?.length) return null;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const peakPower = Math.max(...readings.map((r) => r.power || 0), 0);
    const averagePower = readings.reduce((sum, r) => sum + (r.power || 0), 0) / readings.length;
    const latest = readings[readings.length - 1];
    const totalEnergyKwh = latest.energy || 0;
    const ratePerKwh = 12;
    const totalCost = totalEnergyKwh * ratePerKwh;

    return await this.createSummary({
      userId,
      deviceId,
      period: 'daily',
      startDate,
      endDate,
      totalEnergyKwh,
      totalCost,
      averagePower,
      peakPower,
      ratePerKwh,
      applianceBreakdown: [],
    });
  }
}

export const consumptionSummaryService = new ConsumptionSummaryService();

