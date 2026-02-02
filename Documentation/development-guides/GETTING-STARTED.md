# Getting Started with NILM App Development

## 📋 Immediate Next Steps (Do These First!)

### Step 1: Set Up Firebase Project ⏱️ ~15 minutes

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create new project**: `capstone-nilm-app`
3. **Add Android app**:
   - Package name: `com.irieskid.capstonenilmapp`
   - Download `google-services.json` → Save to `capstone-nilm-app/` root
4. **Add iOS app** (optional):
   - Bundle ID: `com.irieskid.capstonenilmapp`
   - Download `GoogleService-Info.plist` → Save to `capstone-nilm-app/` root

### Step 2: Enable Firebase Services ⏱️ ~10 minutes

In Firebase Console:

1. **Authentication** → Enable:
   - ✅ Email/Password
   - ✅ Google (optional)

2. **Firestore Database** → Create database:
   - Mode: **Test mode** (for now)
   - Location: **asia-southeast1** (Singapore) or **asia-east1** (Taiwan)

3. **Storage** → Get started:
   - Mode: **Test mode**
   - Same location as Firestore

### Step 3: Get Firebase Configuration ⏱️ ~5 minutes

1. In Firebase Console → Project Settings (⚙️ gear icon)
2. Scroll to "Your apps" section
3. Click on your Android/iOS app
4. Find **"SDK setup and configuration"**
5. Copy the `firebaseConfig` object (looks like this):

```javascript
{
  apiKey: "AIza...",
  authDomain: "capstone-nilm-app.firebaseapp.com",
  projectId: "capstone-nilm-app",
  storageBucket: "capstone-nilm-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:android:abc123...",
  measurementId: "G-ABC123XYZ"
}
```

6. **Paste these values** into `capstone-nilm-app/config/firebase.ts` (replace the placeholder values)

### Step 4: Install Firebase SDK ⏱️ ~5 minutes

Open terminal in `capstone-nilm-app/` folder and run:

```bash
npm install firebase
```

That's it! Firebase SDK will be ready to use.

### Step 5: Test Firebase Connection ⏱️ ~5 minutes

1. Make sure you've updated `config/firebase.ts` with your actual Firebase credentials
2. Start your app:
   ```bash
   npm start
   ```
3. Open in Expo Go app on your phone
4. If you see errors, check the Firebase configuration values

---

## 🎯 Development Roadmap (After Firebase Setup)

### Phase 1: Authentication & User Management (Week 1-2)
- [ ] Login screen with email/password
- [ ] Register/Sign-up screen
- [ ] Password reset functionality
- [ ] Profile screen (view/edit user info)
- [ ] Logout functionality

