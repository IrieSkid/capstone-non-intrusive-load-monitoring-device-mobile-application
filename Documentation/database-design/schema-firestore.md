# NILM System - Firestore Database Schema

## Overview
This document outlines the Firestore collection structure for the NILM system. Firestore is a NoSQL document database, so the structure differs from SQL databases.

## Why Firestore for NILM?

✅ **Real-time Updates** - Built-in real-time listeners perfect for IoT data  
✅ **Scalability** - Automatically scales with your data  
✅ **Easy Integration** - Works seamlessly with React Native and Expo  
✅ **Free Tier** - Generous free tier for capstone projects  
✅ **Offline Support** - Built-in offline persistence  
✅ **Security Rules** - Flexible security rules for access control  

## Collection Structure

### 1. `users` Collection

**Document ID:** `{userId}` (auto-generated)

**Document Structure:**
```javascript
{
  email: "user@example.com",
  passwordHash: "hashed_password", // Store hashed password
  fullName: "John Doe",
  phoneNumber: "+639123456789",
  role: "homeowner", // "admin" | "homeowner" | "tenant"
  status: "active", // "active" | "inactive" | "suspended"
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLoginAt: Timestamp
}
```

**Indexes:**
- `email` (ascending) - Unique
- `status` (ascending)
- `role` (ascending)

---

### 2. `userSessions` Collection

**Document ID:** `{sessionId}` (auto-generated)

**Document Structure:**
```javascript
{
  userId: "user123",
  token: "jwt_token_string",
  deviceInfo: "iPhone 13",
  ipAddress: "192.168.1.1",
  createdAt: Timestamp,
  expiresAt: Timestamp,
  isActive: true
}
```

**Subcollection:** None

**Indexes:**
- `userId` (ascending), `isActive` (ascending)
- `expiresAt` (ascending)

---

### 3. `devices` Collection

**Document ID:** `{deviceId}` (auto-generated)

