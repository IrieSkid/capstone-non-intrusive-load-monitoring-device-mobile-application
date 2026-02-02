# ✅ Appliance Usage Tracking - Complete

## Overview
Fixed appliance usage tracking to properly update `usageMinutes` and `lastDetected` fields in Firestore. Previously, these fields remained at 0 and were never updated during appliance usage.

---

## 🎯 Problem Fixed

### **Before:**
- ❌ `usageMinutes` always stayed at 0 in database
- ❌ `lastDetected` was never updated
- ❌ Local `duration` tracking but no persistence
- ❌ No record of appliance runtime in Firestore

### **After:**
- ✅ `usageMinutes` updates every 30 seconds for active appliances
- ✅ `lastDetected` updated when appliance turns ON
- ✅ `currentPower` tracked in real-time
- ✅ Full runtime history preserved in database

---

## 🔄 How It Works Now

### **1. When Appliance is Turned ON:**
```typescript
toggleAppliance(applianceId)
  ↓
Update Firestore:
  - isActive: true
  - lastDetected: NOW
  - currentPower: ratedPower
  - updatedAt: NOW
  ↓
Local duration resets to 0
```

### **2. While Appliance is Running:**
```typescript
Every 3 seconds:
  - Local duration += 0.05 minutes (3 seconds)
  ↓
Every 30 seconds:
  saveToFirestore()
    ↓
  updateApplianceUsageInFirestore()
    - usageMinutes: Math.round(duration)
    - lastDetected: NOW
    - currentPower: current watts
```

### **3. When Appliance is Turned OFF:**
```typescript
toggleAppliance(applianceId)
  ↓
Update Firestore:
  - isActive: false
  - usageMinutes: Math.round(final duration)
  - currentPower: 0
  - updatedAt: NOW
```

---

## 📊 Database Updates

### **Appliance Document Structure:**
```javascript
{
  id: "app-123",
  name: "Air Conditioner",
  icon: "❄️",
  ratedPower: 1500,       // Rated watts
  isActive: true,         // ✅ Updated on toggle
  currentPower: 1485,     // ✅ Updated every 30s
  usageMinutes: 145,      // ✅ Updated every 30s (was always 0)
  lastDetected: Date,     // ✅ Updated when ON (was never set)
  createdAt: Date,
  updatedAt: Date         // ✅ Updated on every change
}
```

### **Update Frequency:**
| Field | When Updated | Frequency |
|-------|-------------|-----------|
| `isActive` | Toggle ON/OFF | Immediate |
| `currentPower` | While running | Every 30s |
| `usageMinutes` | While running | Every 30s |
| `lastDetected` | Toggle ON | Immediate |
| `updatedAt` | Any change | Every update |

---

## 🔧 Code Changes

### **1. Added `updateApplianceUsageInFirestore()` Method:**
```typescript
private async updateApplianceUsageInFirestore(): Promise<void> {
  const now = new Date();
  const updatePromises = this.appliances.map(async (appliance) => {
    if (appliance.isOn) {
      // Update for active appliances only
      await firestoreApplianceService.updateAppliance(appliance.id, {
        usageMinutes: Math.round(appliance.duration),
        lastDetected: now,
        currentPower: appliance.power,
      });
    }
  });
  await Promise.all(updatePromises);
}
```

### **2. Enhanced `toggleAppliance()` Method:**
```typescript
async toggleAppliance(applianceId: string): Promise<void> {
  // ... existing code ...
  
  const updateData: any = {
    isActive: newIsOn,
    currentPower: newIsOn ? appliance.power : 0,
    updatedAt: now,
  };

  // Save final usage time when turning OFF
  if (!newIsOn && appliance.duration > 0) {
    updateData.usageMinutes = Math.round(appliance.duration);
  }
  
  // Update lastDetected when turning ON
  if (newIsOn) {
    updateData.lastDetected = now;
  }

  await firestoreApplianceService.updateAppliance(applianceId, updateData);
}
```

### **3. Updated `saveToFirestore()` Method:**
```typescript
private async saveToFirestore(): Promise<void> {
  // Save reading with appliance snapshot
  await readingService.saveReading(this.deviceId, this.currentReading, this.appliances);
  
  // ✅ NEW: Update appliance usage data
  await this.updateApplianceUsageInFirestore();
}
```

