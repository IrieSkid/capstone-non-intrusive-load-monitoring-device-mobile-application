/**
 * Alert Monitoring Service
 * Monitors real-time data and triggers notifications based on alert rules
 */

import { alertRuleService, AlertRule } from './alertRuleService';
import { notificationService } from './notificationService';
import { RealtimeReading } from './realtimeDataService';

interface MonitoringState {
  dailyConsumption: number; // kWh
  peakPower: number; // Watts
  lastResetTime: Date;
  consecutiveHighPowerMinutes: number;
}

class AlertMonitoringService {
  private monitoringState: MonitoringState = {
    dailyConsumption: 0,
    peakPower: 0,
    lastResetTime: new Date(),
    consecutiveHighPowerMinutes: 0,
  };

  private userId: string | null = null;
  private deviceId: string | null = null;
  private activeRules: AlertRule[] = [];
  private lastCheckTime: Date = new Date();

  /**
   * Initialize monitoring for user
   */
  async initialize(userId: string, deviceId: string): Promise<void> {
    this.userId = userId;
    this.deviceId = deviceId;

    // Load active alert rules
    await this.loadAlertRules();

    // Reset daily stats if new day
    this.checkDailyReset();

    console.log('✅ Alert monitoring initialized', this.activeRules.length, 'active rules');
  }

  /**
   * Load alert rules from Firestore
   */
  private async loadAlertRules(): Promise<void> {
    if (!this.userId) return;

    try {
      this.activeRules = await alertRuleService.getActiveRules(this.userId);
    } catch (error) {
      console.error('Failed to load alert rules:', error);
      this.activeRules = [];
    }
  }

  /**
   * Check if we need to reset daily stats
   */
  private checkDailyReset(): void {
    const now = new Date();
    const lastReset = this.monitoringState.lastResetTime;

    // Reset if different day
    if (
      now.getDate() !== lastReset.getDate() ||
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear()
    ) {
      this.monitoringState.dailyConsumption = 0;
      this.monitoringState.peakPower = 0;
      this.monitoringState.lastResetTime = now;
      console.log('📅 Daily stats reset');
    }
  }

  /**
   * Process real-time reading and check alert rules
   */
  async processReading(reading: RealtimeReading): Promise<void> {
    if (!this.userId || !this.deviceId) return;

    // Check daily reset
    this.checkDailyReset();

    // Update monitoring state
    this.updateState(reading);

    // Check all active rules
    await this.checkAlertRules(reading);

    this.lastCheckTime = new Date();
  }

  /**
   * Update monitoring state
   */
  private updateState(reading: RealtimeReading): void {
    // Update daily consumption (energy is cumulative kWh)
    this.monitoringState.dailyConsumption = reading.energy;

    // Track peak power
    if (reading.power > this.monitoringState.peakPower) {
      this.monitoringState.peakPower = reading.power;
    }

    // Track consecutive high power (>2000W)
    if (reading.power > 2000) {
      this.monitoringState.consecutiveHighPowerMinutes += 0.05; // 3 seconds = 0.05 minutes
    } else {
      this.monitoringState.consecutiveHighPowerMinutes = 0;
    }
  }

  /**
   * Check all alert rules against current reading
   */
  private async checkAlertRules(reading: RealtimeReading): Promise<void> {
    for (const rule of this.activeRules) {
      try {
        const shouldTrigger = await this.evaluateRule(rule, reading);
        
        if (shouldTrigger) {
          await this.triggerAlert(rule, reading);
        }
      } catch (error) {
        console.error('Error checking rule:', rule.id, error);
      }
    }
  }