### Phase 2: Dashboard & Real-Time Monitoring (Week 3-4)
- [ ] Dashboard home screen with mock data
- [ ] Real-time power consumption display
- [ ] Current voltage, current, power readings
- [ ] Device status indicators
- [ ] Quick stats cards (today's consumption, cost, etc.)

### Phase 3: Device & Appliance Management (Week 5-6) ✅ COMPLETE
- [x] Device list screen ✅ (Feb 2, 2026)
- [x] Add new device (when hardware ready) ✅ (4-step wizard complete)
- [x] Device details screen ✅ (Settings, connection management)
- [x] Appliance list per device ✅ (Active/Inactive sections)
- [x] Add/edit/delete appliances ✅ (Quick add, full CRUD)
- [x] Appliance classification settings ✅ (Detection config, training)

### Phase 4: Consumption Analytics (Week 7-8)
- [ ] Consumption history screen
- [ ] Daily/Weekly/Monthly charts
- [ ] Appliance-wise breakdown
- [ ] Cost analysis
- [ ] Export data to CSV/PDF

### Phase 5: Alerts & Notifications (Week 9-10)
- [ ] Alert settings screen
- [ ] Push notification setup
- [ ] Alert history
- [ ] Custom alert thresholds
- [ ] In-app notifications

### Phase 6: Settings & Admin (Week 11-12)
- [ ] App settings screen
- [ ] Electricity rate management
- [ ] User preferences
- [ ] Theme settings (dark/light mode)
- [ ] System settings (admin only)

### Phase 7: Testing & Refinement (Week 13-14)
- [ ] Unit tests for Firebase operations
- [ ] Integration tests
- [ ] UI/UX testing
- [ ] Performance optimization
- [ ] Bug fixes

### Phase 8: Hardware Integration (When Ready)
- [ ] MQTT/WebSocket connection setup
- [ ] Real-time data ingestion from IoT device
- [ ] Device pairing workflow
- [ ] Calibration screens
- [ ] Error handling for device disconnections

---

## 🗂️ Project Structure

```
capstone-nilm-app/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx            # Dashboard/Home
│   │   ├── devices.tsx          # Device management
│   │   ├── analytics.tsx        # Consumption analytics
│   │   ├── alerts.tsx           # Alerts & notifications
│   │   └── profile.tsx          # User profile
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable UI components
│   ├── auth/                    # Auth-related components
│   ├── dashboard/               # Dashboard widgets
│   ├── devices/                 # Device UI components
│   ├── charts/                  # Chart components
│   └── ui/                      # Generic UI components
├── config/                      # Configuration files
│   └── firebase.ts              # Firebase initialization
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── useDevices.ts           # Device management hook
│   ├── useReadings.ts          # Real-time readings hook
│   └── useFirestore.ts         # Generic Firestore hook
├── services/                    # Business logic & API calls
│   ├── auth.service.ts         # Authentication logic
│   ├── device.service.ts       # Device management
│   ├── readings.service.ts     # Readings operations
│   └── analytics.service.ts    # Analytics calculations
├── types/                       # TypeScript type definitions
│   ├── user.types.ts
│   ├── device.types.ts
│   └── readings.types.ts
├── utils/                       # Utility functions
│   ├── formatters.ts           # Data formatting
│   ├── validators.ts           # Form validation
│   └── calculations.ts         # Energy calculations
└── constants/                   # App constants
    ├── colors.ts
    └── config.ts
```

---

## 🛠️ Useful Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Lint code
npm run lint

# Clear cache and restart
npx expo start --clear

# Build for production (when ready)
npx eas build --platform android
npx eas build --platform ios
```

---

## 📚 Key Resources

### Firebase Documentation
- [Firebase Web SDK Guide](https://firebase.google.com/docs/web/setup)
- [Firestore CRUD Operations](https://firebase.google.com/docs/firestore/manage-data/add-data)
- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)

### React Native / Expo
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Components](https://reactnative.dev/docs/components-and-apis)
- [Expo SDK Reference](https://docs.expo.dev/versions/latest/)

### Design & UI
- [React Native Paper](https://callstack.github.io/react-native-paper/) - Material Design components
- [Expo Vector Icons](https://icons.expo.fyi/) - Icon library
- [React Native Charts](https://github.com/wuxudong/react-native-charts-wrapper) - Chart library

---

## 🚨 Common Issues & Solutions

### Issue: "Firebase app not initialized"
**Solution**: Make sure you've replaced the placeholder values in `config/firebase.ts` with your actual Firebase credentials.

### Issue: "Network request failed"
**Solution**: 
1. Check your internet connection
2. Verify Firebase project is active in Firebase Console
3. Check if API keys are correct

### Issue: "Permission denied" when accessing Firestore
**Solution**: 
1. Make sure Firestore is in "Test mode"
2. Check security rules in Firebase Console
3. Verify user is authenticated

### Issue: Expo Go app crashes
**Solution**: 
1. Clear cache: `npx expo start --clear`
2. Restart app
3. Check terminal for error messages

---

## 👥 Team Collaboration Tips

1. **Code Reviews**: Always review each other's code before merging
2. **Branching Strategy**: 
   - `main` - production-ready code
   - `develop` - integration branch
   - `feature/[name]` - feature branches
3. **Commit Messages**: Use clear, descriptive commit messages
4. **Documentation**: Document complex logic and Firebase queries
5. **Testing**: Test on real devices, not just emulator

---

## 📝 Next Steps After This Guide

1. ✅ Complete Firebase setup (Steps 1-4 above)
2. 📱 Start with **Phase 1: Authentication** (Login/Register screens)
3. 🎨 Design reusable UI components
4. 📊 Create mock data for testing without hardware
5. 🔄 Set up state management (Context API or Zustand)

---

**Last Updated:** February 2, 2026  
**Team:** NILM Capstone Project  
**Status:** 🚀 Ready to start development!
