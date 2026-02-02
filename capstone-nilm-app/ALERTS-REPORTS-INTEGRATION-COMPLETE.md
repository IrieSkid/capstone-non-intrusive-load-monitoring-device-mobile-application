# Alerts, Reports & Notifications Integration - Complete

## Overview
The Reports, Notifications, and Alert Rules are now fully integrated with the real-time simulation system. The entire data pipeline is connected end-to-end:

**Simulation → Real-Time Data → Alert Monitoring → Notifications → Reports**

---

## System Architecture

### Data Flow
```
User Toggles Appliance ON
        ↓
Real-Time Service Updates Power Reading
        ↓
Reading Saved to Firestore (every 30s)
        ↓
Alert Monitoring Service Checks Rules
        ↓
If Threshold Exceeded → Create Notification
        ↓
User Sees Notification in Alerts Tab
        ↓
Reports Generated from Firestore Readings
```

---

## 1. Alert Monitoring System

### New Service: `alertMonitoringService.ts`

**Purpose**: Continuously monitors real-time data and triggers notifications when alert rules are violated.

### Features

#### Automatic Rule Checking
- Checks ALL active alert rules every 3 seconds
- Evaluates rules against current readings
- No manual intervention required

#### Supported Alert Types
1. **power_threshold** - Triggers when power exceeds limit (e.g., >2000W)
2. **consumption_limit** - Triggers when daily kWh exceeds limit
3. **budget_exceeded** - Triggers when estimated cost exceeds budget
4. **unusual_pattern** - Triggers on prolonged high power consumption

#### Monitoring State
```typescript
{
  dailyConsumption: number;  // Cumulative kWh today
  peakPower: number;         // Highest power reading today
  consecutiveHighPowerMinutes: number; // Time at high power
  lastResetTime: Date;       // When daily stats were reset
}
```

#### Notification Throttling
- Prevents notification spam
- Maximum: 1 notification per rule per hour
- Tracks last notification time in memory

---

## 2. Alert Rules

### Default Rules Created Automatically
When a user first signs up, three default alert rules are created:

```typescript
1. Daily Consumption Alert
   - Type: consumption_limit
   - Threshold: 50 kWh
   - Severity: high
   - Message: "Daily consumption exceeded 50 kWh"

2. Monthly Budget Alert
   - Type: budget_exceeded
   - Threshold: ₱2000
   - Severity: high
   - Message: "Monthly cost exceeded ₱2000"

3. Device Offline Alert
   - Type: device_offline
   - Threshold: 15 minutes
   - Severity: medium
   - Message: "Device offline for 15 minutes"
```

### How Rules Are Evaluated

#### Power Threshold Example
```typescript
// Rule: Alert when power > 2000W
currentPower = 2500W  // From real-time reading
threshold = 2000W     // From alert rule
condition = '>'

if (2500 > 2000) {
  → CREATE NOTIFICATION ✅
}
```

#### Consumption Limit Example
```typescript
// Rule: Alert when daily consumption > 50 kWh
dailyConsumption = 52.5 kWh  // Tracked by monitoring service
threshold = 50 kWh            // From alert rule

if (52.5 > 50) {
  → CREATE NOTIFICATION ✅
}
```

---

## 3. Notifications

### Auto-Generated Notifications

When an alert rule triggers, a notification is automatically created:

```typescript
{
  userId: "user123",
  type: "alert",
  priority: "high",
  title: "⚡ High Power Usage Alert",
  message: "Current power consumption (2500W) exceeds your threshold of 2000W",
  isRead: false,
  ruleId: "rule123",
  deviceId: "device456",
  createdAt: new Date()
}
```

### Notification Types
- **alert** - Triggered by alert rules
- **warning** - Important but not critical
- **info** - General information
- **error** - System errors

### Notification Priorities
- **critical** - Requires immediate attention
- **high** - Important alerts
- **medium** - Normal notifications
- **low** - Informational

---

## 4. Reports System

### Now Uses Real Data!

**Before**: Mock/random data  
**After**: Actual Firestore readings from simulation

