# NILM System - ERD in Mermaid Format for Draw.io Import

This ERD uses Mermaid notation and can be imported into Draw.io or viewed directly in GitHub.

```mermaid
erDiagram

    TBLUSERS {
        INT users_id PK
        VARCHAR users_email UK
        VARCHAR users_password_hash
        VARCHAR users_full_name
        VARCHAR users_phone_number
        ENUM users_role
        ENUM users_status
        DATETIME users_created_at
        DATETIME users_updated_at
        DATETIME users_last_login_at
    }

    TBLUSER_SESSIONS {
        INT user_sessions_id PK
        INT user_sessions_user_id FK
        VARCHAR user_sessions_token
        VARCHAR user_sessions_device_info
        VARCHAR user_sessions_ip_address
        DATETIME user_sessions_created_at
        DATETIME user_sessions_expires_at
        BOOLEAN user_sessions_is_active
    }

    TBLDEVICES {
        INT devices_id PK
        INT devices_user_id FK
        VARCHAR devices_name
        VARCHAR devices_serial_number UK
        VARCHAR devices_mac_address UK
        VARCHAR devices_location
        VARCHAR devices_wifi_ssid
        ENUM devices_status
        DATETIME devices_last_sync_at
        DATETIME devices_created_at
        DATETIME devices_updated_at
    }

    TBLAPPLIANCES {
        INT appliances_id PK
        INT appliances_device_id FK
        VARCHAR appliances_name
        ENUM appliances_type
        INT appliances_port_number
        DECIMAL appliances_rated_watts
        ENUM appliances_status
        DATETIME appliances_created_at
        DATETIME appliances_updated_at
    }

    TBLREAL_TIME_READINGS {
        INT real_time_readings_id PK
        INT real_time_readings_device_id FK
        INT real_time_readings_appliance_id FK
        DECIMAL real_time_readings_voltage_rms
        DECIMAL real_time_readings_current_rms
        DECIMAL real_time_readings_power_watts
        DECIMAL real_time_readings_apparent_power_va
        DECIMAL real_time_readings_power_factor
        DECIMAL real_time_readings_energy_kwh
        DATETIME real_time_readings_recorded_at
    }

    TBLCONSUMPTION_SUMMARIES {
        INT consumption_summaries_id PK
        INT consumption_summaries_user_id FK
        INT consumption_summaries_device_id FK
        INT consumption_summaries_appliance_id FK
        INT consumption_summaries_electricity_rate_id FK
        ENUM consumption_summaries_period_type
        DATE consumption_summaries_period_start
        DATE consumption_summaries_period_end
        DECIMAL consumption_summaries_total_kwh
        DECIMAL consumption_summaries_total_cost_php
        INT consumption_summaries_reading_count
        DATETIME consumption_summaries_created_at
    }

    TBLELECTRICITY_RATES {
        INT electricity_rates_id PK
        VARCHAR electricity_rates_name
        DECIMAL electricity_rates_peso_per_kwh
        DATE electricity_rates_effective_from
        DATE electricity_rates_effective_to
        BOOLEAN electricity_rates_is_active
        DATETIME electricity_rates_created_at
    }

    TBLNOTIFICATIONS {
        INT notifications_id PK
        INT notifications_user_id FK
        VARCHAR notifications_title
        TEXT notifications_message
        ENUM notifications_type
        ENUM notifications_priority
        BOOLEAN notifications_is_read
        DATETIME notifications_read_at
        DATETIME notifications_expires_at
        DATETIME notifications_created_at
    }

    TBLALERT_RULES {
        INT alert_rules_id PK
        INT alert_rules_user_id FK
        INT alert_rules_appliance_id FK
        INT alert_rules_device_id FK
        ENUM alert_rules_alert_type
        DECIMAL alert_rules_threshold_value
        VARCHAR alert_rules_condition
        ENUM alert_rules_severity
        BOOLEAN alert_rules_is_active
        DATETIME alert_rules_created_at
        DATETIME alert_rules_updated_at
    }

    TBLAUDIT_LOGS {
        INT audit_logs_id PK
        INT audit_logs_user_id FK
        VARCHAR audit_logs_action
        VARCHAR audit_logs_entity_type
        INT audit_logs_entity_id
        JSON audit_logs_old_value
        JSON audit_logs_new_value
        VARCHAR audit_logs_ip_address
        TEXT audit_logs_description
        DATETIME audit_logs_created_at
    }

    TBLSYSTEM_SETTINGS {
        INT system_settings_id PK
        VARCHAR system_settings_setting_key UK
        TEXT system_settings_setting_value
        TEXT system_settings_description
        ENUM system_settings_category
        BOOLEAN system_settings_is_public
        DATETIME system_settings_created_at
        INT system_settings_created_by FK
        DATETIME system_settings_updated_at
        INT system_settings_updated_by FK
    }

    %% User Management Relationships
    TBLUSERS ||--o{ TBLUSER_SESSIONS : has
    TBLUSERS ||--o{ TBLDEVICES : owns
    TBLUSERS ||--o{ TBLCONSUMPTION_SUMMARIES : generates
    TBLUSERS ||--o{ TBLNOTIFICATIONS : receives
    TBLUSERS ||--o{ TBLALERT_RULES : defines
    TBLUSERS ||--o{ TBLAUDIT_LOGS : logs
    TBLUSERS ||--o{ TBLSYSTEM_SETTINGS : creates_and_updates

    %% Device and Appliance Relationships
    TBLDEVICES ||--o{ TBLAPPLIANCES : contains
    TBLDEVICES ||--o{ TBLREAL_TIME_READINGS : records
    TBLDEVICES ||--o{ TBLCONSUMPTION_SUMMARIES : summarizes
    TBLDEVICES ||--o{ TBLALERT_RULES : triggers

    %% Appliance Relationships
    TBLAPPLIANCES ||--o{ TBLREAL_TIME_READINGS : produces
    TBLAPPLIANCES ||--o{ TBLCONSUMPTION_SUMMARIES : summarizes
    TBLAPPLIANCES ||--o{ TBLALERT_RULES : monitored_by

    %% Consumption and Billing Relationships
    TBLELECTRICITY_RATES ||--o{ TBLCONSUMPTION_SUMMARIES : applied_to

```

