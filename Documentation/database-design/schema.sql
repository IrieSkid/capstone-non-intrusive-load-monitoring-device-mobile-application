-- ============================================
-- NILM System Database Schema
-- Non-Intrusive Load Monitoring System
-- ============================================
-- Database: MySQL / MariaDB
-- Version: 1.0
-- Created for: BSIT Capstone Project
-- Naming Convention: tbl prefix + tablename_columnname format
-- ============================================

-- Drop existing tables (if any) - Use with caution in production
-- DROP TABLE IF EXISTS tblalert_rules CASCADE;
-- DROP TABLE IF EXISTS tblnotifications CASCADE;
-- DROP TABLE IF EXISTS tblconsumption_summaries CASCADE;
-- DROP TABLE IF EXISTS tblreal_time_readings CASCADE;
-- DROP TABLE IF EXISTS tblappliances CASCADE;
-- DROP TABLE IF EXISTS tbldevices CASCADE;
-- DROP TABLE IF EXISTS tblelectricity_rates CASCADE;
-- DROP TABLE IF EXISTS tbluser_sessions CASCADE;
-- DROP TABLE IF EXISTS tblsystem_settings CASCADE;
-- DROP TABLE IF EXISTS tblaudit_logs CASCADE;
-- DROP TABLE IF EXISTS tblusers CASCADE;

-- ============================================
-- USER MANAGEMENT TABLES
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
    users_last_login_at DATETIME,
    INDEX idx_users_email (users_email),
    INDEX idx_users_status (users_status),
    INDEX idx_users_role (users_role)
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
    FOREIGN KEY (user_sessions_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE,
    INDEX idx_user_sessions_user_id (user_sessions_user_id),
    INDEX idx_user_sessions_token (user_sessions_token),
    INDEX idx_user_sessions_expires_at (user_sessions_expires_at)
);

-- ============================================
-- DEVICE AND APPLIANCE TABLES
-- ============================================

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
    FOREIGN KEY (devices_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE,
    INDEX idx_devices_user_id (devices_user_id),
    INDEX idx_devices_status (devices_status),
    INDEX idx_devices_serial_number (devices_serial_number)
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
    FOREIGN KEY (appliances_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE,
    INDEX idx_appliances_device_id (appliances_device_id),
    INDEX idx_appliances_status (appliances_status),
    INDEX idx_appliances_type (appliances_type)
);

-- ============================================
-- REAL-TIME READINGS TABLE
-- ============================================

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
    FOREIGN KEY (real_time_readings_appliance_id) REFERENCES tblappliances(appliances_id) ON DELETE SET NULL,
    INDEX idx_real_time_readings_recorded_at (real_time_readings_recorded_at),
    INDEX idx_real_time_readings_device_appliance (real_time_readings_device_id, real_time_readings_appliance_id),
    INDEX idx_real_time_readings_device_time (real_time_readings_device_id, real_time_readings_recorded_at),
    INDEX idx_real_time_readings_appliance_time (real_time_readings_appliance_id, real_time_readings_recorded_at)
);

-- ============================================
-- CONSUMPTION AND BILLING TABLES
-- ============================================

-- Electricity Rates Table
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
    FOREIGN KEY (consumption_summaries_appliance_id) REFERENCES tblappliances(appliances_id) ON DELETE CASCADE,
    UNIQUE KEY uk_consumption_period (consumption_summaries_appliance_id, consumption_summaries_period_type, consumption_summaries_period_start),
    INDEX idx_consumption_user_period (consumption_summaries_user_id, consumption_summaries_period_type, consumption_summaries_period_start),
    INDEX idx_consumption_device_period (consumption_summaries_device_id, consumption_summaries_period_type, consumption_summaries_period_start),
    INDEX idx_consumption_appliance_period (consumption_summaries_appliance_id, consumption_summaries_period_type, consumption_summaries_period_start)
);

