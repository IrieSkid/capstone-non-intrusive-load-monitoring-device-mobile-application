/**
 * Mock Report Data Generator
 * Generates realistic historical data for reports and analytics
 */

import {
  DailyReport,
  WeeklyReport,
  MonthlyReport,
  ConsumptionDataPoint,
  ApplianceConsumption,
  CostAnalysis,
} from '@/types/report';

// Philippine electricity rate (average)
const RATE_PER_KWH = 11.5; // PHP

// Appliance profiles with realistic consumption patterns
const APPLIANCES = [
  { id: '1', name: 'Air Conditioner', icon: '❄️', avgWatts: 1500, hoursPerDay: 8 },
  { id: '2', name: 'Refrigerator', icon: '🧊', avgWatts: 150, hoursPerDay: 24 },
  { id: '3', name: 'Water Heater', icon: '🚿', avgWatts: 3000, hoursPerDay: 2 },
  { id: '4', name: 'Washing Machine', icon: '🧺', avgWatts: 500, hoursPerDay: 1 },
  { id: '5', name: 'TV', icon: '📺', avgWatts: 100, hoursPerDay: 6 },
  { id: '6', name: 'Electric Fan', icon: '🌀', avgWatts: 75, hoursPerDay: 10 },
  { id: '7', name: 'Computer', icon: '💻', avgWatts: 300, hoursPerDay: 8 },
  { id: '8', name: 'Lights', icon: '💡', avgWatts: 200, hoursPerDay: 12 },
];

/**
 * Generate random consumption with realistic variation
 */
function generateRealisticValue(baseValue: number, variance: number = 0.2): number {
  const variation = baseValue * variance;
  return baseValue + (Math.random() - 0.5) * 2 * variation;
}

/**
 * Generate hourly consumption data for a day
 */
export function generateHourlyData(date: Date): ConsumptionDataPoint[] {
  const hourlyData: ConsumptionDataPoint[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    // Realistic consumption patterns:
    // - Low at night (12am-6am): 0.5-1.5 kWh
    // - Morning peak (6am-9am): 2-4 kWh
    // - Daytime moderate (9am-6pm): 1.5-3 kWh
    // - Evening peak (6pm-10pm): 3-5 kWh
    // - Late evening (10pm-12am): 2-3 kWh
    
    let baseConsumption: number;
    if (hour >= 0 && hour < 6) {
      baseConsumption = 1.0; // Night
    } else if (hour >= 6 && hour < 9) {
      baseConsumption = 3.0; // Morning peak
    } else if (hour >= 9 && hour < 18) {
      baseConsumption = 2.0; // Daytime
    } else if (hour >= 18 && hour < 22) {
      baseConsumption = 4.0; // Evening peak
    } else {
      baseConsumption = 2.5; // Late evening
    }
    
    const kwh = generateRealisticValue(baseConsumption, 0.25);
    const cost = kwh * RATE_PER_KWH;
    
    const timestamp = new Date(date);
    timestamp.setHours(hour, 0, 0, 0);
    
    hourlyData.push({
      timestamp,
      label: `${hour}:00`,
      value: parseFloat(kwh.toFixed(2)),
      cost: parseFloat(cost.toFixed(2)),
    });
  }
  
  return hourlyData;
}

/**
 * Generate daily data for a week
 */
export function generateDailyDataForWeek(startDate: Date): ConsumptionDataPoint[] {
  const dailyData: ConsumptionDataPoint[] = [];
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    
    const hourlyData = generateHourlyData(date);
    const totalKwh = hourlyData.reduce((sum, d) => sum + d.value, 0);
    const totalCost = totalKwh * RATE_PER_KWH;
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    dailyData.push({
      timestamp: date,
      label: dayNames[date.getDay()],
      value: parseFloat(totalKwh.toFixed(2)),
      cost: parseFloat(totalCost.toFixed(2)),
    });
  }
  
  return dailyData;
}

/**
 * Generate daily data for a month
 */
