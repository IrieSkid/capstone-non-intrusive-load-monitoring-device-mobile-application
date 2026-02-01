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
    last_login_at DATETIME
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
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

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
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
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
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

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
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id) ON DELETE SET NULL
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
    FOREIGN KEY (appliance_id) REFERENCES appliances(appliance_id) ON DELETE CASCADE
);

-- Electricity Rates Table
CREATE TABLE electricity_rates (
    rate_id INT PRIMARY KEY AUTO_INCREMENT,
    rate_name VARCHAR(255) NOT NULL,
    peso_per_kwh DECIMAL(10, 4) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
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
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

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
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- System Settings Table
CREATE TABLE system_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    category ENUM('general', 'billing', 'alerts', 'device') DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

