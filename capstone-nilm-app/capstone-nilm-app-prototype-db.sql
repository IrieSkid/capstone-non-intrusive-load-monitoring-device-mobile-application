-- ============================================
-- NILM CAPSTONE DATABASE (Frequency-Aware)
-- ============================================

DROP DATABASE IF EXISTS nilm_capstone;
CREATE DATABASE nilm_capstone;
USE nilm_capstone;

-- =============================
-- 1. ROLES
-- =============================
CREATE TABLE tblroles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO tblroles (role_name) VALUES
('admin'),
('landlord'),
('tenant');

-- =============================
-- 2. USER STATUS
-- =============================
CREATE TABLE tbluser_status (
    status_id INT PRIMARY KEY AUTO_INCREMENT,
    status_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO tbluser_status (status_name) VALUES
('active'),
('inactive'),
('suspended');

-- =============================
-- 3. USERS
-- =============================
CREATE TABLE tblusers (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_role_id INT NOT NULL,
    user_status_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_role_id) REFERENCES tblroles(role_id),
    FOREIGN KEY (user_status_id) REFERENCES tbluser_status(status_id)
);

INSERT INTO tblusers (user_role_id, user_status_id, user_name, user_email, user_password, user_phone) VALUES
(1,1,'System Admin','admin@nilm.com','hashedpass','09170000001'),
(2,1,'Mr. Santos','landlord@nilm.com','hashedpass','09170000002'),
(3,1,'Juan Dela Cruz','juan@email.com','hashedpass','09170000003'),
(3,1,'Maria Lopez','maria@email.com','hashedpass','09170000004'),
(3,1,'Kevin Ramos','kevin@email.com','hashedpass','09170000005');


-- =============================
-- 4. APPLIANCE TYPES/CATEGORY (Updated)
-- =============================

CREATE TABLE tblappliance_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO tblappliance_categories (category_name) VALUES
('Cooling'),
('Kitchen'),
('Entertainment'),
('Lighting'),
('Computing');


CREATE TABLE tblappliance_types (
    appliance_type_id INT PRIMARY KEY AUTO_INCREMENT,
    appliance_type_category_id INT NOT NULL,

    appliance_type_name VARCHAR(100),

    appliance_type_typical_power_w DECIMAL(10,2),
    appliance_type_power_factor DECIMAL(5,2),

    appliance_type_nominal_frequency_hz DECIMAL(5,2) DEFAULT 60.00,
    appliance_type_frequency_tolerance DECIMAL(5,2) DEFAULT 0.50,

    appliance_type_thd_reference DECIMAL(5,2),
    appliance_type_harmonic_signature TEXT,

    appliance_type_power_pattern ENUM('constant','cyclic','variable') DEFAULT 'constant',

    FOREIGN KEY (appliance_type_category_id) REFERENCES tblappliance_categories(category_id)
);

INSERT INTO tblappliance_types
(appliance_type_category_id, appliance_type_name, appliance_type_typical_power_w, appliance_type_power_factor, appliance_type_thd_reference, appliance_type_harmonic_signature, appliance_type_power_pattern)
VALUES
(1,'Air Conditioner',1200,0.85,12.5,'{"3rd":0.12,"5th":0.08}','cyclic'),
(1,'Electric Fan',75,0.90,5.0,'{"3rd":0.03}','constant'),
(2,'Refrigerator',150,0.80,10.0,'{"3rd":0.09,"5th":0.05}','cyclic'),
(2,'Rice Cooker',700,0.99,3.0,'{"3rd":0.02}','variable'),
(3,'LED TV',120,0.70,18.0,'{"3rd":0.15,"5th":0.10}','constant');

-- =============================
-- 5. DEVICES
-- =============================
CREATE TABLE tbldevices (
    device_id INT PRIMARY KEY AUTO_INCREMENT,
    device_name VARCHAR(100),
    device_identifier VARCHAR(100) UNIQUE,
    device_status ENUM('online','offline') DEFAULT 'online',
    device_last_seen DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tbldevices (device_name, device_identifier, device_last_seen) VALUES
('ESP32 Room 101','DEV-101',NOW()),
('ESP32 Room 102','DEV-102',NOW()),
('ESP32 Room 103','DEV-103',NOW());

-- =============================
-- 6. ROOMS
-- =============================
CREATE TABLE tblrooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    room_name VARCHAR(100),
    room_tenant_id INT,
    room_device_id INT,
    room_rate_per_kwh DECIMAL(10,2) DEFAULT 12.00,
    room_status ENUM('available','occupied') DEFAULT 'occupied',
    FOREIGN KEY (room_tenant_id) REFERENCES tblusers(user_id),
    FOREIGN KEY (room_device_id) REFERENCES tbldevices(device_id)
);