### Report Types

#### Daily Report
```typescript
{
  date: today,
  totalKwh: 12.5,           // From Firestore readings
  peakPower: 2500,          // Maximum from readings
  avgPower: 1200,           // Average from readings
  totalCost: 150,           // kWh × ₱12
  hourlyData: [...],        // Power by hour
  comparisonToYesterday: 5  // % change
}
```

#### Weekly Report
```typescript
{
  startDate: lastSunday,
  endDate: now,
  totalKwh: 85.2,
  avgDailyKwh: 12.2,
  peakPower: 3000,
  totalCost: 1022.40,
  dailyData: [...],         // 7 days of data
  comparisonToPreviousWeek: -8
}
```

#### Monthly Report
```typescript
{
  month: currentMonth,
  totalKwh: 350.5,
  avgDailyKwh: 11.7,
  peakPower: 3500,
  totalCost: 4206,
  dailyData: [...],         // All days in month
  applianceBreakdown: [...], // Usage by appliance
  comparisonToPreviousMonth: 12
}
```

### Appliance Breakdown

Reports now show which appliances consumed the most energy:

```typescript
[
  { name: "Air Conditioner", kwh: 125.5, percentage: 35.8% },
  { name: "Water Heater", kwh: 85.2, percentage: 24.3% },
  { name: "Refrigerator", kwh: 45.8, percentage: 13.1% },
  { name: "Television", kwh: 32.1, percentage: 9.2% },
  // ...
]
```

**Calculation**: `(RatedPower / 1000) × (UsageMinutes / 60)`

---

## 5. Real-Time Integration

### RealtimeDataContext Updates

```typescript
// When real-time service starts:
1. Initialize alert monitoring service
2. Load active alert rules from Firestore
3. Subscribe to data updates
4. For EACH reading every 3 seconds:
   - Update monitoring state
   - Check all alert rules
   - Trigger notifications if needed
   - Save to Firestore (every 30s)
```

### Example Timeline

```
00:00:00 - User turns ON Air Conditioner (1500W)
00:00:03 - Reading: 1485W, Alert check: OK
00:00:06 - Reading: 1520W, Alert check: OK
00:00:09 - Reading: 1505W, Alert check: OK
00:00:12 - User turns ON Water Heater (1200W)
00:00:15 - Reading: 2700W, Alert check: TRIGGERED! (>2000W)
00:00:15 - Notification created: "High Power Usage Alert"
00:00:18 - Reading: 2650W, Alert check: Throttled (already notified)
00:00:30 - Reading saved to Firestore
... continues every 3 seconds
```

---

## 6. Usage Examples

### Scenario 1: Budget Monitoring

**Setup**:
- User creates alert rule: "Alert when daily cost > ₱100"
- Rate: ₱12 per kWh
- Threshold: 8.33 kWh per day

**Simulation**:
```
User turns ON:
- AC (1500W) for 3 hours = 4.5 kWh
- Water Heater (1200W) for 2 hours = 2.4 kWh
- Refrigerator (150W) for 24 hours = 3.6 kWh

Total: 10.5 kWh × ₱12 = ₱126

Result: ⚠️ ALERT TRIGGERED
"Estimated daily cost (₱126) has exceeded your budget of ₱100"
```

### Scenario 2: High Power Alert

**Setup**:
- Default rule: "Alert when power > 2000W"

**Simulation**:
```
Current appliances ON:
- AC: 1500W
- User turns ON Water Heater: 1200W

Total Power: 2700W

Result: ⚠️ ALERT TRIGGERED
"Current power consumption (2700W) exceeds your threshold of 2000W"
```

### Scenario 3: Unusual Pattern

**Setup**:
- Rule: "Alert when high power (>2000W) sustained for 30 minutes"

**Simulation**:
```
00:00 - Power: 2500W (start tracking)
00:03 - Power: 2480W (continue tracking)
00:06 - Power: 2550W (continue tracking)
...
00:30 - Power: 2520W (30 minutes reached)

Result: ⚠️ ALERT TRIGGERED
"High power consumption detected for 30 minutes"
```