-- ============================================
-- NOTIFICATION AND ALERT TABLES
-- ============================================

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
    FOREIGN KEY (notifications_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE,
    INDEX idx_notifications_user_unread (notifications_user_id, notifications_is_read),
    INDEX idx_notifications_created_at (notifications_created_at),
    INDEX idx_notifications_type (notifications_type)
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
    FOREIGN KEY (alert_rules_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE,
    INDEX idx_alert_rules_user_active (alert_rules_user_id, alert_rules_is_active),
    INDEX idx_alert_rules_appliance_active (alert_rules_appliance_id, alert_rules_is_active)
);

-- ============================================
-- AUDIT AND SYSTEM CONFIGURATION TABLES
-- ============================================

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
    FOREIGN KEY (audit_logs_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE,
    INDEX idx_audit_logs_user_action (audit_logs_user_id, audit_logs_action),
    INDEX idx_audit_logs_entity (audit_logs_entity_type, audit_logs_entity_id),
    INDEX idx_audit_logs_created_at (audit_logs_created_at)
);

-- System Settings Table
CREATE TABLE tblsystem_settings (
    system_settings_id INT PRIMARY KEY AUTO_INCREMENT,
    system_settings_setting_key VARCHAR(100) UNIQUE NOT NULL,
    system_settings_setting_value TEXT,
    system_settings_description TEXT,
    system_settings_category ENUM('general', 'billing', 'alerts', 'device') DEFAULT 'general',
    system_settings_is_public BOOLEAN DEFAULT FALSE,
    system_settings_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_system_settings_category (system_settings_category),
    INDEX idx_system_settings_key (system_settings_setting_key)
);

-- ============================================
-- INITIAL DATA (SEED DATA)
-- ============================================

-- Insert default admin user (password: admin123 - CHANGE THIS!)
-- Password hash for 'admin123' using bcrypt (cost 10)
INSERT INTO tblusers (users_email, users_password_hash, users_full_name, users_role, users_status) VALUES
('admin@nilm.local', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'System Administrator', 'admin', 'active');

-- Insert default electricity rate
INSERT INTO tblelectricity_rates (electricity_rates_name, electricity_rates_peso_per_kwh, electricity_rates_effective_from, electricity_rates_is_active) VALUES
('Residential Rate 2024', 12.50, CURDATE(), TRUE);

-- Insert default system settings
INSERT INTO tblsystem_settings (system_settings_setting_key, system_settings_setting_value, system_settings_description, system_settings_category, system_settings_is_public) VALUES
('app_name', 'NILM Monitoring System', 'Application Name', 'general', TRUE),
('data_retention_days', '90', 'Number of days to keep real-time readings', 'device', FALSE),
('default_currency', 'PHP', 'Default currency symbol', 'billing', TRUE),
('alert_check_interval', '60', 'Alert check interval in seconds', 'alerts', FALSE);

-- ============================================
-- VIEWS (Optional - for easier queries)
-- ============================================

-- View: Latest Device Readings
CREATE OR REPLACE VIEW v_latest_device_readings AS
SELECT 
    d.devices_id,
    d.devices_name,
    d.devices_status,
    r.real_time_readings_voltage_rms,
    r.real_time_readings_current_rms,
    r.real_time_readings_power_watts,
    r.real_time_readings_apparent_power_va,
    r.real_time_readings_power_factor,
    r.real_time_readings_energy_kwh,
    r.real_time_readings_recorded_at
FROM tbldevices d
LEFT JOIN tblreal_time_readings r ON d.devices_id = r.real_time_readings_device_id
WHERE r.real_time_readings_recorded_at = (
    SELECT MAX(real_time_readings_recorded_at) 
    FROM tblreal_time_readings 
    WHERE real_time_readings_device_id = d.devices_id
);

-- View: Appliance Status Summary
CREATE OR REPLACE VIEW v_appliance_status AS
SELECT 
    a.appliances_id,
    a.appliances_name,
    a.appliances_type,
    a.appliances_status,
    d.devices_name,
    d.devices_location,
    u.users_full_name AS owner_name,
    r.real_time_readings_power_watts AS current_power,
    r.real_time_readings_recorded_at AS last_reading
FROM tblappliances a
JOIN tbldevices d ON a.appliances_device_id = d.devices_id
JOIN tblusers u ON d.devices_user_id = u.users_id
LEFT JOIN tblreal_time_readings r ON a.appliances_id = r.real_time_readings_appliance_id
WHERE r.real_time_readings_recorded_at = (
    SELECT MAX(real_time_readings_recorded_at) 
    FROM tblreal_time_readings 
    WHERE real_time_readings_appliance_id = a.appliances_id
);

-- View: Unread Notifications Count
CREATE OR REPLACE VIEW v_unread_notifications_count AS
SELECT 
    notifications_user_id,
    COUNT(*) AS unread_count
FROM tblnotifications
WHERE notifications_is_read = FALSE
GROUP BY notifications_user_id;

-- ============================================
-- END OF SCHEMA
-- ============================================

-- Notes:
-- 1. Change the admin password hash before deploying
-- 2. All table names use 'tbl' prefix
-- 3. All column names use 'tablename_columnname' format
-- 4. For PostgreSQL version, see schema-postgresql.sql
-- 5. Consider adding triggers for automatic consumption summary generation
-- 6. Consider partitioning tblreal_time_readings table by date for large datasets
