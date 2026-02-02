/**
 * Seed Alerts Script
 * Creates sample alerts in Firestore for testing
 * 
 * Usage: npx ts-node -r tsconfig-paths/register scripts/seedAlerts.ts
 */

import { firestoreAlertService } from '../services/firestoreAlertService';

// Sample alert data
const sampleAlerts = [
  {
    type: 'High Consumption',
    title: 'High Energy Usage Detected',
    message: 'Your daily consumption has exceeded 50 kWh. Consider reducing usage during peak hours.',
    priority: 'high' as const,
    threshold: 50,
    currentValue: 62.5,
  },
  {
    type: 'Budget Exceeded',
    title: 'Monthly Budget Exceeded',
    message: 'Your monthly electricity cost has exceeded ₱2,000. Current cost: ₱2,450.',
    priority: 'high' as const,
    threshold: 2000,
    currentValue: 2450,
  },
  {
    type: 'Unusual Pattern',
    title: 'Unusual Consumption Pattern',
    message: 'Detected unusual energy consumption pattern. Your usage is 30% higher than usual.',
    priority: 'medium' as const,
  },
  {
    type: 'Device Offline',
    title: 'Device Connection Lost',
    message: 'Your energy monitor has been offline for 15 minutes. Please check the connection.',
    priority: 'medium' as const,
  },
  {
    type: 'Appliance Always On',
    title: 'Air Conditioner Running Continuously',
    message: 'Air conditioner has been running for 12 hours. Consider turning it off when not needed.',
    priority: 'low' as const,
  },
  {
    type: 'Peak Hours Usage',
    title: 'High Usage During Peak Hours',
    message: 'Consider shifting heavy appliance usage to off-peak hours to save on electricity costs.',
    priority: 'low' as const,
  },
];

async function seedAlerts(userId: string, deviceId: string) {
  console.log('🌱 Seeding alerts...');

  try {
    for (const alertData of sampleAlerts) {
      const alert = await firestoreAlertService.createAlert({
        userId,
        deviceId,
        ...alertData,
        status: 'active',
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within last 7 days
      });

      console.log(`✅ Created alert: ${alert.title}`);
    }

    console.log('\n🎉 Successfully seeded alerts!');
    console.log(`\nTotal alerts created: ${sampleAlerts.length}`);
  } catch (error) {
    console.error('❌ Error seeding alerts:', error);
    throw error;
  }
}

// Export for use in other scripts
export { seedAlerts };

// If run directly, require user ID and device ID
if (require.main === module) {
  const userId = process.argv[2];
  const deviceId = process.argv[3];

  if (!userId || !deviceId) {
    console.error('Usage: npx ts-node -r tsconfig-paths/register scripts/seedAlerts.ts <userId> <deviceId>');
    process.exit(1);
  }

  seedAlerts(userId, deviceId)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
