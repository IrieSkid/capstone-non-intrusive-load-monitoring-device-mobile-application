# Quick Start - Running Scripts 🚀

## Simple Command (Use This!)

```bash
npx tsx scripts/initializeUserData.ts YOUR_USER_ID
```

**Replace `YOUR_USER_ID` with your actual Firebase user ID (without the `<` `>` brackets!)**

## Example:
```bash
npx tsx scripts/initializeUserData.ts HlVuCoJh2ROtM8K9T0W6AA4zSNX2
```

## If That Doesn't Work

The scripts need a Node.js environment. Since Firebase uses React Native packages, just use the Firebase Console directly:

### Create Data Manually (Easiest!)

1. Go to **Firebase Console** → **Firestore Database**
2. Use the UI to create documents

OR

### Use the App Itself

The app auto-creates everything when you first login! Just:
1. Register/Login to the app
2. Wait a few seconds
3. Everything is created automatically

The app will create:
- Device
- Appliances  
- Alert Rules
- Real-time readings (every 30 seconds)

**To add notifications**, we can create them directly in Firebase Console or wait for the alert rules to trigger them naturally!

---

*For now, just use the app - it's the easiest way!* ✅
