/**
 * Firestore Alert Service
 * Manages alerts in Firestore (replaces mock data)
 */

import { firestore } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc,
  getDoc,
  getDocs, 
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { Alert, AlertThreshold, AlertConfiguration } from '@/types/alert';

class FirestoreAlertService {
  private alertsCollection = 'alerts';
  private configCollection = 'alertConfigurations';

  /**
   * Create a new alert
   */
  async createAlert(alert: Omit<Alert, 'id'>): Promise<Alert> {
    try {
      const alertRef = doc(collection(firestore, this.alertsCollection));
      
      const newAlert: Alert = {
        ...alert,
        id: alertRef.id,
      };

      await setDoc(alertRef, {
        ...newAlert,
        timestamp: Timestamp.fromDate(alert.timestamp),
        acknowledgedAt: alert.acknowledgedAt ? Timestamp.fromDate(alert.acknowledgedAt) : null,
        resolvedAt: alert.resolvedAt ? Timestamp.fromDate(alert.resolvedAt) : null,
      });

      return newAlert;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  /**
   * Get all alerts for user
   */
  async getAlerts(userId: string, limitCount: number = 50): Promise<Alert[]> {
    try {
      const q = query(
        collection(firestore, this.alertsCollection),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp: data.timestamp?.toDate() || new Date(),
          acknowledgedAt: data.acknowledgedAt?.toDate(),
          resolvedAt: data.resolvedAt?.toDate(),
        } as Alert;
      });
    } catch (error) {
      console.error('Error getting alerts:', error);
      throw error;
    }
  }

  /**
   * Get unread alert count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(firestore, this.alertsCollection),
        where('userId', '==', userId),
        where('status', '==', 'active')
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Acknowledge alert
   */
  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      const alertRef = doc(firestore, this.alertsCollection, alertId);
      await updateDoc(alertRef, {
        status: 'acknowledged',
        acknowledgedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  /**
   * Dismiss alert
   */
  async dismissAlert(alertId: string): Promise<void> {
    try {
      const alertRef = doc(firestore, this.alertsCollection, alertId);
      await updateDoc(alertRef, {
        status: 'dismissed',
      });
    } catch (error) {
      console.error('Error dismissing alert:', error);
      throw error;
    }
  }

  /**
   * Resolve alert
   */
  async resolveAlert(alertId: string): Promise<void> {
    try {
      const alertRef = doc(firestore, this.alertsCollection, alertId);
      await updateDoc(alertRef, {
        status: 'resolved',
        resolvedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  }

  /**
   * Get alert configuration
   */
  async getConfiguration(userId: string): Promise<AlertConfiguration | null> {
    try {
      const configRef = doc(firestore, this.configCollection, userId);
      const snapshot = await getDoc(configRef);

      if (!snapshot.exists()) {
        // Create default configuration
        return this.createDefaultConfiguration(userId);
      }

      const data = snapshot.data();
      return {
        ...data,
        thresholds: data.thresholds.map((t: any) => ({
          ...t,
          createdAt: t.createdAt?.toDate() || new Date(),
          updatedAt: t.updatedAt?.toDate() || new Date(),
        })),
      } as AlertConfiguration;
    } catch (error) {
      console.error('Error getting configuration:', error);
      return null;
    }
  }

  /**
   * Create default configuration
   */
  private async createDefaultConfiguration(userId: string): Promise<AlertConfiguration> {
    const defaultConfig: AlertConfiguration = {
      userId,
      enablePushNotifications: true,
      enableEmailNotifications: false,
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
      thresholds: [
        {
          id: 'threshold-high-consumption',
          userId,
          type: 'high_consumption',
          enabled: true,
          threshold: 50,
          unit: 'kWh',
          period: 'daily',
          notifyPush: true,
          notifyEmail: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'threshold-budget',
          userId,
          type: 'budget_exceeded',
          enabled: true,
          threshold: 2000,
          unit: 'PHP',
          period: 'monthly',
          notifyPush: true,
          notifyEmail: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    await this.updateConfiguration(defaultConfig);
    return defaultConfig;
  }

  /**
   * Update alert configuration
   */
  async updateConfiguration(config: AlertConfiguration): Promise<void> {
    try {
      const configRef = doc(firestore, this.configCollection, config.userId);
      
      await setDoc(configRef, {
        ...config,
        thresholds: config.thresholds.map(t => ({
          ...t,
          createdAt: Timestamp.fromDate(t.createdAt),
          updatedAt: Timestamp.fromDate(t.updatedAt),
        })),
      });
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw error;
    }
  }
}

export const firestoreAlertService = new FirestoreAlertService();
