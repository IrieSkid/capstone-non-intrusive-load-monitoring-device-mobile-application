# Database Design Improvements - Summary

## Overview
This document outlines the improvements made to the original database design, explaining what was removed, simplified, and optimized for the NILM capstone project.

## Entities Removed

### 1. ❌ `tbl_flow_steps`
**Reason for Removal:**
- Not relevant to NILM system functionality
- Appears to be workflow management, which is outside the scope
- No connection to load monitoring or appliance classification

**Impact:** None - This entity was not needed for the system

---

### 2. ❌ `tbl_notification_reads`
**Reason for Removal:**
- Redundant with `is_read` boolean flag in `notifications` table
- Adds unnecessary complexity for a simple read/unread status
- Can be tracked with a single field and timestamp

**Replacement:** Using `is_read` boolean and `read_at` timestamp in `notifications` table

**Impact:** Simplified notification system, easier queries

---

### 3. ✅ `audit_logs` (KEPT - Required for Capstone)
**Reason for Keeping:**
- **Required by capstone project requirements**
- Important for tracking user actions and system changes
- Demonstrates proper system logging and accountability
- Essential for security and compliance

**Implementation:** 
- Tracks all user actions (CREATE, UPDATE, DELETE)
- Stores old and new values for change tracking
- Indexed for efficient querying
- Can be archived periodically to manage size

**Impact:** Meets capstone requirements, provides audit trail

---

### 4. ❌ `tbl_login_attempts`
**Reason for Removal:**
- Can be handled in application logic
- Not critical for capstone project scope
- Adds unnecessary database overhead
- Security can be managed at API level

**Alternative:** Implement rate limiting in backend API middleware

**Impact:** Simpler authentication flow

---

### 5. ❌ `tbl_device_sync_logs`
**Reason for Removal:**
- Redundant information
- Device sync status can be tracked with `last_sync_at` in `devices` table
- Error messages can be stored in device status or notifications

**Replacement:** Using `last_sync_at` timestamp and `status` enum in `devices` table

**Impact:** Cleaner device management

---

### 6. ❌ `tbl_roles` (Separate Table)
**Reason for Simplification:**
- Only 3 roles needed: admin, homeowner, tenant
- Enum is simpler and more efficient for small, fixed set of values
- Reduces join operations
- Easier to query and maintain

**Replacement:** Using `ENUM('admin', 'homeowner', 'tenant')` in `users` table

**Impact:** Faster queries, simpler code

---

## Entities Simplified

### 1. ✅ `users` (Simplified)
**Changes:**
- Removed separate `tbl_roles` relationship → Using enum
- Added `phone_number` for mobile app contact
- Simplified status management
- Added `last_login_at` for tracking

**Benefits:**
- Fewer joins required
- Faster user queries
- Still maintains all necessary functionality

---

### 2. ✅ `notifications` (Simplified)
**Changes:**
- Removed separate `tbl_notification_reads` table
- Added `is_read` boolean flag
- Added `read_at` timestamp
- Simplified structure

**Benefits:**
- Single table for all notification data
- Easier to query unread notifications
- Better performance with proper indexing

---

### 3. ✅ `real_time_readings` (Optimized)
**Changes:**
- Made `appliance_id` nullable to support aggregate device readings
- Added strategic indexes for time-series queries
- Optimized for high-frequency inserts

**Benefits:**
- Supports both appliance-level and device-level readings
- Fast queries for real-time dashboard
- Efficient time-series data storage

---

### 4. ✅ `consumption_summaries` (Enhanced)
**Changes:**
- Made `device_id` and `appliance_id` nullable
- Supports multiple aggregation levels (appliance, device, user)
- Added unique constraint to prevent duplicates
- Added `reading_count` for accuracy tracking

**Benefits:**
- Flexible reporting at different levels
- Prevents duplicate summary entries
- Better data integrity

---

## New Optimizations

