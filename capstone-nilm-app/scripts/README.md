# Scripts Directory 📜

## Overview
This directory contains utility scripts for seeding and managing Firestore data during development and testing.

## Available Scripts

### 1. `initializeUserData.ts` 🚀
**Purpose:** Complete user data initialization - creates everything a new user needs.

**What it does:**
- Creates a mock IoT device
- Creates 8 default appliances
- Sets up default electricity rate (₱10.50/kWh)
- Creates 3 alert rules
- Seeds 15 sample notifications

**Usage:**
```bash
npx ts-node -r tsconfig-paths/register scripts/initializeUserData.ts <userId>
```

**Example:**
```bash
npx ts-node -r tsconfig-paths/register scripts/initializeUserData.ts abc123xyz456
```

**When to use:**
- First time setup for a new user
- After clearing Firestore data
- Setting up test accounts

---

### 2. `seedNotifications.ts` 🔔
**Purpose:** Create sample notifications for testing the notifications screen.

**What it creates:**
- 5 Alert notifications (high consumption, budget exceeded, etc.)
- 4 Warning notifications (unusual patterns, peak usage, etc.)
- 4 Info notifications (reports, achievements, etc.)
- 2 Error notifications (device offline, sync failed)

**Types:**
- 🚨 Alerts (7 notifications)
- ⚠️  Warnings (4 notifications)
- ❌ Errors (2 notifications)
- ℹ️  Info (4 notifications)

**Usage:**
```bash
npx ts-node -r tsconfig-paths/register scripts/seedNotifications.ts <userId> <deviceId>
```

**Example:**
```bash
npx ts-node -r tsconfig-paths/register scripts/seedNotifications.ts abc123 device456
```

**When to use:**
- Testing the Notifications screen
- Demonstrating notification features
- Creating realistic test data

---

### 3. `seedAlerts.ts` (Deprecated) ⚠️
**Purpose:** Old script for creating alerts (replaced by notifications).

**Status:** Kept for reference but use `seedNotifications.ts` instead.

---

## How to Find Your IDs

### Find User ID:
1. Go to **Firebase Console**
2. Click **Authentication**
3. Find your user in the list
4. Copy the **User UID** column

### Find Device ID:
1. Go to **Firebase Console**
2. Click **Firestore Database**
3. Open `devices` collection
4. Find your device
5. Copy the **Document ID**

**OR** use the auto-generated IDs from `initializeUserData` output!

---

## Typical Workflow

### New User Setup:
```bash
# 1. Get user ID from Firebase Auth
# 2. Run initialization
npx ts-node -r tsconfig-paths/register scripts/initializeUserData.ts <userId>

# That's it! Everything is created automatically.
```

### Add More Notifications:
```bash
# If you want additional notifications beyond the initial 15
npx ts-node -r tsconfig-paths/register scripts/seedNotifications.ts <userId> <deviceId>
```

---

## Script Output Examples

### initializeUserData.ts:
```
🚀 Initializing data for user: abc123
==================================================

📱 Creating device...
✅ Device created: Smart Energy Monitor (device456)

🔌 Creating appliances...
✅ Created 8 appliances
   - ❄️ Air Conditioner (1500W)
   - 🧊 Refrigerator (150W)
   - 🌀 Electric Fan (75W)
   - 📺 Television (100W)
   - 🚿 Water Heater (1200W)
   - 🍚 Rice Cooker (400W)
   - 💻 Computer (200W)
   - 💡 Lights (60W)

⚡ Creating electricity rate...
✅ Electricity rate configured

⚡ Creating alert rules...
✅ Created 3 alert rules
   - consumption_limit: 50 Alert
   - budget_exceeded: 2000 Alert
   - device_offline: 15 Alert

🔔 Creating sample notifications...
✅ 15 notifications created

==================================================
🎉 User data initialization complete!

Summary:
- Device ID: device456
- Appliances: 8
- Alert Rules: 3
- Sample Notifications: 15

✨ The user can now start monitoring their energy usage!
```

### seedNotifications.ts:
```
🌱 Seeding notifications...
User ID: abc123
Device ID: device456
==================================================
● 🚨 High Energy Consumption Alert
   Priority: high | Unread | 0.5h ago
✓ ℹ️ Daily Energy Report Ready
   Priority: low | Read | 18h ago
● ⚠️  Peak Hours Usage
   Priority: low | Unread | 24h ago

... (more notifications)

==================================================
🎉 Successfully seeded notifications!

Total notifications created: 15

Breakdown by type:
- 🚨 Alerts: 7
- ⚠️  Warnings: 4
- ❌ Errors: 2
- ℹ️  Info: 4

Unread: 8
Read: 7

✨ Done! Check your Notifications tab in the app.
```

---

## Troubleshooting

### "Module not found" Error
```bash
# Install dependencies first
cd capstone-nilm-app
npm install
```

### "Cannot find 'tsconfig-paths'" Error
```bash
# Install tsconfig-paths
npm install --save-dev tsconfig-paths
```

### "Firebase Error: Permission Denied"
1. Check Firestore security rules
2. Make sure rules allow read/write (use `if true` for testing)
3. Verify user is authenticated

### "User ID or Device ID not found"
1. Double-check IDs from Firebase Console
2. Make sure user is registered in Authentication
3. Ensure device was created first (use initializeUserData)

---

## Best Practices

1. ✅ **Use `initializeUserData` for new users** - It creates everything at once
2. ✅ **Run scripts with valid IDs** - Check Firebase Console first
3. ✅ **Create indexes** - Click the links in error messages
4. ✅ **Clear old data** - Delete old notifications before re-seeding
5. ✅ **Check output** - Scripts show what was created

---

## Future Scripts (Planned)

- `clearUserData.ts` - Remove all data for a user
- `generateHistoricalData.ts` - Create historical readings/summaries
- `seedConsumptionSummaries.ts` - Create aggregated reports
- `testAlertRules.ts` - Test alert rule triggers
- `migrateData.ts` - Migrate data between environments

---

*Last Updated: 2026-02-02*
*Status: Active Development*
