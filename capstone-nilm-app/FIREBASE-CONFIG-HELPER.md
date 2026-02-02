# 🔍 Finding Your Firebase Configuration

You're in the right place! Here's what to do:

## On the page you're looking at:

1. **Scroll DOWN** on that same page (the SDK setup and configuration page)

2. You should see a section that says **"SDK setup and configuration"**

3. Look for radio buttons that say:
   - **Config** ← Click this one!
   - npm
   - CDN

4. After clicking **"Config"**, you'll see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "capstonenilmapp.firebaseapp.com",
  projectId: "capstonenilmapp",
  storageBucket: "capstonenilmapp.appspot.com",
  messagingSenderId: "223044937764",
  appId: "1:223044937764:android:d88b8bb6d9bb3fc0a590b1"
};
```

5. **Copy ALL those values** (your real values will be different)

---

## Then paste them here:

Open: `capstone-nilm-app\config\firebase.ts`

Replace the placeholder values with your real ones:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_REAL_API_KEY_HERE",           // ← Paste your apiKey
  authDomain: "YOUR_REAL_AUTH_DOMAIN_HERE",   // ← Paste your authDomain
  projectId: "YOUR_REAL_PROJECT_ID_HERE",     // ← Paste your projectId
  storageBucket: "YOUR_REAL_STORAGE_HERE",    // ← Paste your storageBucket
  messagingSenderId: "223044937764",          // ← Paste your messagingSenderId
  appId: "1:223044937764:android:d88b8bb6d9bb3fc0a590b1"  // ← Paste your appId
};
```

---

## Can't find the "Config" option?

Try this alternative:

1. Click the **"google-services.json"** download button (you already see this)
2. Save the file to: `d:\Development\NILM Planning\capstone-nilm-app\`
3. Open the `google-services.json` file in a text editor
4. Look for these values in the JSON:
   - `"api_key"` → `current_key`
   - `"project_id"` 
   - `"storage_bucket"`
   - `"mobilesdk_app_id"`

5. Use those to fill in `config/firebase.ts`

---

## Quick Reference:

From your screenshot, I can already see:
- ✅ **appId**: `1:223044937764:android:d88b8bb6d9bb3fc0a590b1`
- ✅ **messagingSenderId**: `223044937764`
- ✅ **Package name**: `com.irieskid.capstonenilmapp` (correct!)

You just need:
- apiKey
- authDomain  
- projectId
- storageBucket

These are on that same page - scroll down or click "Config"!
