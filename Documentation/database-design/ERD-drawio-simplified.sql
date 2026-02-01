-- ============================================
-- NILM System ERD - Simplified for Draw.io
-- (ENUM and JSON replaced with VARCHAR/TEXT for compatibility)
-- ============================================
-- Note: Uses tbl prefix naming convention
-- ============================================

-- Users Table
CREATE TABLE tblusers (
    users_id INT PRIMARY KEY,
    users_email VARCHAR(255) UNIQUE NOT NULL,
    users_password_hash VARCHAR(255) NOT NULL,
    users_full_name VARCHAR(255) NOT NULL,
    users_phone_number VARCHAR(20),
    users_role VARCHAR(20),
    users_status VARCHAR(20),
    users_created_at DATETIME,
    users_updated_at DATETIME,
    users_last_login_at DATETIME
);

-- User Sessions Table
CREATE TABLE tbluser_sessions (
    user_sessions_id INT PRIMARY KEY,
    user_sessions_user_id INT NOT NULL,
    user_sessions_token VARCHAR(500) NOT NULL,
    user_sessions_device_info VARCHAR(255),
    user_sessions_ip_address VARCHAR(45),
    user_sessions_created_at DATETIME,
    user_sessions_expires_at DATETIME NOT NULL,
    user_sessions_is_active BOOLEAN,
    FOREIGN KEY (user_sessions_user_id) REFERENCES tblusers(users_id)
);

-- Devices Table
CREATE TABLE tbldevices (
    devices_id INT PRIMARY KEY,
    devices_user_id INT NOT NULL,
    devices_name VARCHAR(255) NOT NULL,
    devices_serial_number VARCHAR(100) UNIQUE NOT NULL,
    devices_mac_address VARCHAR(17) UNIQUE NOT NULL,
    devices_location VARCHAR(255),
    devices_wifi_ssid VARCHAR(255),
    devices_status VARCHAR(20),
    devices_last_sync_at DATETIME,
    devices_created_at DATETIME,
    devices_updated_at DATETIME,
    FOREIGN KEY (devices_user_id) REFERENCES tblusers(users_id)
);

-- Appliances Table
CREATE TABLE tblappliances (
    appliances_id INT PRIMARY KEY,
    appliances_device_id INT NOT NULL,
    appliances_name VARCHAR(255) NOT NULL,
    appliances_type VARCHAR(20) NOT NULL,
    appliances_port_number INT NOT NULL,
    appliances_rated_watts DECIMAL(10, 2),
    appliances_status VARCHAR(20),
    appliances_created_at DATETIME,
    appliances_updated_at DATETIME,
    FOREIGN KEY (appliances_device_id) REFERENCES tbldevices(devices_id)
);

-- Real-Time Readings Table
CREATE TABLE tblreal_time_readings (
    real_time_readings_id INT PRIMARY KEY,
    real_time_readings_device_id INT NOT NULL,
    real_time_readings_appliance_id INT,
    real_time_readings_voltage_rms DECIMAL(10, 2) NOT NULL,
    real_time_readings_current_rms DECIMAL(10, 2) NOT NULL,
    real_time_readings_power_watts DECIMAL(10, 2) NOT NULL,
    real_time_readings_apparent_power_va DECIMAL(10, 2) NOT NULL,
    real_time_readings_power_factor DECIMAL(5, 4) NOT NULL,
    real_time_readings_energy_kwh DECIMAL(10, 6) NOT NULL,
    real_time_readings_recorded_at DATETIME NOT NULL,
    FOREIGN KEY (real_time_readings_device_id) REFERENCES tbldevices(devices_id),
    FOREIGN KEY (real_time_readings_appliance_id) REFERENCES tblappliances(appliances_id)
);

