# Relationship Analysis: `tblelectricity_rates` and `tblconsumption_summaries`

## Current Schema Review

### Table 1: `tblelectricity_rates`
```sql
CREATE TABLE tblelectricity_rates (
    electricity_rates_id INT PRIMARY KEY AUTO_INCREMENT,
    electricity_rates_name VARCHAR(255) NOT NULL,
    electricity_rates_peso_per_kwh DECIMAL(10, 4) NOT NULL,
    electricity_rates_effective_from DATE NOT NULL,
    electricity_rates_effective_to DATE,
    electricity_rates_is_active BOOLEAN DEFAULT TRUE,
    electricity_rates_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_electricity_rates_active (electricity_rates_is_active, electricity_rates_effective_from)
);
```

**Purpose:** Stores electricity billing rates (PHP per kWh) with effective date ranges.

**Key Fields:**
- `electricity_rates_peso_per_kwh` - The rate used for cost calculation
- `electricity_rates_effective_from` / `electricity_rates_effective_to` - Date range when rate is valid
- `electricity_rates_is_active` - Whether the rate is currently active

### Table 2: `tblconsumption_summaries`
```sql
CREATE TABLE tblconsumption_summaries (
    consumption_summaries_id INT PRIMARY KEY AUTO_INCREMENT,
    consumption_summaries_user_id INT NOT NULL,
    consumption_summaries_device_id INT,
    consumption_summaries_appliance_id INT,
    consumption_summaries_period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    consumption_summaries_period_start DATE NOT NULL,
    consumption_summaries_period_end DATE NOT NULL,
    consumption_summaries_total_kwh DECIMAL(10, 4) NOT NULL,
    consumption_summaries_total_cost_php DECIMAL(10, 2) NOT NULL,  -- ⚠️ Calculated field
    consumption_summaries_reading_count INT DEFAULT 0,
    consumption_summaries_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- ... foreign keys to users, devices, appliances
);
```

**Purpose:** Stores aggregated energy consumption data with calculated costs.

**Key Fields:**
- `consumption_summaries_total_kwh` - Total energy consumed in the period
- `consumption_summaries_total_cost_php` - **Calculated cost** (kWh × rate)
- `consumption_summaries_period_start` / `consumption_summaries_period_end` - Period dates

---

## ⚠️ **CRITICAL ISSUE IDENTIFIED**

### Problem: Missing Foreign Key Relationship

**Current State:**
- ❌ **NO foreign key** between `tblelectricity_rates` and `tblconsumption_summaries`
- ❌ **NO reference** to which rate was used to calculate `consumption_summaries_total_cost_php`
- ❌ **NO audit trail** of which rate was applied

**Impact:**
1. **Data Integrity Issue:** Cannot verify which rate was used for cost calculation
2. **Historical Accuracy:** If rates change, old summaries lose traceability
3. **Audit Problem:** Cannot prove cost calculations are correct
4. **Rate Changes:** If rate changes mid-period, unclear which rate applies

---

## Relationship Analysis

### Conceptual Relationship

```
tblelectricity_rates (1) ──[used to calculate]──> (many) tblconsumption_summaries
```

**Relationship Type:** One-to-Many (Optional)
- One electricity rate can be used to calculate many consumption summaries
- Each consumption summary should reference ONE electricity rate (the one effective during its period)

### Business Logic

1. **When creating a consumption summary:**
   - System must find the active electricity rate for the period
   - Calculate: `total_cost_php = total_kwh × peso_per_kwh`
   - Store the calculated cost AND reference to the rate used

2. **Rate Selection Logic:**
   ```sql
   -- Find rate effective during consumption period
   SELECT electricity_rates_id, electricity_rates_peso_per_kwh
   FROM tblelectricity_rates
   WHERE electricity_rates_is_active = TRUE
     AND electricity_rates_effective_from <= consumption_period_start
     AND (electricity_rates_effective_to IS NULL 
          OR electricity_rates_effective_to >= consumption_period_end)
   ORDER BY electricity_rates_effective_from DESC
   LIMIT 1;
   ```

3. **Rate Changes:**
   - If rate changes during a period, need to handle:
     - Use rate at start of period?
     - Use rate at end of period?
     - Use average of rates?
     - Split period by rate changes?

---

## Recommended Solution