INSERT INTO tblrooms (room_name, room_tenant_id, room_device_id) VALUES
('Room 101',3,1),
('Room 102',4,2),
('Room 103',5,3);

-- =============================
-- 7. READING HEADERS
-- =============================
CREATE TABLE tblreading_headers (
    reading_header_id INT PRIMARY KEY AUTO_INCREMENT,
    reading_header_room_id INT,
    reading_header_device_id INT,
    reading_header_time DATETIME,
    FOREIGN KEY (reading_header_room_id) REFERENCES tblrooms(room_id),
    FOREIGN KEY (reading_header_device_id) REFERENCES tbldevices(device_id)
);

INSERT INTO tblreading_headers (reading_header_room_id, reading_header_device_id, reading_header_time) VALUES
(1,1,NOW()),
(2,2,NOW()),
(3,3,NOW());

-- =============================
-- 8. READING DETAILS (Frequency + THD)
-- =============================
CREATE TABLE tblreading_details (
    reading_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    reading_detail_header_id INT,
    reading_detail_voltage DECIMAL(10,2),
    reading_detail_current DECIMAL(10,3),
    reading_detail_power_w DECIMAL(10,2),
    reading_detail_frequency DECIMAL(10,2),
    reading_detail_power_factor DECIMAL(5,2),
    reading_detail_thd_percentage DECIMAL(5,2),
    reading_detail_energy_kwh DECIMAL(10,4),
    FOREIGN KEY (reading_detail_header_id) REFERENCES tblreading_headers(reading_header_id)
);

INSERT INTO tblreading_details 
(reading_detail_header_id, reading_detail_voltage, reading_detail_current, reading_detail_power_w, reading_detail_frequency, reading_detail_power_factor, reading_detail_thd_percentage, reading_detail_energy_kwh)
VALUES
(1,220,5.2,1180,60.02,0.84,13.0,1.25),
(2,220,3.5,710,60.01,0.98,3.1,0.85),
(3,220,2.1,120,59.98,0.72,17.5,0.52);

-- =============================
-- 9. DETECTION HEADERS
-- =============================
CREATE TABLE tblappliance_detection_headers (
    detection_header_id INT PRIMARY KEY AUTO_INCREMENT,
    detection_header_room_id INT,
    detection_header_reading_header_id INT,
    detection_header_time DATETIME,
    FOREIGN KEY (detection_header_room_id) REFERENCES tblrooms(room_id),
    FOREIGN KEY (detection_header_reading_header_id) REFERENCES tblreading_headers(reading_header_id)
);

INSERT INTO tblappliance_detection_headers (detection_header_room_id, detection_header_reading_header_id, detection_header_time)
VALUES
(1,1,NOW()),
(2,2,NOW()),
(3,3,NOW());

-- =============================
-- 10. DETECTION DETAILS
-- =============================
CREATE TABLE tblappliance_detection_details (
    detection_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    detection_detail_header_id INT,
    detection_detail_appliance_type_id INT,
    detection_detail_status ENUM('ON','OFF'),
    detection_detail_confidence DECIMAL(5,2),
    detection_detail_detected_power DECIMAL(10,2),
    detection_detail_detected_frequency DECIMAL(10,2),
    detection_detail_detected_thd DECIMAL(5,2),
    FOREIGN KEY (detection_detail_header_id) REFERENCES tblappliance_detection_headers(detection_header_id),
    FOREIGN KEY (detection_detail_appliance_type_id) REFERENCES tblappliance_types(appliance_type_id)
);

INSERT INTO tblappliance_detection_details
(detection_detail_header_id, detection_detail_appliance_type_id, detection_detail_status, detection_detail_confidence, detection_detail_detected_power, detection_detail_detected_frequency, detection_detail_detected_thd)
VALUES
(1,1,'ON',0.93,1180,60.02,13.0),
(2,4,'ON',0.89,710,60.01,3.1),
(3,5,'ON',0.91,120,59.98,17.5);

-- =============================
-- 11. BILLING HEADERS
-- =============================
CREATE TABLE tblbilling_headers (
    billing_header_id INT PRIMARY KEY AUTO_INCREMENT,
    billing_header_room_id INT,
    billing_header_tenant_id INT,
    billing_header_month VARCHAR(7),
    billing_header_total_kwh DECIMAL(10,2),
    billing_header_total_amount DECIMAL(10,2),
    billing_header_status ENUM('pending','paid') DEFAULT 'pending',
    FOREIGN KEY (billing_header_room_id) REFERENCES tblrooms(room_id),
    FOREIGN KEY (billing_header_tenant_id) REFERENCES tblusers(user_id)
);

