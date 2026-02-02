# 🔥 Firebase Setup - DO THIS NOW

**Time Required:** 40 minutes  
**Goal:** Get Firebase connected to your app

---

## 📋 What You Need

- [ ] Internet connection
- [ ] Google account
- [ ] This terminal open: `d:\Development\NILM Planning\capstone-nilm-app`

---

## 🎯 Step 1: Create Firebase Project (10 min)

### 1.1 Go to Firebase Console
👉 **Open:** https://console.firebase.google.com/

### 1.2 Create Project
1. Click **"Add project"**
2. Project name: `capstone-nilm-app`
3. (Optional) Enable Google Analytics
4. Click **"Create project"**
5. Wait... ⏳
6. Click **"Continue"** when ready

---

## 📱 Step 2: Register Your App (10 min)

### 2.1 Add Android App
1. In Firebase Console, click **⚙️ Settings** (gear icon top left)
2. Click **"Project settings"**
3. Scroll to **"Your apps"** section
4. Click Android icon 🤖
5. Fill in:
   - **Android package name:** `com.irieskid.capstonenilmapp`
   - **App nickname:** `NILM Android` (optional)
6. Click **"Register app"**
7. **DOWNLOAD** `google-services.json`
8. **SAVE TO:** `d:\Development\NILM Planning\capstone-nilm-app\google-services.json`
9. Click **"Next"** → **"Next"** → **"Continue to console"**

### 2.2 Copy Your Configuration
1. Still in **Project settings** → Scroll to **"Your apps"**
2. Find your Android app
3. Scroll to **"SDK setup and configuration"**
4. Click **"Config"** radio button
5. **COPY THIS ENTIRE BLOCK:**

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

6. Open: `config\firebase.ts` in VS Code
7. **PASTE** your values (replace the `YOUR_...` placeholders)
8. **SAVE** the file

---

## 🔐 Step 3: Enable Services (10 min)

### 3.1 Enable Authentication
1. In Firebase Console, go to: **Build** → **Authentication**
2. Click **"Get started"**
3. Click **"Email/Password"**
4. **Toggle ON** the first switch (Email/Password)
5. Click **"Save"**

### 3.2 Create Firestore Database
1. Go to: **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Click **"Next"**
5. Location: **`asia-southeast1`** (Singapore) or **`asia-east1`** (Taiwan)
6. Click **"Enable"**
7. Wait for database creation... ⏳

### 3.3 Enable Storage
1. Go to: **Build** → **Storage**
2. Click **"Get started"**
3. Select **"Start in test mode"**
4. Click **"Next"**
5. Use **same location** as Firestore
6. Click **"Done"**

---

## 📦 Step 4: Install Firebase SDK (5 min)

### 4.1 Open Terminal
```bash
cd "d:\Development\NILM Planning\capstone-nilm-app"
```

### 4.2 Install Firebase
```bash
npm install firebase
```

**Wait for installation to complete...**

---

## 🗃️ Step 5: Create Test Data (5 min)

### 5.1 Create Users Collection
1. In Firebase Console, go to: **Firestore Database**
2. Click **"Start collection"**
3. Collection ID: `users`
4. Click **"Next"**
5. Document ID: (leave as Auto-ID)
6. Add these fields (click "Add field" for each):

| Field Name  | Type      | Value                 |
|-------------|-----------|-----------------------|
| email       | string    | admin@nilm.com       |
| firstName   | string    | Admin                |
| lastName    | string    | User                 |
| role        | string    | admin                |
| isActive    | boolean   | true                 |
| createdAt   | timestamp | (click calendar icon, select now) |

7. Click **"Save"**

### 5.2 Create Other Collections (Quick!)
For each of these, just create an empty collection:
1. Click **"Start collection"**
2. Enter collection ID
3. Add a dummy doc (any field)
4. Delete the doc (keeps the collection)

**Collections to create:**
- `devices`
- `appliances`
- `realTimeReadings`
- `consumptionSummaries`
- `electricityRates`
- `alerts`
- `notifications`
- `systemSettings`

---

## ✅ Step 6: Test It! (5 min)

### 6.1 Verify Your Setup
- [ ] `google-services.json` is in `capstone-nilm-app\` folder
- [ ] `config\firebase.ts` has real values (not "YOUR_...")
- [ ] Firebase Authentication is enabled
- [ ] Firestore Database is created
- [ ] `users` collection has 1 document

### 6.2 Start Your App
```bash
npm start
```

**Expected:**
- Metro bundler starts
- QR code appears
- No Firebase errors in terminal

**If you see errors:**
- Double-check `config\firebase.ts` values
- Make sure you saved the file
- Check Firebase Console (services enabled?)

---

## 🎉 Success!

**You're done with Firebase setup!** 

### What's Next?

Now you can start building:
1. **Authentication screens** (Login, Register)
2. **Dashboard** (Real-time monitoring)
3. **Device management**
4. **Analytics charts**

See: `Documentation/development-guides/GETTING-STARTED.md` for the full development roadmap.

---

## 🆘 Troubleshooting

**Error: "Firebase app not initialized"**
- Check `config\firebase.ts` has real values
- Make sure you replaced ALL placeholders

**Error: "Permission denied"**
- Firestore must be in "Test mode"
- Check Firebase Console → Firestore → Rules

**Error: "Network request failed"**
- Check internet connection
- Verify Firebase project is active
- API keys are correct?

**App crashes on start**
- Clear cache: `npx expo start --clear`
- Check terminal for error messages

---

**Need more details?** See `Documentation/development-guides/FIREBASE-SETUP-GUIDE.md`

---

**Last Updated:** February 2, 2026  
**Status:** Ready to configure 🚀
