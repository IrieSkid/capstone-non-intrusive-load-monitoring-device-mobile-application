/**
 * Alert Rule Service
 * Manages user-configurable alert rules/thresholds
 * Based on schema: alertRules collection
 */

import { firestore } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc,
  getDoc,
  getDocs, 
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';

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
  private collectionName = 'alertRules';

  /**
   * Create a new alert rule
   */
  async createRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertRule> {
    try {
      const ruleRef = doc(collection(firestore, this.collectionName));
      const now = new Date();

      const newRule: AlertRule = {
        ...rule,
        id: ruleRef.id,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(ruleRef, {
        ...newRule,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      });

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
      const q = query(
        collection(firestore, this.collectionName),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as AlertRule;
      });
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
      const q = query(
        collection(firestore, this.collectionName),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as AlertRule;
      });
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
      const ruleRef = doc(firestore, this.collectionName, ruleId);
      const snapshot = await getDoc(ruleRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data();
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as AlertRule;
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
      const ruleRef = doc(firestore, this.collectionName, ruleId);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Remove fields that shouldn't be updated
      delete updateData.id;
      delete updateData.userId;
      delete updateData.createdAt;

      await updateDoc(ruleRef, updateData);
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
      const ruleRef = doc(firestore, this.collectionName, ruleId);
      await deleteDoc(ruleRef);
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
