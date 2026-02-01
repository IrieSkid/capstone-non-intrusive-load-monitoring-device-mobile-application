-- ============================================
-- NILM System ERD - Simplified for Draw.io
-- (ENUM and JSON replaced with VARCHAR/TEXT for compatibility)
-- ============================================

-- Users Table
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20),
    status VARCHAR(20),
    created_at DATETIME,
    updated_at DATETIME,
    last_login_at DATETIME
);

-- User Sessions Table
CREATE TABLE user_sessions (
    session_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    device_info VARCHAR(255),
    ip_address VARCHAR(45),
    created_at DATETIME,
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Devices Table
CREATE TABLE devices (
    device_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    device_serial_number VARCHAR(100) UNIQUE NOT NULL,
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    location VARCHAR(255),
    wifi_ssid VARCHAR(255),
    status VARCHAR(20),
    last_sync_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Appliances Table
CREATE TABLE appliances (
    appliance_id INT PRIMARY KEY,
    device_id INT NOT NULL,
    appliance_name VARCHAR(255) NOT NULL,
    appliance_type VARCHAR(20) NOT NULL,
    port_number INT NOT NULL,
    rated_watts DECIMAL(10, 2),
    status VARCHAR(20),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
);

-- Real-Time Readings Table
CREATE TABLE real_time_readings (
    reading_id INT PRIMARY KEY,
    device_id INT NOT NULL,
    appliance_id INT,
    voltage_rms DECIMAL(10, 2) NOT NULL,
    current_rms DECIMAL(10, 2) NOT NULL,
    power_watts DECIMAL(10, 2) NOT NULL,
    apparent_power_va DECIMAL(10, 2) NOT NULL,
    power_factor DECIMAL(5, 4) NOT NULL,
    energy_kwh DECIMAL(10, 6) NOT NULL,
    recorded_at DATETIME NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices(device_id),
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id)
);

-- Consumption Summaries Table
CREATE TABLE consumption_summaries (
    summary_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    device_id INT,
    appliance_id INT,
    period_type VARCHAR(20) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_kwh DECIMAL(10, 4) NOT NULL,
    total_cost_php DECIMAL(10, 2) NOT NULL,
    reading_count INT,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (device_id) REFERENCES devices(device_id),
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id)
);

-- Electricity Rates Table
CREATE TABLE electricity_rates (
    rate_id INT PRIMARY KEY,
    rate_name VARCHAR(255) NOT NULL,
    peso_per_kwh DECIMAL(10, 4) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN,
    created_at DATETIME
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20),
    priority VARCHAR(20),
    is_read BOOLEAN,
    read_at DATETIME,
    expires_at DATETIME,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Alert Rules Table
CREATE TABLE alert_rules (
    rule_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    appliance_id INT,
    device_id INT,
    alert_type VARCHAR(30) NOT NULL,
    threshold_value DECIMAL(10, 2) NOT NULL,
    condition VARCHAR(10) NOT NULL,
    severity VARCHAR(20),
    is_active BOOLEAN,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id),
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    log_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    description TEXT,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- System Settings Table
CREATE TABLE system_settings (
    setting_id INT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    category VARCHAR(20),
    is_public BOOLEAN,
    updated_at DATETIME
);

