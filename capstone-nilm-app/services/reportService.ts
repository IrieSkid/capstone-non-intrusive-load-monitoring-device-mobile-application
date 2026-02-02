/**
 * Report Service
 * Handles data aggregation and report generation from Firestore
 */

import { DailyReport, WeeklyReport, MonthlyReport, CostAnalysis, ApplianceConsumption } from '@/types/report';
import { readingService } from './readingService';
import { firestoreApplianceService } from './firestoreApplianceService';
import { electricityRateService } from './electricityRateService';
import { consumptionSummaryService } from './consumptionSummaryService';

class ReportService {
  private readonly defaultCostPerKwh = 12; // ₱12 per kWh fallback

  /**
   * Format number to 3 decimal places
   */
  private fmt(value: number): number {
    return parseFloat(value.toFixed(3));
  }

  /**
   * Get current electricity rate for user, or default
   */
  private async getCostPerKwh(userId?: string): Promise<number> {
    if (!userId) return this.defaultCostPerKwh;
    
    try {
      const rate = await electricityRateService.getCurrentRate(userId);
      return rate?.ratePerKwh || this.defaultCostPerKwh;
    } catch (error) {
      console.error('Error getting electricity rate:', error);
      return this.defaultCostPerKwh;
    }
  }

  /**
   * Get today's report from Firestore readings
   */
  async getDailyReport(deviceId: string, userId?: string): Promise<DailyReport> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const readings = await readingService.getReadingsByDateRange(deviceId, startOfDay, endOfDay);
      
      if (readings.length === 0) {
        return this.getEmptyDailyReport();
      }

      // Get electricity rate
      const costPerKwh = await this.getCostPerKwh(userId);

      // Calculate metrics from readings
      const totalKwh = this.calculateTotalKwh(readings);
      const avgPower = this.calculateAveragePower(readings);
      const peakPower = Math.max(...readings.map(r => r.power || 0), 0);
      const totalCost = totalKwh * costPerKwh;

      // Calculate hourly data
      const hourlyData = this.calculateHourlyData(readings, costPerKwh);

      // Get appliance breakdown
      const applianceBreakdown = await this.calculateApplianceBreakdown(readings, deviceId, costPerKwh);

