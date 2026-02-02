# Real-Time Appliance Simulation - Complete

## Overview
The dashboard now displays **realistic, consistent power readings** based on your actual registered appliances from the database instead of random mock data.

---

## Key Features

### 1. Database Integration
- **Loads actual appliances** from Firestore when app starts
- Uses appliances registered via Device/Appliance management screens
- Power readings based on **rated power** from appliance specifications
- Syncs appliance on/off states to database

### 2. Manual Simulation Controls
- **Toggle switches** on dashboard to turn appliances on/off
- Simulates real-world usage patterns for testing
- Great for demos and development without hardware

### 3. Realistic Power Calculations
```typescript
Total Power = Sum of (Active Appliances' Rated Power ± 5% variance)
```
- Only **active appliances** contribute to total power
- Natural power fluctuation (±5%) for realism
- Consistent readings based on appliance specifications

### 4. Usage Tracking
- **Duration counter** tracks how long each appliance has been on
- Resets to 0 when appliance is turned on
- Displays in minutes/hours format
- Updates in real-time every 3 seconds

---

## How It Works

### System Flow
```
User Authentication
    ↓
Load User's Devices from Firestore
    ↓
Load Device's Appliances from Firestore
    ↓
Initialize Real-Time Service with Actual Appliances
    ↓
Calculate Total Power = Sum of Active Appliances
    ↓
Display on Dashboard with Toggle Controls
    ↓
User Toggles Appliance → Updates Firestore → Updates Dashboard
```

### Data Structure
```typescript
ApplianceStatus {
  id: string            // From Firestore
  name: string          // From Firestore
  icon: string          // From Firestore
  isOn: boolean         // From isActive in Firestore
  power: number         // From ratedPower ± 5%
  duration: number      // Calculated runtime in minutes
}
```

---

## Dashboard Components

### Appliance Simulation Section
```
┌─────────────────────────────────────────────┐
│ Appliance Simulation (3/8 ON)              │
├─────────────────────────────────────────────┤
│ 🎮 Toggle appliances to simulate real-time │
│    power consumption                        │
├─────────────────────────────────────────────┤
│ ACTIVE (3)                                  │
│                                             │
│  ❄️  Air Conditioner                 [ON]  │
│      ON • 45m • 1485W                       │
│                                             │
│  🧊  Refrigerator                    [ON]  │
│      ON • 2h 15m • 148W                     │
│                                             │
│  💡  Lights                          [ON]  │
│      ON • 1h 30m • 62W                      │
├─────────────────────────────────────────────┤
│ INACTIVE (5)                                │
│                                             │
│  🌀  Electric Fan                   [OFF]  │
│      OFF                                    │
│                                             │
│  📺  Television                     [OFF]  │
│      OFF                                    │
│                                             │
│  ... (more inactive appliances)             │
└─────────────────────────────────────────────┘
```

### Power Card
Shows real-time total power = sum of all active appliances

### Parameters Grid
- Voltage: 220V ± 5V
- Current: Calculated from power
- Power Factor: 0.85-0.95
- Frequency: 60Hz ± 0.1Hz

---

## Code Changes

### `services/realtimeDataService.ts`
- **Before**: Used hardcoded mock appliances
- **After**: Loads actual appliances from Firestore
- **New Methods**:
  - `loadAppliances(userId, deviceId)` - Fetch from Firestore
  - `toggleAppliance(applianceId)` - Manually control appliances
- **Removed**: Random appliance state changes

### `contexts/RealtimeDataContext.tsx`
- Added `toggleAppliance` to context interface
- Passes `userId` to service when starting
- Exposes toggle function to components

### `components/dashboard/ApplianceList.tsx`
- **Before**: Showed only active appliances (read-only)
- **After**: Shows ALL appliances with toggle switches
- Separated into ACTIVE and INACTIVE sections
- Shows appliance count: "3/8 ON"
- Added simulation instructions

### `app/(tabs)/index.tsx`
- Updated info message to explain simulation system

---

## Usage Guide

