# Readings and Rates Tables Analysis

**Tables Reviewed:** `tblreal_time_readings` and `tblelectricity_rates`  
**Date:** 2026  
**Status:** ✅ Verified

## Table 1: `tblreal_time_readings`

### Purpose
Stores real-time electrical measurements from IoT devices. Each reading captures voltage, current, power, and energy consumption at a specific point in time.

### Schema Structure

```sql
CREATE TABLE tblreal_time_readings (
    real_time_readings_id INT PRIMARY KEY AUTO_INCREMENT,
    real_time_readings_device_id INT NOT NULL,
    real_time_readings_appliance_id INT,  -- NULLABLE
    real_time_readings_voltage_rms DECIMAL(10, 2) NOT NULL,
    real_time_readings_current_rms DECIMAL(10, 2) NOT NULL,
    real_time_readings_power_watts DECIMAL(10, 2) NOT NULL,
    real_time_readings_apparent_power_va DECIMAL(10, 2) NOT NULL,
    real_time_readings_power_factor DECIMAL(5, 4) NOT NULL,
    real_time_readings_energy_kwh DECIMAL(10, 6) NOT NULL,
    real_time_readings_recorded_at DATETIME NOT NULL,
    FOREIGN KEY (real_time_readings_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE,
    FOREIGN KEY (real_time_readings_appliance_id) REFERENCES tblappliances(appliances_id) ON DELETE SET NULL,
    INDEX idx_real_time_readings_recorded_at (real_time_readings_recorded_at),
    INDEX idx_real_time_readings_device_appliance (real_time_readings_device_id, real_time_readings_appliance_id),
    INDEX idx_real_time_readings_device_time (real_time_readings_device_id, real_time_readings_recorded_at),
    INDEX idx_real_time_readings_appliance_time (real_time_readings_appliance_id, real_time_readings_recorded_at)
);
```

### Key Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `real_time_readings_id` | INT | ✅ | Primary key, auto-increment |
| `real_time_readings_device_id` | INT | ✅ | **Required** - Links to `tbldevices` |
| `real_time_readings_appliance_id` | INT | ❌ | **Nullable** - Links to `tblappliances` (NULL = aggregate reading) |
| `real_time_readings_voltage_rms` | DECIMAL(10,2) | ✅ | Voltage RMS in Volts |
| `real_time_readings_current_rms` | DECIMAL(10,2) | ✅ | Current RMS in Amperes |
| `real_time_readings_power_watts` | DECIMAL(10,2) | ✅ | Instantaneous power in Watts |
| `real_time_readings_apparent_power_va` | DECIMAL(10,2) | ✅ | Apparent power in VA |
| `real_time_readings_power_factor` | DECIMAL(5,4) | ✅ | Power factor (0.0000 to 1.0000) |
| `real_time_readings_energy_kwh` | DECIMAL(10,6) | ✅ | Energy consumption in kWh |
| `real_time_readings_recorded_at` | DATETIME | ✅ | Timestamp of the reading |

### Relationships

#### 1. Device Relationship
- **Parent:** `tbldevices.devices_id`
- **Child:** `tblreal_time_readings.real_time_readings_device_id`
- **Cardinality:** 1:N (One device has many readings)
- **Constraint:** `ON DELETE CASCADE`
- **Required:** ✅ YES (NOT NULL)
- **Behavior:** When a device is deleted, all its readings are deleted

#### 2. Appliance Relationship
- **Parent:** `tblappliances.appliances_id`
- **Child:** `tblreal_time_readings.real_time_readings_appliance_id`
- **Cardinality:** 1:N (One appliance has many readings)
- **Constraint:** `ON DELETE SET NULL`
- **Required:** ❌ NO (NULLABLE)
- **Behavior:** 
  - When `appliance_id` is set → Appliance-specific reading
  - When `appliance_id` is NULL → Device-level aggregate reading
  - When appliance is deleted → `appliance_id` becomes NULL (reading preserved)

### Design Rationale

✅ **Why `appliance_id` is nullable:**
- Supports device-level aggregate readings (total power consumption of all appliances)
- Allows readings before appliances are configured
- Enables system-level monitoring