export function generateDailyDataForMonth(year: number, month: number): ConsumptionDataPoint[] {
  const dailyData: ConsumptionDataPoint[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const hourlyData = generateHourlyData(date);
    const totalKwh = hourlyData.reduce((sum, d) => sum + d.value, 0);
    const totalCost = totalKwh * RATE_PER_KWH;
    
    dailyData.push({
      timestamp: date,
      label: day.toString(),
      value: parseFloat(totalKwh.toFixed(2)),
      cost: parseFloat(totalCost.toFixed(2)),
    });
  }
  
  return dailyData;
}

/**
 * Generate monthly data for a year
 */
export function generateMonthlyDataForYear(year: number): ConsumptionDataPoint[] {
  const monthlyData: ConsumptionDataPoint[] = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let month = 0; month < 12; month++) {
    const dailyData = generateDailyDataForMonth(year, month);
    const totalKwh = dailyData.reduce((sum, d) => sum + d.value, 0);
    const totalCost = totalKwh * RATE_PER_KWH;
    
    monthlyData.push({
      timestamp: new Date(year, month, 1),
      label: monthNames[month],
      value: parseFloat(totalKwh.toFixed(2)),
      cost: parseFloat(totalCost.toFixed(2)),
    });
  }
  
  return monthlyData;
}

/**
 * Generate appliance breakdown
 */
export function generateApplianceBreakdown(totalKwh: number): ApplianceConsumption[] {
  const breakdown: ApplianceConsumption[] = [];
  
  // Calculate daily consumption for each appliance
  const applianceConsumption = APPLIANCES.map(appliance => {
    const dailyKwh = (appliance.avgWatts * appliance.hoursPerDay) / 1000;
    return {
      ...appliance,
      dailyKwh: generateRealisticValue(dailyKwh, 0.15),
    };
  });
  
  const totalCalculated = applianceConsumption.reduce((sum, a) => sum + a.dailyKwh, 0);
  
  // Normalize to match actual total
  applianceConsumption.forEach(appliance => {
    const normalizedKwh = (appliance.dailyKwh / totalCalculated) * totalKwh;
    const cost = normalizedKwh * RATE_PER_KWH;
    const percentage = (normalizedKwh / totalKwh) * 100;
    
    breakdown.push({
      applianceId: appliance.id,
      name: appliance.name,
      icon: appliance.icon,
      totalKwh: parseFloat(normalizedKwh.toFixed(2)),
      totalCost: parseFloat(cost.toFixed(2)),
      percentage: parseFloat(percentage.toFixed(1)),
      averageHoursPerDay: appliance.hoursPerDay,
      estimatedMonthlyCost: parseFloat((cost * 30).toFixed(2)),
    });
  });
  
  // Sort by consumption (highest first)
  return breakdown.sort((a, b) => b.totalKwh - a.totalKwh);
}

/**
 * Generate today's daily report
 */
