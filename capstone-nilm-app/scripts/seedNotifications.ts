/**
 * Seed Notifications Script
 * Creates sample notifications in Firestore for testing
 * 
 * Usage: npx ts-node -r tsconfig-paths/register scripts/seedNotifications.ts <userId> <deviceId>
 */

import { notificationService } from '../services/notificationService';

// Sample notification data with various types and priorities
const sampleNotifications = [
  // High Priority Alerts
  {
    title: 'High Energy Consumption Alert',
    message: 'Your daily energy consumption has exceeded 50 kWh. Current usage: 62.5 kWh. Consider reducing usage during peak hours.',
    type: 'alert' as const,
    priority: 'high' as const,
    isRead: false,
    hoursAgo: 0.5, // 30 minutes ago
  },
  {
    title: 'Monthly Budget Exceeded',
    message: 'Your electricity bill has exceeded ₱2,000 this month. Current cost: ₱2,450. Review your consumption patterns.',
    type: 'alert' as const,
    priority: 'critical' as const,
    isRead: false,
    hoursAgo: 2,
  },
  {
    title: 'Air Conditioner Running Continuously',
    message: 'Your air conditioner has been running for 12 hours straight. Consider turning it off when not needed to save energy.',
    type: 'alert' as const,
    priority: 'medium' as const,
    isRead: false,
    hoursAgo: 4,
  },
  
  // Medium Priority Warnings
  {
    title: 'Unusual Consumption Pattern Detected',
    message: 'Your energy usage is 30% higher than usual for this time of day. Check if any appliances are malfunctioning.',
    type: 'warning' as const,
    priority: 'medium' as const,
    isRead: false,
    hoursAgo: 6,
  },
  {
    title: 'Peak Hours Usage',
    message: 'You are using high-power appliances during peak hours (6-10 PM). Consider shifting usage to off-peak hours to save on costs.',
    type: 'warning' as const,
    priority: 'low' as const,
    isRead: true,
    hoursAgo: 24,
  },
  {
    title: 'Device Connection Unstable',
    message: 'Your energy monitor has experienced 3 disconnections in the past hour. Please check your WiFi connection.',
    type: 'warning' as const,
    priority: 'medium' as const,
    isRead: true,
    hoursAgo: 12,
  },
  {
    title: 'Refrigerator Power Spike',
    message: 'Your refrigerator power consumption increased by 25%. This might indicate a maintenance issue.',
    type: 'warning' as const,
    priority: 'medium' as const,
    isRead: false,
    hoursAgo: 8,
  },

  // Informational Notifications
  {
    title: 'Daily Energy Report Ready',
    message: 'Your daily energy consumption report for yesterday is now available. Total consumption: 45.2 kWh, Cost: ₱475.',
    type: 'info' as const,
    priority: 'low' as const,
    isRead: true,
    hoursAgo: 18,
  },
  {
    title: 'Weekly Savings Achievement',
    message: 'Great job! You saved 15% on energy costs this week compared to last week. Keep up the good work!',
    type: 'info' as const,
    priority: 'low' as const,
    isRead: true,
    hoursAgo: 72,
  },
  {
    title: 'New Alert Rule Created',
    message: 'You have successfully created a new alert rule for daily consumption exceeding 50 kWh.',
    type: 'info' as const,
    priority: 'low' as const,
    isRead: true,
    hoursAgo: 120,
  },
  {
    title: 'Device Online',
    message: 'Your Smart Energy Monitor is now online and actively monitoring your energy consumption.',
    type: 'info' as const,
    priority: 'low' as const,
    isRead: true,
    hoursAgo: 168, // 1 week ago
  },

  // Error Notifications
  {
    title: 'Device Offline',
    message: 'Your energy monitor has been offline for 15 minutes. Please check the power connection and WiFi.',
    type: 'error' as const,
    priority: 'high' as const,
    isRead: false,
    hoursAgo: 1,
  },
  {
    title: 'Data Sync Failed',
    message: 'Failed to sync energy data from your device. Your data will be synced automatically when connection is restored.',
    type: 'error' as const,
    priority: 'medium' as const,
    isRead: true,
    hoursAgo: 36,
  },

  // Recent unread notifications
  {
    title: 'Water Heater High Usage',
    message: 'Your water heater has been consuming 3.2 kW for the past 2 hours. This is higher than normal.',
    type: 'alert' as const,
    priority: 'medium' as const,
    isRead: false,
    hoursAgo: 0.25, // 15 minutes ago
  },
  {
    title: 'Cost Approaching Budget Limit',
    message: 'Your monthly electricity cost is at 85% of your budget (₱1,700 / ₱2,000). Monitor your usage carefully.',
    type: 'warning' as const,
    priority: 'medium' as const,
    isRead: false,
    hoursAgo: 3,
  },
];

