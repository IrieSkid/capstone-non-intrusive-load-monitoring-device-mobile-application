# 🚀 Setup Guide - NILM Mobile App

Complete guide to set up and run the NILM (Non-Intrusive Load Monitoring) mobile application.

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI**: `npm install -g expo-cli`
- **Firebase Account** with Firestore enabled
- **Android Studio** (for Android) or **Xcode** (for iOS)
- **Git** for version control

---

## 🔧 Installation Steps

### 1. Clone and Install Dependencies

```bash
cd capstone-nilm-app
npm install
```

### 2. Firebase Configuration

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: "NILM Capstone"
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database** → Start in test mode

#### B. Get Configuration Files

**For Android:**
1. Add Android app in Firebase Console
2. Download `google-services.json`
3. Place in `capstone-nilm-app/` root

**For iOS:**
1. Add iOS app in Firebase Console
2. Download `GoogleService-Info.plist`
3. Place in `capstone-nilm-app/` root

#### C. Update Firebase Config

Edit `config/firebase.ts` with your Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Create Firestore Indexes

**Required for Reports to work!**

Go to [Firestore Console](https://console.firebase.google.com/) → Indexes → Create:

```
Collection: realTimeReadings
Fields:
  - deviceId (Ascending)
  - timestamp (Ascending)
```

See [FIRESTORE-INDEXES.md](./FIRESTORE-INDEXES.md) for complete list.

### 4. Run the App

```bash
# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on web
npx expo start --web
```

---

## 👤 First-Time User Setup

### 1. Register Account
```
1. Open app
2. Tap "Create Account"
3. Enter email and password
4. Tap "Sign Up"
```

### 2. Add Device
```
1. Go to "Devices" tab
2. Tap "Add Device" button
3. Follow 4-step wizard:
   - Device Info (name, model)
   - Network Config (WiFi, IP)
   - Location (room, building)
   - Review & Confirm
```

### 3. Add Appliances
```
1. Tap on your device
2. Tap "View Appliances"
3. Tap "Add Appliance"
4. Fill in details:
   - Name: "Air Conditioner"
   - Category: "Cooling"
   - Rated Power: 1500 (Watts)
   - Icon: ❄️
   - Port Number: 1 (hardware port)
5. Tap "Add Appliance"
```

### 4. Start Monitoring
```
1. Go to "Dashboard" tab
2. Toggle appliances ON/OFF
3. Watch real-time power consumption
4. Data saves automatically every 30 seconds
```

### 5. View Reports
```
1. Go to "Reports" tab
2. Switch between Daily/Weekly/Monthly
3. See consumption charts
4. View appliance breakdown
5. Check cost analysis
```

### 6. Configure Alerts
```
1. Go to "Alerts" tab
2. Tap "+" to create alert rule
3. Set threshold and conditions
4. Receive notifications automatically
```

---

## 🗂️ Project Structure

```
capstone-nilm-app/
├── app/                    # Screens (Expo Router)
│   ├── (auth)/            # Login, Register
│   ├── (tabs)/            # Main tabs (Dashboard, Reports, etc.)
│   ├── add-device.tsx     # Device wizard
│   ├── add-appliance.tsx  # Appliance form
│   └── ...
├── components/            # Reusable components
│   ├── dashboard/         # Dashboard widgets
│   ├── reports/           # Report charts
│   └── ui/               # UI primitives
├── services/             # Business logic
│   ├── authService.ts
│   ├── deviceService.ts
│   ├── firestoreApplianceService.ts
│   ├── readingService.ts
│   ├── reportService.ts
│   ├── realtimeDataService.ts
│   └── ...
├── contexts/             # React Context providers
│   ├── AuthContext.tsx
│   ├── RealtimeDataContext.tsx
│   └── ThemeContext.tsx
├── types/                # TypeScript interfaces
├── config/               # Firebase config
├── docs/                 # Documentation
└── utils/                # Helper functions
```

---

## 🔥 Firebase Collections

### Required Collections:
- `users` - User profiles
- `devices` - IoT device registrations
- `appliances` - Appliance configurations
- `realTimeReadings` - Power readings (with per-appliance data)
- `consumptionSummaries` - Aggregated data
- `notifications` - User notifications
- `alertRules` - Alert configurations
- `electricityRates` - Rate plans

**Auto-created on first use** - No manual setup needed!

---

## 🧪 Testing the App

### 1. Test Authentication
```bash
1. Register new account
2. Logout
3. Login with same credentials
4. Test "Forgot Password"
```

### 2. Test Device Management
```bash
1. Add device
2. View device list
3. Edit device details
4. Test connection
5. Delete device
```

### 3. Test Appliance Control
```bash
1. Add 3-5 appliances
2. Toggle them ON/OFF
3. Check Firestore Console:
   - isActive should change
   - usageMinutes should increment
   - lastDetected should update
```

### 4. Test Reports
```bash
1. Keep appliances ON for 2-3 minutes
2. Go to Reports tab
3. Check Daily report shows data
4. Verify appliance breakdown
5. Check cost analysis
```

### 5. Test Alerts
```bash
1. Create alert rule (e.g., Power > 2000W)
2. Turn on enough appliances to trigger
3. Wait 1 minute
4. Check Alerts tab for notification
```

---

## 🐛 Troubleshooting

### Firebase Connection Issues
```bash
# Check Firebase config
- Verify apiKey, projectId are correct
- Ensure google-services.json is in root
- Check Firebase Console for enabled services
```

### App Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### Firestore Permission Denied
```bash
# Update Firestore Rules (temporary for development)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Reports Not Loading
```bash
# Check Firestore Indexes
1. Go to Firebase Console → Firestore → Indexes
2. Create index for realTimeReadings:
   - deviceId (Ascending)
   - timestamp (Ascending)
3. Wait 2-3 minutes for index to build
```

### Appliance Usage Not Updating
```bash
# Verify real-time service is running
1. Check Dashboard shows "Connected"
2. Toggle appliance and wait 30 seconds
3. Check Firestore Console → appliances collection
4. usageMinutes should be > 0
```

---

## 📱 Building for Production

### Android APK
```bash
# Build APK
eas build --platform android --profile preview

# Or local build
npx expo export:android
```

### iOS IPA
```bash
# Build IPA (requires Apple Developer account)
eas build --platform ios --profile preview
```

---

## 🔐 Security Checklist

- [ ] Update Firestore security rules for production
- [ ] Enable App Check for Firebase
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting on API calls
- [ ] Add input validation on all forms
- [ ] Enable 2FA for Firebase Console access

---

## 📚 Additional Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Expo Documentation**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **TypeScript**: https://www.typescriptlang.org/

---

## 🆘 Getting Help

- Check [CURRENT-FEATURES.md](./CURRENT-FEATURES.md) for feature list
- Review [FIRESTORE-INDEXES.md](./FIRESTORE-INDEXES.md) for index setup
- Check Firebase Console logs for errors
- Review app logs in Expo Dev Tools

---

**Last Updated**: February 2, 2026  
**Status**: ✅ Production Ready
