# 🚀 Deployment Checklist

**IMPORTANT**: Complete this checklist before deploying to production!

---

## ⚠️ CRITICAL: Remove Development Constraints

### 1. Update Environment Configuration

**File**: `config/environment.ts`

```typescript
export const ENV = {
  DEVELOPMENT_MODE: false,        // ⬅️ CHANGE FROM true TO false
  PERSISTENCE_INTERVAL: 3000,     // ⬅️ CHANGE FROM 30000 TO 3000
  ENABLE_CACHING: true,           // ✅ Keep as is (improves performance)
  CACHE_DURATION: 30000,          // ✅ Optional: Adjust 30s-60s
  UI_UPDATE_INTERVAL: 3000,       // ✅ Keep as is
};
```

**Why**: Development mode reduces Firebase writes to save quota. Production needs full real-time (3-second persistence).

**Verification**:
- [ ] `DEVELOPMENT_MODE` is `false`
- [ ] `PERSISTENCE_INTERVAL` is `3000`
- [ ] Check logs: Should NOT show "Running in DEVELOPMENT MODE"

---

## 🔥 Firebase Setup

### 2. Upgrade to Blaze Plan

**Steps**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to "Upgrade" in left sidebar
4. Select **Blaze (Pay as you go)**
5. Set up billing account
6. **Set spending limit**: $5-10/month (safety net)

**Why**: Free tier (20K writes/day) will be exceeded with 3-second real-time updates.

**Cost Estimate**: $2-5/month for 1 device with full real-time tracking.

**Verification**:
- [ ] Blaze plan activated
- [ ] Billing account configured
- [ ] Spending alert set up

---

## ✅ Testing Before Deployment

### 3. Test with Production Settings

**Before deploying**, test locally with production config:

```bash
# Update config/environment.ts to production values
# Then test the app
npm start
```

**Check**:
- [ ] Real-time updates work (3-second intervals)
- [ ] Reports load correctly
- [ ] Appliances toggle properly
- [ ] No Firebase quota errors
- [ ] Logs show "Development Mode: ❌ OFF (Full Performance)"

---

## 📱 Build & Deploy

### 4. Build Production App

**For Android**:
```bash
eas build --platform android --profile production
```

**For iOS**:
```bash
eas build --platform ios --profile production
```

### 5. Deploy to App Stores

Follow standard deployment procedures for:
- [ ] Google Play Store (Android)
- [ ] Apple App Store (iOS)

---

## 🔍 Post-Deployment Monitoring

### 6. Monitor Firebase Usage

**First Week**:
- Check Firebase Console → Usage daily
- Monitor read/write counts
- Watch for quota warnings
- Adjust spending limits if needed

**Set Up Alerts**:
- Firebase Console → Budget & Alerts
- Email notifications for unusual usage
- Alert when 80% of budget reached

**Verification**:
- [ ] Firebase usage monitored
- [ ] Budget alerts configured
- [ ] No quota errors reported

---

## 📊 Optional Optimizations

### 7. Fine-Tune Cache Duration

Based on usage patterns, adjust cache duration:

```typescript
// More real-time (less caching)
CACHE_DURATION: 30000, // 30 seconds

// Better performance (more caching)
CACHE_DURATION: 60000, // 60 seconds
```

### 8. Set Up Data Retention Policy

For cost optimization, periodically clean old data:

```bash
# Keep only last 30 days of readings
npm run cleanup-data -- --live --days 30 --collections realTimeReadings
```

**Note**: Daily summaries preserve aggregated data.

---

## 🛡️ Safety Checks

### Before Going Live

- [ ] All environment variables set correctly
- [ ] Firebase Blaze plan active
- [ ] App tested with production config
- [ ] Spending alerts configured
- [ ] Backup of current data created
- [ ] Team aware of production settings

### After Going Live

- [ ] Monitor Firebase usage first 24 hours
- [ ] Check app performance
- [ ] Verify real-time data accuracy
- [ ] Confirm no quota errors
- [ ] User feedback collected

---

## 📝 Quick Reference

### Development vs Production

| Setting | Development | Production |
|---------|------------|------------|
| `DEVELOPMENT_MODE` | `true` | `false` |
| `PERSISTENCE_INTERVAL` | `30000` (30s) | `3000` (3s) |
| Firebase Writes/Day | 2,880 | 28,800 |
| Firebase Plan | Spark (Free) | Blaze (Pay-as-you-go) |
| Real-time Accuracy | Good | Excellent |
| Cost | $0 | $2-5/month |

### Key Files to Check

1. `config/environment.ts` - **Most important**
2. Firebase Console - Plan & Usage
3. App logs - Verify production mode

---

## 🆘 Troubleshooting

### "Firebase quota exceeded" in production

**Cause**: Still using free Spark plan  
**Fix**: Upgrade to Blaze plan

### Data updates are slow (30-second delay)

**Cause**: `DEVELOPMENT_MODE` still `true`  
**Fix**: Set to `false` in `config/environment.ts`

### High Firebase costs

**Cause**: Too many reads/writes  
**Fix**: 
- Keep `ENABLE_CACHING` true
- Increase `CACHE_DURATION` to 60s
- Run cleanup script for old data

---

## 📞 Support

**Documentation**:
- `docs/FIREBASE-QUOTA-OPTIMIZATION.md` - Full optimization guide
- `docs/CONSUMPTION-SUMMARIES-INTEGRATION.md` - Summary generation
- `docs/FIREBASE-SETUP.md` - Firebase configuration

**Scripts**:
- `npm run cleanup-data` - Clean old test data
- `npm start` - Start development server

---

## ✅ Final Checklist

Before marking deployment complete:

- [ ] `DEVELOPMENT_MODE = false`
- [ ] `PERSISTENCE_INTERVAL = 3000`
- [ ] Firebase Blaze plan active
- [ ] Spending alerts configured
- [ ] Production build created
- [ ] App tested with prod config
- [ ] Monitoring set up
- [ ] Team briefed on changes

**Date Deployed**: _______________  
**Deployed By**: _______________  
**Firebase Plan**: Blaze ☐ / Spark ☐  
**Production Config Verified**: Yes ☐ / No ☐

---

**🎉 Ready to deploy? Make sure all checkboxes above are ✅ checked!**