async function seedNotifications(userId: string, deviceId: string) {
  console.log('🌱 Seeding notifications...');
  console.log(`User ID: ${userId}`);
  console.log(`Device ID: ${deviceId}`);
  console.log('='.repeat(50));

  try {
    let createdCount = 0;
    const now = new Date();

    for (const notificationData of sampleNotifications) {
      // Calculate timestamp based on hoursAgo
      const timestamp = new Date(now.getTime() - notificationData.hoursAgo * 60 * 60 * 1000);

      // Add optional expiresAt for alerts (7 days from creation)
      const expiresAt = notificationData.type === 'alert' 
        ? new Date(timestamp.getTime() + 7 * 24 * 60 * 60 * 1000)
        : undefined;

      const notification = await notificationService.createNotification({
        userId,
        deviceId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        priority: notificationData.priority,
        isRead: notificationData.isRead,
        readAt: notificationData.isRead ? new Date(timestamp.getTime() + 60 * 1000) : undefined, // Read 1 min after creation
        expiresAt,
        createdAt: timestamp,
      });

      const statusIcon = notificationData.isRead ? '✓' : '●';
      const typeEmoji = 
        notificationData.type === 'alert' ? '🚨' :
        notificationData.type === 'warning' ? '⚠️' :
        notificationData.type === 'error' ? '❌' : 'ℹ️';

      console.log(`${statusIcon} ${typeEmoji} ${notification.title}`);
      console.log(`   Priority: ${notification.priority} | ${notificationData.isRead ? 'Read' : 'Unread'} | ${notificationData.hoursAgo}h ago`);
      
      createdCount++;
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Successfully seeded notifications!');
    console.log(`\nTotal notifications created: ${createdCount}`);
    console.log('\nBreakdown by type:');
    console.log(`- 🚨 Alerts: ${sampleNotifications.filter(n => n.type === 'alert').length}`);
    console.log(`- ⚠️  Warnings: ${sampleNotifications.filter(n => n.type === 'warning').length}`);
    console.log(`- ❌ Errors: ${sampleNotifications.filter(n => n.type === 'error').length}`);
    console.log(`- ℹ️  Info: ${sampleNotifications.filter(n => n.type === 'info').length}`);
    console.log(`\nUnread: ${sampleNotifications.filter(n => !n.isRead).length}`);
    console.log(`Read: ${sampleNotifications.filter(n => n.isRead).length}`);

  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
    throw error;
  }
}

// Export for use in other scripts
export { seedNotifications };

// If run directly, require user ID and device ID
if (require.main === module) {
  const userId = process.argv[2];
  const deviceId = process.argv[3];

  if (!userId || !deviceId) {
    console.error('❌ Missing required arguments!');
    console.error('\nUsage: npx ts-node -r tsconfig-paths/register scripts/seedNotifications.ts <userId> <deviceId>');
    console.error('\nExample: npx ts-node -r tsconfig-paths/register scripts/seedNotifications.ts abc123 device456');
    console.error('\nTip: Find your userId in Firebase Console → Authentication');
    console.error('     Find your deviceId in Firebase Console → Firestore → devices collection');
    process.exit(1);
  }

  seedNotifications(userId, deviceId)
    .then(() => {
      console.log('\n✨ Done! Check your Notifications tab in the app.');
      process.exit(0);
    })
    .catch(() => process.exit(1));
}
