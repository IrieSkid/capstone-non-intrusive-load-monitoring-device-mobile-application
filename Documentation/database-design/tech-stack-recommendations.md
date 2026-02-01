# NILM System - Technology Stack Recommendations

## ✅ Chosen Tech Stack

**Backend API:** Firebase Cloud Functions  
**Database:** Firebase Firestore  
**Backend Hosting:** Firebase Cloud Functions  
**Real-Time Communication:** Firestore Real-time Listeners  
**Authentication:** Firebase Authentication  
**File Storage:** Cloudinary  
**Chart Generation:** `react-native-chart-kit` or `victory-native`  
**PDF Generation:** `pdfkit` (Node.js)  
**Version Control:** Git + GitHub  
**API Testing:** Postman or Insomnia  
**Database Management:** Firebase Console  
**Mobile Testing:** Expo Go App  

---

## Mobile App Development

### Frontend Framework
- **React Native + Expo Go** ✅ (As requested)
  - **Why**: Fast development, cross-platform (iOS & Android), hot reload
  - **Expo SDK Version**: Latest stable (SDK 50+)
  - **Key Libraries**:
    - `@react-navigation/native` - Navigation
    - `react-native-chart-kit` or `victory-native` - Charts for consumption graphs
    - `react-native-paper` or `native-base` - UI components
    - `@react-native-async-storage/async-storage` - Local storage
    - `react-native-push-notification` - Push notifications

## Backend API

### Recommended Options

#### Option 1: Firebase Cloud Functions (Recommended with Firestore)
- **Why**: Serverless, no backend server needed, integrates with Firestore
- **Framework**: Firebase Functions (Node.js)
- **Key Libraries**:
  - `firebase-functions` - Cloud Functions SDK
  - `firebase-admin` - Admin SDK for server-side operations
  - `express` - For HTTP functions (optional)
  - **Benefits**: Automatic scaling, pay-per-use, easy deployment

#### Option 2: Node.js + Express (If using SQL Database)
- **Why**: JavaScript/TypeScript, easy to learn, fast development
- **Framework**: Express.js
- **Key Libraries**:
  - `express` - Web framework
  - `jsonwebtoken` - JWT authentication
  - `bcrypt` - Password hashing
  - `mysql2` or `pg` - Database driver
  - `socket.io` - Real-time updates (optional)
  - `express-validator` - Input validation
  - `dotenv` - Environment variables

#### Option 3: Python + FastAPI (Alternative)
- **Why**: Great for data processing, ML integration potential
- **Framework**: FastAPI
- **Key Libraries**:
  - `fastapi` - Web framework
  - `sqlalchemy` - ORM
  - `pydantic` - Data validation
  - `python-jose` - JWT authentication

## Database

### Option 1: Firebase Firestore (Recommended for NILM) ⭐

#### Why Firestore is Great for NILM:
- ✅ **Real-time Updates** - Built-in real-time listeners perfect for IoT data
- ✅ **Easy Integration** - Works seamlessly with React Native + Expo
- ✅ **Offline Support** - Built-in offline persistence
- ✅ **Scalability** - Automatically scales with your data
- ✅ **Free Tier** - Generous free tier (50K reads, 20K writes/day)
- ✅ **Security Rules** - Flexible security rules for access control
- ✅ **No Backend Required** - Can use Cloud Functions for server-side logic

#### Setup:
- **Firebase Console**: https://console.firebase.google.com
- **React Native**: `@react-native-firebase/firestore` or `expo-firestore`
- **Documentation**: See `schema-firestore.md` for complete schema

#### Key Libraries:
- `@react-native-firebase/app` - Firebase core
- `@react-native-firebase/firestore` - Firestore database
- `@react-native-firebase/auth` - Authentication (optional)
- `@react-native-firebase/functions` - Cloud Functions

### Option 2: PostgreSQL or MySQL (Traditional SQL)

#### PostgreSQL (Recommended for SQL)
- **Why**: Better for time-series data, JSON support, advanced features
- **Connection**: Use connection pooling (e.g., `pg-pool`)
- **ORM Option**: Prisma, TypeORM, or Sequelize

