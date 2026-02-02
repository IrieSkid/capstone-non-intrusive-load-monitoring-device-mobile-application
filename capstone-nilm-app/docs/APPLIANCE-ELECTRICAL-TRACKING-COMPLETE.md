# ⚡ Appliance Electrical Parameters Tracking - COMPLETE

**Date**: February 2, 2026  
**Status**: ✅ Complete

---

## 🎯 What Was Implemented

Enhanced the entire system to track and display detailed electrical parameters (Voltage, Current, Power Factor) for each appliance, providing comprehensive data for NILM research and user insights.

---

## 📊 New Fields Added

### 1. Appliance Interface (Database Schema)
```typescript
export interface Appliance {
  // ... existing fields ...
  voltage?: number;        // Real-time voltage (V)
  current?: number;        // Real-time current (A)
  powerFactor?: number;    // Real-time power factor (0-1)
}
```

### 2. ApplianceStatus (Real-time Simulation)
```typescript
export interface ApplianceStatus {
  // ... existing fields ...
  category: string;
  voltage: number;         // Voltage (V)
  current: number;         // Current (A)
  powerFactor: number;     // Power factor (0-1)
}
```

### 3. ApplianceConsumption (Reports & Analytics)
```typescript
export interface ApplianceConsumption {
  // ... existing fields ...
  category: string;
  avgPower?: number;        // Average power (W)
  avgVoltage?: number;      // Average voltage (V)
  avgCurrent?: number;      // Average current (A)
  avgPowerFactor?: number;  // Average power factor (0-1)
}
```

---

## 🔧 Implementation Details

### Power Factor Defaults by Category

| Category | PF | Type | Rationale |
|----------|-----|------|-----------|
| **Cooling** | 0.85 | Inductive | AC units, fans have motors |
| **Heating** | 0.95 | Resistive | Heaters are resistive loads |
| **Lighting** | 0.90 | Capacitive | LED/CFL ballasts |
| **Entertainment** | 0.88 | Electronic | TV, audio systems |
| **Kitchen** | 0.92 | Mixed | Microwave, toaster |
| **Laundry** | 0.80 | Inductive | Washer/dryer motors |
| **Computing** | 0.85 | SMPS | Computer power supplies |
| **Other** | 0.90 | Default | Generic appliances |

### Current Calculation Formula
```typescript
current = power / (voltage * powerFactor)
```

**Example:**
- Air Conditioner: 1200W, 220V, PF 0.85
- Current: 1200 / (220 × 0.85) = **6.42A**

### Real-Time Variation
```typescript
// Voltage: ±2V
voltage = deviceVoltage + (Math.random() - 0.5) * 4

// Power: ±5%
power = ratedPower * (0.95 + Math.random() * 0.1)

// Power Factor: ±0.02
powerFactor = basePF + (Math.random() - 0.5) * 0.04
```

---

## 📱 User Interface Updates

### 1. Dashboard - Appliance List
**Before:**
```
Air Conditioner
ON • 45m • 1200W
```

**After:**
```
Air Conditioner
ON • 45m
1200W • 220V • 6.22A • PF: 0.85
```

### 2. Reports - Appliance Breakdown
**Before:**
```
Air Conditioner
4.5h/day · 35% of total
12.5 kWh
₱150.00
```

**After:**
```
Air Conditioner
4.5h/day · 35% of total
1200W • 220V • 6.22A • PF: 0.85
12.5 kWh
₱150.00
```

---

## 💾 Database Structure

### Appliances Collection
```javascript
{
  id: "app-123",
  name: "Air Conditioner",
  category: "Cooling",
  ratedPower: 1500,
  isActive: true,
  // NEW FIELDS:
  currentPower: 1485,
  voltage: 220.5,
  current: 6.42,
  powerFactor: 0.85,
  usageMinutes: 145,
  lastDetected: Date
}
```

### realTimeReadings Collection
```javascript
{
  deviceId: "device-123",
  timestamp: Date,
  power: 1500,
  voltage: 220,
  current: 6.82,
  powerFactor: 0.95,
  applianceReadings: [
    {
      applianceId: "app-1",
      applianceName: "Air Conditioner",
      category: "Cooling",
      // NEW FIELDS:
      power: 1200,
      voltage: 220.5,
      current: 6.22,
      powerFactor: 0.85,
      isActive: true,
      runtime: 45
    }
  ]
}
```

