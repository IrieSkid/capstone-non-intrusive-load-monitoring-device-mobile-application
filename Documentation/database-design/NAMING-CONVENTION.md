# Database Naming Convention

Based on the reference database, all tables follow this naming convention:

## Table Naming
- **Prefix**: `tbl` (lowercase)
- **Format**: `tbl` + `table_name` (lowercase, underscores for compound words)
- **Examples**: 
  - `tblusers`
  - `tbluser_sessions`
  - `tbldevices`
  - `tblappliances`
  - `tblreal_time_readings`
  - `tblconsumption_summaries`

## Column Naming
- **Format**: `tablename_columnname` (all lowercase, underscores)
- **Primary Key**: `tablename_id` (e.g., `users_id`, `devices_id`)
- **Foreign Key**: `tablename_referencedtable_id` (e.g., `devices_user_id`)
- **Examples**:
  - `users_id`, `users_email`, `users_password_hash`
  - `devices_id`, `devices_user_id`, `devices_name`
  - `appliances_id`, `appliances_device_id`, `appliances_name`

## Updated Table Names

| Old Name | New Name |
|----------|----------|
| `users` | `tblusers` |
| `user_sessions` | `tbluser_sessions` |
| `devices` | `tbldevices` |
| `appliances` | `tblappliances` |
| `real_time_readings` | `tblreal_time_readings` |
| `consumption_summaries` | `tblconsumption_summaries` |
| `electricity_rates` | `tblelectricity_rates` |
| `notifications` | `tblnotifications` |
| `alert_rules` | `tblalert_rules` |
| `audit_logs` | `tblaudit_logs` |
| `system_settings` | `tblsystem_settings` |

## Column Naming Examples

### tblusers
- `users_id` (PK)
- `users_email`
- `users_password_hash`
- `users_full_name`
- `users_phone_number`
- `users_role`
- `users_status`
- `users_created_at`
- `users_updated_at`
- `users_last_login_at`

### tbldevices
- `devices_id` (PK)
- `devices_user_id` (FK to tblusers)
- `devices_name`
- `devices_serial_number`
- `devices_mac_address`
- `devices_location`
- `devices_wifi_ssid`
- `devices_status`
- `devices_last_sync_at`
- `devices_created_at`
- `devices_updated_at`