✅ **Why CASCADE for device, SET NULL for appliance:**
- Device deletion = remove all readings (device is gone)
- Appliance deletion = preserve readings but mark appliance_id as NULL (historical data)

### Indexes

1. **`idx_real_time_readings_recorded_at`** - Time-series queries
2. **`idx_real_time_readings_device_appliance`** - Filter by device and appliance
3. **`idx_real_time_readings_device_time`** - Device readings over time
4. **`idx_real_time_readings_appliance_time`** - Appliance readings over time

### Data Flow

```
IoT Device → Sends Reading → tblreal_time_readings
                              ↓
                    (Aggregated Periodically)
                              ↓
                    tblconsumption_summaries
```

---

## Table 2: `tblelectricity_rates`

### Purpose
Stores electricity rate information (PHP per kWh) with effective date ranges. Supports historical rate tracking and rate changes over time.

### Schema Structure

```sql
CREATE TABLE tblelectricity_rates (
    electricity_rates_id INT PRIMARY KEY AUTO_INCREMENT,
    electricity_rates_name VARCHAR(255) NOT NULL,
    electricity_rates_peso_per_kwh DECIMAL(10, 4) NOT NULL,
    electricity_rates_effective_from DATE NOT NULL,
    electricity_rates_effective_to DATE,  -- NULLABLE
    electricity_rates_is_active BOOLEAN DEFAULT TRUE,
    electricity_rates_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_electricity_rates_active (electricity_rates_is_active, electricity_rates_effective_from)
);
```

### Key Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `electricity_rates_id` | INT | ✅ | Primary key, auto-increment |
| `electricity_rates_name` | VARCHAR(255) | ✅ | Descriptive name (e.g., "Residential Rate 2026") |
| `electricity_rates_peso_per_kwh` | DECIMAL(10,4) | ✅ | Rate per kWh in PHP (e.g., 12.5000) |
| `electricity_rates_effective_from` | DATE | ✅ | Start date when rate becomes effective |
| `electricity_rates_effective_to` | DATE | ❌ | End date (NULL = currently active) |
| `electricity_rates_is_active` | BOOLEAN | ✅ | Active status flag |
| `electricity_rates_created_at` | DATETIME | ✅ | Creation timestamp |

### Relationships

#### Consumption Summaries Relationship
- **Parent:** `tblelectricity_rates.electricity_rates_id`
- **Child:** `tblconsumption_summaries.consumption_summaries_electricity_rate_id`
- **Cardinality:** 1:N (One rate used in many summaries)
- **Constraint:** `ON DELETE RESTRICT`
- **Purpose:** Tracks which rate was used for each cost calculation
- **Behavior:** Prevents deletion of rates that are referenced in summaries

### Design Rationale

✅ **Why `ON DELETE RESTRICT`:**
- Prevents accidental deletion of rates that are referenced
- Maintains historical accuracy of cost calculations
- Ensures audit trail integrity

✅ **Why date ranges (`effective_from` / `effective_to`):**
- Supports rate changes over time
- Allows historical rate tracking
- Enables queries for "active rate at a specific date"

### Indexes

1. **`idx_electricity_rates_active`** - Composite index on `is_active` and `effective_from`
   - Optimizes queries for active rates
   - Supports date-based rate lookups

### Data Flow

```
Admin Creates Rate → tblelectricity_rates
                              ↓
                    (Referenced When Calculating)
                              ↓
                    tblconsumption_summaries
                    (consumption_summaries_electricity_rate_id)
```

---

## Relationship Between Readings and Rates

### ⚠️ Important: No Direct Relationship

**`tblreal_time_readings` and `tblelectricity_rates` do NOT have a direct relationship.**

### Indirect Relationship Through Consumption Summaries

```
tblreal_time_readings
    ↓ (aggregated)
tblconsumption_summaries
    ↓ (references)
tblelectricity_rates
```

### How It Works

1. **Readings Collection:**
   - IoT devices send readings to `tblreal_time_readings`
   - Readings are stored with device/appliance IDs and timestamps

2. **Aggregation Process:**
   - System periodically aggregates readings into `tblconsumption_summaries`
   - Aggregation happens by period (daily, weekly, monthly)
   - System calculates total kWh for the period

