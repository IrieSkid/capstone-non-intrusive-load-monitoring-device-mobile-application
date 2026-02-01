# How to Import ERD into Draw.io

## Method 1: Import from SQL (Recommended)

### Step-by-Step Instructions:

1. **Open Draw.io**
   - Go to https://app.diagrams.net/ (or use desktop app)
   - Create a new diagram

2. **Import Database Schema**
   - Click **File** → **Import** → **From Database**
   - Or use shortcut: `Ctrl+Shift+I` (Windows) / `Cmd+Shift+I` (Mac)

3. **Select Database Type**
   - Choose **MySQL** or **PostgreSQL**
   - Both will work with the provided SQL

4. **Paste SQL Script**
   - Open `ERD-drawio-import.sql`
   - Copy all contents
   - Paste into the import dialog

5. **Click Import**
   - Draw.io will automatically create the ERD diagram
   - Tables will be arranged automatically

6. **Customize Layout**
   - Rearrange tables as needed
   - Adjust colors and styles
   - Add labels and notes

---

## Method 2: Manual Creation (If Import Fails)

If the automatic import doesn't work, you can manually create the diagram:

### Create Each Table:

1. **Add Entity**
   - Drag "Entity" from the left panel
   - Or use: Insert → Entity

2. **Add Attributes**
   - Double-click the entity
   - Add each field as an attribute
   - Mark Primary Keys (PK) and Foreign Keys (FK)

3. **Create Relationships**
   - Use "Relationship" connector
   - Connect tables based on foreign keys

### Quick Reference - All Tables:

1. **users** (PK: user_id)
2. **user_sessions** (PK: session_id, FK: user_id)
3. **devices** (PK: device_id, FK: user_id)
4. **appliances** (PK: appliance_id, FK: device_id)
5. **real_time_readings** (PK: reading_id, FK: device_id, appliance_id)
6. **consumption_summaries** (PK: summary_id, FK: user_id, device_id, appliance_id)
7. **electricity_rates** (PK: rate_id)
8. **notifications** (PK: notification_id, FK: user_id)
9. **alert_rules** (PK: rule_id, FK: user_id, appliance_id, device_id)
10. **audit_logs** (PK: log_id, FK: user_id)
11. **system_settings** (PK: setting_id)

---

## Method 3: Using Draw.io Database Template

1. **Open Draw.io**
2. **File** → **New** → **Templates**
3. Search for "Database" or "ERD"
4. Use a template as starting point
5. Manually add tables from the SQL script

---

## Relationships to Create:

### One-to-Many Relationships:

1. **users** → **user_sessions** (1:N)
2. **users** → **devices** (1:N)
3. **users** → **consumption_summaries** (1:N)
4. **users** → **notifications** (1:N)
5. **users** → **alert_rules** (1:N)
6. **users** → **audit_logs** (1:N)
7. **devices** → **appliances** (1:N)
8. **devices** → **real_time_readings** (1:N)
9. **devices** → **consumption_summaries** (1:N)
10. **appliances** → **real_time_readings** (1:N)
11. **appliances** → **consumption_summaries** (1:N)
12. **appliances** → **alert_rules** (1:N)
13. **electricity_rates** → **consumption_summaries** (1:N)

### Relationship Types:
- Use **Crow's Foot** notation (one-to-many)
- Mark foreign keys clearly
- Add cardinality labels (1, N)

---

## Draw.io Tips:

### Styling:
- **Primary Keys**: Bold text, different color
- **Foreign Keys**: Italic text, different color
- **Required Fields**: Mark with asterisk (*)
- **Optional Fields**: Mark with (nullable)

### Layout Suggestions:
- Group related tables together
- Place **users** at the top
- Place **devices** and **appliances** in the middle
- Place **readings** and **summaries** at the bottom
- Place **settings** and **audit_logs** on the side

### Colors by Category:
- **User Management**: Blue
- **Device Management**: Green
- **Data Collection**: Orange
- **Consumption**: Purple
- **Notifications**: Red
- **System**: Gray

---

## Export Options:

Once your ERD is complete:

1. **Export as Image**
   - File → Export as → PNG/JPG
   - High resolution for thesis

2. **Export as PDF**
   - File → Export as → PDF
   - Good for documentation

3. **Export as SVG**
   - File → Export as → SVG
   - Scalable vector format

4. **Save Source**
   - File → Save as → .drawio
   - Keep editable version

---

## Alternative: Use Online ERD Tools

If Draw.io doesn't work well, consider:

1. **dbdiagram.io** - Import SQL directly
2. **Lucidchart** - Professional ERD tool
3. **Creately** - Online diagramming
4. **MySQL Workbench** - Built-in ERD tool

---

## Troubleshooting:

### Import Fails:
- Check SQL syntax is correct
- Try removing ENUM types (replace with VARCHAR)
- Try removing JSON types (replace with TEXT)
- Import one table at a time

### Tables Not Showing:
- Check foreign key references exist
- Verify table names match exactly
- Try importing without foreign keys first

### Layout Issues:
- Use "Arrange" → "Layout" → "Hierarchical"
- Manually arrange if needed
- Use alignment tools

---

## Quick Copy-Paste Format

If you need a simpler format, here's a CSV-like structure:

```
Table: users
Fields: user_id (PK), email (UK), password_hash, full_name, phone_number, role, status, created_at, updated_at, last_login_at

Table: user_sessions
Fields: session_id (PK), user_id (FK→users), token, device_info, ip_address, created_at, expires_at, is_active

Table: devices
Fields: device_id (PK), user_id (FK→users), device_name, device_serial_number (UK), mac_address (UK), location, wifi_ssid, status, last_sync_at, created_at, updated_at

Table: appliances
Fields: appliance_id (PK), device_id (FK→devices), appliance_name, appliance_type, port_number, rated_watts, status, created_at, updated_at

Table: real_time_readings
Fields: reading_id (PK), device_id (FK→devices), appliance_id (FK→appliances, nullable), voltage_rms, current_rms, power_watts, apparent_power_va, power_factor, energy_kwh, recorded_at

Table: consumption_summaries
Fields: summary_id (PK), user_id (FK→users), device_id (FK→devices, nullable), appliance_id (FK→appliances, nullable), period_type, period_start, period_end, total_kwh, total_cost_php, reading_count, created_at

Table: electricity_rates
Fields: rate_id (PK), rate_name, peso_per_kwh, effective_from, effective_to, is_active, created_at

Table: notifications
Fields: notification_id (PK), user_id (FK→users), title, message, type, priority, is_read, read_at, expires_at, created_at

Table: alert_rules
Fields: rule_id (PK), user_id (FK→users), appliance_id (FK→appliances, nullable), device_id (FK→devices, nullable), alert_type, threshold_value, condition, severity, is_active, created_at, updated_at

Table: audit_logs
Fields: log_id (PK), user_id (FK→users), action, entity_type, entity_id, old_value, new_value, ip_address, description, created_at

Table: system_settings
Fields: setting_id (PK), setting_key (UK), setting_value, description, category, is_public, updated_at
```

---

**File to Use:** `ERD-drawio-import.sql`  
**Last Updated:** 2024