INSERT INTO tblbilling_headers (billing_header_room_id, billing_header_tenant_id, billing_header_month, billing_header_total_kwh, billing_header_total_amount)
VALUES
(1,3,'2026-02',120,1440),
(2,4,'2026-02',85,1020),
(3,5,'2026-02',60,720);

-- =============================
-- 12. BILLING DETAILS
-- =============================
CREATE TABLE tblbilling_details (
    billing_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    billing_detail_header_id INT,
    billing_detail_rate_per_kwh DECIMAL(10,2),
    billing_detail_energy_charge DECIMAL(10,2),
    FOREIGN KEY (billing_detail_header_id) REFERENCES tblbilling_headers(billing_header_id)
);

INSERT INTO tblbilling_details VALUES
(1,1,12,1440),
(2,2,12,1020),
(3,3,12,720);

-- =============================
-- 13. APPLIANCE USAGE SUMMARY
-- =============================
CREATE TABLE tblappliance_usage_summary (
    summary_id INT PRIMARY KEY AUTO_INCREMENT,
    summary_billing_header_id INT,
    summary_appliance_type_id INT,
    summary_runtime_hours DECIMAL(10,2),
    summary_energy_kwh DECIMAL(10,2),
    summary_cost DECIMAL(10,2),
    FOREIGN KEY (summary_billing_header_id) REFERENCES tblbilling_headers(billing_header_id),
    FOREIGN KEY (summary_appliance_type_id) REFERENCES tblappliance_types(appliance_type_id)
);

INSERT INTO tblappliance_usage_summary
(summary_billing_header_id, summary_appliance_type_id, summary_runtime_hours, summary_energy_kwh, summary_cost)
VALUES
(1,1,80,96,1152),
(2,4,30,21,252),
(3,5,50,6,72);

-- =============================
-- 14. ALERTS
-- =============================
CREATE TABLE tblalerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_room_id INT,
    alert_type VARCHAR(50),
    alert_message TEXT,
    alert_status ENUM('new','resolved') DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_room_id) REFERENCES tblrooms(room_id)
);

INSERT INTO tblalerts (alert_room_id, alert_type, alert_message)
VALUES
(1,'HIGH_THD','High harmonic distortion detected'),
(2,'HIGH_POWER','Power exceeded expected range');

-- =============================
-- 15. RELAY CONTROL LOGS
-- =============================
CREATE TABLE tblrelay_control_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    relay_control_log_room_id INT,
    relay_control_log_command ENUM('ON','OFF'),
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (relay_control_log_room_id) REFERENCES tblrooms(room_id)
);

INSERT INTO tblrelay_control_logs (relay_control_log_room_id, relay_control_log_command)
VALUES
(1,'OFF'),
(2,'ON');

-- =============================
-- 16. SYSTEM SETTINGS
-- =============================
CREATE TABLE tblsystem_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_description VARCHAR(255),
    setting_category ENUM('billing','detection','alerts','general') DEFAULT 'general',
    setting_updated_by INT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (setting_updated_by) REFERENCES tblusers(user_id)
);

INSERT INTO tblsystem_settings (setting_key, setting_value, setting_description, setting_category, setting_updated_by) VALUES
('default_rate_per_kwh', '12.00', 'Default electricity rate per kWh', 'billing', 1),
('billing_cycle_day', '1', 'Day of month when billing cycle starts', 'billing', 1),
('currency', 'PHP', 'System currency', 'billing', 1),
('high_power_threshold', '2000', 'Alert threshold for high power consumption (watts)', 'alerts', 1),
('high_thd_threshold', '20.0', 'Alert threshold for high THD percentage', 'alerts', 1),
('detection_confidence_min', '0.75', 'Minimum confidence score for appliance detection', 'detection', 1),
('frequency_nominal', '60.00', 'Nominal frequency in Hz', 'detection', 1),
('frequency_tolerance', '0.50', 'Acceptable frequency deviation in Hz', 'detection', 1),
('system_name', 'NILM Capstone System', 'System display name', 'general', 1),
('timezone', 'Asia/Manila', 'System timezone', 'general', 1),
('maintenance_mode', 'false', 'Enable/disable maintenance mode', 'general', 1),
('auto_billing_enabled', 'true', 'Enable automatic monthly billing generation', 'billing', 1),
('alert_email_enabled', 'true', 'Enable email notifications for alerts', 'alerts', 1);

-- =============================
-- 17. SYSTEM LOGS
-- =============================
CREATE TABLE tblsystem_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    system_log_user_id INT,
    system_log_action VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (system_log_user_id) REFERENCES tblusers(user_id)
);

INSERT INTO tblsystem_logs (system_log_user_id, system_log_action)
VALUES
(1,'Generated February Billing'),
(2,'Updated Appliance Signatures');