#### MySQL (Alternative)
- **Why**: Simpler, widely used, good for capstone projects
- **Connection**: Use `mysql2` with connection pooling
- **ORM Option**: Sequelize or Prisma

### Database Hosting Options

#### For Firestore:
- **Firebase (Google Cloud)** - Free tier available
- **No separate hosting needed** - Fully managed

#### For SQL Databases:
1. **Free Tier Options**:
   - **Supabase** (PostgreSQL) - Free tier, includes auth
   - **PlanetScale** (MySQL) - Free tier, serverless
   - **Railway** - Free tier for PostgreSQL
   - **Neon** - Free tier for PostgreSQL

2. **Self-Hosted** (For Development):
   - Local MySQL/PostgreSQL installation
   - Docker container

### Recommendation for NILM Project:
**Use Firebase Firestore** - It's perfect for IoT real-time monitoring and works seamlessly with React Native + Expo. See `schema-firestore.md` for complete implementation guide.

## Cloud Services & APIs

### Backend Hosting

#### Option 1: Firebase Cloud Functions (Recommended with Firestore)
- **Why**: Serverless, automatic scaling, integrates with Firestore
- **URL**: https://firebase.google.com
- **Features**: 
  - Free tier: 2 million invocations/month
  - Auto-deploy from GitHub
  - No server management
  - Pay-per-use pricing

#### Option 2: Railway (If using SQL + Express)
- **Why**: Free tier, easy deployment, supports Node.js/Python
- **URL**: https://railway.app
- **Features**: Auto-deploy from GitHub, PostgreSQL included

#### Option 3: Render
- **Why**: Free tier, simple deployment
- **URL**: https://render.com
- **Features**: Free PostgreSQL database

#### Option 4: Vercel (For Serverless)
- **Why**: Great for Next.js/API routes
- **URL**: https://vercel.com
- **Note**: Better for serverless functions

#### Option 5: Heroku (Alternative)
- **Why**: Well-known, but limited free tier
- **Note**: Consider paid options if needed

### Real-Time Communication

#### Option 1: Firestore Real-time Listeners (Recommended with Firestore)
- **Why**: Built-in, no additional setup needed
- **Use Case**: Live dashboard updates, real-time readings
- **Implementation**: `firestore().collection('readings').onSnapshot()`
- **Benefits**: Automatic, offline support, free with Firestore

#### Option 2: WebSockets (Socket.io) - If using SQL
- **Why**: Real-time bidirectional communication
- **Use Case**: Live dashboard updates
- **Implementation**: `socket.io` on backend, `socket.io-client` on mobile

#### Option 3: MQTT (For IoT)
- **Why**: Lightweight, designed for IoT
- **Broker Options**:
  - **HiveMQ Cloud** - Free tier
  - **Mosquitto** - Self-hosted
  - **AWS IoT Core** - If using AWS
- **Library**: `mqtt.js` (Node.js)

#### Option 4: Server-Sent Events (SSE)
- **Why**: Simpler than WebSockets, one-way server to client
- **Use Case**: Real-time data streaming

### Authentication & Security

#### Option 1: Firebase Authentication (Recommended with Firestore)
- **Why**: Built-in, secure, easy to use
- **Features**: 
  - Email/Password authentication
  - Google Sign-In (optional)
  - Phone authentication (optional)
  - Secure token management
- **Library**: `@react-native-firebase/auth` or Firebase Auth in Expo
- **Benefits**: No backend code needed, automatic security

#### Option 2: JWT (JSON Web Tokens) - If using SQL
- **Library**: `jsonwebtoken` (Node.js) or `python-jose` (Python)
- **Storage**: Secure storage in mobile app
- **Refresh Tokens**: Implement refresh token rotation

#### OAuth (Optional)
- **Google Sign-In**: For easier user onboarding
- **Library**: `@react-native-google-signin/google-signin` or Firebase Auth

### File Storage