### For Development/Testing
1. **Add Appliances**: Go to Devices tab → Select device → Manage Appliances → Add appliances
2. **Return to Dashboard**: Navigate back to Dashboard tab
3. **Toggle Appliances**: Flip switches to turn appliances on/off
4. **Watch Power Update**: Total power updates in real-time
5. **Check Duration**: See how long each appliance has been running

### Example Scenario
```
Initial State: All appliances OFF, Total Power = 0W

User turns ON:
- Air Conditioner (1500W)
- Refrigerator (150W)  
- Lights (60W)

Result:
- Total Power ≈ 1710W (with variance)
- Dashboard shows 3/8 appliances active
- Duration counters start for each
- Power card updates every 3 seconds
```

---

## Benefits

### ✅ Consistency
- No more random, unpredictable power readings
- Readings match your actual registered appliances
- Same appliances every time

### ✅ Realistic
- Based on actual rated power specifications
- Natural power variations (±5%)
- Proper electrical parameter calculations

### ✅ Controllable
- Toggle appliances for specific test scenarios
- Predictable outcomes for demos
- Easy to reproduce issues

### ✅ Database-Driven
- Uses real Firestore data
- Changes persist to database
- Ready for hardware integration

### ✅ Demo-Ready
- Show clients realistic usage scenarios
- Toggle appliances during presentations
- Explain NILM classification visually

---

## Future Hardware Integration

When IoT hardware is connected:

### Current (Simulation Mode)
- Manual toggle switches
- Simulated power based on rated power
- User-controlled appliance states

### Future (Hardware Mode)
- **Automatic detection** of appliance on/off states
- **Real power signatures** from sensors
- **NILM classification** identifies which appliance turned on
- Toggle switches become **status indicators** (read-only)
- **Training mode** to improve detection accuracy

The simulation system provides the perfect foundation for hardware integration!

---

## Testing Checklist

- [ ] Dashboard loads appliances from Firestore
- [ ] Appliance count shows "X/Y ON" format
- [ ] Toggle switches work for each appliance
- [ ] Total power updates when toggling appliances
- [ ] Duration counters increment for active appliances
- [ ] Duration resets when turning appliance on
- [ ] ACTIVE and INACTIVE sections display correctly
- [ ] Power readings are consistent and predictable
- [ ] Appliance states persist to Firestore
- [ ] Empty state shows if no appliances exist

---

## Technical Details

### Real-Time Update Cycle (Every 3 seconds)
1. Calculate total power from active appliances
2. Add ±5% variance for realism
3. Update voltage, current, power factor, frequency
4. Increment duration for active appliances
5. Notify all subscribers (dashboard components)
6. **Every 30 seconds**: Save reading to Firestore

### Power Calculation
```typescript
// Get active appliances
const activeAppliances = appliances.filter(a => a.isOn);

// Sum their power with small variance
const basePower = activeAppliances.reduce(
  (sum, a) => sum + a.power, 0
);

// Add realistic fluctuation
const power = basePower * (0.95 + Math.random() * 0.1);
```

### Duration Tracking
```typescript
// Every 3 seconds, add 0.05 minutes (3/60)
if (appliance.isOn) {
  appliance.duration += 0.05;
}
```

---

## Troubleshooting

### "No appliances found"
- Add appliances via Devices tab
- Make sure appliances are linked to a device
- Check Firestore permissions

### "Toggle not working"
- Check internet connection
- Verify Firestore write permissions
- Look for console errors

### "Power not updating"
- Check if real-time service is running (console logs)
- Verify appliances loaded successfully
- Refresh the dashboard (pull down)

---

## Success Metrics

**✅ All Goals Achieved**:
- [x] Load appliances from Firestore
- [x] Calculate power based on rated specifications
- [x] Provide toggle controls for simulation
- [x] Track appliance usage duration
- [x] Persist states to database
- [x] Display realistic, consistent readings
- [x] Separate active/inactive appliances
- [x] Update in real-time every 3 seconds

---

*Real-Time Appliance Simulation Complete!*  
*Ready for realistic testing and demonstrations*  
*Date: February 2, 2026*