### 1. Indexes Added
- **Time-series queries**: Indexes on `recorded_at` and composite indexes
- **User queries**: Indexes on `user_id` and status fields
- **Notification queries**: Composite index on `user_id` and `is_read`
- **Consumption queries**: Indexes on period types and dates

**Impact:** Significantly faster queries, especially for real-time data

---

### 2. Data Types Optimized
- **Electrical measurements**: Appropriate DECIMAL precision
- **Timestamps**: DATETIME for all temporal data
- **Status fields**: ENUM for fixed value sets
- **JSON fields**: Removed (using proper relational structure)

**Impact:** Better data integrity, appropriate storage sizes

---

### 3. Foreign Key Constraints
- **CASCADE deletes**: Proper cleanup when parent records deleted
- **SET NULL**: For optional relationships (e.g., appliance_id in readings)
- **All relationships**: Properly defined with referential integrity

**Impact:** Data consistency, automatic cleanup

---

## Comparison Table

| Aspect | Original Design | Improved Design | Benefit |
|--------|----------------|----------------|---------|
| **Total Tables** | 15 tables | 11 tables | 27% reduction |
| **Complexity** | High | Medium | Easier to implement |
| **Join Operations** | Many | Fewer | Better performance |
| **Indexes** | Basic | Strategic | Faster queries |
| **Audit Trail** | Full | Streamlined | Meets requirements |
| **Notification System** | 2 tables | 1 table | Simpler queries |
| **Role Management** | Separate table | Enum | Faster, simpler |
| **Time-Series Optimization** | Basic | Optimized | Better for real-time |

---

## Key Improvements Summary

### ✅ Reduced Complexity
- **33% fewer tables** (15 → 10)
- Removed unnecessary relationships
- Simplified data model

### ✅ Better Performance
- Strategic indexes for time-series data
- Fewer join operations
- Optimized for real-time queries

### ✅ Easier Development
- Simpler structure
- Less code to write
- Faster to implement

### ✅ Still Robust
- All core functionality maintained
- Proper normalization
- Referential integrity
- Scalable design

### ✅ Capstone Appropriate
- Not over-engineered
- Focused on core requirements
- Professional but manageable
- Suitable for academic submission

---

## What Was Kept (Important Features)

✅ **User Management** - Complete authentication system  
✅ **Device Management** - Full device registration and tracking  
✅ **Appliance Tracking** - Detailed appliance configuration  
✅ **Real-Time Monitoring** - Time-series data storage  
✅ **Consumption Tracking** - Historical data and summaries  
✅ **Billing System** - Electricity rates and cost calculation  
✅ **Notifications** - Alert and notification system  
✅ **Alert Rules** - Configurable thresholds  
✅ **System Settings** - Configuration management  

---

## Recommendations for Implementation

1. **Start Simple**: Implement core tables first (users, devices, appliances, readings)
2. **Add Features Gradually**: Add notifications, alerts, and summaries later
3. **Test Performance**: Monitor query performance with real data volumes
4. **Consider Archiving**: Plan for archiving old readings data
5. **Backup Strategy**: Regular backups of critical tables

---

## Future Enhancements (If Needed)

If you need to add features later:

1. **Audit Logs**: Can add `audit_logs` table if required
2. **Login Attempts**: Can add if security requirements increase
3. **Advanced Roles**: Can convert enum back to table if roles become complex
4. **Notification History**: Can add separate table if read history is critical
5. **Device Sync Logs**: Can add if detailed sync tracking is needed

**Note:** The current design is sufficient for capstone project requirements. Only add these if specifically required by your adviser or if you have extra time.

---

## Conclusion

The improved database design:
- ✅ Maintains all core functionality
- ✅ Reduces complexity by 33%
- ✅ Improves performance with strategic indexes
- ✅ Is more suitable for capstone project scope
- ✅ Is easier to implement and maintain
- ✅ Still professional and robust

This design strikes the right balance between **completeness** and **simplicity** for a BSIT capstone project.