#### Cloudinary (Chosen) ✅
- **Why**: Free tier, image optimization, PDF storage
- **Use Case**: 
  - User profile pictures
  - PDF report exports
  - Chart images
- **Free Tier**: 25 GB storage, 25 GB bandwidth/month
- **Setup**:
  1. Sign up at https://cloudinary.com
  2. Get API credentials from dashboard
  3. Install: `npm install cloudinary` (for Cloud Functions)
  4. Configure in Cloud Function environment variables

**Cloud Function Example:**
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload PDF
const uploadPDF = async (pdfBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'nilm-reports',
        public_id: fileName,
        format: 'pdf'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(pdfBuffer);
  });
};
```

#### AWS S3 (Alternative)
- **Why**: Scalable, but more complex setup

## IoT Communication Protocol

### Recommended: HTTP REST API
- **Why**: Simple, easy to implement, works with any microcontroller
- **Endpoint**: `POST /api/devices/{device_id}/readings`
- **Format**: JSON
- **Authentication**: API Key or JWT token

### Alternative: MQTT
- **Why**: Lightweight, designed for IoT
- **Use Case**: High-frequency data transmission
- **Broker**: HiveMQ Cloud (free tier) or self-hosted Mosquitto

---

## IoT Communication Protocol (For Arduino/Microcontroller)

### Recommended Options for NILM Hardware

#### Option 1: HTTP REST API (Recommended) ⭐

**Why it's best for NILM:**
- ✅ **Simple to implement** - Arduino has HTTP libraries
- ✅ **Works with Firestore** - Can use Cloud Functions as endpoint
- ✅ **Easy debugging** - Can test with Postman/Insomnia
- ✅ **Reliable** - Standard HTTP protocol
- ✅ **No additional infrastructure** - Uses existing Firebase setup

**Arduino Implementation:**
```cpp
#include <WiFi.h>  // For ESP32
// or
#include <ESP8266WiFi.h>  // For ESP8266
#include <HTTPClient.h>

const char* ssid = "YourWiFi";
const char* password = "YourPassword";
const char* serverURL = "https://your-region-your-project.cloudfunctions.net/submitReading";

