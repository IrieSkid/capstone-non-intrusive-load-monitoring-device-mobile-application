/**
 * Report Service
 * Handles data aggregation and report generation from Firestore
 */

import { DailyReport, WeeklyReport, MonthlyReport, CostAnalysis } from '@/types/report';
import { readingService } from './readingService';
import { firestoreApplianceService } from './firestoreApplianceService';

class ReportService {
  private readonly costPerKwh = 12; // ₱12 per kWh average

  /**
   * Get today's report from Firestore readings
   */
  async getDailyReport(deviceId: string): Promise<DailyReport> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const readings = await readingService.getReadingsByDateRange(deviceId, startOfDay, endOfDay);
      
      if (readings.length === 0) {
        return this.getEmptyDailyReport();
      }

      // Calculate total kWh from readings
      const latestReading = readings[readings.length - 1];
      const totalKwh = latestReading?.energy || 0;
      
      // Calculate average power
      const avgPower = await readingService.getAveragePower(deviceId, startOfDay, endOfDay);
      
      // Calculate peak power
      const peakPower = Math.max(...readings.map(r => r.power));

      // Calculate cost
      const totalCost = totalKwh * this.costPerKwh;

      // Calculate hourly data
      const hourlyData = this.calculateHourlyData(readings);

      // Get appliance breakdown
      const applianceBreakdown = await this.getApplianceBreakdown(deviceId);

