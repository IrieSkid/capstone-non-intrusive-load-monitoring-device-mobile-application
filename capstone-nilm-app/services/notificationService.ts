/**
 * Notification Service
 * Manages notifications (actual notification instances sent to users)
 * Based on schema: notifications collection
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

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  readAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  // Optional metadata
  deviceId?: string;
  applianceId?: string;
  ruleId?: string; // Reference to alertRule that triggered this
}

class NotificationService {
  private collectionName = 'notifications';

  /**
   * Create a new notification
   */
  async createNotification(notification: Omit<Notification, 'id'>): Promise<Notification> {
    try {
      const notificationRef = doc(collection(firestore, this.collectionName));
      
      const newNotification: Notification = {
        ...notification,
        id: notificationRef.id,
      };

      await setDoc(notificationRef, {
        ...newNotification,
        createdAt: Timestamp.fromDate(notification.createdAt),
        readAt: notification.readAt ? Timestamp.fromDate(notification.readAt) : null,
        expiresAt: notification.expiresAt ? Timestamp.fromDate(notification.expiresAt) : null,
      });

      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get all notifications for user
   */
  async getNotifications(userId: string, limitCount: number = 50): Promise<Notification[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          readAt: data.readAt?.toDate(),
          expiresAt: data.expiresAt?.toDate(),
        } as Notification;
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('userId', '==', userId),
        where('isRead', '==', false)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(firestore, this.collectionName, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('userId', '==', userId),
        where('isRead', '==', false)
      );

      const snapshot = await getDocs(q);
      const updates = snapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          isRead: true,
          readAt: Timestamp.fromDate(new Date()),
        })
      );

      await Promise.all(updates);
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(firestore, this.collectionName, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Get notifications by type
   */
  async getNotificationsByType(
    userId: string, 
    type: 'alert' | 'info' | 'warning' | 'error'
  ): Promise<Notification[]> {
    try {
      const q = query(
        collection(firestore, this.collectionName),
        where('userId', '==', userId),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          readAt: data.readAt?.toDate(),
          expiresAt: data.expiresAt?.toDate(),
        } as Notification;
      });
    } catch (error) {
      console.error('Error getting notifications by type:', error);
      return [];
    }
  }
}

export const notificationService = new NotificationService();
