# Database Naming Convention Update Summary

## Overview
All database table and column names have been updated to follow the reference database naming convention:
- **Table Prefix**: `tbl` (lowercase)
- **Column Format**: `tablename_columnname` (all lowercase, underscores)

## Table Name Changes

| Old Name | New Name | Status |
|----------|----------|--------|
| `users` | `tblusers` | ✅ Updated |
| `user_sessions` | `tbluser_sessions` | ✅ Updated |
| `devices` | `tbldevices` | ✅ Updated |
| `appliances` | `tblappliances` | ✅ Updated |
| `real_time_readings` | `tblreal_time_readings` | ✅ Updated |
| `consumption_summaries` | `tblconsumption_summaries` | ✅ Updated |
| `electricity_rates` | `tblelectricity_rates` | ✅ Updated |
| `notifications` | `tblnotifications` | ✅ Updated |
| `alert_rules` | `tblalert_rules` | ✅ Updated |
| `audit_logs` | `tblaudit_logs` | ✅ Updated |
| `system_settings` | `tblsystem_settings` | ✅ Updated |

## Column Naming Examples

### tblusers
- `users_id` (PK) - was `user_id`
- `users_email` - was `email`
- `users_password_hash` - was `password_hash`
- `users_full_name` - was `full_name`
- `users_phone_number` - was `phone_number`
- `users_role` - was `role`
- `users_status` - was `status`
- `users_created_at` - was `created_at`
- `users_updated_at` - was `updated_at`
- `users_last_login_at` - was `last_login_at`

### tbldevices
- `devices_id` (PK) - was `device_id`
- `devices_user_id` (FK) - was `user_id`
- `devices_name` - was `device_name`
- `devices_serial_number` - was `device_serial_number`
- `devices_mac_address` - was `mac_address`
- `devices_location` - was `location`
- `devices_wifi_ssid` - was `wifi_ssid`
- `devices_status` - was `status`
- `devices_last_sync_at` - was `last_sync_at`
- `devices_created_at` - was `created_at`
- `devices_updated_at` - was `updated_at`

### tblappliances
- `appliances_id` (PK) - was `appliance_id`
- `appliances_device_id` (FK) - was `device_id`
- `appliances_name` - was `appliance_name`
- `appliances_type` - was `appliance_type`
- `appliances_port_number` - was `port_number`
- `appliances_rated_watts` - was `rated_watts`
- `appliances_status` - was `status`
- `appliances_created_at` - was `created_at`
- `appliances_updated_at` - was `updated_at`

### tblreal_time_readings
- `real_time_readings_id` (PK) - was `reading_id`
- `real_time_readings_device_id` (FK) - was `device_id`
- `real_time_readings_appliance_id` (FK) - was `appliance_id`
- `real_time_readings_voltage_rms` - was `voltage_rms`
- `real_time_readings_current_rms` - was `current_rms`
- `real_time_readings_power_watts` - was `power_watts`
- `real_time_readings_apparent_power_va` - was `apparent_power_va`
- `real_time_readings_power_factor` - was `power_factor`
- `real_time_readings_energy_kwh` - was `energy_kwh`
- `real_time_readings_recorded_at` - was `recorded_at`

### tblconsumption_summaries
- `consumption_summaries_id` (PK) - was `summary_id`
- `consumption_summaries_user_id` (FK) - was `user_id`
- `consumption_summaries_device_id` (FK) - was `device_id`
- `consumption_summaries_appliance_id` (FK) - was `appliance_id`
- `consumption_summaries_period_type` - was `period_type`
- `consumption_summaries_period_start` - was `period_start`
- `consumption_summaries_period_end` - was `period_end`
- `consumption_summaries_total_kwh` - was `total_kwh`
- `consumption_summaries_total_cost_php` - was `total_cost_php`
- `consumption_summaries_reading_count` - was `reading_count`
- `consumption_summaries_created_at` - was `created_at`

