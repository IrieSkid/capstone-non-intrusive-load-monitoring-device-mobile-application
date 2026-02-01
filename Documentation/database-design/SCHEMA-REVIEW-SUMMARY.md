# Database Schema Review & Consolidation Summary

**Date:** 2026  
**Status:** ✅ Verified and Consolidated

## Review Objectives

1. Identify inconsistencies in database schema files
2. Verify relationships, especially rates and readings tables
3. Consolidate ERD documentation into consistent format
4. Document all findings and fixes

## Issues Found and Fixed

### ✅ Issue 1: Missing `consumption_summaries_electricity_rate_id` in ERD.md SQL Section
**Status:** FIXED

**Problem:** The ERD.md file had the `consumption_summaries_electricity_rate_id` field in the Mermaid diagram but was missing from the SQL schema section.

**Fix Applied:** Added the field and foreign key constraint to match `schema.sql`:
```sql
consumption_summaries_electricity_rate_id INT,
FOREIGN KEY (consumption_summaries_electricity_rate_id) REFERENCES tblelectricity_rates(electricity_rates_id) ON DELETE RESTRICT,
INDEX idx_consumption_rate (consumption_summaries_electricity_rate_id)
```

**Impact:** This relationship is critical for:
- Historical cost tracking with exact rates used
- Audit trail of billing calculations
- Preventing deletion of referenced rates

### ✅ Issue 2: Missing System Settings Audit Fields in ERD.md
**Status:** FIXED

**Problem:** The `tblsystem_settings` table in ERD.md SQL section was missing `created_at`, `created_by`, and `updated_by` fields.

**Fix Applied:** Added all audit trail fields:
```sql
system_settings_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
system_settings_created_by INT,
system_settings_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
system_settings_updated_by INT,
FOREIGN KEY (system_settings_created_by) REFERENCES tblusers(users_id) ON DELETE SET NULL,
FOREIGN KEY (system_settings_updated_by) REFERENCES tblusers(users_id) ON DELETE SET NULL,
```

**Impact:** Enables tracking of who created and modified system settings for audit purposes.

## Relationship Verification

### ✅ Electricity Rates → Consumption Summaries
**Status:** VERIFIED CORRECT

**Relationship Type:** One-to-Many (1:N)

**Details:**
- `tblelectricity_rates.electricity_rates_id` (PK) → `tblconsumption_summaries.consumption_summaries_electricity_rate_id` (FK)
- Constraint: `ON DELETE RESTRICT` - Prevents deletion of rates that are referenced
- Purpose: Maintains historical accuracy of cost calculations

**Why This Design:**
- Each consumption summary references the specific rate that was active when calculated
- If rates change over time, historical summaries remain accurate
- Provides audit trail for billing disputes

**Example Use Case:**
```
Rate 1: 12.50 PHP/kWh (Jan 1 - Mar 31, 2026)
Rate 2: 13.00 PHP/kWh (Apr 1 - Dec 31, 2026)

Summary for March 2026 → References Rate 1
Summary for April 2026 → References Rate 2
```

### ✅ Real-Time Readings Relationships
**Status:** VERIFIED CORRECT

#### Device Relationship
- `tbldevices.devices_id` (PK) → `tblreal_time_readings.real_time_readings_device_id` (FK)
- Constraint: `ON DELETE CASCADE` - Readings deleted when device is deleted
- Required: `real_time_readings_device_id` is NOT NULL
- **Correct:** Every reading must belong to a device

#### Appliance Relationship
- `tblappliances.appliances_id` (PK) → `tblreal_time_readings.real_time_readings_appliance_id` (FK)
- Constraint: `ON DELETE SET NULL` - Appliance ID set to NULL when appliance is deleted
- Required: `real_time_readings_appliance_id` is NULLABLE
- **Correct:** Allows both appliance-specific and device-level aggregate readings

**Why This Design:**
- Supports appliance-specific readings (when `appliance_id` is set)
- Supports device-level aggregate readings (when `appliance_id = NULL`)
- Preserves historical readings when appliances are removed (appliance_id becomes NULL, but reading remains)

**Example Use Cases:**
```
Reading 1: device_id=1, appliance_id=5 → Refrigerator reading
Reading 2: device_id=1, appliance_id=NULL → Device aggregate reading
Reading 3: device_id=1, appliance_id=5 → After appliance deleted, appliance_id becomes NULL
```

## File Consistency Check

### ✅ schema.sql (Authoritative Source)
**Status:** VERIFIED - All relationships correct

**Contains:**
- ✅ `consumption_summaries_electricity_rate_id` with FK constraint
- ✅ `system_settings_created_at`, `created_by`, `updated_by` fields
- ✅ All foreign key constraints match relationships
- ✅ All indexes properly defined

### ✅ ERD.md (Consolidated Documentation)
**Status:** VERIFIED - Now matches schema.sql

