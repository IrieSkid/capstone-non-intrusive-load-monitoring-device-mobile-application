# ✅ Appliance-Level Tracking - Complete

## Overview
Enhanced the real-time data tracking system to store **per-appliance readings** alongside device-level data in both `realTimeReadings` and `consumptionSummaries` collections.

---

## 🎯 What Changed

### 1. **Real-Time Readings Enhanced**
Previously, only device-level data was stored:
```typescript
// OLD: Only device totals
{
  deviceId: string;
  voltage: number;
  current: number;
  power: number;  // Total power only
  timestamp: Date;
}
```

Now includes per-appliance breakdown:
```typescript
// NEW: Device totals + appliance breakdown
{
  deviceId: string;
  voltage: number;
  current: number;
  power: number;  // Total device power
  timestamp: Date;
  // NEW: Per-appliance data
  applianceReadings: [
    {
      applianceId: string;
      applianceName: string;
      power: number;        // Individual appliance power
      isActive: boolean;    // ON/OFF state
      runtime: number;      // Minutes in current session
    }
  ]
}
```

### 2. **Consumption Summaries Enhanced**
Previously, only device-level aggregates:
```typescript
// OLD: Only device totals
{
  totalEnergyKwh: number;
  totalCost: number;
  peakPower: number;
  avgPower: number;
}
```

Now includes per-appliance breakdown:
```typescript
// NEW: Device totals + appliance breakdown
{
  totalEnergyKwh: number;
  totalCost: number;
  peakPower: number;
  avgPower: number;
  // NEW: Per-appliance consumption
  applianceBreakdown: [
    {
      applianceId: string;
      applianceName: string;
      totalKwh: number;
      totalCost: number;
      avgPower: number;
      runtime: number;      // Total minutes
      percentage: number;   // % of total consumption
    }
  ]
}
```

---

## 📁 Files Modified

### **services/readingService.ts**
- Updated `saveReading()` to accept `appliances` parameter
- Stores `applianceReadings` array with each reading
- Retrieval methods now include appliance data

### **services/realtimeDataService.ts**
- Modified `saveToFirestore()` to pass current appliances
- Each reading now includes state of all appliances

### **services/consumptionSummaryService.ts**
- Added `ApplianceConsumption` interface
- Enhanced `ConsumptionSummary` with `applianceBreakdown` field
- Added `generateDailySummary()` method that:
  - Aggregates appliance data from readings
  - Calculates per-appliance kWh, cost, runtime
  - Computes percentage of total consumption

---

## 🔍 Data Flow

```
User toggles appliance ON
         ↓
realtimeDataService updates local state
         ↓
Every 3 seconds: generateReading()
         ↓
Calculates total power from active appliances
         ↓
saveToFirestore() with appliance states
         ↓
readingService.saveReading(deviceId, reading, appliances)
         ↓
Firestore: realTimeReadings collection
{
  power: 1500W (total),
  applianceReadings: [
    { name: "Air Conditioner", power: 1200W, isActive: true },
    { name: "Refrigerator", power: 300W, isActive: true }
  ]
}
```

---

## 📊 Database Structure

### **realTimeReadings Collection**
```json
{
  "id": "auto-generated",
  "deviceId": "device-123",
  "timestamp": "2026-02-02T10:30:00Z",
  "voltage": 220,
  "current": 6.82,
  "power": 1500,
  "powerFactor": 0.95,
  "frequency": 60,
  "energy": 12.5,
  "applianceReadings": [
    {
      "applianceId": "app-1",
      "applianceName": "Air Conditioner",
      "power": 1200,
      "isActive": true,
      "runtime": 45
    },
    {
      "applianceId": "app-2",
      "applianceName": "Refrigerator",
      "power": 300,
      "isActive": true,
      "runtime": 1440
    }
  ]
}
```