export function generateTodayReport(): DailyReport {
  const today = new Date();
  const hourlyData = generateHourlyData(today);
  
  const totalKwh = hourlyData.reduce((sum, d) => sum + d.value, 0);
  const totalCost = totalKwh * RATE_PER_KWH;
  const peakPower = Math.max(...hourlyData.map(d => d.value * 1000)); // Convert to watts
  const averagePower = (totalKwh / 24) * 1000; // Convert to watts
  
  return {
    date: today,
    totalKwh: parseFloat(totalKwh.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    peakPower: parseFloat(peakPower.toFixed(0)),
    averagePower: parseFloat(averagePower.toFixed(0)),
    hourlyData,
    applianceBreakdown: generateApplianceBreakdown(totalKwh),
  };
}

/**
 * Generate this week's report
 */
export function generateThisWeekReport(): WeeklyReport {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const dailyData = generateDailyDataForWeek(weekStart);
  const totalKwh = dailyData.reduce((sum, d) => sum + d.value, 0);
  const totalCost = totalKwh * RATE_PER_KWH;
  const averageDaily = totalKwh / 7;
  
  // Generate previous week data for comparison
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(weekStart.getDate() - 7);
  const prevWeekData = generateDailyDataForWeek(prevWeekStart);
  const prevWeekKwh = prevWeekData.reduce((sum, d) => sum + d.value, 0);
  const comparison = ((totalKwh - prevWeekKwh) / prevWeekKwh) * 100;
  
  return {
    weekStart,
    weekEnd,
    totalKwh: parseFloat(totalKwh.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    averageDaily: parseFloat(averageDaily.toFixed(2)),
    dailyData,
    applianceBreakdown: generateApplianceBreakdown(totalKwh),
    comparisonToPreviousWeek: parseFloat(comparison.toFixed(1)),
  };
}

/**
 * Generate this month's report
 */
export function generateThisMonthReport(): MonthlyReport {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dailyData = generateDailyDataForMonth(year, month);
  const totalKwh = dailyData.reduce((sum, d) => sum + d.value, 0);
  const totalCost = totalKwh * RATE_PER_KWH;
  const averageDaily = totalKwh / dailyData.length;
  
  // Generate weekly data (4 weeks)
  const weeklyData: ConsumptionDataPoint[] = [];
  for (let week = 0; week < 4; week++) {
    const weekStart = week * 7;
    const weekEnd = Math.min(weekStart + 7, dailyData.length);
    const weekData = dailyData.slice(weekStart, weekEnd);
    const weekKwh = weekData.reduce((sum, d) => sum + d.value, 0);
    
    weeklyData.push({
      timestamp: weekData[0].timestamp,
      label: `Week ${week + 1}`,
      value: parseFloat(weekKwh.toFixed(2)),
      cost: parseFloat((weekKwh * RATE_PER_KWH).toFixed(2)),
    });
  }
  
  // Previous month comparison
  const prevMonthData = generateDailyDataForMonth(year, month - 1);
  const prevMonthKwh = prevMonthData.reduce((sum, d) => sum + d.value, 0);
  const comparison = ((totalKwh - prevMonthKwh) / prevMonthKwh) * 100;
  
  // Project full month bill
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const projectedBill = (totalKwh / dailyData.length) * daysInMonth * RATE_PER_KWH;
  
  return {
    month: monthNames[month],
    year,
    totalKwh: parseFloat(totalKwh.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    averageDaily: parseFloat(averageDaily.toFixed(2)),
    dailyData,
    weeklyData,
    applianceBreakdown: generateApplianceBreakdown(totalKwh),
    comparisonToPreviousMonth: parseFloat(comparison.toFixed(1)),
    projectedBill: parseFloat(projectedBill.toFixed(2)),
  };
}

/**
 * Generate cost analysis
 */
export function generateCostAnalysis(currentKwh: number, previousKwh: number): CostAnalysis {
  const currentCost = currentKwh * RATE_PER_KWH;
  const previousCost = previousKwh * RATE_PER_KWH;
  const percentageChange = ((currentCost - previousCost) / previousCost) * 100;
  
  // Estimate next bill (assuming similar usage)
  const estimatedNextBill = currentCost * 1.05; // 5% buffer
  
  // Potential savings (if reducing peak hours usage by 20%)
  const savingsOpportunity = currentCost * 0.15;
  
  return {
    currentPeriodCost: parseFloat(currentCost.toFixed(2)),
    previousPeriodCost: parseFloat(previousCost.toFixed(2)),
    percentageChange: parseFloat(percentageChange.toFixed(1)),
    estimatedNextBill: parseFloat(estimatedNextBill.toFixed(2)),
    savingsOpportunity: parseFloat(savingsOpportunity.toFixed(2)),
    costByTimeOfDay: {
      morning: parseFloat((currentCost * 0.25).toFixed(2)),
      afternoon: parseFloat((currentCost * 0.20).toFixed(2)),
      evening: parseFloat((currentCost * 0.40).toFixed(2)),
      night: parseFloat((currentCost * 0.15).toFixed(2)),
    },
  };
}
