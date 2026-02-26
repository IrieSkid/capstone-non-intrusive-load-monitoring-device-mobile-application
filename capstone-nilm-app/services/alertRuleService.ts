/**
 * Alert Rule Service
 * Manages user-configurable alert rules/thresholds (in-memory implementation)
 *
 * NOTE: This implementation keeps alert rules in memory only and does NOT persist
 * them to MySQL yet. It replaces the previous Firestore-based version so the
 * app can run without Firebase. For production, a proper MySQL table should be
 * used instead.
 */

export interface AlertRule {
  id: string;
  userId: string;
  applianceId?: string; // Optional - specific appliance
  deviceId?: string; // Optional - specific device
  alertType: 'power_threshold' | 'consumption_limit' | 'device_offline' | 'budget_exceeded' | 'unusual_pattern';
  thresholdValue: number;
  condition: '>' | '<' | '>=' | '<=';
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Optional
  notifyPush?: boolean;
  notifyEmail?: boolean;
  description?: string;
}

class AlertRuleService {
  // In-memory storage for rules keyed by rule ID
  private rules: Map<string, AlertRule> = new Map();

  /**
   * Create a new alert rule
   */
  async createRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertRule> {
    try {
      const now = new Date();

      const id = `rule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const newRule: AlertRule = {
        ...rule,
        id,
        createdAt: now,
        updatedAt: now,
      };

      this.rules.set(newRule.id, newRule);

      return newRule;
    } catch (error) {
      console.error('Error creating rule:', error);
      throw error;
    }
  }

  /**
   * Get all rules for user
   */
  async getUserRules(userId: string): Promise<AlertRule[]> {
    try {
      return Array.from(this.rules.values()).filter(rule => rule.userId === userId);
    } catch (error) {
      console.error('Error getting user rules:', error);
      return [];
    }
  }

  /**
   * Get active rules for user
   */
  async getActiveRules(userId: string): Promise<AlertRule[]> {
    try {
      return Array.from(this.rules.values()).filter(
        rule => rule.userId === userId && rule.isActive
      );
    } catch (error) {
      console.error('Error getting active rules:', error);
      return [];
    }
  }

  /**
   * Get rule by ID
   */
  async getRule(ruleId: string): Promise<AlertRule | null> {
    try {
      return this.rules.get(ruleId) || null;
    } catch (error) {
      console.error('Error getting rule:', error);
      return null;
    }
  }

  /**
   * Update alert rule
   */
  async updateRule(ruleId: string, updates: Partial<AlertRule>): Promise<void> {
    try {
      const existing = this.rules.get(ruleId);
      if (!existing) return;

      const updated: AlertRule = {
        ...existing,
        ...updates,
        id: existing.id,
        userId: existing.userId,
        createdAt: existing.createdAt,
        updatedAt: new Date(),
      };

      this.rules.set(ruleId, updated);
    } catch (error) {
      console.error('Error updating rule:', error);
      throw error;
    }
  }

  /**
   * Toggle rule active status
   */
  async toggleRule(ruleId: string, isActive: boolean): Promise<void> {
    try {
      await this.updateRule(ruleId, { isActive });
    } catch (error) {
      console.error('Error toggling rule:', error);
      throw error;
    }
  }

  /**
   * Delete alert rule
   */
  async deleteRule(ruleId: string): Promise<void> {
    try {
      this.rules.delete(ruleId);
    } catch (error) {
      console.error('Error deleting rule:', error);
      throw error;
    }
  }

  /**
   * Create default rules for user
   */
  async createDefaultRules(userId: string, deviceId: string): Promise<AlertRule[]> {
    const defaultRules = [
      {
        userId,
        deviceId,
        alertType: 'consumption_limit' as const,
        thresholdValue: 50,
        condition: '>' as const,
        severity: 'high' as const,
        isActive: true,
        notifyPush: true,
        description: 'Alert when daily consumption exceeds 50 kWh',
      },
      {
        userId,
        deviceId,
        alertType: 'budget_exceeded' as const,
        thresholdValue: 2000,
        condition: '>' as const,
        severity: 'high' as const,
        isActive: true,
        notifyPush: true,
        description: 'Alert when monthly cost exceeds ₱2000',
      },
      {
        userId,
        deviceId,
        alertType: 'device_offline' as const,
        thresholdValue: 15,
        condition: '>' as const,
        severity: 'medium' as const,
        isActive: true,
        notifyPush: true,
        description: 'Alert when device is offline for 15 minutes',
      },
    ];

    const createdRules: AlertRule[] = [];

    for (const ruleData of defaultRules) {
      const rule = await this.createRule(ruleData);
      createdRules.push(rule);
    }

    return createdRules;
  }
}

export const alertRuleService = new AlertRuleService();
