-- Adds per-device appliance instances.
-- The existing schema has appliance *types* only; the app needs per-device appliances.

CREATE TABLE IF NOT EXISTS tblappliances (
  appliance_id INT PRIMARY KEY AUTO_INCREMENT,
  appliance_user_id INT NOT NULL,
  appliance_device_id INT NOT NULL,
  appliance_type_id INT NOT NULL,
  appliance_custom_name VARCHAR(100),
  appliance_icon VARCHAR(16),
  appliance_port_number INT,
  appliance_is_active TINYINT(1) DEFAULT 0,
  appliance_usage_minutes DECIMAL(10,2) DEFAULT 0,
  appliance_last_detected DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appliance_user_id) REFERENCES tblusers(user_id),
  FOREIGN KEY (appliance_device_id) REFERENCES tbldevices(device_id),
  FOREIGN KEY (appliance_type_id) REFERENCES tblappliance_types(appliance_type_id)
);

CREATE INDEX idx_tblappliances_device_id ON tblappliances (appliance_device_id);
CREATE INDEX idx_tblappliances_user_id ON tblappliances (appliance_user_id);