-- Consumption Summaries Table
CREATE TABLE tblconsumption_summaries (
    consumption_summaries_id INT PRIMARY KEY,
    consumption_summaries_user_id INT NOT NULL,
    consumption_summaries_device_id INT,
    consumption_summaries_appliance_id INT,
    consumption_summaries_electricity_rate_id INT,
    consumption_summaries_period_type VARCHAR(20) NOT NULL,
    consumption_summaries_period_start DATE NOT NULL,
    consumption_summaries_period_end DATE NOT NULL,
    consumption_summaries_total_kwh DECIMAL(10, 4) NOT NULL,
    consumption_summaries_total_cost_php DECIMAL(10, 2) NOT NULL,
    consumption_summaries_reading_count INT,
    consumption_summaries_created_at DATETIME,
    FOREIGN KEY (consumption_summaries_user_id) REFERENCES tblusers(users_id),
    FOREIGN KEY (consumption_summaries_device_id) REFERENCES tbldevices(devices_id),
    FOREIGN KEY (consumption_summaries_appliance_id) REFERENCES tblappliances(appliances_id),
    FOREIGN KEY (consumption_summaries_electricity_rate_id) REFERENCES tblelectricity_rates(electricity_rates_id)
);

-- Electricity Rates Table
CREATE TABLE tblelectricity_rates (
    electricity_rates_id INT PRIMARY KEY,
    electricity_rates_name VARCHAR(255) NOT NULL,
    electricity_rates_peso_per_kwh DECIMAL(10, 4) NOT NULL,
    electricity_rates_effective_from DATE NOT NULL,
    electricity_rates_effective_to DATE,
    electricity_rates_is_active BOOLEAN,
    electricity_rates_created_at DATETIME
);

-- Notifications Table
CREATE TABLE tblnotifications (
    notifications_id INT PRIMARY KEY,
    notifications_user_id INT NOT NULL,
    notifications_title VARCHAR(255) NOT NULL,
    notifications_message TEXT NOT NULL,
    notifications_type VARCHAR(20),
    notifications_priority VARCHAR(20),
    notifications_is_read BOOLEAN,
    notifications_read_at DATETIME,
    notifications_expires_at DATETIME,
    notifications_created_at DATETIME,
    FOREIGN KEY (notifications_user_id) REFERENCES tblusers(users_id)
);

-- Alert Rules Table
CREATE TABLE tblalert_rules (
    alert_rules_id INT PRIMARY KEY,
    alert_rules_user_id INT NOT NULL,
    alert_rules_appliance_id INT,
    alert_rules_device_id INT,
    alert_rules_alert_type VARCHAR(30) NOT NULL,
    alert_rules_threshold_value DECIMAL(10, 2) NOT NULL,
    alert_rules_condition VARCHAR(10) NOT NULL,
    alert_rules_severity VARCHAR(20),
    alert_rules_is_active BOOLEAN,
    alert_rules_created_at DATETIME,
    alert_rules_updated_at DATETIME,
    FOREIGN KEY (alert_rules_user_id) REFERENCES tblusers(users_id),
    FOREIGN KEY (alert_rules_appliance_id) REFERENCES tblappliances(appliances_id),
    FOREIGN KEY (alert_rules_device_id) REFERENCES tbldevices(devices_id)
);

-- Audit Logs Table
CREATE TABLE tblaudit_logs (
    audit_logs_id INT PRIMARY KEY,
    audit_logs_user_id INT NOT NULL,
    audit_logs_action VARCHAR(50) NOT NULL,
    audit_logs_entity_type VARCHAR(50) NOT NULL,
    audit_logs_entity_id INT,
    audit_logs_old_value TEXT,
    audit_logs_new_value TEXT,
    audit_logs_ip_address VARCHAR(45),
    audit_logs_description TEXT,
    audit_logs_created_at DATETIME,
    FOREIGN KEY (audit_logs_user_id) REFERENCES tblusers(users_id)
);

-- System Settings Table
CREATE TABLE tblsystem_settings (
    system_settings_id INT PRIMARY KEY,
    system_settings_setting_key VARCHAR(100) UNIQUE NOT NULL,
    system_settings_setting_value TEXT,
    system_settings_description TEXT,
    system_settings_category VARCHAR(20),
    system_settings_is_public BOOLEAN,
    system_settings_created_at DATETIME,
    system_settings_created_by INT,
    system_settings_updated_at DATETIME,
    system_settings_updated_by INT,
    FOREIGN KEY (system_settings_created_by) REFERENCES tblusers(users_id),
    FOREIGN KEY (system_settings_updated_by) REFERENCES tblusers(users_id)
);