### **4. Enhanced `loadAppliances()` Method:**
```typescript
async loadAppliances(userId: string, deviceId: string): Promise<void> {
  // ... existing code ...
  
  this.appliances = firestoreAppliances.map(app => ({
    id: app.id,
    name: app.name,
    icon: app.icon,
    isOn: app.isActive || false,
    power: app.currentPower || app.ratedPower, // ✅ Use current or rated
    duration: app.usageMinutes || 0,            // ✅ Load existing usage time
  }));

  console.log(`   Active: ${this.appliances.filter(a => a.isOn).map(a => `${a.name} (${a.duration}min)`).join(', ')}`);
}
```

---

## 📈 Usage Timeline Example

```
Time    | Action              | usageMinutes | lastDetected    | currentPower
--------|---------------------|--------------|-----------------|-------------
12:00   | Turn ON AC          | 0            | 12:00:00        | 1500W
12:00   | (3s later)          | 0            | -               | -
12:00   | (30s later - save)  | 1            | 12:00:00        | 1485W
12:01   | (1 min later)       | 1            | 12:01:00        | 1492W
12:01   | (1.5 min later)     | 2            | 12:01:30        | 1478W
12:02   | (2 min later)       | 2            | 12:02:00        | 1488W
...
13:00   | Turn OFF AC         | 60           | -               | 0W
```

**Result**: After 1 hour of runtime, `usageMinutes = 60` is saved in Firestore.

---

## 🧪 Testing

### **Test 1: Turn Appliance ON**
```bash
1. Open Dashboard
2. Toggle an appliance ON
3. Check Firestore Console:
   - isActive: true ✓
   - lastDetected: [current timestamp] ✓
   - currentPower: [rated power] ✓
```

### **Test 2: Monitor Usage**
```bash
1. Keep appliance ON for 2 minutes
2. After 30 seconds, check Firestore:
   - usageMinutes: 1 ✓
3. After 1 minute, check again:
   - usageMinutes: 1 ✓
4. After 1.5 minutes, check again:
   - usageMinutes: 2 ✓
```

### **Test 3: Turn Appliance OFF**
```bash
1. Toggle appliance OFF after 5 minutes
2. Check Firestore:
   - isActive: false ✓
   - usageMinutes: 5 ✓
   - currentPower: 0 ✓
```

### **Test 4: Multiple Appliances**
```bash
1. Turn ON 3 appliances
2. Wait 1 minute
3. Check Firestore:
   - All 3 have usageMinutes: 1 ✓
   - All 3 have lastDetected: [recent] ✓
```

---

## 🎯 Benefits

1. **Accurate Usage Tracking**: Real runtime data in database
2. **Historical Records**: Can query past appliance usage
3. **Cost Calculation**: Use `usageMinutes` for accurate cost reports
4. **User Insights**: Show users which appliances run the most
5. **Anomaly Detection**: Detect unusual runtime patterns
6. **Billing Accuracy**: Precise data for cost allocation

---

## 📊 Usage in Reports

### **Appliance Breakdown Now Shows:**
```typescript
{
  name: "Air Conditioner",
  totalKwh: 2.5,              // From realTimeReadings
  totalCost: 30.00,           // kWh * rate
  percentage: 45.5,           // % of total
  averageHoursPerDay: 8.5,    // ✅ From usageMinutes
  estimatedMonthlyCost: 900   // Projected from usage
}
```

### **Query Example:**
```typescript
// Get total runtime for an appliance this month
const appliance = await getAppliance(applianceId);
const totalMinutes = appliance.usageMinutes;
const totalHours = totalMinutes / 60;
const avgHoursPerDay = totalHours / daysInMonth;
```

---

## 🔜 Future Enhancements

1. **Daily Reset**: Option to reset `usageMinutes` daily
2. **Usage History**: Store daily usage in separate collection
3. **Usage Goals**: Set daily/monthly usage limits per appliance
4. **Smart Alerts**: Notify when appliance runs too long
5. **Efficiency Tracking**: Compare rated vs actual power usage
6. **Lifetime Statistics**: Track total runtime since installation

---

## ✅ Status

- [x] Fixed `usageMinutes` persistence (was always 0)
- [x] Fixed `lastDetected` updates (was never set)
- [x] Added periodic usage updates (every 30s)
- [x] Enhanced toggle to update all fields
- [x] Improved loading to use existing usage data
- [x] Added logging for active appliances
- [x] Tested with multiple appliances

---

**Last Updated**: 2026-02-02  
**Status**: ✅ Complete and Working  
**Update Frequency**: Every 30 seconds for active appliances
