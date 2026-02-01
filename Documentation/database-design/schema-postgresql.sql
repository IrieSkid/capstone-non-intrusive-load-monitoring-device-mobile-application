-- ============================================
-- NILM System Database Schema (PostgreSQL)
-- Non-Intrusive Load Monitoring System
-- ============================================
-- Database: PostgreSQL 12+
-- Version: 1.0
-- Created for: BSIT Capstone Project
-- Naming Convention: tbl prefix + tablename_columnname format
-- ============================================

-- Create database (run as superuser)
-- CREATE DATABASE nilm_db;
-- \c nilm_db;

-- Create extensions if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER MANAGEMENT TABLES
-- ============================================

-- Users Table
CREATE TABLE tblusers (
    users_id SERIAL PRIMARY KEY,
    users_email VARCHAR(255) UNIQUE NOT NULL,
    users_password_hash VARCHAR(255) NOT NULL,
    users_full_name VARCHAR(255) NOT NULL,
    users_phone_number VARCHAR(20),
    users_role VARCHAR(20) CHECK (users_role IN ('admin', 'homeowner', 'tenant')) DEFAULT 'homeowner',
    users_status VARCHAR(20) CHECK (users_status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    users_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    users_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    users_last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON tblusers(users_email);
CREATE INDEX idx_users_status ON tblusers(users_status);
CREATE INDEX idx_users_role ON tblusers(users_role);

-- User Sessions Table
CREATE TABLE tbluser_sessions (
    user_sessions_id SERIAL PRIMARY KEY,
    user_sessions_user_id INTEGER NOT NULL,
    user_sessions_token VARCHAR(500) NOT NULL,
    user_sessions_device_info VARCHAR(255),
    user_sessions_ip_address VARCHAR(45),
    user_sessions_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_sessions_expires_at TIMESTAMP NOT NULL,
    user_sessions_is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_sessions_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_sessions_user_id ON tbluser_sessions(user_sessions_user_id);
CREATE INDEX idx_user_sessions_token ON tbluser_sessions(user_sessions_token);
CREATE INDEX idx_user_sessions_expires_at ON tbluser_sessions(user_sessions_expires_at);

-- ============================================
-- DEVICE AND APPLIANCE TABLES
-- ============================================

-- Devices Table
CREATE TABLE tbldevices (
    devices_id SERIAL PRIMARY KEY,
    devices_user_id INTEGER NOT NULL,
    devices_name VARCHAR(255) NOT NULL,
    devices_serial_number VARCHAR(100) UNIQUE NOT NULL,
    devices_mac_address VARCHAR(17) UNIQUE NOT NULL,
    devices_location VARCHAR(255),
    devices_wifi_ssid VARCHAR(255),
    devices_status VARCHAR(20) CHECK (devices_status IN ('online', 'offline', 'error')) DEFAULT 'offline',
    devices_last_sync_at TIMESTAMP,
    devices_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    devices_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (devices_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE
);

CREATE INDEX idx_devices_user_id ON tbldevices(devices_user_id);
CREATE INDEX idx_devices_status ON tbldevices(devices_status);
CREATE INDEX idx_devices_serial_number ON tbldevices(devices_serial_number);

-- Appliances Table
CREATE TABLE tblappliances (
    appliances_id SERIAL PRIMARY KEY,
    appliances_device_id INTEGER NOT NULL,
    appliances_name VARCHAR(255) NOT NULL,
    appliances_type VARCHAR(20) CHECK (appliances_type IN ('light', 'fan', 'refrigerator', 'ac', 'tv', 'other')) NOT NULL,
    appliances_port_number INTEGER NOT NULL,
    appliances_rated_watts DECIMAL(10, 2),
    appliances_status VARCHAR(20) CHECK (appliances_status IN ('on', 'off', 'unknown')) DEFAULT 'unknown',
    appliances_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    appliances_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appliances_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE
);

CREATE INDEX idx_appliances_device_id ON tblappliances(appliances_device_id);
CREATE INDEX idx_appliances_status ON tblappliances(appliances_status);
CREATE INDEX idx_appliances_type ON tblappliances(appliances_type);

-- ============================================
-- REAL-TIME READINGS TABLE
-- ============================================

-- Real-Time Readings Table
CREATE TABLE tblreal_time_readings (
    real_time_readings_id SERIAL PRIMARY KEY,
    real_time_readings_device_id INTEGER NOT NULL,
    real_time_readings_appliance_id INTEGER,
    real_time_readings_voltage_rms DECIMAL(10, 2) NOT NULL,
    real_time_readings_current_rms DECIMAL(10, 2) NOT NULL,
    real_time_readings_power_watts DECIMAL(10, 2) NOT NULL,
    real_time_readings_apparent_power_va DECIMAL(10, 2) NOT NULL,
    real_time_readings_power_factor DECIMAL(5, 4) NOT NULL,
    real_time_readings_energy_kwh DECIMAL(10, 6) NOT NULL,
    real_time_readings_recorded_at TIMESTAMP NOT NULL,
    FOREIGN KEY (real_time_readings_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE,
    FOREIGN KEY (real_time_readings_appliance_id) REFERENCES tblappliances(appliances_id) ON DELETE SET NULL
);

CREATE INDEX idx_real_time_readings_recorded_at ON tblreal_time_readings(real_time_readings_recorded_at);
CREATE INDEX idx_real_time_readings_device_appliance ON tblreal_time_readings(real_time_readings_device_id, real_time_readings_appliance_id);
CREATE INDEX idx_real_time_readings_device_time ON tblreal_time_readings(real_time_readings_device_id, real_time_readings_recorded_at);
CREATE INDEX idx_real_time_readings_appliance_time ON tblreal_time_readings(real_time_readings_appliance_id, real_time_readings_recorded_at);

-- ============================================
-- CONSUMPTION AND BILLING TABLES
-- ============================================

-- Electricity Rates Table
CREATE TABLE tblelectricity_rates (
    electricity_rates_id SERIAL PRIMARY KEY,
    electricity_rates_name VARCHAR(255) NOT NULL,
    electricity_rates_peso_per_kwh DECIMAL(10, 4) NOT NULL,
    electricity_rates_effective_from DATE NOT NULL,
    electricity_rates_effective_to DATE,
    electricity_rates_is_active BOOLEAN DEFAULT TRUE,
    electricity_rates_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_electricity_rates_active ON tblelectricity_rates(electricity_rates_is_active, electricity_rates_effective_from);

-- Consumption Summaries Table
CREATE TABLE tblconsumption_summaries (
    consumption_summaries_id SERIAL PRIMARY KEY,
    consumption_summaries_user_id INTEGER NOT NULL,
    consumption_summaries_device_id INTEGER,
    consumption_summaries_appliance_id INTEGER,
    consumption_summaries_period_type VARCHAR(20) CHECK (consumption_summaries_period_type IN ('daily', 'weekly', 'monthly')) NOT NULL,
    consumption_summaries_period_start DATE NOT NULL,
    consumption_summaries_period_end DATE NOT NULL,
    consumption_summaries_total_kwh DECIMAL(10, 4) NOT NULL,
    consumption_summaries_total_cost_php DECIMAL(10, 2) NOT NULL,
    consumption_summaries_reading_count INTEGER DEFAULT 0,
    consumption_summaries_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consumption_summaries_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE,
    FOREIGN KEY (consumption_summaries_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE,
    FOREIGN KEY (consumption_summaries_appliance_id) REFERENCES tblappliances(appliances_id) ON DELETE CASCADE,
    UNIQUE (consumption_summaries_appliance_id, consumption_summaries_period_type, consumption_summaries_period_start)
);

CREATE INDEX idx_consumption_user_period ON tblconsumption_summaries(consumption_summaries_user_id, consumption_summaries_period_type, consumption_summaries_period_start);
CREATE INDEX idx_consumption_device_period ON tblconsumption_summaries(consumption_summaries_device_id, consumption_summaries_period_type, consumption_summaries_period_start);
CREATE INDEX idx_consumption_appliance_period ON tblconsumption_summaries(consumption_summaries_appliance_id, consumption_summaries_period_type, consumption_summaries_period_start);

-- ============================================
-- NOTIFICATION AND ALERT TABLES
-- ============================================

-- Notifications Table
CREATE TABLE tblnotifications (
    notifications_id SERIAL PRIMARY KEY,
    notifications_user_id INTEGER NOT NULL,
    notifications_title VARCHAR(255) NOT NULL,
    notifications_message TEXT NOT NULL,
    notifications_type VARCHAR(20) CHECK (notifications_type IN ('alert', 'info', 'warning', 'error')) DEFAULT 'info',
    notifications_priority VARCHAR(20) CHECK (notifications_priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    notifications_is_read BOOLEAN DEFAULT FALSE,
    notifications_read_at TIMESTAMP,
    notifications_expires_at TIMESTAMP,
    notifications_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notifications_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_unread ON tblnotifications(notifications_user_id, notifications_is_read);
CREATE INDEX idx_notifications_created_at ON tblnotifications(notifications_created_at);
CREATE INDEX idx_notifications_type ON tblnotifications(notifications_type);

-- Alert Rules Table
CREATE TABLE tblalert_rules (
    alert_rules_id SERIAL PRIMARY KEY,
    alert_rules_user_id INTEGER NOT NULL,
    alert_rules_appliance_id INTEGER,
    alert_rules_device_id INTEGER,
    alert_rules_alert_type VARCHAR(20) CHECK (alert_rules_alert_type IN ('power_threshold', 'consumption_limit', 'device_offline')) NOT NULL,
    alert_rules_threshold_value DECIMAL(10, 2) NOT NULL,
    alert_rules_condition VARCHAR(10) NOT NULL,
    alert_rules_severity VARCHAR(20) CHECK (alert_rules_severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    alert_rules_is_active BOOLEAN DEFAULT TRUE,
    alert_rules_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    alert_rules_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_rules_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE,
    FOREIGN KEY (alert_rules_appliance_id) REFERENCES tblappliances(appliances_id) ON DELETE CASCADE,
    FOREIGN KEY (alert_rules_device_id) REFERENCES tbldevices(devices_id) ON DELETE CASCADE
);

CREATE INDEX idx_alert_rules_user_active ON tblalert_rules(alert_rules_user_id, alert_rules_is_active);
CREATE INDEX idx_alert_rules_appliance_active ON tblalert_rules(alert_rules_appliance_id, alert_rules_is_active);

-- ============================================
-- AUDIT AND SYSTEM CONFIGURATION TABLES
-- ============================================

-- Audit Logs Table
CREATE TABLE tblaudit_logs (
    audit_logs_id SERIAL PRIMARY KEY,
    audit_logs_user_id INTEGER NOT NULL,
    audit_logs_action VARCHAR(50) NOT NULL,
    audit_logs_entity_type VARCHAR(50) NOT NULL,
    audit_logs_entity_id INTEGER,
    audit_logs_old_value JSONB,
    audit_logs_new_value JSONB,
    audit_logs_ip_address VARCHAR(45),
    audit_logs_description TEXT,
    audit_logs_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_logs_user_id) REFERENCES tblusers(users_id) ON DELETE CASCADE
);

CREATE INDEX idx_audit_logs_user_action ON tblaudit_logs(audit_logs_user_id, audit_logs_action);
CREATE INDEX idx_audit_logs_entity ON tblaudit_logs(audit_logs_entity_type, audit_logs_entity_id);
CREATE INDEX idx_audit_logs_created_at ON tblaudit_logs(audit_logs_created_at);

-- System Settings Table
CREATE TABLE tblsystem_settings (
    system_settings_id SERIAL PRIMARY KEY,
    system_settings_setting_key VARCHAR(100) UNIQUE NOT NULL,
    system_settings_setting_value TEXT,
    system_settings_description TEXT,
    system_settings_category VARCHAR(20) CHECK (system_settings_category IN ('general', 'billing', 'alerts', 'device')) DEFAULT 'general',
    system_settings_is_public BOOLEAN DEFAULT FALSE,
    system_settings_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_settings_category ON tblsystem_settings(system_settings_category);
CREATE INDEX idx_system_settings_key ON tblsystem_settings(system_settings_setting_key);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON tblusers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON tbldevices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appliances_updated_at BEFORE UPDATE ON tblappliances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_rules_updated_at BEFORE UPDATE ON tblalert_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON tblsystem_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for audit logging (example - can be customized)
CREATE OR REPLACE FUNCTION log_user_action()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO tblaudit_logs (audit_logs_user_id, audit_logs_action, audit_logs_entity_type, audit_logs_entity_id, audit_logs_new_value, audit_logs_description)
        VALUES (NEW.users_id, 'CREATE', TG_TABLE_NAME, NEW.users_id, row_to_json(NEW), 'Record created');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO tblaudit_logs (audit_logs_user_id, audit_logs_action, audit_logs_entity_type, audit_logs_entity_id, audit_logs_old_value, audit_logs_new_value, audit_logs_description)
        VALUES (NEW.users_id, 'UPDATE', TG_TABLE_NAME, NEW.users_id, row_to_json(OLD), row_to_json(NEW), 'Record updated');
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO tblaudit_logs (audit_logs_user_id, audit_logs_action, audit_logs_entity_type, audit_logs_entity_id, audit_logs_old_value, audit_logs_description)
        VALUES (OLD.users_id, 'DELETE', TG_TABLE_NAME, OLD.users_id, row_to_json(OLD), 'Record deleted');
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL DATA (SEED DATA)
-- ============================================

-- Insert default admin user (password: admin123 - CHANGE THIS!)
-- Password hash for 'admin123' using bcrypt (cost 10)
INSERT INTO tblusers (users_email, users_password_hash, users_full_name, users_role, users_status) VALUES
('admin@nilm.local', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'System Administrator', 'admin', 'active');

-- Insert default electricity rate
INSERT INTO tblelectricity_rates (electricity_rates_name, electricity_rates_peso_per_kwh, electricity_rates_effective_from, electricity_rates_is_active) VALUES
('Residential Rate 2024', 12.50, CURRENT_DATE, TRUE);

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
LEFT JOIN LATERAL (
    SELECT * FROM tblreal_time_readings 
    WHERE real_time_readings_device_id = d.devices_id 
    ORDER BY real_time_readings_recorded_at DESC 
    LIMIT 1
) r ON TRUE;

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
LEFT JOIN LATERAL (
    SELECT * FROM tblreal_time_readings 
    WHERE real_time_readings_appliance_id = a.appliances_id 
    ORDER BY real_time_readings_recorded_at DESC 
    LIMIT 1
) r ON TRUE;

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
-- 4. For production, consider using UUID instead of SERIAL for primary keys
-- 5. Consider partitioning tblreal_time_readings table by date for large datasets
-- 6. Consider adding materialized views for frequently accessed summary data
-- 7. Set up regular VACUUM and ANALYZE for optimal performance