### consumptionSummaries Collection
```javascript
{
  userId: "user-123",
  deviceId: "device-123",
  period: "daily",
  applianceBreakdown: [
    {
      applianceId: "app-1",
      applianceName: "Air Conditioner",
      category: "Cooling",
      totalKwh: 12.5,
      totalCost: 150.00,
      // NEW FIELDS:
      avgPower: 1200,
      avgVoltage: 220.5,
      avgCurrent: 6.22,
      avgPowerFactor: 0.85,
      runtime: 270, // minutes
      percentage: 35.5
    }
  ]
}
```

---

## 🔄 Data Flow

```
1. Appliance Loaded
   ↓
2. Assign Default PF (based on category)
   ↓
3. Every 3 seconds:
   - Calculate: I = P / (V * PF)
   - Add realistic variation
   - Update local state
   ↓
4. Every 30 seconds:
   - Save to appliances collection
   - Include in realTimeReadings
   ↓
5. Daily Summary Generation:
   - Calculate averages from realTimeReadings
   - Store in consumptionSummaries
   ↓
6. Display in UI:
   - Dashboard: Real-time V, A, PF
   - Reports: Average V, A, PF
```

---

## 📊 Use Cases

### 1. Energy Efficiency Analysis
```
Low PF Alert:
"Your washing machine has a power factor of 0.75.
Consider power factor correction to reduce reactive power."
```

### 2. Circuit Load Analysis
```
Total Current: 25.5A
Circuit Capacity: 30A
Headroom: 4.5A (15%)
⚠️ Warning: Approaching circuit limit
```

### 3. NILM Research
```
Appliance Signature:
- Power: 1200W
- Voltage: 220V
- Current: 6.22A
- PF: 0.85
→ Identified as: Air Conditioner (Cooling)
```

### 4. Cost Optimization
```
High Current Appliances:
1. AC Unit: 6.22A → ₱150/day
2. Heater: 9.57A → ₱200/day
3. Washer: 5.45A → ₱80/day

Recommendation: Stagger usage to reduce peak demand
```

---

## 🧮 Electrical Calculations

### Apparent Power (VA)
```
S = V × I
S = 220V × 6.22A = 1368 VA
```

### Real Power (W)
```
P = V × I × PF
P = 220V × 6.22A × 0.85 = 1163W
```

### Reactive Power (VAR)
```
Q = √(S² - P²)
Q = √(1368² - 1163²) = 721 VAR
```

### Power Factor
```
PF = P / S
PF = 1163W / 1368VA = 0.85
```

---

## 📈 Benefits

### For Users:
✅ **Detailed Insights**: See exact electrical parameters  
✅ **Efficiency Tracking**: Monitor power factor  
✅ **Load Management**: Understand current draw  
✅ **Safety**: Identify overload conditions  
✅ **Cost Awareness**: Link electrical params to cost

### For Research:
✅ **NILM Algorithms**: Rich data for disaggregation  
✅ **Pattern Recognition**: Electrical signatures  
✅ **Validation**: Compare simulated vs actual  
✅ **Analysis**: Comprehensive electrical data  
✅ **Publications**: Real-world data for papers

### For Hardware Integration:
✅ **Per-Port Data**: Map to hardware readings  
✅ **Validation**: Compare simulated vs actual  
✅ **Calibration**: Adjust power factor values  
✅ **Monitoring**: Track electrical health  
✅ **Diagnostics**: Identify hardware issues

---

## 🎓 Educational Value

### Understanding Power Factor

**High PF (0.95-1.0)**: ✅ Efficient
- Resistive loads (heaters, lights)
- Most power → useful work
- Low reactive power

**Medium PF (0.85-0.95)**: ⚠️ Good
- Most household appliances
- Some reactive power
- Acceptable efficiency

**Low PF (0.5-0.85)**: ❌ Inefficient
- Motors without correction
- High reactive power
- Needs PF correction

### Why PF Matters

**For Utilities:**
- Low PF → Higher transmission losses
- Need larger transformers
- Reduced grid capacity

**For Users:**
- Low PF → Higher current draw
- Larger wire sizes needed
- Potential penalties (commercial)

**For Environment:**
- Low PF → More generation needed
- Higher carbon emissions
- Wasted energy

---

## 🔜 Future Enhancements

### Short-Term (Phase 4):
- [ ] PF alerts when below threshold
- [ ] Efficiency score by PF
- [ ] PF correction recommendations
- [ ] V, A, PF charts over time

