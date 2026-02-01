# NILM System - IoT Communication Guide for Hardware Team

## Quick Reference for Engineering Team

This document provides the hardware team with all necessary information for integrating the NILM device with the software system.

---

## Recommended Setup

### Microcontroller Choice
**Recommended: ESP32** ⭐
- Built-in WiFi
- Dual-core processor
- Cost: ~$5-10
- Easy to program with Arduino IDE

**Alternative: ESP8266**
- Cheaper option (~$3-5)
- Still has WiFi
- Single core (less processing power)

---

## Communication Protocol

### ✅ Recommended: HTTP REST API

**Why:**
- Simple to implement
- Works directly with Firebase
- Easy to test and debug
- No additional services needed

**Endpoint:**
```
POST https://us-central1-[PROJECT-ID].cloudfunctions.net/submitReading
```

**Headers:**
```
Content-Type: application/json
X-Device-API-Key: [DEVICE_API_KEY]
```

**Request Body (JSON):**
```json
{
  "deviceId": "device123",
  "applianceId": "appliance456",  // Optional
  "voltageRms": 220.5,
  "currentRms": 0.68,
  "powerWatts": 150.0,
  "apparentPowerVa": 150.0,
  "powerFactor": 1.0,
  "energyKwh": 0.00015
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reading saved successfully"
}
```

---

## Arduino/ESP32 Code Template

### Complete Example for ESP32

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const char* WIFI_SSID = "YourWiFiNetwork";
const char* WIFI_PASSWORD = "YourWiFiPassword";
const char* FIREBASE_FUNCTION_URL = "https://us-central1-your-project.cloudfunctions.net/submitReading";
const char* DEVICE_ID = "device123";  // Get from software team
const char* DEVICE_API_KEY = "your-api-key-here";  // Get from software team

// Sensor pins (adjust based on your hardware)
const int VOLTAGE_PIN = A0;
const int CURRENT_PIN = A1;

// Reading interval (milliseconds)
const unsigned long READING_INTERVAL = 5000;  // 5 seconds

unsigned long lastReadingTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("NILM Device Starting...");
  
  // Connect to WiFi
  connectWiFi();
  
  Serial.println("Device ready!");
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectWiFi();
  }
  
  // Send reading at intervals
  unsigned long currentTime = millis();
  if (currentTime - lastReadingTime >= READING_INTERVAL) {
    sendReading();
    lastReadingTime = currentTime;
  }
  
  delay(100);  // Small delay to prevent watchdog issues
}

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print("WiFi connected! IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("WiFi connection failed!");
  }
}

