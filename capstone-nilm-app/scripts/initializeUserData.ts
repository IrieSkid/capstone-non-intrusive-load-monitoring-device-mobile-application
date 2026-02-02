/**
 * Initialize User Data Script
 * Sets up device, appliances, and alerts for a user
 * 
 * Usage: npx ts-node -r tsconfig-paths/register scripts/initializeUserData.ts <userId>
 */

import { deviceService } from '../services/deviceService';
import { firestoreApplianceService } from '../services/firestoreApplianceService';
import { electricityRateService } from '../services/electricityRateService';
import { alertRuleService } from '../services/alertRuleService';
import { seedNotifications } from './seedNotifications';

async function initializeUserData(userId: string) {
  console.log(`\n🚀 Initializing data for user: ${userId}`);
  console.log('='.repeat(50));

  try {
    // 1. Create device
    console.log('\n📱 Creating device...');
    const device = await deviceService.createMockDevice(userId);
    console.log(`✅ Device created: ${device.name} (${device.id})`);

    // 2. Create appliances
    console.log('\n🔌 Creating appliances...');
    const appliances = await firestoreApplianceService.createDefaultAppliances(userId, device.id);
    console.log(`✅ Created ${appliances.length} appliances`);
    appliances.forEach(app => console.log(`   - ${app.icon} ${app.name} (${app.ratedPower}W)`));

    // 3. Create electricity rate
    console.log('\n⚡ Creating electricity rate...');
    await electricityRateService.getCurrentRate(userId); // This creates default if none exists
    console.log('✅ Electricity rate configured');

    // 4. Create alert rules
    console.log('\n⚡ Creating alert rules...');
    const alertRules = await alertRuleService.createDefaultRules(userId, device.id);
    console.log(`✅ Created ${alertRules.length} alert rules`);
    alertRules.forEach(rule => console.log(`   - ${rule.alertType}: ${rule.thresholdValue} ${rule.description?.split(' ')[0] || ''}`));

    // 5. Create sample notifications
    console.log('\n🔔 Creating sample notifications...');
    await seedNotifications(userId, device.id);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 User data initialization complete!');
    console.log('\nSummary:');
    console.log(`- Device ID: ${device.id}`);
    console.log(`- Appliances: ${appliances.length}`);
    console.log(`- Alert Rules: ${alertRules.length}`);
    console.log(`- Sample Notifications: 15 created`);
    console.log('\n✨ The user can now start monitoring their energy usage!');

  } catch (error) {
    console.error('\n❌ Error initializing user data:', error);
    throw error;
  }
}

// If run directly
if (require.main === module) {
  const userId = process.argv[2];

  if (!userId) {
    console.error('Usage: npx ts-node -r tsconfig-paths/register scripts/initializeUserData.ts <userId>');
    process.exit(1);
  }

  initializeUserData(userId)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { initializeUserData };
