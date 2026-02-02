# ⚡ Phase 4: Electrical Parameters Enhancement

**Date**: February 2, 2026  
**Status**: ✅ Complete

---

## 🎯 Objective

Add detailed electrical parameters (Voltage, Current, Power Factor) to appliance tracking for comprehensive electrical analysis and NILM research.

---

## 📊 New Fields Added

### Appliance Interface Enhancement:
```typescript
export interface Appliance {
  // ... existing fields ...
  voltage?: number;        // Real-time voltage (V)
  current?: number;        // Real-time current (A)
  powerFactor?: number;    // Real-time power factor (0-1)
}
```

### ApplianceStatus Enhancement:
```typescript
export interface ApplianceStatus {
  // ... existing fields ...
  category: string;
  voltage: number;         // Voltage (V)
  current: number;         // Current (A)
  powerFactor: number;     // Power factor (0-1)
}
```

---

## 🔧 Implementation Details

### 1. Power Factor Defaults by Category

Different appliance types have characteristic power factors:

| Category | Power Factor | Type | Examples |
|----------|--------------|------|----------|
| **Cooling** | 0.85 | Inductive (Motors) | AC, Fans |
| **Heating** | 0.95 | Resistive | Heaters, Irons |
| **Lighting** | 0.90 | Capacitive | LED, CFL |
| **Entertainment** | 0.88 | Electronic | TV, Audio |
| **Kitchen** | 0.92 | Mixed | Microwave, Toaster |
| **Laundry** | 0.80 | Inductive (Motors) | Washer, Dryer |
| **Computing** | 0.85 | SMPS | Computer, Laptop |
| **Other** | 0.90 | Default | Miscellaneous |

### 2. Current Calculation

Current is calculated using the power triangle formula:

```typescript
current = power / (voltage * powerFactor)
```

**Example:**
- Power: 1200W
- Voltage: 220V
- Power Factor: 0.85
- Current: 1200 / (220 × 0.85) = **6.42A**

### 3. Real-Time Variation

To simulate realistic behavior, parameters vary slightly:

```typescript
// Voltage variation: ±2V
voltage = deviceVoltage + (Math.random() - 0.5) * 4

// Power variation: ±5%
power = ratedPower * (0.95 + Math.random() * 0.1)

// Power Factor variation: ±0.02
powerFactor = basePF + (Math.random() - 0.5) * 0.04
```

---

## 📱 Dashboard Display

### Active Appliance Display:
```
Air Conditioner
ON • 45m
1200W • 220V • 6.22A • PF: 0.85
```

### Information Shown:
- **Power (W)**: Current power consumption
- **Voltage (V)**: Supply voltage
- **Current (A)**: Calculated current draw
- **PF**: Power factor (efficiency indicator)

---

## 💾 Database Storage

### Appliances Collection:
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

### realTimeReadings Collection:
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

---

## 🔄 Data Flow

```
1. Appliance Loaded from Firestore
   ↓
2. Default PF assigned based on category
   ↓
3. Every 3 seconds:
   - Calculate current: I = P / (V * PF)
   - Add realistic variation
   - Update local state
   ↓
4. Every 30 seconds:
   - Save to Firestore appliances collection
   - Include in realTimeReadings
   ↓
5. Display on Dashboard
   - Show V, A, PF for active appliances
```

---

## 📊 Use Cases

### 1. Energy Efficiency Analysis
- Compare power factor across appliances
- Identify inefficient appliances (low PF)
- Calculate reactive power consumption

### 2. Electrical Load Analysis
- Total current draw calculation
- Circuit breaker sizing
- Voltage drop analysis

### 3. NILM Research
- Power signature analysis
- Appliance identification by PF
- Load disaggregation algorithms

### 4. Cost Optimization
- Identify high-current appliances
- Power factor correction recommendations
- Load balancing suggestions

---

## 🧮 Electrical Calculations

### Apparent Power (VA):
```
S = V × I
```

### Real Power (W):
```
P = V × I × PF
```

### Reactive Power (VAR):
```
Q = V × I × sin(arccos(PF))
```

### Power Factor:
```
PF = P / S = cos(θ)
```

---

## 📈 Benefits

### For Users:
- ✅ **Detailed Insights**: See exact electrical parameters
- ✅ **Efficiency Tracking**: Monitor power factor
- ✅ **Load Management**: Understand current draw
- ✅ **Safety**: Identify overload conditions

### For Research:
- ✅ **NILM Algorithms**: Rich data for disaggregation
- ✅ **Pattern Recognition**: Electrical signatures
- ✅ **Validation**: Compare with actual measurements
- ✅ **Analysis**: Comprehensive electrical data

### For Hardware Integration:
- ✅ **Per-Port Data**: Map to hardware readings
- ✅ **Validation**: Compare simulated vs actual
- ✅ **Calibration**: Adjust power factor values
- ✅ **Monitoring**: Track electrical health

---

## 🎓 Educational Value

### Understanding Power Factor:

**High PF (0.95-1.0)**: Efficient
- Resistive loads (heaters, incandescent lights)
- Most power converted to useful work

**Medium PF (0.85-0.95)**: Good
- Most household appliances
- Some reactive power

**Low PF (0.5-0.85)**: Inefficient
- Motors without correction
- Old transformers
- Needs power factor correction

---

## 🔜 Future Enhancements

### Short-Term:
1. **PF Alerts**: Notify when PF drops below threshold
2. **Efficiency Score**: Rate appliances by PF
3. **Recommendations**: Suggest PF correction
4. **Charts**: Visualize V, A, PF over time

### Long-Term:
1. **Harmonic Analysis**: THD calculation
2. **3-Phase Support**: For larger appliances
3. **Power Quality**: Voltage sag/swell detection
4. **Smart Recommendations**: AI-based optimization

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
```

---

## ✅ Completion Checklist

- [x] Added voltage, current, powerFactor fields to Appliance interface
- [x] Enhanced ApplianceStatus with electrical parameters
- [x] Implemented getDefaultPowerFactor() by category
- [x] Added current calculation: I = P / (V * PF)
- [x] Implemented realistic parameter variation
- [x] Updated Firestore persistence
- [x] Enhanced dashboard display
- [x] Updated realTimeReadings format
- [x] Tested with multiple appliances
- [x] Documented implementation

---

## 🎯 Impact

**Before:**
- Only power (W) tracked per appliance
- No electrical parameter visibility
- Limited analysis capabilities

**After:**
- Complete electrical parameters (V, A, PF)
- Detailed dashboard display
- Rich data for NILM research
- Ready for hardware validation

---

**Status**: ✅ **COMPLETE**  
**Ready for**: Phase 4 Consumption Analytics  
**Last Updated**: February 2, 2026
