/**
 * Seed Notifications In-App
 * Creates sample notifications directly from the React Native app
 */

import { notificationService } from '@/services/notificationService';

export async function seedNotificationsInApp(userId: string, deviceId: string) {
  console.log('🌱 Seeding notifications in app...');

  const now = new Date();
  const notifications = [
    // Recent unread alerts
    {
      title: 'High Energy Consumption Alert',
      message: 'Your daily energy consumption has exceeded 50 kWh. Current usage: 62.5 kWh.',
      type: 'alert' as const,
      priority: 'high' as const,
      isRead: false,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
    },
    {
      title: 'Monthly Budget Exceeded',
      message: 'Your electricity bill has exceeded ₱2,000 this month. Current cost: ₱2,450.',
      type: 'alert' as const,
      priority: 'critical' as const,
      isRead: false,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      title: 'Air Conditioner Running Continuously',
      message: 'Your air conditioner has been running for 12 hours straight. Consider turning it off.',
      type: 'alert' as const,
      priority: 'medium' as const,
      isRead: false,
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    },

    // Warnings
    {
      title: 'Unusual Consumption Pattern',
      message: 'Your energy usage is 30% higher than usual. Check for malfunctioning appliances.',
      type: 'warning' as const,
      priority: 'medium' as const,
      isRead: false,
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    {
      title: 'Peak Hours Usage',
      message: 'You are using high-power appliances during peak hours. Shift usage to save costs.',
      type: 'warning' as const,
      priority: 'low' as const,
      isRead: true,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      readAt: new Date(now.getTime() - 23 * 60 * 60 * 1000),
    },

    // Info
    {
      title: 'Daily Energy Report Ready',
      message: 'Your daily report is ready. Total: 45.2 kWh, Cost: ₱475.',
      type: 'info' as const,
      priority: 'low' as const,
      isRead: true,
      createdAt: new Date(now.getTime() - 18 * 60 * 60 * 1000), // 18 hours ago
      readAt: new Date(now.getTime() - 17 * 60 * 60 * 1000),
    },
    {
      title: 'Weekly Savings Achievement',
      message: 'Great job! You saved 15% on energy costs this week. Keep it up!',
      type: 'info' as const,
      priority: 'low' as const,
      isRead: true,
      createdAt: new Date(now.getTime() - 72 * 60 * 60 * 1000), // 3 days ago
      readAt: new Date(now.getTime() - 71 * 60 * 60 * 1000),
    },

    // Error
    {
      title: 'Device Connection Lost',
      message: 'Your energy monitor has been offline for 15 minutes. Check WiFi connection.',
      type: 'error' as const,
      priority: 'high' as const,
      isRead: false,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
  ];

  let created = 0;
  for (const notif of notifications) {
    try {
      await notificationService.createNotification({
        userId,
        deviceId,
        ...notif,
        expiresAt: notif.type === 'alert' ? new Date(notif.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined,
      });
      created++;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  console.log(`✅ Created ${created} notifications!`);
  return created;
}
