-- ============================================
-- NILM System Database Schema (PostgreSQL)
-- Non-Intrusive Load Monitoring System
-- ============================================
-- Database: PostgreSQL 12+
-- Version: 1.0
-- Created for: BSIT Capstone Project
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
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('admin', 'homeowner', 'tenant')) DEFAULT 'homeowner',
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);

-- User Sessions Table
CREATE TABLE user_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(500) NOT NULL,
    device_info VARCHAR(255),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token);
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);

-- ============================================
-- DEVICE AND APPLIANCE TABLES
-- ============================================

-- Devices Table
CREATE TABLE devices (
    device_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    device_serial_number VARCHAR(100) UNIQUE NOT NULL,
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    location VARCHAR(255),
    wifi_ssid VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('online', 'offline', 'error')) DEFAULT 'offline',
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_serial_number ON devices(device_serial_number);

-- Appliances Table
CREATE TABLE appliances (
    appliance_id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL,
    appliance_name VARCHAR(255) NOT NULL,
    appliance_type VARCHAR(20) CHECK (appliance_type IN ('light', 'fan', 'refrigerator', 'ac', 'tv', 'other')) NOT NULL,
    port_number INTEGER NOT NULL,
    rated_watts DECIMAL(10, 2),
    status VARCHAR(20) CHECK (status IN ('on', 'off', 'unknown')) DEFAULT 'unknown',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

CREATE INDEX idx_appliances_device_id ON appliances(device_id);
CREATE INDEX idx_appliances_status ON appliances(status);
CREATE INDEX idx_appliances_type ON appliances(appliance_type);

-- ============================================
-- REAL-TIME READINGS TABLE
-- ============================================

-- Real-Time Readings Table
CREATE TABLE real_time_readings (
    reading_id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL,
    appliance_id INTEGER,
    voltage_rms DECIMAL(10, 2) NOT NULL,
    current_rms DECIMAL(10, 2) NOT NULL,
    power_watts DECIMAL(10, 2) NOT NULL,
    apparent_power_va DECIMAL(10, 2) NOT NULL,
    power_factor DECIMAL(5, 4) NOT NULL,
    energy_kwh DECIMAL(10, 6) NOT NULL,
    recorded_at TIMESTAMP NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id) ON DELETE SET NULL
);

CREATE INDEX idx_readings_recorded_at ON real_time_readings(recorded_at);
CREATE INDEX idx_readings_device_appliance ON real_time_readings(device_id, appliance_id);
CREATE INDEX idx_readings_device_time ON real_time_readings(device_id, recorded_at);
CREATE INDEX idx_readings_appliance_time ON real_time_readings(appliance_id, recorded_at);

-- ============================================
-- CONSUMPTION AND BILLING TABLES
-- ============================================

-- Electricity Rates Table
CREATE TABLE electricity_rates (
    rate_id SERIAL PRIMARY KEY,
    rate_name VARCHAR(255) NOT NULL,
    peso_per_kwh DECIMAL(10, 4) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rates_active ON electricity_rates(is_active, effective_from);

-- Consumption Summaries Table
CREATE TABLE consumption_summaries (
    summary_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    device_id INTEGER,
    appliance_id INTEGER,
    period_type VARCHAR(20) CHECK (period_type IN ('daily', 'weekly', 'monthly')) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_kwh DECIMAL(10, 4) NOT NULL,
    total_cost_php DECIMAL(10, 2) NOT NULL,
    reading_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id) ON DELETE CASCADE,
    UNIQUE (appliance_id, period_type, period_start)
);

CREATE INDEX idx_summaries_user_period ON consumption_summaries(user_id, period_type, period_start);
CREATE INDEX idx_summaries_device_period ON consumption_summaries(device_id, period_type, period_start);
CREATE INDEX idx_summaries_appliance_period ON consumption_summaries(appliance_id, period_type, period_start);

-- ============================================
-- NOTIFICATION AND ALERT TABLES
-- ============================================

-- Notifications Table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('alert', 'info', 'warning', 'error')) DEFAULT 'info',
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Alert Rules Table
CREATE TABLE alert_rules (
    rule_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    appliance_id INTEGER,
    device_id INTEGER,
    alert_type VARCHAR(20) CHECK (alert_type IN ('power_threshold', 'consumption_limit', 'device_offline')) NOT NULL,
    threshold_value DECIMAL(10, 2) NOT NULL,
    condition VARCHAR(10) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

CREATE INDEX idx_alert_rules_user_active ON alert_rules(user_id, is_active);
CREATE INDEX idx_alert_rules_appliance_active ON alert_rules(appliance_id, is_active);

-- ============================================
-- SYSTEM CONFIGURATION TABLE
-- ============================================

-- Audit Logs Table
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- System Settings Table
CREATE TABLE system_settings (
    setting_id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    category VARCHAR(20) CHECK (category IN ('general', 'billing', 'alerts', 'device')) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_category ON system_settings(category);
CREATE INDEX idx_settings_key ON system_settings(setting_key);

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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appliances_updated_at BEFORE UPDATE ON appliances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_rules_updated_at BEFORE UPDATE ON alert_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for audit logging (example - can be customized)
CREATE OR REPLACE FUNCTION log_user_action()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value, description)
        VALUES (NEW.user_id, 'CREATE', TG_TABLE_NAME, NEW.id, row_to_json(NEW), 'Record created');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_value, new_value, description)
        VALUES (NEW.user_id, 'UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW), 'Record updated');
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_value, description)
        VALUES (OLD.user_id, 'DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD), 'Record deleted');
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL DATA (SEED DATA)
-- ============================================

-- Insert default admin user (password: admin123 - CHANGE THIS!)
-- Password hash for 'admin123' using bcrypt (cost 10)
INSERT INTO users (email, password_hash, full_name, role, status) VALUES
('admin@nilm.local', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'System Administrator', 'admin', 'active');

-- Insert default electricity rate
INSERT INTO electricity_rates (rate_name, peso_per_kwh, effective_from, is_active) VALUES
('Residential Rate 2024', 12.50, CURRENT_DATE, TRUE);

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
LEFT JOIN LATERAL (
    SELECT * FROM real_time_readings 
    WHERE device_id = d.device_id 
    ORDER BY recorded_at DESC 
    LIMIT 1
) r ON TRUE;

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
LEFT JOIN LATERAL (
    SELECT * FROM real_time_readings 
    WHERE appliance_id = a.appliance_id 
    ORDER BY recorded_at DESC 
    LIMIT 1
) r ON TRUE;

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
-- 2. For production, consider using UUID instead of SERIAL for primary keys
-- 3. Consider partitioning real_time_readings table by date for large datasets
-- 4. Consider adding materialized views for frequently accessed summary data
-- 5. Set up regular VACUUM and ANALYZE for optimal performance

