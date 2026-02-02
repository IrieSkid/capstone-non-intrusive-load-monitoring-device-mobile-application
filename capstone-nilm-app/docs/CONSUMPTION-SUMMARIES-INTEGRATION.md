# Consumption Summaries Integration

**Date**: February 2, 2026  
**Status**: ✅ COMPLETE

## Overview

The `consumptionSummaries` collection is now actively used to store pre-aggregated consumption data. This improves performance and provides historical tracking of energy usage patterns.

## What Was Missing

Previously, the `consumptionSummaryService` existed but was never called. The collection remained empty in Firestore.

## Implementation

### 1. Automatic Daily Summary Generation

**Location**: `contexts/RealtimeDataContext.tsx`

Added automatic daily summary generation that runs in the background:

```typescript
// Check every minute if we need to generate today's summary
const summaryInterval = setInterval(async () => {
  if (deviceIdParam && userIdParam) {
    await generateDailySummaryIfNeeded(userIdParam, deviceIdParam);
  }
}, 60000);

const generateDailySummaryIfNeeded = async (userId: string, deviceId: string) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Only generate once per day
  if (lastSummaryDate === today) {
    return;
  }

  // Get today's readings
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const readings = await readingService.getReadingsByDateRange(deviceId, startOfDay, endOfDay);

  if (readings.length > 0) {
    await consumptionSummaryService.generateDailySummary(userId, deviceId, readings);
    setLastSummaryDate(today);
  }
};
```

### 2. What Gets Stored

Each daily summary includes:

**Device-Level Metrics**:
- `totalEnergyKwh`: Total energy consumed
- `totalCost`: Total cost based on electricity rate
- `averagePower`: Average power consumption
- `peakPower`: Peak power demand
- `ratePerKwh`: Electricity rate used

**Appliance-Level Breakdown**:
```typescript
interface ApplianceConsumption {
  applianceId: string;
  applianceName: string;
  category: string;
  totalKwh: number;          // Total energy consumed
  totalCost: number;         // Cost for this appliance
  avgPower: number;          // Average power when active
  avgVoltage: number;        // Average voltage
  avgCurrent: number;        // Average current
  avgPowerFactor: number;    // Average power factor
  runtime: number;           // Total minutes active
  percentage: number;        // % of total consumption
}
```

### 3. Benefits

#### Performance
- **Before**: Reports query all raw readings (thousands of documents)
- **After**: Reports can query pre-aggregated summaries (one document per day)
- **Result**: Faster load times, reduced Firestore reads

#### Historical Data
- Daily summaries are preserved even if raw readings are purged
- Easy to generate weekly/monthly reports from daily summaries
- Trend analysis over long periods

#### Analytics
- Pre-calculated appliance breakdowns
- Percentage contributions already computed
- Average electrical parameters stored

### 4. Data Flow

```
Real-time Readings (every 3 seconds)
  ↓
Stored in realTimeReadings collection
  ↓
Daily Summary Generation (once per day)
  ↓
Aggregated into consumptionSummaries collection
  ↓
Used by Reports & Analytics
```

### 5. Example Summary Document

```json
{
  "id": "summary_20260202",
  "userId": "user123",
  "deviceId": "device456",
  "period": "daily",
  "startDate": "2026-02-02T00:00:00Z",
  "endDate": "2026-02-02T23:59:59Z",
  "totalEnergyKwh": 12.345,
  "totalCost": 141.97,
  "averagePower": 514.375,
  "peakPower": 1234.567,
  "ratePerKwh": 11.50,
  "applianceBreakdown": [
    {
      "applianceId": "app1",
      "applianceName": "Air Conditioner",
      "category": "Cooling",
      "totalKwh": 8.234,
      "totalCost": 94.69,
      "avgPower": 1200.5,
      "avgVoltage": 220.123,
      "avgCurrent": 5.456,
      "avgPowerFactor": 0.850,
      "runtime": 412,
      "percentage": 66.7
    },
    {
      "applianceId": "app2",
      "applianceName": "Refrigerator",
      "category": "Kitchen",
      "totalKwh": 2.111,
      "totalCost": 24.28,
      "avgPower": 150.0,
      "avgVoltage": 219.987,
      "avgCurrent": 0.682,
      "avgPowerFactor": 0.800,
      "runtime": 1440,
      "percentage": 17.1
    }
  ],
  "createdAt": "2026-02-02T23:59:59Z"
}
```

## Usage

### Query Daily Summaries
```typescript
const summaries = await consumptionSummaryService.getSummariesByPeriod(
  userId,
  'daily',
  startDate,
  endDate
);
```

### Query Monthly Total Cost
```typescript
const monthlyCost = await consumptionSummaryService.getMonthlyTotalCost(
  userId,
  2026,
  1 // January
);
```

### Get Device Summaries
```typescript
const deviceSummaries = await consumptionSummaryService.getDeviceSummaries(deviceId);
```

## Future Enhancements

### 1. Weekly & Monthly Summaries
Currently only daily summaries are generated. Could add:
- Weekly summaries (aggregating 7 daily summaries)
- Monthly summaries (aggregating ~30 daily summaries)

### 2. Hourly Summaries
For more granular analysis:
- Generate hourly summaries throughout the day
- Useful for peak hour analysis

### 3. Report Service Integration
Update `reportService` to:
- Check if summaries exist for date range
- Use summaries if available (faster)
- Fall back to raw readings if not

### 4. Data Retention Policy
- Keep raw readings for 30 days
- Keep daily summaries for 1 year
- Keep monthly summaries forever

### 5. Background Job
For production:
- Move summary generation to a scheduled cloud function
- Run at midnight each day
- Process all active devices

## Testing

### Verify Summaries Are Being Created

1. **Check Firestore Console**:
   - Navigate to `consumptionSummaries` collection
   - Should see new documents created daily

2. **Check Logs**:
   ```
   📊 Generating daily consumption summary...
   📊 Created consumption summary with 5 appliances
   ✅ Daily consumption summary generated
   ```

3. **Query in Code**:
   ```typescript
   const summaries = await consumptionSummaryService.getSummariesByPeriod(
     userId,
     'daily'
   );
   console.log('Total summaries:', summaries.length);
   ```

## Files Modified

1. **`contexts/RealtimeDataContext.tsx`**
   - Added `lastSummaryDate` state
   - Added `generateDailySummaryIfNeeded()` function
   - Set up interval to check for summary generation
   - Added cleanup for interval

2. **`services/reportService.ts`**
   - Imported `consumptionSummaryService`
   - Ready for future optimization to use summaries

## Related Documentation

- `services/consumptionSummaryService.ts` - Service implementation
- `types/report.ts` - TypeScript interfaces
- `PHASE-4-CONSUMPTION-ANALYTICS-COMPLETE.md` - Analytics features
- `APPLIANCE-ELECTRICAL-TRACKING-COMPLETE.md` - Electrical parameters

---

**The `consumptionSummaries` collection is now actively populated and ready for use! 📊**