**Document Structure:**
```javascript
{
  userId: "user123", // Owner
  deviceName: "Main Meter",
  deviceSerialNumber: "NILM-001", // Unique
  macAddress: "AA:BB:CC:DD:EE:FF", // Unique
  location: "Living Room",
  wifiSsid: "HomeWiFi",
  status: "online", // "online" | "offline" | "error"
  lastSyncAt: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Subcollections:**
- `appliances` - Appliances for this device
- `readings` - Real-time readings (optional, can use separate collection)

**Indexes:**
- `userId` (ascending), `status` (ascending)
- `deviceSerialNumber` (ascending) - Unique
- `macAddress` (ascending) - Unique

---

### 4. `appliances` Collection (Subcollection of `devices`)

**Path:** `devices/{deviceId}/appliances/{applianceId}`

**Document Structure:**
```javascript
{
  applianceName: "Refrigerator",
  applianceType: "refrigerator", // "light" | "fan" | "refrigerator" | "ac" | "tv" | "other"
  portNumber: 1,
  ratedWatts: 200,
  status: "on", // "on" | "off" | "unknown"
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Subcollections:** None

**Indexes:**
- `applianceType` (ascending), `status` (ascending)

---

### 5. `readings` Collection

**Document ID:** `{readingId}` (auto-generated, or use timestamp-based ID)

**Document Structure:**
```javascript
{
  deviceId: "device123",
  applianceId: "appliance456", // Optional - null for aggregate readings
  voltageRms: 220.5,
  currentRms: 0.68,
  powerWatts: 150.0,
  apparentPowerVa: 150.0,
  powerFactor: 1.0,
  energyKwh: 0.00015,
  recordedAt: Timestamp
}
```

**Alternative Structure (Time-based Collections):**
For better querying, consider organizing by date:
- `readings/{date}/readings/{readingId}`

**Indexes:**
- `deviceId` (ascending), `recordedAt` (descending)
- `applianceId` (ascending), `recordedAt` (descending)
- `recordedAt` (descending) - Composite index

**Note:** For high-frequency data, consider using Cloud Functions to batch writes.

---

### 6. `consumptionSummaries` Collection

**Document ID:** `{summaryId}` (auto-generated)

**Document Structure:**
```javascript
{
  userId: "user123",
  deviceId: "device123", // Optional
  applianceId: "appliance456", // Optional
  electricityRateId: "rate123", // Reference to electricity rate used for cost calculation
  periodType: "daily", // "daily" | "weekly" | "monthly"
  periodStart: Timestamp,
  periodEnd: Timestamp,
  totalKwh: 150.5,
  totalCostPhp: 1881.25, // Calculated using electricityRateId rate
  readingCount: 1000,
  createdAt: Timestamp
}
```

**Indexes:**
- `userId` (ascending), `periodType` (ascending), `periodStart` (descending)
- `deviceId` (ascending), `periodType` (ascending), `periodStart` (descending)
- `applianceId` (ascending), `periodType` (ascending), `periodStart` (descending)
- `electricityRateId` (ascending) // For joining with electricity rates

---

### 7. `electricityRates` Collection

**Document ID:** `{rateId}` (auto-generated)

**Document Structure:**
```javascript
{
  rateName: "Residential Rate 2026",
  pesoPerKwh: 12.50,
  effectiveFrom: Timestamp,
  effectiveTo: Timestamp | null,
  isActive: true,
  createdAt: Timestamp
}
```

**Indexes:**
- `isActive` (ascending), `effectiveFrom` (descending)

---

### 8. `notifications` Collection

**Document ID:** `{notificationId}` (auto-generated)

**Document Structure:**
```javascript
{
  userId: "user123",
  title: "High Power Consumption",
  message: "Refrigerator is consuming more than threshold",
  type: "alert", // "alert" | "info" | "warning" | "error"
  priority: "high", // "low" | "medium" | "high" | "critical"
  isRead: false,
  readAt: Timestamp | null,
  expiresAt: Timestamp | null,
  createdAt: Timestamp
}
```

**Indexes:**
- `userId` (ascending), `isRead` (ascending), `createdAt` (descending)
- `type` (ascending), `createdAt` (descending)

---

### 9. `alertRules` Collection

**Document ID:** `{ruleId}` (auto-generated)

**Document Structure:**
```javascript
{
  userId: "user123",
  applianceId: "appliance456", // Optional
  deviceId: "device123", // Optional
  alertType: "power_threshold", // "power_threshold" | "consumption_limit" | "device_offline"
  thresholdValue: 200,
  condition: ">", // ">" | "<" | ">=" | "<="
  severity: "high", // "low" | "medium" | "high" | "critical"
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes:**
- `userId` (ascending), `isActive` (ascending)
- `applianceId` (ascending), `isActive` (ascending)

---

### 10. `auditLogs` Collection

**Document ID:** `{logId}` (auto-generated)

**Document Structure:**
```javascript
{
  userId: "user123",
  action: "CREATE", // "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT"
  entityType: "device", // "device" | "appliance" | "user" | "alert_rule" | etc.
  entityId: "device123",
  oldValue: { /* previous state */ } | null,
  newValue: { /* new state */ } | null,
  ipAddress: "192.168.1.1",
  description: "Device registered successfully",
  createdAt: Timestamp
}
```

**Indexes:**
- `userId` (ascending), `action` (ascending), `createdAt` (descending)
- `entityType` (ascending), `entityId` (ascending), `createdAt` (descending)
- `createdAt` (descending)

**Note:** For high-volume audit logs, consider using Cloud Functions to archive old logs.

---

### 11. `systemSettings` Collection

**Document ID:** `{settingKey}` (use key as document ID)

**Document Structure:**
```javascript
{
  settingValue: "NILM Monitoring System", // Can be string, number, or object
  description: "Application Name",
  category: "general", // "general" | "billing" | "alerts" | "device"
  isPublic: true,
  createdAt: Timestamp,
  createdBy: "user123", // Reference to users collection (optional)
  updatedAt: Timestamp,
  updatedBy: "user123" // Reference to users collection (optional)
}
```

**Indexes:**
- `category` (ascending)

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if request.resource.data.email is string;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Devices collection
    match /devices/{deviceId} {
      allow read: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow delete: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      
      // Appliances subcollection
      match /appliances/{applianceId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated();
        allow update: if isAuthenticated();
        allow delete: if isAuthenticated();
      }
    }
    
    // Readings collection
    match /readings/{readingId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated(); // Or use device API key
      allow update, delete: if isAdmin();
    }
    
    // Consumption summaries
    match /consumptionSummaries/{summaryId} {
      allow read: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isAdmin());
      allow create, update, delete: if isAdmin(); // Only system can create
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
    
    // Audit logs - read-only for users, write for system
    match /auditLogs/{logId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated(); // System creates logs
      allow update, delete: if isAdmin();
    }
    
    // System settings
    match /systemSettings/{settingKey} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

---

## React Native Integration

### Installation

```bash
npm install @react-native-firebase/app @react-native-firebase/firestore
# or with Expo
expo install @react-native-firebase/app @react-native-firebase/firestore
```

### Example: Real-time Readings Listener

```javascript
import firestore from '@react-native-firebase/firestore';

// Listen to real-time readings
const unsubscribe = firestore()
  .collection('readings')
  .where('deviceId', '==', deviceId)
  .orderBy('recordedAt', 'desc')
  .limit(100)
  .onSnapshot(
    (snapshot) => {
      const readings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReadings(readings);
    },
    (error) => {
      console.error('Error listening to readings:', error);
    }
  );

// Cleanup
return () => unsubscribe();
```

### Example: Add Reading

```javascript
import firestore from '@react-native-firebase/firestore';

const addReading = async (readingData) => {
  try {
    await firestore().collection('readings').add({
      ...readingData,
      recordedAt: firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding reading:', error);
  }
};
```

### Example: Audit Log

```javascript
const logAction = async (action, entityType, entityId, oldValue, newValue) => {
  try {
    await firestore().collection('auditLogs').add({
      userId: currentUser.uid,
      action,
      entityType,
      entityId,
      oldValue: oldValue || null,
      newValue: newValue || null,
      ipAddress: await getIpAddress(),
      description: `${action} ${entityType} ${entityId}`,
      createdAt: firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error logging action:', error);
  }
};
```

---

## Cloud Functions for Data Processing

### Example: Generate Consumption Summary

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.generateDailySummary = functions.pubsub
  .schedule('0 0 * * *') // Run daily at midnight
  .timeZone('Asia/Manila')
  .onRun(async (context) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get all devices
    const devicesSnapshot = await admin.firestore()
      .collection('devices')
      .get();
    
    for (const deviceDoc of devicesSnapshot.docs) {
      const deviceId = deviceDoc.id;
      const deviceData = deviceDoc.data();
      
      // Get readings for yesterday
      const readingsSnapshot = await admin.firestore()
        .collection('readings')
        .where('deviceId', '==', deviceId)
        .where('recordedAt', '>=', yesterday)
        .where('recordedAt', '<', new Date())
        .get();
      
      // Calculate totals
      let totalKwh = 0;
      readingsSnapshot.forEach(doc => {
        totalKwh += doc.data().energyKwh;
      });
      
      // Get current rate
      const rateSnapshot = await admin.firestore()
        .collection('electricityRates')
        .where('isActive', '==', true)
        .orderBy('effectiveFrom', 'desc')
        .limit(1)
        .get();
      
      const rate = rateSnapshot.docs[0]?.data().pesoPerKwh || 12.50;
      const totalCost = totalKwh * rate;
      
      // Save summary
      await admin.firestore().collection('consumptionSummaries').add({
        userId: deviceData.userId,
        deviceId,
        periodType: 'daily',
        periodStart: admin.firestore.Timestamp.fromDate(yesterday),
        periodEnd: admin.firestore.Timestamp.fromDate(new Date()),
        totalKwh,
        totalCostPhp: totalCost,
        readingCount: readingsSnapshot.size,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });
```

---

## Cost Considerations

### Firestore Pricing (Free Tier)
- **50,000 reads/day** - Free
- **20,000 writes/day** - Free
- **20,000 deletes/day** - Free
- **Storage**: 1 GB free

### For NILM System:
- **Readings**: If device sends data every 5 seconds = 17,280 writes/day per device
- **Real-time listeners**: Count as reads
- **Recommendation**: Batch readings or use Cloud Functions to aggregate

### Optimization Tips:
1. **Batch writes** - Group multiple readings into one write
2. **Use subcollections** - Organize data hierarchically
3. **Archive old data** - Move old readings to Cloud Storage
4. **Use Cloud Functions** - Process data server-side to reduce reads

---

## Migration from SQL to Firestore

If you need to migrate from SQL:

1. **Export SQL data** to JSON
2. **Transform data** to match Firestore structure
3. **Import to Firestore** using Admin SDK
4. **Update application code** to use Firestore SDK

---

## Best Practices

1. **Use subcollections** for hierarchical data (devices → appliances)
2. **Denormalize** when needed for faster reads
3. **Use composite indexes** for complex queries
4. **Implement pagination** for large result sets
5. **Use Cloud Functions** for server-side processing
6. **Set up proper security rules** before going live
7. **Monitor usage** to stay within free tier
8. **Archive old data** to reduce costs

---

## Comparison: Firestore vs SQL

| Feature | Firestore | SQL (PostgreSQL/MySQL) |
|---------|-----------|------------------------|
| Real-time updates | ✅ Built-in | ❌ Requires WebSockets |
| Scalability | ✅ Automatic | ⚠️ Manual scaling |
| Offline support | ✅ Built-in | ❌ Requires implementation |
| Complex queries | ⚠️ Limited | ✅ Full SQL support |
| Transactions | ⚠️ Limited | ✅ Full ACID |
| Cost (free tier) | ✅ Generous | ⚠️ Varies by provider |
| Learning curve | ✅ Easy | ⚠️ Moderate |
| Time-series data | ⚠️ Possible but not optimal | ✅ Optimized |

**Recommendation for NILM:**
- **Use Firestore** if you prioritize real-time updates and easy setup
- **Use SQL** if you need complex queries and time-series optimization

For a capstone project, **Firestore is an excellent choice** due to its ease of use and real-time capabilities.