**Contains:**
- ✅ Complete Mermaid ERD diagram with all relationships
- ✅ SQL schema section matching schema.sql exactly
- ✅ Detailed relationship explanations
- ✅ Design decisions documentation

### ✅ ERD-mermaid-drawio.md
**Status:** VERIFIED - Consistent with ERD.md

**Purpose:** Mermaid format specifically for Draw.io import
**Contains:** All relationships correctly defined

### ✅ ERD-drawio-import.sql
**Status:** VERIFIED - Consistent with schema.sql

**Purpose:** SQL format for Draw.io database import
**Contains:** All tables with correct relationships

### ✅ ERD-drawio-simplified.sql
**Status:** VERIFIED - Simplified version for compatibility

**Purpose:** Simplified SQL (ENUMs replaced with VARCHAR) for tools that don't support ENUMs
**Contains:** All relationships correct, simplified data types

### ✅ schema-postgresql.sql
**Status:** VERIFIED - PostgreSQL version consistent

**Contains:** All relationships correctly translated to PostgreSQL syntax

## Key Relationships Summary

| Relationship | Parent Table | Child Table | FK Column | Constraint | Notes |
|-------------|--------------|-------------|-----------|------------|-------|
| Users → Sessions | `tblusers` | `tbluser_sessions` | `user_sessions_user_id` | CASCADE | User deletion removes sessions |
| Users → Devices | `tblusers` | `tbldevices` | `devices_user_id` | CASCADE | User deletion removes devices |
| Users → Consumption | `tblusers` | `tblconsumption_summaries` | `consumption_summaries_user_id` | CASCADE | User deletion removes summaries |
| Devices → Appliances | `tbldevices` | `tblappliances` | `appliances_device_id` | CASCADE | Device deletion removes appliances |
| Devices → Readings | `tbldevices` | `tblreal_time_readings` | `real_time_readings_device_id` | CASCADE | Device deletion removes readings |
| Appliances → Readings | `tblappliances` | `tblreal_time_readings` | `real_time_readings_appliance_id` | SET NULL | Appliance deletion preserves readings |
| **Rates → Consumption** | **`tblelectricity_rates`** | **`tblconsumption_summaries`** | **`consumption_summaries_electricity_rate_id`** | **RESTRICT** | **Prevents rate deletion if referenced** |
| Appliances → Consumption | `tblappliances` | `tblconsumption_summaries` | `consumption_summaries_appliance_id` | CASCADE | Appliance deletion removes summaries |
| Users → System Settings | `tblusers` | `tblsystem_settings` | `system_settings_created_by` | SET NULL | Preserves history if user deleted |
| Users → System Settings | `tblusers` | `tblsystem_settings` | `system_settings_updated_by` | SET NULL | Preserves history if user deleted |

## Critical Design Decisions Verified

### 1. Electricity Rates Relationship
✅ **Correct Implementation**
- Uses `ON DELETE RESTRICT` to prevent accidental deletion of referenced rates
- Allows historical tracking of which rate was used for each calculation
- Supports rate changes over time without affecting past calculations

### 2. Real-Time Readings Relationships
✅ **Correct Implementation**
- Device relationship: Required (NOT NULL) with CASCADE
- Appliance relationship: Optional (NULLABLE) with SET NULL
- Supports both appliance-specific and aggregate readings
- Preserves historical data when appliances are removed

### 3. System Settings Audit Trail
✅ **Correct Implementation**
- Tracks who created and updated each setting
- Uses SET NULL to preserve history if user is deleted
- Enables audit compliance for capstone project

## Recommendations

### ✅ Keep These Files (All Verified)
1. **`schema.sql`** - Authoritative MySQL schema
2. **`schema-postgresql.sql`** - PostgreSQL version
3. **`ERD.md`** - Consolidated ERD documentation (primary reference)
4. **`ERD-mermaid-drawio.md`** - For Draw.io Mermaid import
5. **`ERD-drawio-import.sql`** - For Draw.io SQL import
6. **`ERD-drawio-simplified.sql`** - Simplified version for compatibility

### 📝 Optional: Consider Consolidating
- `ERD-text-visual.txt` - Could be removed if ERD.md is sufficient
- Multiple Draw.io import formats - Consider keeping only the most useful one

## Conclusion

✅ **All relationships verified and correct**
✅ **All inconsistencies fixed**
✅ **ERD.md is now the authoritative consolidated documentation**
✅ **All files are consistent with schema.sql**

The database schema is now:
- **Consistent** across all files
- **Well-documented** with relationship explanations
- **Properly constrained** with appropriate foreign key actions
- **Ready for implementation**

---

**Review Completed:** 2026  
**Next Steps:** 
- Use `schema.sql` as the authoritative source for implementation
- Use `ERD.md` as the primary documentation reference
- All other ERD files are consistent and can be used as needed
