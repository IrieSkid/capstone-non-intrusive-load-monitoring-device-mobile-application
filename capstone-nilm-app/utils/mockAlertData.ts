/**
 * Mock Alert Data Generator
 * Generates realistic alerts for testing
 */

import { Alert, AlertType, AlertPriority } from '@/types/alert';

const ALERT_TEMPLATES: Record<AlertType, { title: string; message: string; priority: AlertPriority }[]> = {
  high_consumption: [
    {
      title: 'High Energy Consumption Detected',
      message: 'Your consumption today is 25% higher than usual. Current: 15.2 kWh',
      priority: 'high',
    },
    {
      title: 'Consumption Spike Alert',
      message: 'Unusual spike detected at 2:30 PM. Power usage reached 3.5 kW',
      priority: 'medium',
    },
  ],
  budget_exceeded: [
    {
      title: 'Monthly Budget Exceeded',
      message: 'You have exceeded your monthly budget of ₱2,000. Current: ₱2,150',
      priority: 'critical',
    },
    {
      title: 'Budget Warning',
      message: 'You are at 90% of your monthly budget (₱1,800 / ₱2,000)',
      priority: 'high',
    },
  ],
  unusual_pattern: [
    {
      title: 'Unusual Usage Pattern',
      message: 'High consumption detected at 3:00 AM. This is unusual for your typical usage.',
      priority: 'medium',
    },
    {
      title: 'Pattern Anomaly Detected',
      message: 'Your consumption pattern today differs significantly from your weekly average.',
      priority: 'low',
    },
  ],
  device_offline: [
    {
      title: 'Device Offline',
      message: 'Your monitoring device has been offline for 2 hours. Please check the connection.',
      priority: 'critical',
    },
    {
      title: 'Connection Lost',
      message: 'Lost connection to IoT device. Last reading: 1 hour ago.',
      priority: 'high',
    },
  ],
  appliance_always_on: [
    {
      title: 'Air Conditioner Always On',
      message: 'Your Air Conditioner has been running continuously for 12 hours.',
      priority: 'medium',
    },
    {
      title: 'Potential Energy Waste',
      message: 'TV has been on for 8+ hours. Consider turning it off to save energy.',
      priority: 'low',
    },
  ],
  peak_hours_usage: [
    {
      title: 'Peak Hours Usage Alert',
      message: 'High consumption during peak hours (6-10 PM). Consider shifting usage to save costs.',
      priority: 'medium',
    },
    {
      title: 'Peak Hours Reminder',
      message: 'You are using 4.2 kW during peak hours. Electricity rates are 30% higher now.',
      priority: 'low',
    },
  ],
};

/**
 * Generate random alerts
 */
export function generateMockAlerts(count: number = 10, userId: string = 'mock-user'): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();
  
  const alertTypes: AlertType[] = [
    'high_consumption',
    'budget_exceeded',
    'unusual_pattern',
    'device_offline',
    'appliance_always_on',
    'peak_hours_usage',
  ];

  for (let i = 0; i < count; i++) {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const templates = ALERT_TEMPLATES[type];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Generate timestamp (within last 7 days)
    const hoursAgo = Math.floor(Math.random() * 168); // 7 days in hours
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    
    // Random status
    const statusOptions: Alert['status'][] = ['active', 'acknowledged', 'resolved', 'dismissed'];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    const alert: Alert = {
      id: `alert-${i + 1}`,
      userId,
      type,
      priority: template.priority,
      status,
      title: template.title,
      message: template.message,
      timestamp,
      data: {
        consumption: type === 'high_consumption' ? 15.2 + Math.random() * 5 : undefined,
        threshold: type === 'high_consumption' ? 12.0 : undefined,
        cost: type === 'budget_exceeded' ? 2000 + Math.random() * 500 : undefined,
      },
    };

    // Add acknowledged/resolved timestamps if applicable
    if (status === 'acknowledged' || status === 'resolved') {
      alert.acknowledgedAt = new Date(timestamp.getTime() + 30 * 60 * 1000); // 30 min after
    }
    if (status === 'resolved') {
      alert.resolvedAt = new Date(timestamp.getTime() + 60 * 60 * 1000); // 1 hour after
    }

    alerts.push(alert);
  }

  // Sort by timestamp (newest first)
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Get alert icon emoji
 */
export function getAlertIcon(type: AlertType): string {
  const icons: Record<AlertType, string> = {
    high_consumption: '⚡',
    budget_exceeded: '💰',
    unusual_pattern: '📊',
    device_offline: '📡',
    appliance_always_on: '🔌',
    peak_hours_usage: '⏰',
  };
  return icons[type];
}

/**
 * Get alert color
 */
export function getAlertColor(priority: AlertPriority): string {
  const colors: Record<AlertPriority, string> = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#FF5722',
    critical: '#F44336',
  };
  return colors[priority];
}

/**
 * Get status color
 */
export function getStatusColor(status: Alert['status']): string {
  const colors: Record<Alert['status'], string> = {
    active: '#F44336',
    acknowledged: '#FF9800',
    resolved: '#4CAF50',
    dismissed: '#9E9E9E',
  };
  return colors[status];
}

/**
 * Get time ago string
 */
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
