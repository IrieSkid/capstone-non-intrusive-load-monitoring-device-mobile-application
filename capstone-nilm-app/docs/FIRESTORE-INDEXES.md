# Firestore Indexes Guide 🔍

## ⚠️ CRITICAL INDEX NEEDED FOR REPORTS!

### **realTimeReadings** - Date Range Queries
**Status**: 🔴 **REQUIRED NOW** - Reports will not work without this!

**Direct Link to Create**: https://console.firebase.google.com/v1/r/project/capstone-nilm-app/firestore/indexes?create_composite=Clpwcm9qZWN0cy9jYXBzdG9uZS1uaWxtLWFwcC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcmVhbFRpbWVSZWFkaW5ncy9pbmRleGVzL18QARoMCghkZXZpY2VJZBABGg0KCXRpbWVzdGFtcBABGgwKCF9fbmFtZV9fEAE

**Fields**:
- `deviceId` (Ascending)
- `timestamp` (Ascending)

**Why**: Reports screen queries readings by deviceId and date range. Without this index, reports will show errors.

**How to Create**:
1. Click the link above
2. Click "Create Index" button
3. Wait 1-2 minutes for it to build
4. Refresh your app

---

## Why Indexes Are Needed

Firestore requires composite indexes when you:
- Filter by one field AND sort by another
- Use multiple `where()` clauses with `orderBy()`

## Required Indexes for NILM App

### 1. ✅ `notifications` Collection
**Query:** `where('userId', '==', userId)` + `orderBy('createdAt', 'desc')`

**Index Fields:**
- `userId` (Ascending)
- `createdAt` (Descending)

**Create Link:** Firebase Console → Firestore → Indexes → Create Index

OR use the direct link from error message.

---

### 2. `realTimeReadings` Collection (ALREADY COVERED ABOVE)
**Query:** `where('deviceId', '==', deviceId)` + `where('timestamp', '>=', start)` + `where('timestamp', '<=', end)`

**Index Fields:**
- `deviceId` (Ascending)
- `timestamp` (Ascending)

**Status**: 🔴 See critical index section above

---

### 3. `appliances` Collection
**Query:** `where('deviceId', '==', deviceId)` + `where('isActive', '==', true)`

**Index Fields:**
- `deviceId` (Ascending)
- `isActive` (Ascending)

---

### 4. `alertRules` Collection
**Query:** `where('userId', '==', userId)` + `where('isActive', '==', true)`

**Index Fields:**
- `userId` (Ascending)
- `isActive` (Ascending)

---

### 5. `devices` Collection
**Query:** `where('userId', '==', userId)` + `where('status', '==', 'online')`

**Index Fields:**
- `userId` (Ascending)
- `status` (Ascending)

---

### 6. `consumptionSummaries` Collection
**Query:** `where('userId', '==', userId)` + `where('period', '==', 'daily')` + `orderBy('startDate', 'desc')`

**Index Fields:**
- `userId` (Ascending)
- `period` (Ascending)
- `startDate` (Descending)

---

### 7. `notifications` by Type
**Query:** `where('userId', '==', userId)` + `where('type', '==', 'alert')` + `orderBy('createdAt', 'desc')`

**Index Fields:**
- `userId` (Ascending)
- `type` (Ascending)
- `createdAt` (Descending)

---

### 8. `notifications` - Unread
**Query:** `where('userId', '==', userId)` + `where('isRead', '==', false)`

**Index Fields:**
- `userId` (Ascending)
- `isRead` (Ascending)

---

## Quick Index Creation Script

You can create all indexes at once using the Firebase CLI:

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login
```bash
firebase login
```

### Step 3: Create `firestore.indexes.json`
```json
{
  "indexes": [
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "isRead", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "realTimeReadings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "deviceId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "appliances",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "deviceId", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "appliances",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "alertRules",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "isActive", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "devices",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "consumptionSummaries",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "period", "order": "ASCENDING" },
        { "fieldPath": "startDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "electricityRates",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "effectiveDate", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Step 4: Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

This will create all indexes at once! ⚡

## Manual Creation (Easier for Now)

Since you're getting error messages with direct links:

1. **Wait for error messages** - They provide direct links!
2. **Click the link** in the error
3. **Click "Create Index"**
4. **Wait 1-2 minutes** for it to build
5. **Refresh your app**

Firestore will tell you exactly which indexes you need as you use the app! 📊

## Index Status

Check your indexes:
1. Go to **Firebase Console**
2. Click **Firestore Database**
3. Click **Indexes** tab
4. See all indexes and their status:
   - 🟢 **Enabled** - Ready to use
   - 🟡 **Building** - Wait a few minutes
   - 🔴 **Error** - Check configuration

## Common Issues

### Index Still Building
**Wait 1-2 minutes.** Large indexes can take longer.

### Query Still Fails
1. Check the collection name matches exactly
2. Check field names match exactly (case-sensitive)
3. Ensure field types match (string, number, etc.)

### Too Many Indexes
Don't worry! Indexes don't cost money in the free tier, only slightly slower writes.

## Best Practices

1. ✅ **Let errors guide you** - Create indexes as needed
2. ✅ **Use the direct links** - Easier than manual creation
3. ✅ **Wait for completion** - Check Indexes tab for status
4. ✅ **Test queries** - Ensure they work after index creation

## Current Status

| Collection | Index Status | Priority | Notes |
|------------|--------------|----------|-------|
| `realTimeReadings` | 🔴 **CRITICAL** | **HIGH** | **Required for Reports - Create NOW!** |
| `notifications` | ⏳ Pending | Medium | Click link from error to create |
| `appliances` | ⏳ Not Yet | Low | Will trigger when filtering |
| `alertRules` | ⏳ Not Yet | Low | Will trigger when querying |
| `devices` | ⏳ Not Yet | Low | Will trigger when filtering |
| `consumptionSummaries` | ⏳ Not Yet | Low | Will trigger when needed |
| `electricityRates` | ⏳ Not Yet | Low | Will trigger when needed |

As you use the app, Firestore will tell you which indexes to create! 🎯

---

*Last Updated: 2026-02-02*
*Status: Active Development*
*Tip: Click the error links - they're the fastest way to create indexes!*