void sendReading() {
  // Read sensors (implement your sensor reading logic)
  float voltage = readVoltage();
  float current = readCurrent();
  float power = voltage * current;
  float apparentPower = power;  // Adjust if you calculate VA separately
  float powerFactor = 1.0;  // Calculate if you have phase measurement
  float energyKwh = power * (READING_INTERVAL / 1000.0) / 3600000.0;  // Convert to kWh
  
  // Create JSON payload
  StaticJsonDocument<300> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["voltageRms"] = voltage;
  doc["currentRms"] = current;
  doc["powerWatts"] = power;
  doc["apparentPowerVa"] = apparentPower;
  doc["powerFactor"] = powerFactor;
  doc["energyKwh"] = energyKwh;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send HTTP POST request
  HTTPClient http;
  http.begin(FIREBASE_FUNCTION_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-API-Key", DEVICE_API_KEY);
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.print("Response: ");
    Serial.println(response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    Serial.println("Failed to send reading");
  }
  
  http.end();
}

// ============================================
// SENSOR READING FUNCTIONS
// Implement these based on your sensor hardware
// ============================================

float readVoltage() {
  // Example: Read from voltage sensor
  // Adjust based on your sensor type and calibration
  int sensorValue = analogRead(VOLTAGE_PIN);
  float voltage = (sensorValue / 4095.0) * 3.3 * 66.67;  // Adjust multiplier for your sensor
  return voltage;
}

float readCurrent() {
  // Example: Read from current sensor (ACS712 or INA219)
  // Adjust based on your sensor type and calibration
  int sensorValue = analogRead(CURRENT_PIN);
  float current = ((sensorValue / 4095.0) * 3.3 - 1.65) / 0.066;  // Adjust for ACS712
  if (current < 0) current = 0;  // Handle negative values
  return current;
}
```

---

## Required Arduino Libraries

Install these libraries in Arduino IDE:

1. **WiFi** (built-in for ESP32)
2. **HTTPClient** (built-in for ESP32)
3. **ArduinoJson** by Benoit Blanchon
   - Install via: Tools → Manage Libraries → Search "ArduinoJson"

---

## Data Format Requirements

### Required Fields:
- `deviceId` (string) - Unique device identifier
- `voltageRms` (float) - Voltage in Volts
- `currentRms` (float) - Current in Amperes
- `powerWatts` (float) - Power in Watts
- `apparentPowerVa` (float) - Apparent power in VA
- `powerFactor` (float) - Power factor (0.0 to 1.0)
- `energyKwh` (float) - Energy in kilowatt-hours

### Optional Fields:
- `applianceId` (string) - If monitoring specific appliance

### Data Ranges (Expected):
- Voltage: 0-250 V (typical: 220-240 V)
- Current: 0-50 A (adjust based on sensor)
- Power: 0-11000 W (voltage × current)
- Power Factor: 0.0-1.0
- Energy: Cumulative, very small increments per reading

---

## Testing Procedure

### Step 1: Test WiFi Connection
```cpp
void testWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi: OK");
  } else {
    Serial.println("WiFi: FAILED");
  }
}
```

### Step 2: Test HTTP Connection
- Use Serial Monitor to check HTTP response codes
- Code 200 = Success
- Code 401 = Authentication failed (check API key)
- Code 400 = Bad request (check JSON format)

### Step 3: Verify Data in Firebase
- Software team will verify data appears in Firestore
- Check Firebase Console: Firestore → readings collection

### Step 4: Test Real-Time Updates
- Mobile app should receive updates automatically
- Verify data appears in mobile app dashboard

---

## Error Handling

### Network Errors
```cpp
if (WiFi.status() != WL_CONNECTED) {
  // Retry connection
  connectWiFi();
}
```

### HTTP Errors
```cpp
if (httpResponseCode != 200) {
  // Log error, retry later
  Serial.println("Failed to send. Will retry...");
}
```

### Sensor Errors
- Validate sensor readings before sending
- Check for reasonable ranges
- Handle sensor disconnection gracefully

---

## Power Considerations

### For Battery-Powered Devices:
- Reduce reading frequency (e.g., every 30 seconds)
- Use deep sleep between readings
- Consider MQTT instead of HTTP (lighter protocol)

### For AC-Powered Devices:
- Can send readings more frequently (every 5 seconds)
- HTTP REST API is fine

---

## Security

### Device Authentication
- Each device has unique API key
- API key must be included in HTTP header
- Never expose API key in code (use secure storage)

### Data Validation
- Software team validates all readings
- Invalid data is rejected
- Device receives error response

---

## Communication Frequency

### Recommended:
- **Every 5 seconds**: For real-time monitoring
- **Every 10 seconds**: For lower bandwidth usage
- **Every 30 seconds**: For battery-powered devices

### Adjust based on:
- Network stability
- Power consumption requirements
- Data accuracy needs

---

## Troubleshooting

### Problem: WiFi won't connect
**Solutions:**
- Check SSID and password
- Verify router is working
- Check signal strength
- Try different WiFi network

### Problem: HTTP request fails
**Solutions:**
- Check internet connection
- Verify Firebase Function URL is correct
- Check device API key
- Verify JSON format is valid
- Check Serial Monitor for error codes

### Problem: Data not appearing in app
**Solutions:**
- Verify HTTP response is 200
- Check deviceId matches registered device
- Verify Firebase Function is deployed
- Check Firestore security rules

### Problem: Sensor readings are wrong
**Solutions:**
- Calibrate sensors
- Check sensor connections
- Verify sensor voltage/current ranges
- Adjust calculation formulas

---

## Support & Contact

### For Hardware Issues:
- Check Arduino/ESP32 documentation
- Review sensor datasheets
- Test with Serial Monitor

### For Integration Issues:
- Contact software team
- Verify endpoint URL and API key
- Check Firebase Console for errors

---

## Next Steps

1. **Get credentials from software team:**
   - Device ID
   - Device API Key
   - Firebase Function URL

2. **Set up development environment:**
   - Install Arduino IDE
   - Install ESP32 board support
   - Install required libraries

3. **Test basic connectivity:**
   - Connect to WiFi
   - Send test HTTP request
   - Verify response

4. **Integrate sensors:**
   - Connect voltage sensor
   - Connect current sensor
   - Calibrate readings

5. **Test full system:**
   - Send real sensor data
   - Verify in Firebase
   - Check mobile app updates

---

## Quick Checklist

- [ ] ESP32/ESP8266 microcontroller
- [ ] Voltage sensor connected
- [ ] Current sensor connected
- [ ] WiFi credentials configured
- [ ] Device ID and API key obtained
- [ ] Firebase Function URL obtained
- [ ] Arduino libraries installed
- [ ] Code uploaded to device
- [ ] WiFi connection working
- [ ] HTTP requests successful
- [ ] Data appears in Firebase
- [ ] Mobile app receives updates

---

**Last Updated:** 2026  
**For:** NILM Capstone Project - Hardware Team