3. **Cost Calculation:**
   - When creating a consumption summary, system:
     - Determines the active rate at the time of calculation
     - References that rate in `consumption_summaries_electricity_rate_id`
     - Calculates cost: `total_kwh × rate.peso_per_kwh`
     - Stores result in `consumption_summaries_total_cost_php`

### Example Flow

```
1. Readings collected:
   - Reading 1: 2026-01-15 10:00, 0.5 kWh
   - Reading 2: 2026-01-15 11:00, 0.3 kWh
   - Reading 3: 2026-01-15 12:00, 0.4 kWh

2. Daily aggregation (2026-01-15):
   - Total kWh: 1.2 kWh
   - Active rate: Rate ID 1 (12.50 PHP/kWh)
   - Cost: 1.2 × 12.50 = 15.00 PHP

3. Summary created:
   - consumption_summaries_electricity_rate_id = 1
   - consumption_summaries_total_kwh = 1.2
   - consumption_summaries_total_cost_php = 15.00
```

---

## Key Design Decisions

### ✅ Why Readings Don't Reference Rates Directly

1. **Performance:** Readings are high-frequency (potentially every second)
   - Adding rate reference to each reading would be redundant
   - Rates change infrequently (monthly/quarterly)

2. **Data Volume:** Readings table will be very large
   - Minimizing columns reduces storage
   - Rates are applied at aggregation time, not reading time

3. **Flexibility:** Allows rate changes without affecting historical readings
   - Readings remain raw data
   - Summaries can be recalculated with different rates if needed

### ✅ Why Rates Reference Summaries (Not Readings)

1. **Historical Accuracy:** Each summary knows exactly which rate was used
2. **Audit Trail:** Can verify cost calculations
3. **Rate Changes:** Supports rate changes over time without data loss

---

## Potential Issues & Solutions

### Issue 1: Missing Rate Reference
**Problem:** What if a summary is created but no active rate exists?

**Solution:** Application logic should:
- Check for active rate before creating summary
- Use the most recent rate if no active rate found
- Log warning if rate lookup fails

### Issue 2: Rate Changes Mid-Period
**Problem:** What if rate changes during a daily/weekly/monthly period?

**Solution:** Application logic should:
- Use the rate that was active at the **end** of the period
- Or use the rate that was active for the **majority** of the period
- Document the decision in system documentation

### Issue 3: Historical Rate Lookup
**Problem:** How to find which rate was active on a specific date?

**Solution:** Query logic:
```sql
SELECT * FROM tblelectricity_rates
WHERE electricity_rates_effective_from <= :target_date
  AND (electricity_rates_effective_to >= :target_date OR electricity_rates_effective_to IS NULL)
  AND electricity_rates_is_active = TRUE
ORDER BY electricity_rates_effective_from DESC
LIMIT 1;
```

---

## Recommendations

### ✅ Current Design is Correct

1. **Readings table** - Stores raw measurement data
2. **Rates table** - Stores rate information with date ranges
3. **Summaries table** - Links readings (aggregated) to rates (used for calculation)

### 📝 Implementation Notes

1. **Rate Selection Logic:**
   - Always select active rate when creating summaries
   - Store rate reference in summary for historical accuracy
   - Handle edge cases (no active rate, rate changes mid-period)

2. **Data Retention:**
   - Consider archiving old readings (keep last 90 days)
   - Keep all summaries (they're already aggregated)
   - Keep all rates (they're small and needed for history)

3. **Performance:**
   - Index on `recorded_at` for time-series queries
   - Index on rate lookup fields for efficient queries
   - Consider partitioning readings table by date

---

## Summary

| Aspect | `tblreal_time_readings` | `tblelectricity_rates` |
|--------|------------------------|------------------------|
| **Purpose** | Raw measurement data | Rate information |
| **Frequency** | High (seconds/minutes) | Low (monthly/quarterly) |
| **Size** | Very large (millions) | Small (dozens) |
| **Relationships** | Devices, Appliances | Consumption Summaries |
| **Direct Link** | ❌ No direct relationship | ❌ No direct relationship |
| **Indirect Link** | → Summaries → Rates | ← Summaries ← Readings |

**✅ Both tables are correctly designed and properly related through `tblconsumption_summaries`.**

---

**Last Updated:** 2026  
**Status:** Verified and Consistent
