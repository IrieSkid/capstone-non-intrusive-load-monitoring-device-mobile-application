/**
 * Alert Types
 * TypeScript interfaces for alerts and notifications
 */

export type AlertType = 
  | 'high_consumption'
  | 'budget_exceeded'
  | 'unusual_pattern'
  | 'device_offline'
  | 'appliance_always_on'
  | 'peak_hours_usage';

export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';

export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  title: string;
  message: string;
  timestamp: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  data?: {
    deviceId?: string;
    applianceId?: string;
    consumption?: number;
    threshold?: number;
    cost?: number;
    [key: string]: any;
  };
}

export interface AlertThreshold {
  id: string;
  userId: string;
  type: AlertType;
  enabled: boolean;
  threshold: number;
  unit: 'kWh' | 'PHP' | 'watts' | 'hours';
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  notifyPush: boolean;
  notifyEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertConfiguration {
  userId: string;
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string; // HH:MM format
  thresholds: AlertThreshold[];
}

export interface NotificationPreferences {
  highConsumption: boolean;
  budgetExceeded: boolean;
  unusualPattern: boolean;
  deviceOffline: boolean;
  applianceAlwaysOn: boolean;
  peakHoursUsage: boolean;
  dailySummary: boolean;
  weeklySummary: boolean;
}
