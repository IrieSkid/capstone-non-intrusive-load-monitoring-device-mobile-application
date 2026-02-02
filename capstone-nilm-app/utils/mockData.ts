/**
 * Mock Data Generators
 * Generates realistic mock data for testing without hardware
 */

import { RealTimeReading, ConsumptionSummary, ElectricityRate } from '@/types/readings.types';
import { Device } from '@/types/device.types';

/**
 * Generate a mock real-time reading
 */
export const generateMockReading = (deviceId: string, applianceId?: string): RealTimeReading => {
  // Simulate typical household electrical values
  const voltageRms = 220 + (Math.random() - 0.5) * 10; // 215-225V
  const currentRms = 2 + Math.random() * 8; // 2-10A
  const powerWatts = voltageRms * currentRms * (0.85 + Math.random() * 0.1); // PF 0.85-0.95
  const powerFactor = 0.85 + Math.random() * 0.1;
  const frequency = 60 + (Math.random() - 0.5) * 0.2; // 59.9-60.1 Hz

  return {
    id: `reading_${Date.now()}_${Math.random()}`,
    deviceId,
    applianceId,
    voltageRms: Number(voltageRms.toFixed(2)),
    currentRms: Number(currentRms.toFixed(2)),
    powerWatts: Number(powerWatts.toFixed(2)),
    energyKwh: Number((powerWatts / 1000).toFixed(4)),
    powerFactor: Number(powerFactor.toFixed(3)),
    frequency: Number(frequency.toFixed(2)),
    recordedAt: new Date(),
  };
};

/**
 * Generate mock device
 */
export const generateMockDevice = (userId: string, name: string = 'Smart Meter 001'): Device => {
  return {
    id: `device_${Date.now()}`,
    userId,
    deviceName: name,
    macAddress: generateMockMacAddress(),
    ipAddress: `192.168.1.${Math.floor(Math.random() * 200 + 10)}`,
    status: 'active',
    location: 'Living Room',
    registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    lastSeenAt: new Date(),
    firmwareVersion: '1.0.2',
    isActive: true,
  };
};

/**
 * Generate mock MAC address
 */
const generateMockMacAddress = (): string => {
  const hexDigits = '0123456789ABCDEF';
  const segments = [];
  for (let i = 0; i < 6; i++) {
    const segment =
      hexDigits[Math.floor(Math.random() * 16)] + hexDigits[Math.floor(Math.random() * 16)];
    segments.push(segment);
  }
  return segments.join(':');
};

/**
 * Generate mock electricity rate
 */
export const generateMockElectricityRate = (): ElectricityRate => {
  return {
    id: 'rate_2026_standard',
    name: 'Standard Residential Rate 2026',
    pesoPerKwh: 11.5,
    effectiveFrom: new Date('2026-01-01'),
    effectiveTo: undefined,
    isActive: true,
    description: 'Standard residential electricity rate for Metro Manila',
    createdAt: new Date('2026-01-01'),
  };
};

/**
 * Generate daily consumption data for charts (last 7 days)
 */
export const generateDailyConsumptionData = () => {
  const data = [];
  const today = new Date();
  const rate = 11.5; // PHP per kWh

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate varying daily consumption (15-35 kWh)
    const kwh = 15 + Math.random() * 20;
    const cost = kwh * rate;

    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: date,
      kwh: Number(kwh.toFixed(2)),
      cost: Number(cost.toFixed(2)),
    });
  }

  return data;
};

/**
 * Generate hourly consumption data for today (24 hours)
 */
export const generateHourlyConsumptionData = () => {
  const data = [];
  const today = new Date();
  const currentHour = today.getHours();

  for (let hour = 0; hour <= currentHour; hour++) {
    // Simulate varying hourly consumption (0.5-3 kWh)
    // Higher consumption during morning (6-9) and evening (18-22)
    let baseConsumption = 0.8;
    if (hour >= 6 && hour <= 9) baseConsumption = 2.5; // Morning peak
    if (hour >= 18 && hour <= 22) baseConsumption = 3.0; // Evening peak
    if (hour >= 0 && hour <= 5) baseConsumption = 0.5; // Night low

    const kwh = baseConsumption + (Math.random() - 0.5) * 0.5;

    data.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      kwh: Number(kwh.toFixed(2)),
    });
  }

  return data;
};

/**
 * Generate mock appliance consumption breakdown
 */
export const generateApplianceBreakdown = () => {
  return [
    { name: 'Air Conditioner', kwh: 45.2, percentage: 35, color: '#FF6B6B' },
    { name: 'Refrigerator', kwh: 32.8, percentage: 25, color: '#4ECDC4' },
    { name: 'Water Heater', kwh: 19.7, percentage: 15, color: '#FFE66D' },
    { name: 'Washing Machine', kwh: 13.1, percentage: 10, color: '#95E1D3' },
    { name: 'TV & Electronics', kwh: 10.5, percentage: 8, color: '#A8E6CF' },
    { name: 'Lights', kwh: 9.2, percentage: 7, color: '#C7CEEA' },
  ];
};

/**
 * Calculate today's statistics
 */
export const calculateTodayStats = () => {
  const hourlyData = generateHourlyConsumptionData();
  const totalKwh = hourlyData.reduce((sum, item) => sum + item.kwh, 0);
  const rate = 11.5;
  const totalCost = totalKwh * rate;

  // Calculate average power (assuming current hour consumption)
  const currentHourKwh = hourlyData[hourlyData.length - 1]?.kwh || 0;
  const averagePowerW = (currentHourKwh * 1000) / 1; // Watts

  return {
    totalKwh: Number(totalKwh.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    averagePowerW: Number(averagePowerW.toFixed(0)),
    currentHour: new Date().getHours(),
  };
};

/**
 * Calculate monthly statistics
 */
export const calculateMonthlyStats = () => {
  const today = new Date();
  const dayOfMonth = today.getDate();

  // Simulate monthly consumption so far
  const avgDailyKwh = 25;
  const totalKwh = avgDailyKwh * dayOfMonth + (Math.random() - 0.5) * 50;
  const rate = 11.5;
  const totalCost = totalKwh * rate;

  // Projected end-of-month
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const projectedKwh = (totalKwh / dayOfMonth) * daysInMonth;
  const projectedCost = projectedKwh * rate;

  return {
    totalKwh: Number(totalKwh.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    projectedKwh: Number(projectedKwh.toFixed(2)),
    projectedCost: Number(projectedCost.toFixed(2)),
    daysElapsed: dayOfMonth,
    daysInMonth,
  };
};

/**
 * Get comparison with previous period
 */
export const getComparisonStats = () => {
  const currentKwh = 25.3;
  const previousKwh = 28.1;
  const change = ((currentKwh - previousKwh) / previousKwh) * 100;

  return {
    currentKwh,
    previousKwh,
    change: Number(change.toFixed(1)),
    isIncrease: change > 0,
  };
};
