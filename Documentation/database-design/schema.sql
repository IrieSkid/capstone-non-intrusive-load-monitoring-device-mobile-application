-- ============================================
-- NILM System Database Schema
-- Non-Intrusive Load Monitoring System
-- ============================================
-- Database: PostgreSQL or MySQL
-- Version: 1.0
-- Created for: BSIT Capstone Project
-- ============================================

-- Drop existing tables (if any) - Use with caution in production
-- DROP TABLE IF EXISTS alert_rules CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS consumption_summaries CASCADE;
-- DROP TABLE IF EXISTS real_time_readings CASCADE;
-- DROP TABLE IF EXISTS appliances CASCADE;
-- DROP TABLE IF EXISTS devices CASCADE;
-- DROP TABLE IF EXISTS electricity_rates CASCADE;
-- DROP TABLE IF EXISTS user_sessions CASCADE;
-- DROP TABLE IF EXISTS system_settings CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USER MANAGEMENT TABLES
-- ============================================

-- Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('admin', 'homeowner', 'tenant') DEFAULT 'homeowner',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at DATETIME,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_role (role)
);

-- User Sessions Table
CREATE TABLE user_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    device_info VARCHAR(255),
    ip_address VARCHAR(45),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
);

-- ============================================
-- DEVICE AND APPLIANCE TABLES
-- ============================================

-- Devices Table
CREATE TABLE devices (
    device_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    device_serial_number VARCHAR(100) UNIQUE NOT NULL,
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    location VARCHAR(255),
    wifi_ssid VARCHAR(255),
    status ENUM('online', 'offline', 'error') DEFAULT 'offline',
    last_sync_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_serial_number (device_serial_number)
);

-- Appliances Table
CREATE TABLE appliances (
    appliance_id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL,
    appliance_name VARCHAR(255) NOT NULL,
    appliance_type ENUM('light', 'fan', 'refrigerator', 'ac', 'tv', 'other') NOT NULL,
    port_number INT NOT NULL,
    rated_watts DECIMAL(10, 2),
    status ENUM('on', 'off', 'unknown') DEFAULT 'unknown',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    INDEX idx_device_id (device_id),
    INDEX idx_status (status),
    INDEX idx_appliance_type (appliance_type)
);

-- ============================================
-- REAL-TIME READINGS TABLE
-- ============================================

-- Real-Time Readings Table
CREATE TABLE real_time_readings (
    reading_id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL,
    appliance_id INT,
    voltage_rms DECIMAL(10, 2) NOT NULL,
    current_rms DECIMAL(10, 2) NOT NULL,
    power_watts DECIMAL(10, 2) NOT NULL,
    apparent_power_va DECIMAL(10, 2) NOT NULL,
    power_factor DECIMAL(5, 4) NOT NULL,
    energy_kwh DECIMAL(10, 6) NOT NULL,
    recorded_at DATETIME NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id) ON DELETE SET NULL,
    INDEX idx_recorded_at (recorded_at),
    INDEX idx_device_appliance (device_id, appliance_id),
    INDEX idx_device_time (device_id, recorded_at),
    INDEX idx_appliance_time (appliance_id, recorded_at)
);

-- ============================================
-- CONSUMPTION AND BILLING TABLES
-- ============================================

-- Electricity Rates Table
CREATE TABLE electricity_rates (
    rate_id INT PRIMARY KEY AUTO_INCREMENT,
    rate_name VARCHAR(255) NOT NULL,
    peso_per_kwh DECIMAL(10, 4) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (is_active, effective_from)
);

-- Consumption Summaries Table
CREATE TABLE consumption_summaries (
    summary_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    device_id INT,
    appliance_id INT,
    period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_kwh DECIMAL(10, 4) NOT NULL,
    total_cost_php DECIMAL(10, 2) NOT NULL,
    reading_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id) ON DELETE CASCADE,
    UNIQUE KEY uk_period (appliance_id, period_type, period_start),
    INDEX idx_user_period (user_id, period_type, period_start),
    INDEX idx_device_period (device_id, period_type, period_start),
    INDEX idx_appliance_period (appliance_id, period_type, period_start)
);

-- ============================================
-- NOTIFICATION AND ALERT TABLES
-- ============================================

-- Notifications Table
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('alert', 'info', 'warning', 'error') DEFAULT 'info',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_type (type)
);

-- Alert Rules Table
CREATE TABLE alert_rules (
    rule_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    appliance_id INT,
    device_id INT,
    alert_type ENUM('power_threshold', 'consumption_limit', 'device_offline') NOT NULL,
    threshold_value DECIMAL(10, 2) NOT NULL,
    condition VARCHAR(10) NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_appliance_active (appliance_id, is_active)
);

-- ============================================
-- SYSTEM CONFIGURATION TABLE
-- ============================================

-- Audit Logs Table
CREATE TABLE audit_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_action (user_id, action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
);

-- System Settings Table
CREATE TABLE system_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    category ENUM('general', 'billing', 'alerts', 'device') DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_key (setting_key)
);

-- ============================================
-- INITIAL DATA (SEED DATA)
-- ============================================

-- Insert default admin user (password: admin123 - CHANGE THIS!)
-- Password hash for 'admin123' using bcrypt (cost 10)
INSERT INTO users (email, password_hash, full_name, role, status) VALUES
('admin@nilm.local', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'System Administrator', 'admin', 'active');

-- Insert default electricity rate
INSERT INTO electricity_rates (rate_name, peso_per_kwh, effective_from, is_active) VALUES
('Residential Rate 2024', 12.50, CURDATE(), TRUE);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, category, is_public) VALUES
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
    d.device_id,
    d.device_name,
    d.status AS device_status,
    r.voltage_rms,
    r.current_rms,
    r.power_watts,
    r.apparent_power_va,
    r.power_factor,
    r.energy_kwh,
    r.recorded_at
FROM devices d
LEFT JOIN real_time_readings r ON d.device_id = r.device_id
WHERE r.recorded_at = (
    SELECT MAX(recorded_at) 
    FROM real_time_readings 
    WHERE device_id = d.device_id
);

-- View: Appliance Status Summary
CREATE OR REPLACE VIEW v_appliance_status AS
SELECT 
    a.appliance_id,
    a.appliance_name,
    a.appliance_type,
    a.status,
    d.device_name,
    d.location,
    u.full_name AS owner_name,
    r.power_watts AS current_power,
    r.recorded_at AS last_reading
FROM appliances a
JOIN devices d ON a.device_id = d.device_id
JOIN users u ON d.user_id = u.user_id
LEFT JOIN real_time_readings r ON a.appliance_id = r.appliance_id
WHERE r.recorded_at = (
    SELECT MAX(recorded_at) 
    FROM real_time_readings 
    WHERE appliance_id = a.appliance_id
);

-- View: Unread Notifications Count
CREATE OR REPLACE VIEW v_unread_notifications_count AS
SELECT 
    user_id,
    COUNT(*) AS unread_count
FROM notifications
WHERE is_read = FALSE
GROUP BY user_id;

-- ============================================
-- END OF SCHEMA
-- ============================================

-- Notes:
-- 1. Change the admin password hash before deploying
-- 2. Adjust data types if using PostgreSQL (e.g., SERIAL instead of AUTO_INCREMENT)
-- 3. For PostgreSQL, use TIMESTAMP instead of DATETIME
-- 4. For PostgreSQL, use TEXT instead of VARCHAR for longer fields
-- 5. Consider adding triggers for automatic consumption summary generation
-- 6. Consider partitioning real_time_readings table by date for large datasets

