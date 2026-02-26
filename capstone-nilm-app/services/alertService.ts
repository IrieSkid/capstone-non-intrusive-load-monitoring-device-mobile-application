/**
 * Alert Service (client)
 * Calls the Node/Express backend API which talks to MySQL.
 */

import { apiFetch } from '@/config/api';
import { Alert, AlertConfiguration } from '@/types/alert';

class AlertService {
  async getAlerts(userId: string): Promise<Alert[]> {
    try {
      const resp = await apiFetch<{ alerts: any[] }>(`/users/${userId}/alerts`, { method: 'GET' });
      return (resp.alerts || []).map((row) => this.mapAlertFromDb(row));
    } catch (error) {
      console.error('Error getting alerts:', error);
      return [];
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    const alerts = await this.getAlerts(userId);
    return alerts.filter((a) => a.status === 'active').length;
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    await apiFetch(`/alerts/${alertId}/acknowledge`, { method: 'POST' });
  }

  async dismissAlert(alertId: string): Promise<void> {
    await apiFetch(`/alerts/${alertId}/dismiss`, { method: 'POST' });
  }

  async resolveAlert(alertId: string): Promise<void> {
    await apiFetch(`/alerts/${alertId}/resolve`, { method: 'POST' });
  }

  async getConfiguration(userId: string): Promise<AlertConfiguration> {
    // Placeholder defaults (server-side config can be added later)
    return {
      userId,
      enablePushNotifications: true,
      enableEmailNotifications: false,
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
      thresholds: [],
    };
  }

  async updateConfiguration(_config: Partial<AlertConfiguration>): Promise<void> {
    // Not implemented yet.
  }

  private mapAlertFromDb(row: any): Alert {
    const dbType = (row.alert_type || '').toString();
    const type = this.mapAlertType(dbType);
    return {
      id: row.alert_id?.toString() ?? row.id?.toString(),
      userId: '', // could be joined via rooms
      type,
      priority: this.getPriority(dbType),
      status: row.alert_status === 'new' ? 'active' : 'resolved',
      title: this.getTitle(dbType),
      message: row.alert_message || '',
      timestamp: row.created_at ? new Date(row.created_at) : new Date(),
    };
  }

  private mapAlertType(dbType: string): Alert['type'] {
    const map: Record<string, Alert['type']> = {
      HIGH_POWER: 'high_consumption',
      HIGH_THD: 'unusual_pattern',
      HIGH_CONSUMPTION: 'high_consumption',
      BUDGET_EXCEEDED: 'budget_exceeded',
    };
    return map[dbType] || 'unusual_pattern';
  }

  private getTitle(dbType: string): string {
    const titles: Record<string, string> = {
      HIGH_POWER: 'High Power Consumption',
      HIGH_THD: 'High Harmonic Distortion',
      HIGH_CONSUMPTION: 'High Energy Consumption',
      BUDGET_EXCEEDED: 'Budget Exceeded',
    };
    return titles[dbType] || 'Alert';
  }

  private getPriority(dbType: string): Alert['priority'] {
    const priorities: Record<string, Alert['priority']> = {
      HIGH_POWER: 'high',
      HIGH_THD: 'medium',
      HIGH_CONSUMPTION: 'high',
      BUDGET_EXCEEDED: 'critical',
    };
    return priorities[dbType] || 'medium';
  }
}

export const alertService = new AlertService();

