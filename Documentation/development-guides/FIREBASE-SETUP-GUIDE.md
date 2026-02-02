# Firebase Setup Guide for NILM App

## Overview
This guide walks you through setting up Firebase for the NILM (Non-Intrusive Load Monitoring) mobile application, including Firestore database, Authentication, and Cloud Functions.

---

## Phase 1: Firebase Project Setup (Do This First!)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `capstone-nilm-app`
4. **(Optional)** Enable Google Analytics (recommended for tracking app usage)
5. Click **"Create project"** and wait for initialization

### Step 2: Add Android App to Firebase
1. In Firebase Console, click the **Android icon** (⚙️ Settings > Project settings)
2. Click **"Add app"** and select **Android**
3. Enter Android package name: `com.irieskid.capstonenilmapp` (or your custom package name)
   - Find this in `app.json` under `expo.android.package` (you may need to add it)
4. **(Optional)** Enter app nickname: `NILM Android`
5. Click **"Register app"**
6. **Download `google-services.json`** and save it to `capstone-nilm-app/` root directory
7. Click **"Next"** through the remaining steps

### Step 3: Add iOS App to Firebase (if building for iOS)
1. Click **"Add app"** and select **iOS**
2. Enter iOS bundle ID: `com.irieskid.capstonenilmapp` (or your custom bundle ID)
   - Find this in `app.json` under `expo.ios.bundleIdentifier` (you may need to add it)
3. **(Optional)** Enter app nickname: `NILM iOS`
4. Click **"Register app"**
5. **Download `GoogleService-Info.plist`** and save it to `capstone-nilm-app/` root directory
6. Click **"Next"** through the remaining steps

---

## Phase 2: Enable Firebase Services

### Step 4: Enable Authentication
1. In Firebase Console, go to **Build > Authentication**
2. Click **"Get started"**
3. Enable the following sign-in methods:
   - ✅ **Email/Password** (for user login)
   - ✅ **Google** (optional, for Google Sign-In)
4. Click **"Save"**

### Step 5: Create Firestore Database
1. In Firebase Console, go to **Build > Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** for now (we'll add security rules later)
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2026, 3, 1);
       }
     }
   }
   ```
4. Choose Firestore location: **`asia-southeast1`** (Singapore) or **`asia-east1`** (Taiwan) - closest to Philippines
5. Click **"Enable"**

### Step 6: Set Up Storage (for user profile images, device images)
1. In Firebase Console, go to **Build > Storage**
2. Click **"Get started"**
3. Select **"Start in test mode"** for now
4. Use the same location as Firestore
5. Click **"Done"**

---

## Phase 3: Install Firebase SDK in React Native App

### Step 7: Install Firebase Dependencies
Open your terminal in `capstone-nilm-app/` and run:

```bash
npm install firebase
npm install @react-native-firebase/app @react-native-firebase/firestore @react-native-firebase/auth
npx expo install expo-dev-client
```

**Why `expo-dev-client`?**
- Firebase native modules require a custom development build (not Expo Go)
- We'll use Expo's managed workflow with custom native code

### Step 8: Create Firebase Configuration File
Create `capstone-nilm-app/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration (from Firebase Console > Project Settings > General)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
```

**To get your `firebaseConfig`:**
1. Go to Firebase Console > Project Settings (⚙️)
2. Scroll to **"Your apps"** section
3. Click on your Android/iOS app
4. Find the **"Firebase SDK snippet"** section
5. Select **"Config"**
6. Copy the `firebaseConfig` object

---

## Phase 4: Create Firestore Database Collections

### Step 9: Create Initial Collections
In Firebase Console > Firestore Database, create these collections manually:

#### 1. `users` Collection
- Click **"Start collection"**
- Collection ID: `users`
- Add first document with auto-generated ID:
  ```
  Field: email | Type: string | Value: admin@nilm.com
  Field: firstName | Type: string | Value: Admin
  Field: lastName | Type: string | Value: User
  Field: role | Type: string | Value: admin
  Field: createdAt | Type: timestamp | Value: (current timestamp)
  Field: isActive | Type: boolean | Value: true
  ```

#### 2. `devices` Collection
- Collection ID: `devices`
- Add a mock device document (auto-generated ID):
  ```
  Field: userId | Type: string | Value: (copy user ID from users collection)
  Field: deviceName | Type: string | Value: Main Smart Meter
  Field: macAddress | Type: string | Value: AA:BB:CC:DD:EE:FF
  Field: status | Type: string | Value: active
  Field: location | Type: string | Value: Living Room
  Field: registeredAt | Type: timestamp | Value: (current timestamp)
  ```

#### 3. Other Collections (Create Empty)
Create these empty collections (add a dummy document and delete it to create the collection):
- `appliances`
- `realTimeReadings`
- `consumptionSummaries`
- `electricityRates`
- `alerts`
- `systemSettings`
- `notifications`
- `auditLogs`

---

## Phase 5: Set Up Security Rules (Important!)

### Step 10: Update Firestore Security Rules
In Firebase Console > Firestore Database > Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || isAdmin();
    }
    
    // Devices collection
    match /devices/{deviceId} {
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
                               resource.data.userId == request.auth.uid;
    }
    
    // Appliances collection
    match /appliances/{applianceId} {
      allow read, write: if isAuthenticated();
    }
    
    // Real-time readings (high frequency, need special handling)
    match /realTimeReadings/{readingId} {
      allow read: if isAuthenticated();
      allow create: if true; // IoT devices need to write without auth
      allow update, delete: if isAdmin();
    }
    
    // Consumption summaries
    match /consumptionSummaries/{summaryId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin(); // Only system generates summaries
    }
    
    // Electricity rates
    match /electricityRates/{rateId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Alerts
    match /alerts/{alertId} {
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      allow write: if isAdmin();
    }
    
    // System settings
    match /systemSettings/{settingId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      allow write: if isAdmin();
    }
    
    // Audit logs (admin only)
    match /auditLogs/{logId} {
      allow read, write: if isAdmin();
    }
  }
}
```

