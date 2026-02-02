/**
 * Report Types
 * TypeScript interfaces for reports and analytics
 */

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ConsumptionDataPoint {
  timestamp: Date;
  label: string;
  value: number; // kWh
  cost: number; // PHP
}

export interface DailyReport {
  date: Date;
  totalKwh: number;
  totalCost: number;
  peakPower: number;
  averagePower: number;
  hourlyData: ConsumptionDataPoint[];
  applianceBreakdown: ApplianceConsumption[];
}

export interface WeeklyReport {
  weekStart: Date;
  weekEnd: Date;
  totalKwh: number;
  totalCost: number;
  averageDaily: number;
  dailyData: ConsumptionDataPoint[];
  applianceBreakdown: ApplianceConsumption[];
  comparisonToPreviousWeek: number; // percentage
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalKwh: number;
  totalCost: number;
  averageDaily: number;
  dailyData: ConsumptionDataPoint[];
  weeklyData: ConsumptionDataPoint[];
  applianceBreakdown: ApplianceConsumption[];
  comparisonToPreviousMonth: number; // percentage
  projectedBill: number;
}

export interface YearlyReport {
  year: number;
  totalKwh: number;
  totalCost: number;
  averageMonthly: number;
  monthlyData: ConsumptionDataPoint[];
  applianceBreakdown: ApplianceConsumption[];
  comparisonToPreviousYear: number; // percentage
}

export interface ApplianceConsumption {
  applianceId: string;
  name: string;
  icon: string;
  totalKwh: number;
  totalCost: number;
  percentage: number; // percentage of total consumption
  averageHoursPerDay: number;
  estimatedMonthlyCost: number;
}

export interface CostAnalysis {
  currentPeriodCost: number;
  previousPeriodCost: number;
  percentageChange: number;
  estimatedNextBill: number;
  savingsOpportunity: number;
  costByTimeOfDay: {
    morning: number; // 6am-12pm
    afternoon: number; // 12pm-6pm
    evening: number; // 6pm-12am
    night: number; // 12am-6am
  };
}

export interface UsagePattern {
  peakHours: string[];
  offPeakHours: string[];
  averageConsumptionByDayOfWeek: {
    day: string;
    kwh: number;
  }[];
  trends: {
    isIncreasing: boolean;
    percentageChange: number;
    insight: string;
  };
}

export interface BillingForecast {
  currentMonthEstimate: number;
  nextMonthPrediction: number;
  annualEstimate: number;
  savingsTips: string[];
}