### Option 1: Add Foreign Key (Recommended)

**Add reference to electricity rate in consumption summaries:**

```sql
-- Add column to tblconsumption_summaries
ALTER TABLE tblconsumption_summaries
ADD COLUMN consumption_summaries_electricity_rate_id INT,
ADD FOREIGN KEY (consumption_summaries_electricity_rate_id) 
    REFERENCES tblelectricity_rates(electricity_rates_id) ON DELETE RESTRICT,
ADD INDEX idx_consumption_rate (consumption_summaries_electricity_rate_id);
```

**Benefits:**
- ✅ **Data Integrity:** Explicit link between cost and rate used
- ✅ **Audit Trail:** Can verify which rate was applied
- ✅ **Historical Accuracy:** Preserves rate used even if rates change later
- ✅ **Query Capability:** Can join to get rate details
- ✅ **Validation:** Can verify cost calculation is correct

**Updated Schema:**
```sql
CREATE TABLE tblconsumption_summaries (
    consumption_summaries_id INT PRIMARY KEY AUTO_INCREMENT,
    consumption_summaries_user_id INT NOT NULL,
    consumption_summaries_device_id INT,
    consumption_summaries_appliance_id INT,
    consumption_summaries_electricity_rate_id INT,  -- ✅ NEW
    consumption_summaries_period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    consumption_summaries_period_start DATE NOT NULL,
    consumption_summaries_period_end DATE NOT NULL,
    consumption_summaries_total_kwh DECIMAL(10, 4) NOT NULL,
    consumption_summaries_total_cost_php DECIMAL(10, 2) NOT NULL,
    consumption_summaries_reading_count INT DEFAULT 0,
    consumption_summaries_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consumption_summaries_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE,
    FOREIGN KEY (consumption_summaries_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE,
    FOREIGN KEY (consumption_summaries_appliance_id) REFERENCES tblappliances(appliances_id) ON DELETE CASCADE,
    FOREIGN KEY (consumption_summaries_electricity_rate_id)  -- ✅ NEW
        REFERENCES tblelectricity_rates(electricity_rates_id) ON DELETE RESTRICT,
    -- ... indexes
);
```

### Option 2: Store Rate Value (Not Recommended)

Store the rate value directly in consumption summaries:

```sql
ALTER TABLE tblconsumption_summaries
ADD COLUMN consumption_summaries_rate_per_kwh DECIMAL(10, 4);
```

**Drawbacks:**
- ❌ **Data Redundancy:** Duplicates rate data
- ❌ **No Reference:** Cannot link back to rate record
- ❌ **Rate Changes:** If rate is updated, summaries become inconsistent
- ❌ **No Audit:** Cannot verify which rate version was used

**Not Recommended** - Loses referential integrity.

---

## Implementation Logic

### When Creating Consumption Summary

```sql
-- Step 1: Find applicable rate for the period
SELECT 
    electricity_rates_id,
    electricity_rates_peso_per_kwh
FROM tblelectricity_rates
WHERE electricity_rates_is_active = TRUE
  AND electricity_rates_effective_from <= :period_start
  AND (electricity_rates_effective_to IS NULL 
       OR electricity_rates_effective_to >= :period_end)
ORDER BY electricity_rates_effective_from DESC
LIMIT 1;

-- Step 2: Calculate cost
SET @rate_per_kwh = (SELECT electricity_rates_peso_per_kwh FROM ...);
SET @total_cost = @total_kwh * @rate_per_kwh;

-- Step 3: Insert consumption summary with rate reference
INSERT INTO tblconsumption_summaries (
    consumption_summaries_user_id,
    consumption_summaries_electricity_rate_id,  -- ✅ Reference to rate
    consumption_summaries_period_type,
    consumption_summaries_period_start,
    consumption_summaries_period_end,
    consumption_summaries_total_kwh,
    consumption_summaries_total_cost_php,
    ...
) VALUES (
    :user_id,
    :electricity_rate_id,  -- ✅ Store which rate was used
    :period_type,
    :period_start,
    :period_end,
    :total_kwh,
    @total_cost,  -- ✅ Calculated using the rate
    ...
);
```

### Query Example: Get Summary with Rate Details