Click **"Publish"** to save the rules.

---

## Phase 6: Test Firebase Connection

### Step 11: Create a Test Component
Create `capstone-nilm-app/components/firebase-test.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

export function FirebaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      // Try to fetch users collection
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      setStatus('success');
      setMessage(`✅ Firebase connected! Found ${snapshot.size} users.`);
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Firebase error: ${error.message}`);
      console.error('Firebase connection error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {status === 'loading' && <ActivityIndicator size="large" />}
      <Text style={[
        styles.message,
        status === 'success' ? styles.success : styles.error
      ]}>
        {message || 'Testing Firebase connection...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
});
```

### Step 12: Add Test to Home Screen
Update `capstone-nilm-app/app/(tabs)/index.tsx` to include the test component temporarily.

---

## Phase 7: Mock Data Setup (Since Hardware Isn't Ready)

### Step 13: Create Mock Data Generator
Create `capstone-nilm-app/scripts/seedFirestore.ts`:

```typescript
// This script generates mock data for testing without hardware
// Run: npx ts-node scripts/seedFirestore.ts

import { db } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

async function seedMockData() {
  console.log('🌱 Seeding mock data...');

  // Mock electricity rate
  await addDoc(collection(db, 'electricityRates'), {
    name: 'Standard Rate 2026',
    pesoPerKwh: 11.50,
    effectiveFrom: Timestamp.fromDate(new Date('2026-01-01')),
    effectiveTo: null,
    isActive: true,
    createdAt: Timestamp.now(),
  });

  console.log('✅ Mock electricity rate created');

  // Mock real-time readings (simulating device data)
  const now = new Date();
  for (let i = 0; i < 10; i++) {
    await addDoc(collection(db, 'realTimeReadings'), {
      deviceId: 'mock-device-001',
      applianceId: i % 2 === 0 ? 'mock-appliance-001' : null,
      voltageRms: 220 + Math.random() * 10,
      currentRms: 2 + Math.random() * 5,
      powerWatts: 440 + Math.random() * 100,
      energyKwh: 0.5 + Math.random() * 0.5,
      powerFactor: 0.85 + Math.random() * 0.1,
      recordedAt: Timestamp.fromDate(new Date(now.getTime() - i * 60000)),
    });
  }

  console.log('✅ Mock readings created');
  console.log('🎉 Seeding complete!');
}

seedMockData().catch(console.error);
```

---

## Next Steps After Setup

1. ✅ **Test Firebase connection** using the test component
2. 📱 **Build authentication screens** (Login, Register, Profile)
3. 📊 **Create dashboard** to display mock data
4. 🔌 **Design device management screens**
5. 📈 **Build consumption analytics charts**
6. 🔔 **Implement notifications system**
7. ⚙️ **Add settings and user preferences**
8. 🧪 **Write unit tests** for Firebase operations

---

## Troubleshooting

### Error: "Firebase app not initialized"
- Make sure `firebase.ts` is imported at the top of your root layout (`app/_layout.tsx`)

### Error: "Permission denied"
- Check Firestore security rules
- Ensure user is authenticated before accessing protected collections

### Error: "Network request failed"
- Check your internet connection
- Verify Firebase project is active in Firebase Console
- Ensure API keys are correct in `firebase.ts`

---

## Security Best Practices

1. 🔒 **Never commit Firebase API keys** to public repositories
   - Use environment variables for sensitive data
   - Add `firebase.ts` to `.gitignore` if needed

2. 🛡️ **Always validate data** on the client and server (Cloud Functions)

3. 🚫 **Restrict real-time readings writes** to authenticated IoT devices only
   - Use Firebase Admin SDK in Cloud Functions for server-side validation

4. 📝 **Enable audit logging** for critical operations (user changes, device registration)

---

**Last Updated:** February 2, 2026
**Author:** NILM Development Team