void setup() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void sendReading(float voltage, float current, float power) {
  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-API-Key", "your-device-api-key");
  
  String jsonData = "{"
    "\"deviceId\":\"device123\","
    "\"applianceId\":\"appliance456\","
    "\"voltageRms\":" + String(voltage) + ","
    "\"currentRms\":" + String(current) + ","
    "\"powerWatts\":" + String(power) + ","
    "\"apparentPowerVa\":" + String(power) + ","
    "\"powerFactor\":1.0,"
    "\"energyKwh\":" + String(power * 0.001) +
  "}";
  
  int httpResponseCode = http.POST(jsonData);
  http.end();
}
```

**Cloud Function Endpoint:**
```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.submitReading = functions.https.onRequest(async (req, res) => {
  // Verify device API key
  const apiKey = req.headers['x-device-api-key'];
  if (!apiKey || !validateApiKey(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const reading = {
    deviceId: req.body.deviceId,
    applianceId: req.body.applianceId,
    voltageRms: req.body.voltageRms,
    currentRms: req.body.currentRms,
    powerWatts: req.body.powerWatts,
    apparentPowerVa: req.body.apparentPowerVa,
    powerFactor: req.body.powerFactor,
    energyKwh: req.body.energyKwh,
    recordedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  await admin.firestore().collection('readings').add(reading);
  res.json({ success: true });
});
```

**Pros:**
- Simple implementation
- Works with any microcontroller with WiFi
- Easy to test and debug
- No additional services needed

**Cons:**
- Higher power consumption (WiFi)
- Requires stable internet connection
- Slightly more overhead than MQTT

---

#### Option 2: MQTT (Alternative)

**Why consider MQTT:**
- ✅ **Lightweight** - Lower bandwidth usage
- ✅ **Designed for IoT** - Built for device-to-cloud communication
- ✅ **Low power** - More efficient than HTTP
- ✅ **QoS support** - Message delivery guarantees

**Arduino Implementation:**
```cpp
#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient espClient;
PubSubClient client(espClient);

const char* mqtt_server = "broker.hivemq.com";  // Free MQTT broker
const char* mqtt_topic = "nilm/device123/readings";

void setup() {
  WiFi.begin(ssid, password);
  client.setServer(mqtt_server, 1883);
}

void sendReading(float voltage, float current, float power) {
  if (!client.connected()) {
    reconnect();
  }
  
  String payload = "{"
    "\"voltageRms\":" + String(voltage) + ","
    "\"currentRms\":" + String(current) + ","
    "\"powerWatts\":" + String(power) +
  "}";
  
  client.publish(mqtt_topic, payload.c_str());
}
```

**Cloud Function (MQTT to Firestore):**
```javascript
// Requires MQTT broker (HiveMQ Cloud free tier)
// Cloud Function subscribes to MQTT and writes to Firestore
```

**Pros:**
- Lower bandwidth
- Better for battery-powered devices
- Built for IoT use cases

**Cons:**
- Requires MQTT broker (additional service)
- More complex setup
- Need to bridge MQTT to Firestore

---

#### Option 3: Firebase Realtime Database (Alternative)

**Why consider:**
- ✅ **Direct integration** - Works directly with Firebase
- ✅ **Real-time** - Automatic updates
- ✅ **Simple** - Firebase SDK available

**Arduino Implementation:**
- Use Firebase REST API
- Similar to HTTP REST but Firebase-specific

---

### Microcontroller Recommendations

#### For NILM Project:

**Option 1: ESP32 (Recommended) ⭐**
- **Why**: Built-in WiFi, Bluetooth, dual-core processor
- **Cost**: ~$5-10
- **Libraries**: `WiFi.h`, `HTTPClient.h`, `ArduinoJson`
- **Power**: Can be powered via USB or external power supply
- **Best for**: HTTP REST API approach

**Option 2: ESP8266 (Budget Option)**
- **Why**: Cheaper, still has WiFi
- **Cost**: ~$3-5
- **Libraries**: `ESP8266WiFi.h`, `ESP8266HTTPClient.h`
- **Limitations**: Single core, less processing power
- **Best for**: Simple HTTP REST API

**Option 3: Arduino Uno + ESP8266 Module**
- **Why**: If you already have Arduino Uno
- **Cost**: ~$5-8 (module only)
- **Setup**: More complex wiring
- **Best for**: Learning/educational purposes

**Option 4: Raspberry Pi Pico W**
- **Why**: More powerful, WiFi built-in
- **Cost**: ~$6
- **Libraries**: MicroPython or C/C++
- **Best for**: More complex processing needs

---

### Recommended Setup for NILM

**Hardware:**
- **Microcontroller**: ESP32 (recommended) or ESP8266
- **Sensors**: Voltage sensor, Current sensor (ACS712 or INA219)
- **Power Supply**: USB or 5V adapter
- **WiFi**: Router with internet connection

**Communication:**
- **Protocol**: HTTP REST API
- **Endpoint**: Firebase Cloud Function
- **Frequency**: Every 5-10 seconds (adjustable)
- **Data Format**: JSON

**Flow:**
```
Arduino (ESP32) 
  → Reads sensors (voltage, current)
  → Calculates power, energy
  → Sends HTTP POST to Cloud Function
  → Cloud Function validates & stores in Firestore
  → Mobile app receives real-time updates via Firestore listeners
```

---

### Sample Arduino Code Structure

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YourWiFi";
const char* password = "YourPassword";

// Firebase Cloud Function URL
const char* serverURL = "https://us-central1-your-project.cloudfunctions.net/submitReading";

// Device credentials
const char* deviceId = "device123";
const char* deviceApiKey = "your-api-key-here";

// Sensor pins
const int voltagePin = A0;
const int currentPin = A1;

void setup() {
  Serial.begin(115200);
  connectWiFi();
}

void loop() {
  // Read sensors
  float voltage = readVoltage();
  float current = readCurrent();
  float power = voltage * current;
  
  // Send to Firebase
  sendToFirebase(voltage, current, power);
  
  delay(5000); // Send every 5 seconds
}

void sendToFirebase(float voltage, float current, float power) {
  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-API-Key", deviceApiKey);
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["deviceId"] = deviceId;
  doc["voltageRms"] = voltage;
  doc["currentRms"] = current;
  doc["powerWatts"] = power;
  doc["apparentPowerVa"] = power;
  doc["powerFactor"] = 1.0;
  doc["energyKwh"] = power * 0.001; // Convert to kWh
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  int httpCode = http.POST(jsonString);
  
  if (httpCode > 0) {
    Serial.println("Data sent successfully");
  } else {
    Serial.println("Error sending data");
  }
  
  http.end();
}
```

---

### Testing IoT Communication

**Before Hardware Integration:**
1. Test Cloud Function with Postman/Insomnia
2. Verify Firestore writes correctly
3. Test mobile app receives updates

**With Hardware:**
1. Use Serial Monitor to debug Arduino
2. Check WiFi connection status
3. Verify HTTP response codes
4. Monitor Firestore in real-time

---

### Security Considerations

1. **Device Authentication**: Use API keys in HTTP headers
2. **HTTPS Only**: Use HTTPS endpoints (Firebase Functions default)
3. **Rate Limiting**: Implement in Cloud Function
4. **Data Validation**: Validate all sensor readings
5. **Error Handling**: Handle network failures gracefully

## Data Processing & Analytics

### Chart Generation
- **Frontend**: `react-native-chart-kit` or `victory-native`
- **Backend**: Generate chart data, send to frontend

### PDF Generation (For Reports)
- **Backend**: `pdfkit` (Node.js) or `reportlab` (Python)
- **Frontend**: Share/export functionality

## Development Tools

### Version Control
- **Git + GitHub**: Standard for capstone projects

### API Testing
- **Postman** or **Insomnia**: Test API endpoints
- **Thunder Client**: VS Code extension

### Database Management
- **Firebase Console**: Firestore database management
- **Firestore Emulator**: Local development and testing
- **Firebase CLI**: Command-line tools for Firestore

### Mobile App Testing
- **Expo Go App**: Test on physical devices
- **Android Studio Emulator**: Android testing
- **Xcode Simulator**: iOS testing (Mac only)

## Recommended Project Structure (Firebase/Firestore)

```
nilm-mobile-app/
├── mobile/                    # React Native App (Expo)
│   ├── src/
│   │   ├── screens/          # App screens
│   │   │   ├── LoginScreen.js
│   │   │   ├── DashboardScreen.js
│   │   │   ├── DeviceScreen.js
│   │   │   ├── ReportsScreen.js
│   │   │   └── SettingsScreen.js
│   │   ├── components/       # Reusable components
│   │   │   ├── PowerChart.js
│   │   │   ├── DeviceCard.js
│   │   │   └── NotificationBadge.js
│   │   ├── services/         # Firebase services
│   │   │   ├── firebase.js   # Firebase config
│   │   │   ├── authService.js
│   │   │   ├── deviceService.js
│   │   │   └── readingService.js
│   │   ├── navigation/       # Navigation setup
│   │   │   └── AppNavigator.js
│   │   ├── utils/            # Utilities
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   └── store/            # State management (Context API/Redux)
│   │       └── AppContext.js
│   ├── app.json
│   ├── package.json
│   └── firebase-config.js    # Firebase config (keep secure)
│
├── functions/                 # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.js          # Main functions file
│   │   ├── submitReading.js  # IoT data endpoint
│   │   ├── generateSummary.js # Daily/weekly summaries
│   │   └── checkAlerts.js    # Alert checking
│   ├── package.json
│   └── .env.example
│
├── hardware/                  # Arduino/ESP32 code (optional)
│   ├── esp32-nilm/
│   │   ├── esp32-nilm.ino
│   │   └── libraries/        # Required Arduino libraries
│   └── README.md
│
├── database/
│   ├── firestore-rules.json  # Firestore security rules
│   ├── firestore-indexes.json # Firestore indexes
│   └── schema-firestore.md   # Schema documentation
│
└── docs/                      # Documentation
    ├── ERD.md
    ├── API.md
    ├── USER_MANUAL.md
    └── SETUP_GUIDE.md
```

## Environment Variables Template

### Firebase Cloud Functions (.env)
```env
# Firebase Project
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_REGION=us-central1

# Device API Keys (for IoT authentication)
DEVICE_API_KEY_DEVICE123=your-secret-api-key-here
DEVICE_API_KEY_DEVICE456=another-secret-key

# Cloudinary (for file storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Mobile App (firebase-config.js)
```javascript
// firebase-config.js
import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export default app;
```

**Note:** For production, use environment variables or secure storage for Firebase config.

### Arduino/ESP32 (config.h)
```cpp
// config.h
#ifndef CONFIG_H
#define CONFIG_H

// WiFi credentials
const char* WIFI_SSID = "YourWiFi";
const char* WIFI_PASSWORD = "YourPassword";

// Firebase Cloud Function URL
const char* FIREBASE_FUNCTION_URL = "https://us-central1-your-project.cloudfunctions.net/submitReading";

// Device credentials
const char* DEVICE_ID = "device123";
const char* DEVICE_API_KEY = "your-device-api-key";

#endif
```

## Cost Estimation (Free Tier)

### With Firebase/Firestore:
- **Mobile App Development**: Free (Expo Go)
- **Backend (Cloud Functions)**: Free (2M invocations/month)
- **Database (Firestore)**: Free (50K reads, 20K writes/day, 1GB storage)
- **Authentication**: Free (unlimited users)
- **Total**: $0/month for development and testing

### With SQL Database:
- **Mobile App Development**: Free (Expo Go)
- **Backend Hosting**: Free (Railway/Render)
- **Database**: Free (Supabase/PlanetScale/Railway)
- **Total**: $0/month for development and testing

## Next Steps

## Implementation Steps (Your Chosen Stack)

### Phase 1: Firebase Setup
1. **Create Firebase project** at https://console.firebase.google.com
2. **Enable Firestore** database
3. **Set up Firestore collections** (see `schema-firestore.md`)
4. **Configure security rules** (provided in `schema-firestore.md`)
5. **Enable Firebase Authentication** (Email/Password)
6. **Set up Cloud Functions** (for IoT data endpoint)

### Phase 2: Mobile App Development
1. **Initialize Expo project**: `npx create-expo-app nilm-app`
2. **Install Firebase**: `expo install @react-native-firebase/app @react-native-firebase/firestore @react-native-firebase/auth`
3. **Configure Firebase** in mobile app
4. **Implement authentication** screens
5. **Create dashboard** with real-time Firestore listeners
6. **Add charts** using `react-native-chart-kit` or `victory-native`
7. **Implement device management** screens
8. **Add reports and PDF export** functionality

### Phase 3: Cloud Functions Setup
1. **Initialize Functions**: `firebase init functions`
2. **Create IoT endpoint** (`submitReading` function)
3. **Implement data validation** and security
4. **Add consumption summary** generation (scheduled function)
5. **Implement alert checking** logic
6. **Deploy functions**: `firebase deploy --only functions`

### Phase 4: Hardware Integration
1. **Choose microcontroller** (ESP32 recommended)
2. **Set up Arduino IDE** with ESP32 board support
3. **Install required libraries** (WiFi, HTTPClient, ArduinoJson)
4. **Implement sensor reading** code
5. **Add HTTP POST** to Cloud Function
6. **Test with Serial Monitor**
7. **Verify data in Firestore**

### Phase 5: Testing & Deployment
1. **Test mobile app** with Expo Go
2. **Test real-time updates** from hardware
3. **Verify consumption summaries** generation
4. **Test alert system**
5. **Test PDF export** functionality
6. **Deploy mobile app** (Expo build or app stores)

### Phase 6: Documentation
1. **User manual** for mobile app
2. **Hardware setup guide** for Arduino
3. **API documentation** for Cloud Functions
4. **System architecture** diagrams
5. **Testing results** and evaluation

