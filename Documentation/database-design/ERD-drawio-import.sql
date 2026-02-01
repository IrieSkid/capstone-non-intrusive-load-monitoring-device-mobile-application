-- ============================================
-- NILM System ERD - Draw.io Import Format
-- ============================================
-- Instructions:
-- 1. Open draw.io (diagrams.net)
-- 2. Go to: File → Import → From Database
-- 3. Select "MySQL" or "PostgreSQL"
-- 4. Paste this SQL script
-- 5. Click "Import"
-- ============================================
-- Note: Uses tbl prefix naming convention
-- ============================================

-- Users Table
CREATE TABLE tblusers (
    users_id INT PRIMARY KEY AUTO_INCREMENT,
    users_email VARCHAR(255) UNIQUE NOT NULL,
    users_password_hash VARCHAR(255) NOT NULL,
    users_full_name VARCHAR(255) NOT NULL,
    users_phone_number VARCHAR(20),
    users_role ENUM('admin', 'homeowner', 'tenant') DEFAULT 'homeowner',
    users_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    users_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    users_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    users_last_login_at DATETIME
);

-- User Sessions Table
CREATE TABLE tbluser_sessions (
    user_sessions_id INT PRIMARY KEY AUTO_INCREMENT,
    user_sessions_user_id INT NOT NULL,
    user_sessions_token VARCHAR(500) NOT NULL,
    user_sessions_device_info VARCHAR(255),
    user_sessions_ip_address VARCHAR(45),
    user_sessions_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_sessions_expires_at DATETIME NOT NULL,
    user_sessions_is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_sessions_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE
);