## How to Use This ERD

### Option 1: View in GitHub
This file will automatically render the Mermaid diagram when viewed on GitHub.

### Option 2: Import to Draw.io
1. Copy the Mermaid code (between the ```mermaid tags)
2. Go to [Draw.io](https://app.diagrams.net/)
3. Create a new diagram
4. Go to **Arrange** → **Insert** → **Advanced** → **Mermaid**
5. Paste the Mermaid code
6. Click **Insert**

### Option 3: Use Mermaid Live Editor
1. Go to [Mermaid Live Editor](https://mermaid.live/)
2. Paste the Mermaid code
3. Export as PNG, SVG, or PDF

## Notes

- All table names use `TBL` prefix (uppercase for Mermaid)
- All column names follow `tablename_columnname` format
- Foreign keys are marked with `FK`
- Primary keys are marked with `PK`
- Unique keys are marked with `UK`
- All relationships include the audit trail fields for `TBLSYSTEM_SETTINGS`
- `TBLCONSUMPTION_SUMMARIES` includes the `consumption_summaries_electricity_rate_id` foreign key

## Critical Relationships

### Electricity Rates → Consumption Summaries
- **Relationship**: `TBLELECTRICITY_RATES` (1) → `TBLCONSUMPTION_SUMMARIES` (N)
- **Foreign Key**: `consumption_summaries_electricity_rate_id` → `electricity_rates_id`
- **Purpose**: Tracks which rate was used for each cost calculation, maintaining historical accuracy even when rates change over time
- **Constraint**: `ON DELETE RESTRICT` - Prevents deletion of rates that are referenced

### Real-Time Readings Relationships
- **Device Relationship**: `TBLDEVICES` (1) → `TBLREAL_TIME_READINGS` (N)
  - `real_time_readings_device_id` is **required** (NOT NULL)
  - Constraint: `ON DELETE CASCADE` - Readings deleted when device is deleted
- **Appliance Relationship**: `TBLAPPLIANCES` (1) → `TBLREAL_TIME_READINGS` (N)
  - `real_time_readings_appliance_id` is **nullable**
  - Constraint: `ON DELETE SET NULL` - Appliance ID set to NULL when appliance is deleted
  - Allows aggregate device readings (when `appliance_id = NULL`)
  - Preserves historical readings when appliances are removed

### System Settings Audit Trail
- `system_settings_created_by` - References `TBLUSERS` (who created the setting)
- `system_settings_updated_by` - References `TBLUSERS` (who last updated the setting)
- Both use `ON DELETE SET NULL` to preserve history if user is deleted

## Schema Consistency

This ERD matches exactly with:
- `schema.sql` - Authoritative MySQL schema
- `ERD.md` - Consolidated ERD documentation
- All relationships verified and correct

---

**Last Updated:** 2026  
**Version:** 1.0  
**Format:** Mermaid ERD for Draw.io Import  
**Status:** Verified and Consistent