      return {
        date: new Date(),
        totalKwh,
        peakPower,
        avgPower,
        totalCost,
        hourlyData,
        applianceBreakdown,
        comparisonToYesterday: 0, // TODO: Calculate from previous day
      };
    } catch (error) {
      console.error('Error generating daily report:', error);
      return this.getEmptyDailyReport();
    }
  }

  /**
   * Get this week's report
   */
  async getWeeklyReport(deviceId: string): Promise<WeeklyReport> {
    try {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);

      const readings = await readingService.getReadingsByDateRange(deviceId, startOfWeek, now);
      
      if (readings.length === 0) {
        return this.getEmptyWeeklyReport();
      }

      const latestReading = readings[readings.length - 1];
      const totalKwh = latestReading?.energy || 0;
      const avgDailyKwh = totalKwh / 7;
      const totalCost = totalKwh * this.costPerKwh;
      const peakPower = Math.max(...readings.map(r => r.power));

      // Calculate daily data
      const dailyData = this.calculateDailyData(readings, startOfWeek);

      // Get appliance breakdown
      const applianceBreakdown = await this.getApplianceBreakdown(deviceId);

      return {
        startDate: startOfWeek,
        endDate: now,
        totalKwh,
        avgDailyKwh,
        peakPower,
        totalCost,
        dailyData,
        applianceBreakdown,
        comparisonToPreviousWeek: 0, // TODO: Calculate
      };
    } catch (error) {
      console.error('Error generating weekly report:', error);
      return this.getEmptyWeeklyReport();
    }
  }

  /**
   * Get this month's report
   */
  async getMonthlyReport(deviceId: string): Promise<MonthlyReport> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const readings = await readingService.getReadingsByDateRange(deviceId, startOfMonth, now);
      
      if (readings.length === 0) {
        return this.getEmptyMonthlyReport();
      }

      const latestReading = readings[readings.length - 1];
      const totalKwh = latestReading?.energy || 0;
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const avgDailyKwh = totalKwh / daysInMonth;
      const totalCost = totalKwh * this.costPerKwh;
      const peakPower = Math.max(...readings.map(r => r.power));

      // Calculate daily data
      const dailyData = this.calculateDailyData(readings, startOfMonth);

      // Get appliance breakdown
      const applianceBreakdown = await this.getApplianceBreakdown(deviceId);

      return {
        month: now,
        totalKwh,
        avgDailyKwh,
        peakPower,
        totalCost,
        dailyData,
        applianceBreakdown,
        comparisonToPreviousMonth: 0, // TODO: Calculate
      };
    } catch (error) {
      console.error('Error generating monthly report:', error);
      return this.getEmptyMonthlyReport();
    }
  }

  /**
   * Get appliance breakdown based on rated power and usage
   */
  private async getApplianceBreakdown(deviceId: string): Promise<Array<{ name: string; kwh: number; percentage: number }>> {
    try {
      const appliances = await firestoreApplianceService.getDeviceAppliances(deviceId);
      
      // Estimate usage based on rated power and simulated usage time
      const breakdown = appliances.map(app => ({
        name: app.name,
        kwh: (app.ratedPower / 1000) * (app.usageMinutes || 0) / 60, // Convert W to kWh
        percentage: 0, // Will calculate below
      }));

      // Calculate total and percentages
      const totalKwh = breakdown.reduce((sum, item) => sum + item.kwh, 0);
      breakdown.forEach(item => {
        item.percentage = totalKwh > 0 ? (item.kwh / totalKwh) * 100 : 0;
      });

      // Sort by usage (highest first)
      return breakdown.sort((a, b) => b.kwh - a.kwh);
    } catch (error) {
      console.error('Error calculating appliance breakdown:', error);
      return [];
    }
  }

  /**
   * Calculate hourly data from readings
   */
  private calculateHourlyData(readings: any[]): Array<{ hour: number; kwh: number }> {
    const hourlyMap = new Map<number, number>();
    
    readings.forEach(reading => {
      const hour = new Date(reading.timestamp).getHours();
      const currentKwh = hourlyMap.get(hour) || 0;
      hourlyMap.set(hour, Math.max(currentKwh, reading.energy));
    });

    const result = [];
    for (let i = 0; i < 24; i++) {
      result.push({ hour: i, kwh: hourlyMap.get(i) || 0 });
    }
    
    return result;
  }

  /**
   * Calculate daily data from readings
   */
  private calculateDailyData(readings: any[], startDate: Date): Array<{ date: Date; kwh: number }> {
    const dailyMap = new Map<string, number>();
    
    readings.forEach(reading => {
      const date = new Date(reading.timestamp);
      const dateKey = date.toDateString();
      const currentKwh = dailyMap.get(dateKey) || 0;
      dailyMap.set(dateKey, Math.max(currentKwh, reading.energy));
    });

    // Generate array for all days
    const result = [];
    const currentDate = new Date(startDate);
    const endDate = new Date();
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toDateString();
      result.push({
        date: new Date(currentDate),
        kwh: dailyMap.get(dateKey) || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return result;
  }

  /**
   * Get cost analysis
   */
  async getCostAnalysis(deviceId: string, period: 'daily' | 'weekly' | 'monthly'): Promise<CostAnalysis> {
    let currentKwh = 0;
    let previousKwh = 0;
    
    try {
      switch (period) {
        case 'daily':
          const dailyReport = await this.getDailyReport(deviceId);
          currentKwh = dailyReport.totalKwh;
          previousKwh = currentKwh * 0.95; // TODO: Get from previous day
          break;
        case 'weekly':
          const weeklyReport = await this.getWeeklyReport(deviceId);
          currentKwh = weeklyReport.totalKwh;
          previousKwh = currentKwh * 0.90; // TODO: Get from previous week
          break;
        case 'monthly':
          const monthlyReport = await this.getMonthlyReport(deviceId);
          currentKwh = monthlyReport.totalKwh;
          previousKwh = currentKwh * 0.85; // TODO: Get from previous month
          break;
      }
    } catch (error) {
      console.error('Error generating cost analysis:', error);
    }
    
    const currentCost = currentKwh * this.costPerKwh;
    const previousCost = previousKwh * this.costPerKwh;
    const savingsAmount = previousCost - currentCost;
    const savingsPercentage = previousCost > 0 ? (savingsAmount / previousCost) * 100 : 0;

    return {
      period,
      currentKwh,
      previousKwh,
      currentCost,
      previousCost,
      savingsAmount,
      savingsPercentage,
      costPerKwh: this.costPerKwh,
    };
  }

  // Empty report helpers
  private getEmptyDailyReport(): DailyReport {
    return {
      date: new Date(),
      totalKwh: 0,
      peakPower: 0,
      avgPower: 0,
      totalCost: 0,
      hourlyData: Array.from({ length: 24 }, (_, i) => ({ hour: i, kwh: 0 })),
      applianceBreakdown: [],
      comparisonToYesterday: 0,
    };
  }

  private getEmptyWeeklyReport(): WeeklyReport {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    return {
      startDate: startOfWeek,
      endDate: now,
      totalKwh: 0,
      avgDailyKwh: 0,
      peakPower: 0,
      totalCost: 0,
      dailyData: [],
      applianceBreakdown: [],
      comparisonToPreviousWeek: 0,
    };
  }

  private getEmptyMonthlyReport(): MonthlyReport {
    return {
      month: new Date(),
      totalKwh: 0,
      avgDailyKwh: 0,
      peakPower: 0,
      totalCost: 0,
      dailyData: [],
      applianceBreakdown: [],
      comparisonToPreviousMonth: 0,
    };
  }

  /**
   * Export report (placeholder for now)
   */
  async exportReport(format: 'pdf' | 'csv', data: any): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // TODO: Implement actual export functionality in Phase 3.2
    return `Report exported as ${format.toUpperCase()}`;
  }
}

export const reportService = new ReportService();
