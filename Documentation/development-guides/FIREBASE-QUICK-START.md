# 🚀 Firebase Quick Start Checklist

**Total Time: ~40 minutes**

---

## ✅ Step-by-Step Checklist

### 1️⃣ Create Firebase Project (5 min)
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project" or "Create a project"
- [ ] Name: `capstone-nilm-app`
- [ ] Enable Google Analytics (optional)
- [ ] Click "Create project"

---

### 2️⃣ Add Android App (5 min)
- [ ] In Firebase Console, click Android icon (or Settings > Add app > Android)
- [ ] Android package name: `com.irieskid.capstonenilmapp`
- [ ] App nickname: `NILM Android` (optional)
- [ ] Click "Register app"
- [ ] **DOWNLOAD `google-services.json`**
- [ ] Save `google-services.json` to: `d:\Development\NILM Planning\capstone-nilm-app\`
- [ ] Click "Next" through remaining steps

---

### 3️⃣ Add iOS App - Optional (5 min)
- [ ] Click iOS icon (or Settings > Add app > iOS)
- [ ] iOS bundle ID: `com.irieskid.capstonenilmapp`
- [ ] App nickname: `NILM iOS` (optional)
- [ ] Click "Register app"
- [ ] **DOWNLOAD `GoogleService-Info.plist`**
- [ ] Save `GoogleService-Info.plist` to: `d:\Development\NILM Planning\capstone-nilm-app\`
- [ ] Click "Next" through remaining steps

---

### 4️⃣ Enable Authentication (3 min)
- [ ] Go to: Build > Authentication
- [ ] Click "Get started"
- [ ] Click "Email/Password" → Enable → Save
- [ ] (Optional) Enable "Google" sign-in method

---

### 5️⃣ Create Firestore Database (5 min)
- [ ] Go to: Build > Firestore Database
- [ ] Click "Create database"
- [ ] Select: **"Start in test mode"**
- [ ] Location: **`asia-southeast1`** (Singapore) or **`asia-east1`** (Taiwan)
- [ ] Click "Enable"
- [ ] Wait for database to be created

---

### 6️⃣ Enable Storage (3 min)
- [ ] Go to: Build > Storage
- [ ] Click "Get started"
- [ ] Select: **"Start in test mode"**
- [ ] Use same location as Firestore
- [ ] Click "Done"

---

### 7️⃣ Get Firebase Configuration (5 min)
- [ ] In Firebase Console, click ⚙️ (Settings) > Project settings
- [ ] Scroll to "Your apps" section
- [ ] Click on your Android app
- [ ] Find "SDK setup and configuration" section
- [ ] Copy the entire `firebaseConfig` object

**It looks like this:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "capstone-nilm-app.firebaseapp.com",
  projectId: "capstone-nilm-app",
  storageBucket: "capstone-nilm-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

- [ ] Open: `capstone-nilm-app\config\firebase.ts`
- [ ] Replace the placeholder values with your copied values
- [ ] Save the file

---

### 8️⃣ Install Firebase SDK (2 min)
Open terminal in `capstone-nilm-app` folder:

```bash
npm install firebase
```

- [ ] Wait for installation to complete
- [ ] Check for any errors

---

### 9️⃣ Create Initial Firestore Collections (5 min)

In Firebase Console > Firestore Database:

**Create `users` collection:**
- [ ] Click "Start collection"
- [ ] Collection ID: `users`
- [ ] Click "Next"
- [ ] Document ID: (Auto-ID)
- [ ] Add fields:
  - `email` (string): `admin@nilm.com`
  - `firstName` (string): `Admin`
  - `lastName` (string): `User`
  - `role` (string): `admin`
  - `isActive` (boolean): `true`
  - `createdAt` (timestamp): (click calendar icon, select now)
- [ ] Click "Save"

**Create empty collections** (just create the collection, add a dummy doc, then delete the doc):
- [ ] `devices`
- [ ] `appliances`
- [ ] `realTimeReadings`
- [ ] `consumptionSummaries`
- [ ] `electricityRates`
- [ ] `alerts`
- [ ] `notifications`
- [ ] `systemSettings`
- [ ] `auditLogs`

---

### 🔟 Test Firebase Connection (5 min)

In terminal:
```bash
cd capstone-nilm-app
npm start
```

- [ ] Wait for Metro bundler to start
- [ ] Open app in Expo Go
- [ ] Check terminal for any Firebase errors
- [ ] If errors appear, double-check `config/firebase.ts` values

---

## ✅ Verification Checklist

**Before moving to development, verify:**

- [ ] ✅ `google-services.json` is in `capstone-nilm-app/` folder
- [ ] ✅ `config/firebase.ts` has real Firebase credentials (not placeholders)
- [ ] ✅ Firebase Console shows Authentication, Firestore, and Storage enabled
- [ ] ✅ Firestore has `users` collection with at least 1 document
- [ ] ✅ App starts without Firebase errors in terminal
- [ ] ✅ Firebase project is in "Test mode" (for now)

---

## 🎉 You're Ready!

Once all checkboxes are checked, you're ready to start building:

**Next: Phase 1 - Authentication Screens**
- Login screen
- Register screen
- Password reset
- Profile screen

See `GETTING-STARTED.md` for the full development roadmap!

---

## 🆘 Need Help?

**Firebase Console:** https://console.firebase.google.com/  
**Full Setup Guide:** See `FIREBASE-SETUP-GUIDE.md`  
**Troubleshooting:** See `FIREBASE-SETUP-GUIDE.md` → Troubleshooting section

---

**Last Updated:** February 2, 2026