      return {
        date: new Date(),
        totalKwh: this.fmt(totalKwh),
        totalCost: this.fmt(totalCost),
        peakPower: this.fmt(peakPower),
        averagePower: this.fmt(avgPower),
        hourlyData,
        applianceBreakdown,
        comparisonToYesterday: 0,
      };
    } catch (error) {
      console.error('Error generating daily report:', error);
      return this.getEmptyDailyReport();
    }
  }

  /**
   * Get this week's report
   */
  async getWeeklyReport(deviceId: string, userId?: string): Promise<WeeklyReport> {
    try {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);

      const readings = await readingService.getReadingsByDateRange(deviceId, startOfWeek, now);
      
      if (readings.length === 0) {
        return this.getEmptyWeeklyReport();
      }

      const costPerKwh = await this.getCostPerKwh(userId);
      const totalKwh = this.calculateTotalKwh(readings);
      const avgDailyKwh = totalKwh / 7;
      const totalCost = totalKwh * costPerKwh;
      const peakPower = Math.max(...readings.map(r => r.power || 0), 0);

      // Calculate daily data
      const dailyData = this.calculateDailyData(readings, startOfWeek, costPerKwh);

      // Get appliance breakdown
      const applianceBreakdown = await this.calculateApplianceBreakdown(readings, deviceId, costPerKwh);

      return {
        weekStart: startOfWeek,
        weekEnd: now,
        totalKwh,
        totalCost,
        averageDaily: avgDailyKwh,
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
  async getMonthlyReport(deviceId: string, userId?: string): Promise<MonthlyReport> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const readings = await readingService.getReadingsByDateRange(deviceId, startOfMonth, now);
      
      if (readings.length === 0) {
        return this.getEmptyMonthlyReport();
      }

      const costPerKwh = await this.getCostPerKwh(userId);
      const totalKwh = this.calculateTotalKwh(readings);
      const daysInMonth = now.getDate();
      const avgDailyKwh = totalKwh / daysInMonth;
      const totalCost = totalKwh * costPerKwh;
      const peakPower = Math.max(...readings.map(r => r.power || 0), 0);

      // Calculate daily and weekly data
      const dailyData = this.calculateDailyData(readings, startOfMonth, costPerKwh);
      const weeklyData = this.calculateWeeklyData(readings, startOfMonth, costPerKwh);

      // Get appliance breakdown
      const applianceBreakdown = await this.calculateApplianceBreakdown(readings, deviceId, costPerKwh);

      return {
        month: now.toLocaleDateString('en-US', { month: 'long' }),
        year: now.getFullYear(),
        totalKwh: this.fmt(totalKwh),
        totalCost: this.fmt(totalCost),
        averageDaily: this.fmt(avgDailyKwh),
        dailyData,
        weeklyData,
        applianceBreakdown,
        comparisonToPreviousMonth: 0,
        projectedBill: this.fmt(totalCost * (30 / daysInMonth)),
      };
    } catch (error) {
      console.error('Error generating monthly report:', error);
      return this.getEmptyMonthlyReport();
    }
  }

  /**
   * Calculate total kWh from readings
   */
  private calculateTotalKwh(readings: any[]): number {
    if (readings.length === 0) return 0;
    
    // Sum up energy from all readings (3-second intervals)
    let totalKwh = 0;
    readings.forEach(reading => {
      const power = reading.power || 0;
      const intervalHours = 3 / 3600; // 3 seconds in hours
      totalKwh += (power / 1000) * intervalHours;
    });
    
    return totalKwh;
  }

  /**
   * Calculate average power from readings
   */
  private calculateAveragePower(readings: any[]): number {
    if (readings.length === 0) return 0;
    const sum = readings.reduce((acc, r) => acc + (r.power || 0), 0);
    return sum / readings.length;
  }

  /**
   * Calculate appliance breakdown from readings
   */
  private async calculateApplianceBreakdown(readings: any[], deviceId: string, costPerKwh: number): Promise<ApplianceConsumption[]> {
    try {
      // Get all appliances for this device
      const appliances = await firestoreApplianceService.getDeviceAppliances(deviceId);
      
      if (appliances.length === 0) {
        return [];
      }

      // Aggregate data per appliance from readings
      const applianceMap = new Map<string, {
        name: string;
        icon: string;
        category: string;
        totalKwh: number;
        totalMinutes: number;
        voltageSum: number;
        currentSum: number;
        pfSum: number;
        powerSum: number;
        count: number;
      }>();

      // Initialize map with all appliances
      appliances.forEach(app => {
        applianceMap.set(app.id, {
          name: app.name,
          icon: app.icon,
          category: app.category,
          totalKwh: 0,
          totalMinutes: 0,
          voltageSum: 0,
          currentSum: 0,
          pfSum: 0,
          powerSum: 0,
          count: 0,
        });
      });

      // Aggregate from readings
      readings.forEach(reading => {
        if (reading.applianceReadings && Array.isArray(reading.applianceReadings)) {
          reading.applianceReadings.forEach((appReading: any) => {
            const existing = applianceMap.get(appReading.applianceId);
            if (existing && appReading.isActive) {
              const kwh = (appReading.power / 1000) * (3 / 3600); // 3 seconds to kWh
              existing.totalKwh += kwh;
              existing.totalMinutes += 0.05; // 3 seconds = 0.05 minutes
              existing.voltageSum += appReading.voltage || 220;
              existing.currentSum += appReading.current || 0;
              existing.pfSum += appReading.powerFactor || 0.9;
              existing.powerSum += appReading.power || 0;
              existing.count++;
            }
          });
        }
      });

      // Convert to ApplianceConsumption format
      const breakdown: ApplianceConsumption[] = [];
      const totalKwh = Array.from(applianceMap.values()).reduce((sum, app) => sum + app.totalKwh, 0);

      applianceMap.forEach((data, applianceId) => {
        if (data.totalKwh === 0) return; // Skip inactive appliances
        
        const totalCost = data.totalKwh * costPerKwh;
        const percentage = totalKwh > 0 ? (data.totalKwh / totalKwh) * 100 : 0;
        const averageHoursPerDay = data.totalMinutes / 60; // Convert to hours
        const estimatedMonthlyCost = (totalCost / (data.totalMinutes / 60 / 24 || 1)) * 30; // Cost per day * 30

        breakdown.push({
          applianceId,
          name: data.name,
          icon: data.icon,
          category: data.category,
          totalKwh: this.fmt(data.totalKwh),
          totalCost: this.fmt(totalCost),
          percentage: this.fmt(percentage),
          averageHoursPerDay: this.fmt(averageHoursPerDay),
          estimatedMonthlyCost: this.fmt(estimatedMonthlyCost),
          avgPower: this.fmt(data.count > 0 ? data.powerSum / data.count : 0),
          avgVoltage: this.fmt(data.count > 0 ? data.voltageSum / data.count : 220),
          avgCurrent: this.fmt(data.count > 0 ? data.currentSum / data.count : 0),
          avgPowerFactor: this.fmt(data.count > 0 ? data.pfSum / data.count : 0.9),
        });
      });

      // Sort by usage (highest first)
      return breakdown.sort((a, b) => b.totalKwh - a.totalKwh);
    } catch (error) {
      console.error('Error calculating appliance breakdown:', error);
      return [];
    }
  }

  /**
   * Calculate hourly data from readings
   */
  private calculateHourlyData(readings: any[], costPerKwh: number): any[] {
    const hourlyMap = new Map<number, number>();
    
    readings.forEach(reading => {
      const hour = new Date(reading.timestamp).getHours();
      const currentKwh = hourlyMap.get(hour) || 0;
      const kwh = (reading.power / 1000) * (3 / 3600); // 3 seconds
      hourlyMap.set(hour, currentKwh + kwh);
    });

    const result = [];
    for (let i = 0; i < 24; i++) {
      const kwh = hourlyMap.get(i) || 0;
      const now = new Date();
      now.setHours(i, 0, 0, 0);
      
      result.push({ 
        timestamp: now,
        label: `${i}:00`,
        value: this.fmt(kwh),
        cost: this.fmt(kwh * costPerKwh),
      });
    }
    
    return result;
  }

  /**
   * Calculate daily data from readings
   */
  private calculateDailyData(readings: any[], startDate?: Date, costPerKwh: number = 12): any[] {
    const dailyMap = new Map<string, number>();
    
    readings.forEach(reading => {
      const date = new Date(reading.timestamp);
      const dateKey = date.toDateString();
      const currentKwh = dailyMap.get(dateKey) || 0;
      const kwh = (reading.power / 1000) * (3 / 3600); // 3 seconds
      dailyMap.set(dateKey, currentKwh + kwh);
    });

    // Generate array for all days
    const result = [];
    const currentDate = new Date(startDate);
    const endDate = new Date();
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toDateString();
      const kwh = dailyMap.get(dateKey) || 0;
      const dateLabel = new Date(currentDate);
      
      result.push({
        timestamp: new Date(currentDate),
        label: dateLabel.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: this.fmt(kwh),
        cost: this.fmt(kwh * costPerKwh),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return result;
  }

  /**
   * Calculate weekly data from readings
   */
  private calculateWeeklyData(readings: any[], startDate: Date, costPerKwh: number = 12): any[] {
    const weeklyMap = new Map<string, number>();
    
    readings.forEach(reading => {
      const date = new Date(reading.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekKey = weekStart.toDateString();
      
      const currentKwh = weeklyMap.get(weekKey) || 0;
      const kwh = (reading.power / 1000) * (3 / 3600); // 3 seconds
      weeklyMap.set(weekKey, currentKwh + kwh);
    });

    const result: any[] = [];
    weeklyMap.forEach((kwh, weekKey) => {
      const weekStart = new Date(weekKey);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      result.push({
        timestamp: weekStart,
        label: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { day: 'numeric' })}`,
        value: this.fmt(kwh),
        cost: this.fmt(kwh * costPerKwh),
      });
    });
    
    return result.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get cost analysis
   */
  async getCostAnalysis(deviceId: string, period: 'daily' | 'weekly' | 'monthly', userId?: string): Promise<CostAnalysis> {
    let currentKwh = 0;
    let previousKwh = 0;
    let readings: any[] = [];
    
    try {
      switch (period) {
        case 'daily':
          const dailyReport = await this.getDailyReport(deviceId, userId);
          currentKwh = dailyReport.totalKwh;
          previousKwh = currentKwh * 0.95; // TODO: Get from previous day
          
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date();
          endOfDay.setHours(23, 59, 59, 999);
          readings = await readingService.getReadingsByDateRange(deviceId, startOfDay, endOfDay);
          break;
        case 'weekly':
          const weeklyReport = await this.getWeeklyReport(deviceId, userId);
          currentKwh = weeklyReport.totalKwh;
          previousKwh = currentKwh * 0.90; // TODO: Get from previous week
          
          const now = new Date();
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          readings = await readingService.getReadingsByDateRange(deviceId, startOfWeek, now);
          break;
        case 'monthly':
          const monthlyReport = await this.getMonthlyReport(deviceId, userId);
          currentKwh = monthlyReport.totalKwh;
          previousKwh = currentKwh * 0.85; // TODO: Get from previous month
          
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);
          readings = await readingService.getReadingsByDateRange(deviceId, startOfMonth, new Date());
          break;
      }
    } catch (error) {
      console.error('Error generating cost analysis:', error);
    }
    
    // Get cost per kWh
    const costPerKwh = await this.getCostPerKwh(userId);
    
    const currentCost = currentKwh * costPerKwh;
    const previousCost = previousKwh * costPerKwh;
    const percentageChange = previousCost > 0 ? ((currentCost - previousCost) / previousCost) * 100 : 0;

    // Calculate cost by time of day
    const costByTimeOfDay = this.calculateCostByTimeOfDay(readings, costPerKwh);

    return {
      currentPeriodCost: this.fmt(currentCost),
      previousPeriodCost: this.fmt(previousCost),
      percentageChange: this.fmt(percentageChange),
      estimatedNextBill: this.fmt(currentCost * 30),
      savingsOpportunity: this.fmt(currentCost * 0.15),
      costByTimeOfDay: {
        morning: this.fmt(costByTimeOfDay.morning),
        afternoon: this.fmt(costByTimeOfDay.afternoon),
        evening: this.fmt(costByTimeOfDay.evening),
        night: this.fmt(costByTimeOfDay.night),
      },
    };
  }

  /**
   * Calculate cost by time of day
   */
  private calculateCostByTimeOfDay(readings: any[], costPerKwh: number): {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  } {
    const timeSlots = {
      morning: 0,   // 6am-12pm
      afternoon: 0, // 12pm-6pm
      evening: 0,   // 6pm-12am
      night: 0,     // 12am-6am
    };

    readings.forEach(reading => {
      const hour = new Date(reading.timestamp).getHours();
      const kwh = (reading.power / 1000) * (3 / 3600); // 3 seconds to kWh (simulation interval)
      const cost = kwh * costPerKwh;

      if (hour >= 6 && hour < 12) {
        timeSlots.morning += cost;
      } else if (hour >= 12 && hour < 18) {
        timeSlots.afternoon += cost;
      } else if (hour >= 18 && hour < 24) {
        timeSlots.evening += cost;
      } else {
        timeSlots.night += cost;
      }
    });

    return timeSlots;
  }

  // Empty report helpers
  private getEmptyDailyReport(): DailyReport {
    const now = new Date();
    return {
      date: new Date(),
      totalKwh: 0,
      totalCost: 0,
      peakPower: 0,
      averagePower: 0,
      hourlyData: Array.from({ length: 24 }, (_, i) => {
        const timestamp = new Date(now);
        timestamp.setHours(i, 0, 0, 0);
        return {
          timestamp,
          label: `${i}:00`,
          value: 0,
          cost: 0,
        };
      }),
      applianceBreakdown: [],
      comparisonToYesterday: 0,
    };
  }

  private getEmptyWeeklyReport(): WeeklyReport {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    return {
      weekStart: startOfWeek,
      weekEnd: now,
      totalKwh: 0,
      totalCost: 0,
      averageDaily: 0,
      dailyData: [],
      applianceBreakdown: [],
      comparisonToPreviousWeek: 0,
    };
  }

  private getEmptyMonthlyReport(): MonthlyReport {
    const now = new Date();
    return {
      month: now.toLocaleDateString('en-US', { month: 'long' }),
      year: now.getFullYear(),
      totalKwh: 0,
      totalCost: 0,
      averageDaily: 0,
      dailyData: [],
      weeklyData: [],
      applianceBreakdown: [],
      comparisonToPreviousMonth: 0,
      projectedBill: 0,
    };
  }

  /**
   * Get daily report for a custom date range
   */
  async getDailyReportByDateRange(deviceId: string, startDate: Date, endDate: Date, userId?: string): Promise<DailyReport> {
    try {
      const readings = await readingService.getReadingsByDateRange(deviceId, startDate, endDate);
      
      if (readings.length === 0) {
        return this.getEmptyDailyReport();
      }

      const costPerKwh = await this.getCostPerKwh(userId);
      const totalKwh = this.calculateTotalKwh(readings);
      const avgPower = this.calculateAveragePower(readings);
      const peakPower = Math.max(...readings.map(r => r.power || 0), 0);
      const totalCost = totalKwh * costPerKwh;
      const hourlyData = this.calculateHourlyData(readings, costPerKwh);
      const applianceBreakdown = await this.calculateApplianceBreakdown(readings, deviceId, costPerKwh);

      return {
        date: startDate,
        totalKwh: this.fmt(totalKwh),
        totalCost: this.fmt(totalCost),
        peakPower: this.fmt(peakPower),
        averagePower: this.fmt(avgPower),
        hourlyData,
        applianceBreakdown,
        comparisonToYesterday: 0,
      };
    } catch (error) {
      console.error('Error generating daily report by date range:', error);
      return this.getEmptyDailyReport();
    }
  }

  /**
   * Get weekly report for a custom date range
   */
  async getWeeklyReportByDateRange(deviceId: string, startDate: Date, endDate: Date, userId?: string): Promise<WeeklyReport> {
    try {
      const readings = await readingService.getReadingsByDateRange(deviceId, startDate, endDate);
      
      if (readings.length === 0) {
        return this.getEmptyWeeklyReport();
      }

      const costPerKwh = await this.getCostPerKwh(userId);
      const totalKwh = this.calculateTotalKwh(readings);
      const totalCost = totalKwh * costPerKwh;
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const averageDaily = totalKwh / days;
      const dailyData = this.calculateDailyData(readings, startDate, costPerKwh);
      const applianceBreakdown = await this.calculateApplianceBreakdown(readings, deviceId, costPerKwh);

      return {
        weekStart: startDate,
        weekEnd: endDate,
        totalKwh: this.fmt(totalKwh),
        totalCost: this.fmt(totalCost),
        averageDaily: this.fmt(averageDaily),
        dailyData,
        applianceBreakdown,
        comparisonToPreviousWeek: 0,
      };
    } catch (error) {
      console.error('Error generating weekly report by date range:', error);
      return this.getEmptyWeeklyReport();
    }
  }

  /**
   * Get monthly report for a custom date range
   */
  async getMonthlyReportByDateRange(deviceId: string, startDate: Date, endDate: Date, userId?: string): Promise<MonthlyReport> {
    try {
      const readings = await readingService.getReadingsByDateRange(deviceId, startDate, endDate);
      
      if (readings.length === 0) {
        return this.getEmptyMonthlyReport();
      }

      const costPerKwh = await this.getCostPerKwh(userId);
      const totalKwh = this.calculateTotalKwh(readings);
      const totalCost = totalKwh * costPerKwh;
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const averageDaily = totalKwh / days;
      const dailyData = this.calculateDailyData(readings, startDate, costPerKwh);
      const applianceBreakdown = await this.calculateApplianceBreakdown(readings, deviceId, costPerKwh);
      const projectedBill = (totalKwh / days) * 30 * costPerKwh;

      return {
        month: startDate.toLocaleDateString('en-US', { month: 'long' }),
        year: startDate.getFullYear(),
        totalKwh: this.fmt(totalKwh),
        totalCost: this.fmt(totalCost),
        averageDaily: this.fmt(averageDaily),
        dailyData,
        weeklyData: [],
        applianceBreakdown,
        comparisonToPreviousMonth: 0,
        projectedBill: this.fmt(projectedBill),
      };
    } catch (error) {
      console.error('Error generating monthly report by date range:', error);
      return this.getEmptyMonthlyReport();
    }
  }

  /**
   * Get cost analysis for a custom date range
   */
  async getCostAnalysisByDateRange(deviceId: string, startDate: Date, endDate: Date, userId?: string): Promise<CostAnalysis> {
    try {
      const readings = await readingService.getReadingsByDateRange(deviceId, startDate, endDate);
      
      if (readings.length === 0) {
        return {
          currentPeriodCost: 0,
          previousPeriodCost: 0,
          percentageChange: 0,
          estimatedNextBill: 0,
          savingsOpportunity: 0,
          costByTimeOfDay: {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0,
          },
        };
      }

      const costPerKwh = await this.getCostPerKwh(userId);
      const totalKwh = this.calculateTotalKwh(readings);
      const currentPeriodCost = totalKwh * costPerKwh;
      const costByTimeOfDay = this.calculateCostByTimeOfDay(readings, costPerKwh);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const estimatedNextBill = (totalKwh / days) * 30 * this.costPerKwh;

      return {
        currentPeriodCost: this.fmt(currentPeriodCost),
        previousPeriodCost: 0,
        percentageChange: 0,
        estimatedNextBill: this.fmt(estimatedNextBill),
        savingsOpportunity: this.fmt(estimatedNextBill * 0.15),
        costByTimeOfDay: {
          morning: this.fmt(costByTimeOfDay.morning),
          afternoon: this.fmt(costByTimeOfDay.afternoon),
          evening: this.fmt(costByTimeOfDay.evening),
          night: this.fmt(costByTimeOfDay.night),
        },
      };
    } catch (error) {
      console.error('Error generating cost analysis by date range:', error);
      return {
        currentPeriodCost: 0,
        previousPeriodCost: 0,
        percentageChange: 0,
        estimatedNextBill: 0,
        savingsOpportunity: 0,
        costByTimeOfDay: {
          morning: 0,
          afternoon: 0,
          evening: 0,
          night: 0,
        },
      };
    }
  }
}

export const reportService = new ReportService();