### **consumptionSummaries Collection**
```json
{
  "id": "auto-generated",
  "userId": "user-123",
  "deviceId": "device-123",
  "period": "daily",
  "startDate": "2026-02-02T00:00:00Z",
  "endDate": "2026-02-02T23:59:59Z",
  "totalEnergyKwh": 25.5,
  "totalCost": 306.00,
  "peakPower": 2500,
  "averagePower": 1200,
  "ratePerKwh": 12,
  "applianceBreakdown": [
    {
      "applianceId": "app-1",
      "applianceName": "Air Conditioner",
      "totalKwh": 14.4,
      "totalCost": 172.80,
      "avgPower": 1200,
      "runtime": 720,
      "percentage": 56.5
    },
    {
      "applianceId": "app-2",
      "applianceName": "Refrigerator",
      "totalKwh": 7.2,
      "totalCost": 86.40,
      "avgPower": 300,
      "runtime": 1440,
      "percentage": 28.2
    }
  ]
}
```

---

## 🎨 UI Impact

### **Reports Screen**
Can now show:
- ✅ Total device consumption
- ✅ **Per-appliance breakdown** (kWh, cost, %)
- ✅ **Appliance runtime** (hours/minutes)
- ✅ **Top energy consumers** ranked by usage

### **Dashboard**
Can now display:
- ✅ Real-time appliance states
- ✅ Individual appliance power draw
- ✅ Contribution to total power

### **Analytics (Future)**
Enables:
- Appliance efficiency analysis
- Usage pattern detection
- Cost optimization recommendations
- Anomaly detection per appliance

---

## 🔧 Usage Example

### **Querying Appliance Data**
```typescript
import { readingService } from '@/services/readingService';

// Get recent readings with appliance data
const readings = await readingService.getRecentReadings(deviceId, 100);

readings.forEach(reading => {
  console.log(`Total Power: ${reading.power}W`);
  reading.applianceReadings.forEach(app => {
    console.log(`  - ${app.applianceName}: ${app.power}W (${app.isActive ? 'ON' : 'OFF'})`);
  });
});
```

### **Generating Daily Summary**
```typescript
import { consumptionSummaryService } from '@/services/consumptionSummaryService';

// Get today's readings
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const readings = await readingService.getReadingsByDateRange(deviceId, today, tomorrow);

// Generate summary with appliance breakdown
const summary = await consumptionSummaryService.generateDailySummary(
  userId,
  deviceId,
  readings
);

console.log(`Total: ${summary.totalEnergyKwh} kWh`);
summary.applianceBreakdown.forEach(app => {
  console.log(`${app.applianceName}: ${app.totalKwh} kWh (${app.percentage.toFixed(1)}%)`);
});
```

---

## 🚀 Benefits

1. **Granular Insights**: Track individual appliance consumption, not just totals
2. **Better Reports**: Show which appliances consume the most energy
3. **Cost Attribution**: Know exactly how much each appliance costs to run
4. **Usage Patterns**: Identify when appliances are used most
5. **Optimization**: Provide targeted recommendations (e.g., "Your AC uses 60% of energy")
6. **Anomaly Detection**: Detect unusual appliance behavior
7. **Hardware Ready**: When real hardware is connected, this data structure supports per-port readings

---

## 📝 Notes

- **Backward Compatible**: Existing readings without `applianceReadings` will default to `[]`
- **Automatic**: No UI changes needed - data is automatically captured
- **Efficient**: Appliance data is stored in a single array, not separate documents
- **Scalable**: Supports any number of appliances per device

---

## ✅ Status

- [x] Enhanced `RealtimeReading` interface with `applianceReadings`
- [x] Updated `readingService.saveReading()` to store appliance data
- [x] Modified `realtimeDataService` to pass appliances
- [x] Enhanced `ConsumptionSummary` with `applianceBreakdown`
- [x] Created `generateDailySummary()` for appliance aggregation
- [x] Tested with simulated data
- [x] Ready for UI integration

---

## 🔜 Next Steps (Optional)

1. **Update Reports UI** to display appliance breakdown charts
2. **Add Appliance Analytics** screen showing per-appliance trends
3. **Implement Background Job** to auto-generate daily summaries
4. **Create Appliance Comparison** feature (compare usage across days/weeks)
5. **Add Cost Projections** per appliance

---

**Last Updated**: 2026-02-02
**Status**: ✅ Complete and Ready for Use
