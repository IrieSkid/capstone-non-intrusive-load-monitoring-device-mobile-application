# Android APK Build Guide

**Date**: February 2, 2026  
**Status**: ✅ READY

## Overview

This guide will help you build a standalone Android APK file that you can install directly on your Android phone, without needing Expo Go.

## Prerequisites

1. **Expo Account** (free)
   - Sign up at https://expo.dev
   - You'll need this for EAS Build

2. **EAS CLI** (Expo Application Services)
   - We'll install this in the steps below

3. **Android Phone** (for testing)
   - Enable "Install from Unknown Sources" in Settings

## Step-by-Step Instructions

### Step 1: Install EAS CLI

Open your terminal in the project directory and run:

```bash
npm install -g eas-cli
```

Or if you prefer using npx (no global install needed):

```bash
npx eas-cli@latest --version
```

### Step 2: Login to Expo

```bash
eas login
```

Enter your Expo account credentials. If you don't have an account, create one at https://expo.dev/signup

### Step 3: Configure Your Project

The `eas.json` file is already created with the correct configuration. Your `app.json` is also properly configured with:
- Package name: `com.irieskid.capstonenilmapp`
- Android package configured
- Google Services file configured

### Step 4: Build the APK

Choose one of these build profiles:

#### Option A: Preview Build (Recommended for Testing)
```bash
eas build --platform android --profile preview
```

#### Option B: Development Build (For Development)
```bash
eas build --platform android --profile development
```

#### Option C: Production Build (For Release)
```bash
eas build --platform android --profile production
```

**For your first test build, use `preview` profile.**

### Step 5: Wait for Build to Complete

- The build will run on Expo's cloud servers
- You'll see a build URL in the terminal
- Build typically takes 10-20 minutes
- You can check progress at: https://expo.dev/accounts/[your-username]/projects/capstone-nilm-app/builds

### Step 6: Download the APK

Once the build completes:

1. **Via Terminal**: The build command will show a download link
2. **Via Expo Dashboard**: 
   - Go to https://expo.dev
   - Navigate to your project
   - Click on "Builds"
   - Download the APK file

### Step 7: Install on Your Phone

**Method 1: Direct Download**
1. Download the APK to your phone
2. Open the file
3. Allow installation from unknown sources if prompted
4. Install the app

**Method 2: Via QR Code**
1. After build completes, EAS will show a QR code
2. Scan with your phone
3. Download and install

**Method 3: Via USB**
1. Connect phone to computer via USB
2. Enable USB debugging
3. Transfer APK to phone
4. Install from file manager

## Build Profiles Explained

### Preview Profile
- **Purpose**: Testing builds
- **Distribution**: Internal (you and your team)
- **Build Type**: APK
- **Best for**: First-time builds, testing features

### Development Profile
- **Purpose**: Development with dev tools
- **Distribution**: Internal
- **Build Type**: APK
- **Best for**: Active development, debugging

### Production Profile
- **Purpose**: Release to users
- **Distribution**: Public (can be published to Play Store)
- **Build Type**: APK or AAB
- **Best for**: Final release, app store submission

## Troubleshooting

### Build Fails

**Error: "No credentials found"**
```bash
eas credentials
```
Follow the prompts to set up credentials.

**Error: "Google Services file not found"**
- Make sure `google-services.json` exists in the project root
- Check that the path in `app.json` is correct: `"./google-services.json"`

**Error: "Package name already exists"**
- Change the package name in `app.json`:
  ```json
  "android": {
    "package": "com.irieskid.capstonenilmapp.unique"
  }
  ```

### APK Won't Install

1. **Enable Unknown Sources**:
   - Settings → Security → Unknown Sources (enable)

2. **Check Android Version**:
   - Make sure your phone supports the minimum SDK version
   - Check `app.json` for `minSdkVersion` if specified

3. **Storage Space**:
   - Ensure you have enough storage for the APK

### Build Takes Too Long

- First build always takes longer (15-30 minutes)
- Subsequent builds are faster (10-15 minutes)
- Check build status at expo.dev dashboard

## Local Build (Alternative)

If you want to build locally instead of using cloud:

```bash
eas build --platform android --profile preview --local
```

**Requirements for Local Build**:
- Android SDK installed
- Java JDK installed
- More complex setup
- **Not recommended for first-time builds**

## Quick Commands Reference

```bash
# Login to Expo
eas login

# Build APK (preview)
eas build --platform android --profile preview

# Check build status
eas build:list

# View build details
eas build:view [build-id]

# Download latest build
eas build:download --platform android --profile preview
```

## Next Steps After First Build

1. **Test thoroughly** on your device
2. **Share with testers** using the download link
3. **Iterate** - make changes and rebuild
4. **Production build** when ready for release

## Cost

- **EAS Build Free Tier**: 
  - 30 builds per month
  - Perfect for development and testing
  - More than enough for most projects

- **Paid Plans**: 
  - Only needed if you exceed 30 builds/month
  - Or need faster build times

## Important Notes

1. **Google Services**: Your app uses Firebase, so `google-services.json` must be included
2. **Package Name**: Keep it unique (`com.irieskid.capstonenilmapp`)
3. **Version**: Update version in `app.json` for each release
4. **Signing**: EAS handles code signing automatically (no manual setup needed)

## Support

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **Expo Discord**: https://chat.expo.dev
- **Expo Forums**: https://forums.expo.dev

---

**You're all set! Run `eas build --platform android --profile preview` to create your first APK! 🚀**