---

## 7. Testing Guide

### Test Alert Monitoring

**Test 1: Power Threshold**
1. Create alert rule: power > 1000W
2. Turn ON Air Conditioner (1500W)
3. Wait 3 seconds
4. Check Alerts tab → Should see notification

**Test 2: Consumption Limit**
1. Create alert rule: daily consumption > 1 kWh
2. Run appliances for 1+ hour total
3. Check Alerts tab → Should see notification

**Test 3: Budget Alert**
1. Create alert rule: daily cost > ₱50
2. Run high-power appliances
3. When cost exceeds ₱50 → Notification appears

### Test Reports

**Test 1: Daily Report**
1. Toggle appliances throughout the day
2. Go to Reports tab
3. Daily report shows:
   - Total kWh matches simulation
   - Peak power shows highest reading
   - Hourly chart reflects usage pattern

**Test 2: Appliance Breakdown**
1. Run different appliances for various durations
2. View Monthly report
3. Appliance breakdown shows usage proportions

### Test Integration

**Complete Flow Test**:
1. Start fresh day (reset app)
2. Turn ON 3 appliances
3. Wait 30 seconds → Reading saved to Firestore
4. Turn ON 1 more appliance → Power exceeds threshold
5. Notification appears in Alerts tab
6. Go to Reports → See actual consumption data
7. Export report → Data matches simulation

---

## 8. Configuration

### Alert Rule Settings

Users can customize alert rules:
```typescript
{
  alertType: 'power_threshold',
  thresholdValue: 2500,  // ← Adjustable
  condition: '>',
  severity: 'high',       // ← Adjustable
  isActive: true,         // ← Can disable
  notifyPush: true,       // ← Can toggle
  description: "Custom message..."  // ← Customizable
}
```

### Electricity Rate

Default: ₱12 per kWh  
Configurable in: `reportService.ts`

```typescript
private readonly costPerKwh = 12; // ← Change here
```

---

## 9. Future Enhancements

### Phase 5 (Hardware Integration)
- Real power signature detection
- Automatic appliance state updates
- No need for manual toggles

### Phase 6 (Advanced Alerts)
- Predictive alerts (based on patterns)
- Cost forecasting
- Anomaly detection using ML
- Email/SMS notifications

### Phase 7 (Smart Recommendations)
- "Turn off AC to save ₱50/day"
- "Your usage is 20% higher than similar households"
- Energy-saving tips based on patterns

---

## 10. Troubleshooting

### Notifications Not Appearing
- Check alert rules are `isActive: true`
- Verify threshold is actually exceeded
- Check if notification was throttled (wait 1 hour)
- Look for errors in console

### Reports Showing Zero
- Ensure appliances have been running
- Wait 30 seconds for first Firestore save
- Check deviceId is valid
- Verify readings exist in Firestore

### Alert Monitoring Not Working
- Check real-time service is running
- Verify alert monitoring initialized
- Look for console logs: "✅ Alert monitoring initialized"
- Check active rules count

---

## 11. Key Benefits

### ✅ Complete Integration
- Every component connected
- Data flows end-to-end
- No more mock/random data

### ✅ Realistic Testing
- Simulate real-world scenarios
- Predictable behavior
- Reproducible issues

### ✅ Production-Ready
- Uses actual database
- Proper error handling
- Scalable architecture

### ✅ User-Friendly
- Automatic alert monitoring
- No manual configuration needed
- Intuitive notifications

---

## Success Metrics

**✅ All Integration Complete**:
- [x] Alert monitoring service created
- [x] Auto-trigger notifications from rules
- [x] Reports use Firestore data
- [x] Appliance breakdown calculated
- [x] Real-time data pipeline connected
- [x] Throttling prevents spam
- [x] Daily stats tracking
- [x] Cost calculations
- [x] Multiple alert types supported
- [x] Production-ready architecture

---

*Complete System Integration Achieved!*  
*Simulation → Monitoring → Alerts → Reports*  
*Date: February 2, 2026*
