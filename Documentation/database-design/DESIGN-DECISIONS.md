# Database Design Decisions & Analysis

This document consolidates all design decisions, improvements, and analysis for the NILM database design.

## Table of Contents

1. [Design Improvements](#design-improvements)
2. [Naming Convention](#naming-convention)
3. [Header/Details Pattern Analysis](#headerdetails-pattern-analysis)
4. [Electricity Rates Relationship](#electricity-rates-relationship)
5. [Key Design Principles](#key-design-principles)

---

## Design Improvements

### Overview
The database was streamlined from an initial 15-table design to 11 core tables, focusing on essential functionality while maintaining professional quality.

### Entities Removed

#### ❌ `tbl_flow_steps`
- **Reason:** Not relevant to NILM system functionality
- **Impact:** None - workflow management outside scope

#### ❌ `tbl_notification_reads`
- **Reason:** Redundant with `is_read` boolean flag
- **Replacement:** Using `notifications_is_read` boolean and `notifications_read_at` timestamp
- **Impact:** Simplified notification system

#### ❌ `tbl_login_attempts`
- **Reason:** Can be handled in application logic
- **Impact:** Reduced complexity

### Entities Kept

#### ✅ `tblaudit_logs` (Required for Capstone)
- **Reason:** Required by capstone project requirements
- **Features:** Tracks all user actions (CREATE, UPDATE, DELETE), stores old/new values
- **Impact:** Meets capstone requirements, provides audit trail

### Design Simplifications

1. **Consumption Summaries:** Single table with nullable FKs (device/appliance/user level)
2. **Notifications:** Simple boolean flag instead of separate reads table
3. **User Sessions:** Direct relationship to users, no complex session management

### Result
- **27% reduction** in table count (15 → 11)
- **Simpler queries** and maintenance
- **Complete functionality** maintained
- **Appropriate complexity** for capstone

---

## Naming Convention

### Table Naming
- **Prefix:** `tbl` (lowercase)
- **Format:** `tbl` + `table_name` (lowercase, underscores)
- **Examples:** `tblusers`, `tbldevices`, `tblconsumption_summaries`

### Column Naming
- **Format:** `tablename_columnname` (all lowercase, underscores)
- **Primary Key:** `tablename_id` (e.g., `users_id`, `devices_id`)
- **Foreign Key:** `tablename_referencedtable_id` (e.g., `devices_user_id`)

### Examples

**tblusers:**
- `users_id` (PK)
- `users_email`
- `users_password_hash`
- `users_full_name`

**tbldevices:**
- `devices_id` (PK)
- `devices_user_id` (FK to `tblusers`)
- `devices_name`
- `devices_serial_number`

### Rationale
- Matches reference database pattern
- Ensures consistency across entire schema
- Explicitly links columns to their tables
- Reduces ambiguity in queries

---

## Header/Details Pattern Analysis

### Current Design Assessment

**✅ Current Design is Good For:**
1. **Real-Time Readings** - Time-series data works best as single table
2. **User Management** - Simple, no need for header/details
3. **Device Management** - Already has parent-child (devices → appliances)
4. **Notifications** - Simple, standalone records
5. **System Settings** - Key-value pairs, no header/details needed

### Potential Header/Details Opportunity

**Consumption Summaries** - Could use header/details pattern:
- **Header:** Summary period (user, period type, dates, totals)
- **Details:** Individual appliance/device breakdown

**Assessment:** ❌ **Not Recommended**
- Current design is simpler and sufficient
- Adds complexity without clear benefit
- Can be calculated on-the-fly from `tblreal_time_readings`
- Appropriate for capstone project scope

### Recommendation

**✅ Keep Current Design** - It's already good!

**Reasons:**
1. Appropriate complexity for capstone
2. Already has parent-child relationships where needed
3. Time-series data optimized correctly
4. Simple enough to implement
5. Complete functionality

**Only add header/details if:**
- Your adviser specifically requests detailed breakdowns
- You need appliance-level contributions in reports
- You have extra development time

---

## Electricity Rates Relationship

### Issue Identified

**Problem:** Missing foreign key relationship between `tblelectricity_rates` and `tblconsumption_summaries`

**Impact:**
- ❌ No reference to which rate was used for cost calculation
- ❌ No audit trail for cost calculations
- ❌ Historical accuracy issues if rates change

### Solution Implemented

**Added Foreign Key:**
```sql
ALTER TABLE tblconsumption_summaries
ADD COLUMN consumption_summaries_electricity_rate_id INT,
ADD FOREIGN KEY (consumption_summaries_electricity_rate_id) 
    REFERENCES tblelectricity_rates(electricity_rates_id) ON DELETE RESTRICT;
```

**Benefits:**
- ✅ Data integrity: Explicit link between cost and rate used
- ✅ Audit trail: Can verify which rate was applied
- ✅ Historical accuracy: Preserves rate even if rates change later
- ✅ Query capability: Can join to get rate details
- ✅ Validation: Can verify cost calculations are correct

### Implementation Logic

When creating a consumption summary:
1. Find active electricity rate for the period
2. Calculate: `total_cost_php = total_kwh × peso_per_kwh`
3. Store calculated cost AND reference to rate used

---

## Key Design Principles

### 1. Normalization
- **Level:** 3NF (Third Normal Form)
- **Rationale:** Eliminates redundancy, ensures data integrity
- **Result:** Clean, maintainable schema

### 2. Simplicity
- **Approach:** Streamlined from 15 to 11 tables
- **Rationale:** Appropriate complexity for capstone
- **Result:** Easier implementation and maintenance

### 3. Performance
- **Strategy:** Strategic indexes on time-series and foreign keys
- **Focus:** Optimized for high-frequency IoT data insertion
- **Result:** Efficient queries and data insertion

### 4. Scalability
- **Design:** Supports multiple users, devices, and appliances
- **Architecture:** Flexible aggregation (appliance/device/user level)
- **Result:** Can handle growth in users and devices

### 5. Integrity
- **Constraints:** Foreign key constraints with CASCADE rules
- **Validation:** Unique constraints on critical fields
- **Result:** Data consistency and referential integrity

### 6. Audit Trail
- **Implementation:** Complete audit logging for compliance
- **Features:** Tracks all user actions with old/new values
- **Result:** Meets capstone requirements, provides accountability

---

## Summary

### Design Philosophy
The database design follows a **streamlined, robust approach** suitable for a capstone project. It balances completeness with simplicity, ensuring all core requirements are met without unnecessary complexity.

### Key Metrics
- **Total Tables:** 11 core tables
- **Normalization:** 3NF
- **Indexes:** 15+ strategic indexes
- **Foreign Keys:** 12 relationships
- **Unique Constraints:** 4 unique constraints

### Final Assessment
✅ **Design is complete and ready for implementation**
- Appropriate complexity for capstone
- Complete functionality coverage
- Professional quality
- Well-documented

---

**Last Updated:** 2024  
**Status:** ✅ Finalized