```sql
SELECT 
    cs.consumption_summaries_id,
    cs.consumption_summaries_period_start,
    cs.consumption_summaries_total_kwh,
    cs.consumption_summaries_total_cost_php,
    er.electricity_rates_name,
    er.electricity_rates_peso_per_kwh,
    er.electricity_rates_effective_from,
    -- Verify calculation
    (cs.consumption_summaries_total_kwh * er.electricity_rates_peso_per_kwh) AS calculated_cost,
    (cs.consumption_summaries_total_cost_php - 
     (cs.consumption_summaries_total_kwh * er.electricity_rates_peso_per_kwh)) AS cost_difference
FROM tblconsumption_summaries cs
LEFT JOIN tblelectricity_rates er 
    ON cs.consumption_summaries_electricity_rate_id = er.electricity_rates_id
WHERE cs.consumption_summaries_user_id = :user_id
ORDER BY cs.consumption_summaries_period_start DESC;
```

---

## Edge Cases to Handle

### 1. Rate Changes During Period

**Scenario:** Rate changes from PHP 10.00 to PHP 11.00 on day 15 of a monthly period.

**Options:**
- **Option A:** Use rate at start of period (simpler)
- **Option B:** Use rate at end of period
- **Option C:** Split period and create two summaries
- **Option D:** Use average rate (complex)

**Recommendation:** Use rate at **start of period** for simplicity in capstone.

### 2. No Active Rate Found

**Scenario:** No rate is active for the consumption period.

**Handling:**
- **Option A:** Use most recent rate (even if inactive)
- **Option B:** Use default rate (e.g., system setting)
- **Option C:** Prevent summary creation (require rate first)

**Recommendation:** Use most recent rate with warning/notification.

### 3. Multiple Rates Overlapping

**Scenario:** Multiple rates are active during the period.

**Handling:**
- Use rate with latest `effective_from` date
- Or use rate that covers the entire period

**Recommendation:** Use rate with latest `effective_from` that covers the period.

---

## Data Integrity Validation

### Verify Cost Calculations

```sql
-- Find summaries where cost doesn't match rate × kWh
SELECT 
    cs.consumption_summaries_id,
    cs.consumption_summaries_total_kwh,
    cs.consumption_summaries_total_cost_php,
    er.electricity_rates_peso_per_kwh,
    (cs.consumption_summaries_total_kwh * er.electricity_rates_peso_per_kwh) AS expected_cost,
    ABS(cs.consumption_summaries_total_cost_php - 
        (cs.consumption_summaries_total_kwh * er.electricity_rates_peso_per_kwh)) AS difference
FROM tblconsumption_summaries cs
LEFT JOIN tblelectricity_rates er 
    ON cs.consumption_summaries_electricity_rate_id = er.electricity_rates_id
WHERE ABS(cs.consumption_summaries_total_cost_php - 
          (cs.consumption_summaries_total_kwh * er.electricity_rates_peso_per_kwh)) > 0.01
ORDER BY difference DESC;
```

---

## Summary

### Current State
- ❌ **No relationship** between tables
- ❌ **No reference** to which rate was used
- ❌ **No audit trail** for cost calculations

### Recommended Fix
- ✅ **Add foreign key** `consumption_summaries_electricity_rate_id`
- ✅ **Store reference** to rate used for calculation
- ✅ **Maintain audit trail** of cost calculations
- ✅ **Enable validation** of cost calculations

### Benefits
1. **Data Integrity:** Explicit relationship ensures consistency
2. **Audit Trail:** Can verify which rate was used
3. **Historical Accuracy:** Preserves rate even if rates change
4. **Query Capability:** Can join to get rate details
5. **Validation:** Can verify cost calculations are correct

### Implementation Priority
- **High Priority** - This is a data integrity issue
- **Easy to Fix** - Just add one column and foreign key
- **Important for Capstone** - Shows understanding of referential integrity

---

## Action Items

1. ✅ **Add column** `consumption_summaries_electricity_rate_id` to `tblconsumption_summaries`
2. ✅ **Add foreign key** constraint
3. ✅ **Update application logic** to select and store rate when creating summaries
4. ✅ **Update ERD** to show the relationship
5. ✅ **Add validation** to verify cost calculations

---

**Conclusion:** The relationship between these tables is **conceptual but not implemented**. Adding a foreign key is **highly recommended** for data integrity and audit purposes.