### tblelectricity_rates
- `electricity_rates_id` (PK) - was `rate_id`
- `electricity_rates_name` - was `rate_name`
- `electricity_rates_peso_per_kwh` - was `peso_per_kwh`
- `electricity_rates_effective_from` - was `effective_from`
- `electricity_rates_effective_to` - was `effective_to`
- `electricity_rates_is_active` - was `is_active`
- `electricity_rates_created_at` - was `created_at`

### tblnotifications
- `notifications_id` (PK) - was `notification_id`
- `notifications_user_id` (FK) - was `user_id`
- `notifications_title` - was `title`
- `notifications_message` - was `message`
- `notifications_type` - was `type`
- `notifications_priority` - was `priority`
- `notifications_is_read` - was `is_read`
- `notifications_read_at` - was `read_at`
- `notifications_expires_at` - was `expires_at`
- `notifications_created_at` - was `created_at`

### tblalert_rules
- `alert_rules_id` (PK) - was `rule_id`
- `alert_rules_user_id` (FK) - was `user_id`
- `alert_rules_appliance_id` (FK) - was `appliance_id`
- `alert_rules_device_id` (FK) - was `device_id`
- `alert_rules_alert_type` - was `alert_type`
- `alert_rules_threshold_value` - was `threshold_value`
- `alert_rules_condition` - was `condition`
- `alert_rules_severity` - was `severity`
- `alert_rules_is_active` - was `is_active`
- `alert_rules_created_at` - was `created_at`
- `alert_rules_updated_at` - was `updated_at`

### tblaudit_logs
- `audit_logs_id` (PK) - was `log_id`
- `audit_logs_user_id` (FK) - was `user_id`
- `audit_logs_action` - was `action`
- `audit_logs_entity_type` - was `entity_type`
- `audit_logs_entity_id` - was `entity_id`
- `audit_logs_old_value` - was `old_value`
- `audit_logs_new_value` - was `new_value`
- `audit_logs_ip_address` - was `ip_address`
- `audit_logs_description` - was `description`
- `audit_logs_created_at` - was `created_at`

### tblsystem_settings
- `system_settings_id` (PK) - was `setting_id`
- `system_settings_setting_key` - was `setting_key`
- `system_settings_setting_value` - was `setting_value`
- `system_settings_description` - was `description`
- `system_settings_category` - was `category`
- `system_settings_is_public` - was `is_public`
- `system_settings_updated_at` - was `updated_at`

## Files Updated

✅ **schema.sql** - MySQL schema with new naming  
✅ **schema-postgresql.sql** - PostgreSQL schema with new naming  
✅ **ERD.md** - Entity Relationship Diagram updated  
✅ **EXECUTIVE-SUMMARY.md** - Table references updated  
✅ **IMPROVEMENTS.md** - Table references updated  
✅ **README.md** - Table references updated  
✅ **NAMING-CONVENTION.md** - New documentation file created  

## Benefits of This Naming Convention

1. **Consistency** - Matches reference database style
2. **Clarity** - Column names clearly indicate which table they belong to
3. **No Ambiguity** - Prevents confusion when joining tables
4. **Standard Practice** - Common in enterprise PHP/MySQL applications
5. **Easy Maintenance** - Clear naming makes code reviews easier

## Migration Notes

If you have existing code or queries, you'll need to update:
- All SQL queries
- All ORM models
- All API endpoints that reference tables/columns
- All documentation

## Example Query Updates

### Before:
```sql
SELECT * FROM users WHERE email = 'user@example.com';
SELECT device_name FROM devices WHERE user_id = 1;
```

### After:
```sql
SELECT * FROM tblusers WHERE users_email = 'user@example.com';
SELECT devices_name FROM tbldevices WHERE devices_user_id = 1;
```

---

**Update Date**: 2026  
**Status**: ✅ Complete  
**All Files Updated**: Yes