-- Devices Table
CREATE TABLE tbldevices (
    devices_id INT PRIMARY KEY AUTO_INCREMENT,
    devices_user_id INT NOT NULL,
    devices_name VARCHAR(255) NOT NULL,
    devices_serial_number VARCHAR(100) UNIQUE NOT NULL,
    devices_mac_address VARCHAR(17) UNIQUE NOT NULL,
    devices_location VARCHAR(255),
    devices_wifi_ssid VARCHAR(255),
    devices_status ENUM('online', 'offline', 'error') DEFAULT 'offline',
    devices_last_sync_at DATETIME,
    devices_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    devices_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (devices_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE
);

-- Appliances Table
CREATE TABLE tblappliances (
    appliances_id INT PRIMARY KEY AUTO_INCREMENT,
    appliances_device_id INT NOT NULL,
    appliances_name VARCHAR(255) NOT NULL,
    appliances_type ENUM('light', 'fan', 'refrigerator', 'ac', 'tv', 'other') NOT NULL,
    appliances_port_number INT NOT NULL,
    appliances_rated_watts DECIMAL(10, 2),
    appliances_status ENUM('on', 'off', 'unknown') DEFAULT 'unknown',
    appliances_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    appliances_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appliances_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE
);

-- Real-Time Readings Table
CREATE TABLE tblreal_time_readings (
    real_time_readings_id INT PRIMARY KEY AUTO_INCREMENT,
    real_time_readings_device_id INT NOT NULL,
    real_time_readings_appliance_id INT,
    real_time_readings_voltage_rms DECIMAL(10, 2) NOT NULL,
    real_time_readings_current_rms DECIMAL(10, 2) NOT NULL,
    real_time_readings_power_watts DECIMAL(10, 2) NOT NULL,
    real_time_readings_apparent_power_va DECIMAL(10, 2) NOT NULL,
    real_time_readings_power_factor DECIMAL(5, 4) NOT NULL,
    real_time_readings_energy_kwh DECIMAL(10, 6) NOT NULL,
    real_time_readings_recorded_at DATETIME NOT NULL,
    FOREIGN KEY (real_time_readings_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE,
    FOREIGN KEY (real_time_readings_appliance_id) REFERENCES tblappliances(appliances_id) ON DELETE SET NULL
);

-- Consumption Summaries Table
CREATE TABLE tblconsumption_summaries (
    consumption_summaries_id INT PRIMARY KEY AUTO_INCREMENT,
    consumption_summaries_user_id INT NOT NULL,
    consumption_summaries_device_id INT,
    consumption_summaries_appliance_id INT,
    consumption_summaries_period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    consumption_summaries_period_start DATE NOT NULL,
    consumption_summaries_period_end DATE NOT NULL,
    consumption_summaries_total_kwh DECIMAL(10, 4) NOT NULL,
    consumption_summaries_total_cost_php DECIMAL(10, 2) NOT NULL,
    consumption_summaries_reading_count INT DEFAULT 0,
    consumption_summaries_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consumption_summaries_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE,
    FOREIGN KEY (consumption_summaries_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE,
    FOREIGN KEY (consumption_summaries_appliance_id) REFERENCES tblappliances(appliances_id) ON DELETE CASCADE
);

-- Electricity Rates Table
CREATE TABLE tblelectricity_rates (
    electricity_rates_id INT PRIMARY KEY AUTO_INCREMENT,
    electricity_rates_name VARCHAR(255) NOT NULL,
    electricity_rates_peso_per_kwh DECIMAL(10, 4) NOT NULL,
    electricity_rates_effective_from DATE NOT NULL,
    electricity_rates_effective_to DATE,
    electricity_rates_is_active BOOLEAN DEFAULT TRUE,
    electricity_rates_created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE tblnotifications (
    notifications_id INT PRIMARY KEY AUTO_INCREMENT,
    notifications_user_id INT NOT NULL,
    notifications_title VARCHAR(255) NOT NULL,
    notifications_message TEXT NOT NULL,
    notifications_type ENUM('alert', 'info', 'warning', 'error') DEFAULT 'info',
    notifications_priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    notifications_is_read BOOLEAN DEFAULT FALSE,
    notifications_read_at DATETIME,
    notifications_expires_at DATETIME,
    notifications_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notifications_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE
);

-- Alert Rules Table
CREATE TABLE tblalert_rules (
    alert_rules_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_rules_user_id INT NOT NULL,
    alert_rules_appliance_id INT,
    alert_rules_device_id INT,
    alert_rules_alert_type ENUM('power_threshold', 'consumption_limit', 'device_offline') NOT NULL,
    alert_rules_threshold_value DECIMAL(10, 2) NOT NULL,
    alert_rules_condition VARCHAR(10) NOT NULL,
    alert_rules_severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    alert_rules_is_active BOOLEAN DEFAULT TRUE,
    alert_rules_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    alert_rules_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_rules_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE,
    FOREIGN KEY (alert_rules_appliance_id) REFERENCES tblappliances(appliances_id) ON DELETE CASCADE,
    FOREIGN KEY (alert_rules_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE
);

-- Audit Logs Table
CREATE TABLE tblaudit_logs (
    audit_logs_id INT PRIMARY KEY AUTO_INCREMENT,
    audit_logs_user_id INT NOT NULL,
    audit_logs_action VARCHAR(50) NOT NULL,
    audit_logs_entity_type VARCHAR(50) NOT NULL,
    audit_logs_entity_id INT,
    audit_logs_old_value JSON,
    audit_logs_new_value JSON,
    audit_logs_ip_address VARCHAR(45),
    audit_logs_description TEXT,
    audit_logs_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_logs_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE
);

-- System Settings Table
CREATE TABLE tblsystem_settings (
    system_settings_id INT PRIMARY KEY AUTO_INCREMENT,
    system_settings_setting_key VARCHAR(100) UNIQUE NOT NULL,
    system_settings_setting_value TEXT,
    system_settings_description TEXT,
    system_settings_category ENUM('general', 'billing', 'alerts', 'device') DEFAULT 'general',
    system_settings_is_public BOOLEAN DEFAULT FALSE,
    system_settings_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
