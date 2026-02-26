/**
 * Notification Service
 * Manages notifications (actual notification instances sent to users)
 *
 * NOTE: This is an in-memory implementation that replaces the previous
 * Firestore-based version so the app can run without Firebase. Notifications
 * are NOT persisted across app restarts. For production, store them in MySQL
 * or a dedicated backend service.
 */


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
  // In-memory storage for notifications keyed by notification ID
  private notifications: Map<string, Notification> = new Map();

  /**
   * Create a new notification
   */
  async createNotification(
    notification: Omit<Notification, 'id' | 'createdAt'> & { createdAt?: Date }
  ): Promise<Notification> {
    try {
      const now = new Date();
      const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      
      const newNotification: Notification = {
        ...notification,
        id,
        createdAt: notification.createdAt || now,
      };

      this.notifications.set(id, newNotification);

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
      return Array.from(this.notifications.values())
        .filter(n => n.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limitCount);
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
      return Array.from(this.notifications.values()).filter(
        n => n.userId === userId && !n.isRead
      ).length;
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
      const existing = this.notifications.get(notificationId);
      if (!existing) return;

      this.notifications.set(notificationId, {
        ...existing,
        isRead: true,
        readAt: new Date(),
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
      const now = new Date();
      this.notifications.forEach((n, id) => {
        if (n.userId === userId && !n.isRead) {
          this.notifications.set(id, {
            ...n,
            isRead: true,
            readAt: now,
          });
        }
      });
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
      this.notifications.delete(notificationId);
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
      return Array.from(this.notifications.values())
        .filter(n => n.userId === userId && n.type === type)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error getting notifications by type:', error);
      return [];
    }
  }
}

export const notificationService = new NotificationService();