  /**
   * Evaluate if a rule should trigger
   */
  private async evaluateRule(rule: AlertRule, reading: RealtimeReading): Promise<boolean> {
    let currentValue = 0;
    let shouldTrigger = false;

    switch (rule.alertType) {
      case 'power_threshold':
        // Check if current power exceeds threshold
        currentValue = reading.power;
        shouldTrigger = this.checkCondition(currentValue, rule.condition, rule.thresholdValue);
        break;

      case 'consumption_limit':
        // Check if daily consumption exceeds limit (kWh)
        currentValue = this.monitoringState.dailyConsumption;
        shouldTrigger = this.checkCondition(currentValue, rule.condition, rule.thresholdValue);
        break;

      case 'budget_exceeded':
        // Calculate estimated cost (₱12 per kWh average)
        const costPerKwh = 12;
        currentValue = this.monitoringState.dailyConsumption * costPerKwh;
        shouldTrigger = this.checkCondition(currentValue, rule.condition, rule.thresholdValue);
        break;

      case 'unusual_pattern':
        // Trigger if consecutive high power for too long
        if (this.monitoringState.consecutiveHighPowerMinutes > rule.thresholdValue) {
          shouldTrigger = true;
        }
        break;

      case 'device_offline':
        // Handle in device connection monitoring (not here)
        break;
    }

    return shouldTrigger;
  }

  /**
   * Check condition (>, <, >=, <=)
   */
  private checkCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case '>':
        return value > threshold;
      case '<':
        return value < threshold;
      case '>=':
        return value >= threshold;
      case '<=':
        return value <= threshold;
      default:
        return false;
    }
  }

  /**
   * Trigger alert and create notification
   */
  private async triggerAlert(rule: AlertRule, reading: RealtimeReading): Promise<void> {
    if (!this.userId) return;

    // Check if we already sent this alert recently (throttle to once per hour)
    const lastNotificationKey = `alert_${rule.id}_last`;
    const lastNotificationTime = this.getLastNotificationTime(lastNotificationKey);
    const now = new Date();

    if (lastNotificationTime && (now.getTime() - lastNotificationTime.getTime()) < 3600000) {
      // Less than 1 hour since last notification
      return;
    }

    // Create notification
    try {
      let title = '';
      let message = '';

      switch (rule.alertType) {
        case 'power_threshold':
          title = '⚡ High Power Usage Alert';
          message = `Current power consumption (${reading.power.toFixed(0)}W) exceeds your threshold of ${rule.thresholdValue}W`;
          break;

        case 'consumption_limit':
          title = '📊 Daily Consumption Alert';
          message = `Daily consumption (${this.monitoringState.dailyConsumption.toFixed(2)} kWh) has exceeded your limit of ${rule.thresholdValue} kWh`;
          break;

        case 'budget_exceeded':
          const cost = this.monitoringState.dailyConsumption * 12;
          title = '💰 Budget Alert';
          message = `Estimated daily cost (₱${cost.toFixed(2)}) has exceeded your budget of ₱${rule.thresholdValue}`;
          break;

        case 'unusual_pattern':
          title = '⚠️ Unusual Pattern Detected';
          message = `High power consumption detected for ${this.monitoringState.consecutiveHighPowerMinutes.toFixed(0)} minutes`;
          break;

        default:
          return;
      }

      if (rule.description) {
        message += `\n\n${rule.description}`;
      }

      await notificationService.createNotification({
        userId: this.userId,
        type: 'alert',
        priority: rule.severity === 'critical' ? 'critical' : rule.severity === 'high' ? 'high' : 'low',
        title,
        message,
        isRead: false,
        ruleId: rule.id,
        deviceId: this.deviceId || undefined,
      });

      // Update last notification time
      this.setLastNotificationTime(lastNotificationKey, now);

      console.log('🚨 Alert triggered:', title);
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }

  /**
   * Get last notification time (in-memory for now)
   */
  private lastNotificationTimes: Map<string, Date> = new Map();

  private getLastNotificationTime(key: string): Date | null {
    return this.lastNotificationTimes.get(key) || null;
  }

  private setLastNotificationTime(key: string, time: Date): void {
    this.lastNotificationTimes.set(key, time);
  }

  /**
   * Get current monitoring state (for debugging/display)
   */
  getState(): MonitoringState {
    return { ...this.monitoringState };
  }

  /**
   * Reload alert rules (call when user updates rules)
   */
  async reloadRules(): Promise<void> {
    await this.loadAlertRules();
    console.log('🔄 Alert rules reloaded:', this.activeRules.length);
  }
}

export const alertMonitoringService = new AlertMonitoringService();