### Medium-Term (Phase 5):
- [ ] Harmonic analysis (THD)
- [ ] Power quality monitoring
- [ ] Voltage sag/swell detection
- [ ] Load balancing suggestions

### Long-Term (Phase 6):
- [ ] 3-phase support
- [ ] Smart recommendations (AI)
- [ ] Predictive maintenance
- [ ] Integration with smart meters

---

## 📊 Example Scenarios

### Scenario 1: Air Conditioner
```
Category: Cooling
Rated Power: 1500W
Power Factor: 0.85 (Motor)

At 220V:
- Current: 1500 / (220 × 0.85) = 8.02A
- Apparent Power: 220 × 8.02 = 1764 VA
- Reactive Power: √(1764² - 1500²) = 929 VAR
- Daily Cost (8h): (1.5kW × 8h × ₱12) = ₱144
```

### Scenario 2: Electric Heater
```
Category: Heating
Rated Power: 2000W
Power Factor: 0.95 (Resistive)

At 220V:
- Current: 2000 / (220 × 0.95) = 9.57A
- Apparent Power: 220 × 9.57 = 2105 VA
- Reactive Power: √(2105² - 2000²) = 656 VAR
- Daily Cost (4h): (2kW × 4h × ₱12) = ₱96
```

### Scenario 3: Washing Machine
```
Category: Laundry
Rated Power: 1000W
Power Factor: 0.80 (Motor)

At 220V:
- Current: 1000 / (220 × 0.80) = 5.68A
- Apparent Power: 220 × 5.68 = 1250 VA
- Reactive Power: √(1250² - 1000²) = 750 VAR
- Daily Cost (2h): (1kW × 2h × ₱12) = ₱24
```

---

## ✅ Files Modified

### Services:
- ✅ `services/firestoreApplianceService.ts` - Added V, A, PF fields
- ✅ `services/realtimeDataService.ts` - Calculate & update electrical params
- ✅ `services/readingService.ts` - Save electrical params to DB
- ✅ `services/consumptionSummaryService.ts` - Calculate averages

### Components:
- ✅ `components/dashboard/ApplianceList.tsx` - Display V, A, PF
- ✅ `components/reports/ApplianceBreakdown.tsx` - Show averages

### Types:
- ✅ `types/report.ts` - Added electrical fields to ApplianceConsumption

### Documentation:
- ✅ `docs/PHASE-4-ELECTRICAL-PARAMETERS.md` - Comprehensive guide
- ✅ `docs/APPLIANCE-ELECTRICAL-TRACKING-COMPLETE.md` - This file

---

## 🎯 Impact Summary

**Before:**
- Only power (W) tracked per appliance
- No electrical parameter visibility
- Limited analysis capabilities
- Basic NILM data

**After:**
- Complete electrical parameters (V, A, PF)
- Real-time calculation and display
- Detailed dashboard and reports
- Rich data for NILM research
- Ready for hardware validation
- Educational insights for users

---

## 📝 Testing Checklist

- [x] Appliances load with default PF by category
- [x] Current calculated correctly: I = P / (V * PF)
- [x] Real-time variation applied (±2V, ±5% P, ±0.02 PF)
- [x] Electrical params saved to Firestore every 30s
- [x] Dashboard displays V, A, PF for active appliances
- [x] Reports show average V, A, PF per appliance
- [x] Averages calculated correctly in summaries
- [x] Database structure supports new fields
- [x] Backward compatibility maintained (optional fields)
- [x] No linter errors

---

## 🎓 Research Value

This enhancement provides:

1. **Electrical Signatures**: V, A, PF patterns for each appliance
2. **NILM Training Data**: Rich dataset for machine learning
3. **Validation Metrics**: Compare simulated vs actual hardware
4. **Power Quality**: Track voltage stability and PF
5. **Load Analysis**: Understand reactive power consumption
6. **Efficiency Studies**: Correlate PF with energy cost
7. **User Behavior**: Link electrical params to usage patterns
8. **Hardware Design**: Inform sensor placement and calibration

---

**Status**: ✅ **COMPLETE**  
**Ready for**: Phase 4 Consumption Analytics (Remaining Items)  
**Last Updated**: February 2, 2026

---

## 🚀 Next Steps

Continue with Phase 4:
1. ✅ Appliance-wise breakdown with V, A, PF ← **DONE**
2. ⏭️ Consumption history screen
3. ⏭️ Daily/weekly/monthly charts
4. ⏭️ Cost analysis
5. ⏭️ Export to CSV/PDF
