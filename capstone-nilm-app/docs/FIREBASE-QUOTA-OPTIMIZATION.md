# Firebase Quota Optimization for Development

**Date**: February 2, 2026  
**Status**: ✅ COMPLETE

## Problem

Firebase free tier (Spark plan) has limited quotas:
- **Reads**: 50,000 per day
- **Writes**: 20,000 per day
- **Storage**: 1 GB

With real-time data persistence every 3 seconds, we exceed write quotas quickly:
- 28,800 writes per day (3-second intervals)
- Plus report queries, alert monitoring, etc.

## Solution

Implemented three-pronged optimization strategy:

1. **Development Mode** - Reduces write frequency
2. **Intelligent Caching** - Reduces read operations  
3. **Cleanup Script** - Removes old test data

---

## 1. Development Mode

### What It Does

**Development Mode** (when `DEVELOPMENT_MODE = true`):
- UI updates every 3 seconds (smooth UX)
- Data persists every 30 seconds (saves quota)
- **Result**: 2,880 writes/day instead of 28,800

**Production Mode** (when `DEVELOPMENT_MODE = false`):
- UI updates every 3 seconds
- Data persists every 3 seconds (full real-time)
- **Result**: Full functionality for live deployment

### Configuration

**File**: `config/environment.ts`

```typescript
export const ENV = {
  DEVELOPMENT_MODE: true,          // 🚀 Set to false for deployment
  PERSISTENCE_INTERVAL: 30000,     // 30s in dev, 3s in production
  ENABLE_CACHING: true,            // Can stay true in production
  CACHE_DURATION: 60000,           // 1 minute cache
  UI_UPDATE_INTERVAL: 3000,        // Always 3s for smooth UI
};
```

### How It Works

```typescript
// UI updates every 3 seconds for smooth experience
this.interval = setInterval(() => {
  // Update UI
  this.currentReading = this.generateReading();
  this.dataCallbacks.forEach(callback => callback(this.currentReading));
  
  // Track time
  this.persistenceCounter += ENV.UI_UPDATE_INTERVAL;
  
  // Only save to Firebase at PERSISTENCE_INTERVAL
  if (this.persistenceCounter >= ENV.PERSISTENCE_INTERVAL) {
    this.saveToFirestore(); // Every 30s in dev, 3s in prod
    this.persistenceCounter = 0;
  }
}, ENV.UI_UPDATE_INTERVAL);
```

### Logs

Development mode logs:
```
🔧 Environment Configuration:
  Development Mode: ✅ ON (Quota Saving)
  Persistence Interval: 30 seconds
  UI Update Interval: 3 seconds
  Caching: ✅ Enabled
⚠️  Running in DEVELOPMENT MODE - Firebase writes reduced
📝 Set DEVELOPMENT_MODE to false before deployment
```

Production mode logs:
```
🔧 Environment Configuration:
  Development Mode: ❌ OFF (Full Performance)
  Persistence Interval: 3 seconds
  UI Update Interval: 3 seconds
  Caching: ✅ Enabled
```

---

## 2. Intelligent Caching

### What It Does

Caches frequently accessed data to reduce Firebase reads:
- Report data cached for 1 minute
- Automatically invalidated when stale
- Optional (can be disabled)

### Configuration

**File**: `utils/cache.ts`

```typescript
// Automatic caching
const cached = cache.get<DailyReport>(cacheKey);
if (cached) return cached; // Cache hit - no Firebase read!

// ... fetch from Firebase ...

cache.set(cacheKey, report); // Cache for next time
```

### Cache Keys

Reports use intelligent cache keys:
```typescript
const cacheKey = generateCacheKey(
  'daily-report',
  deviceId,
  userId,
  new Date().toDateString() // Invalidates daily
);
```

### Cache Statistics

```typescript
cache.getStats();
// { size: 12, entries: ['daily-report:...', 'weekly-report:...'] }
```

### Manual Cache Control

```typescript
// Invalidate specific key
cache.invalidate('daily-report:device123');

// Invalidate all reports
cache.invalidatePattern('report');

// Clear everything
cache.clear();
```

---

## 3. Cleanup Script

### What It Does

Removes old test data from Firestore to free up storage and quota.

### Usage

**Dry Run** (preview what would be deleted):
```bash
npm run cleanup-data
```

**Live Cleanup** (delete data older than 7 days):
```bash
npm run cleanup-data -- --live
```

**Custom Days** (delete data older than 30 days):
```bash
npm run cleanup-data -- --live --days 30
```

**Specific Collections**:
```bash
npm run cleanup-data -- --live --collections realTimeReadings --days 3
```

### What Gets Cleaned

By default:
- `realTimeReadings` - Raw sensor data
- `consumptionSummaries` - Daily summaries

**Note**: Does NOT delete:
- Users
- Devices
- Appliances
- Alert rules
- Notifications (configurable)

### Example Output

```
🧹 Firebase Cleanup Script
==========================
Mode: DRY RUN (no deletion)
Days to keep: 7
Collections: realTimeReadings, consumptionSummaries

Cutoff date: 2026-01-26T00:00:00.000Z

📂 Processing collection: realTimeReadings
   Found 12,450 documents to delete

📂 Processing collection: consumptionSummaries
   Found 6 documents to delete

==========================
Total documents to delete: 12,456

⚠️  This was a DRY RUN. No data was deleted.
Run with --live to actually delete data.
```

---

## Deployment Checklist

### Before Production Deployment

**1. Update Environment Configuration**

```typescript
// config/environment.ts
export const ENV = {
  DEVELOPMENT_MODE: false,        // ⬅️ SET TO FALSE
  PERSISTENCE_INTERVAL: 3000,     // ⬅️ SET TO 3000
  ENABLE_CACHING: true,           // ✅ Can stay true
  CACHE_DURATION: 30000,          // ✅ 30s-60s recommended
  UI_UPDATE_INTERVAL: 3000,       // ✅ Keep at 3000
};
```

**2. Upgrade Firebase Plan**

- Go to Firebase Console
- Upgrade to **Blaze (Pay as you go)**
- Set spending alerts (e.g., $5/month)
- Still has generous free tier

**3. Optional: Adjust Cache Duration**

For more real-time data:
```typescript
CACHE_DURATION: 30000, // 30 seconds (faster updates)
```

For better performance:
```typescript
CACHE_DURATION: 60000, // 60 seconds (more caching)
```

### Production Monitoring

**Monitor Firebase Usage**:
- Firebase Console → Usage tab
- Set up budget alerts
- Track read/write patterns

**Cost Estimates** (Blaze Plan):
- Reads: ~$0.06 per 100K
- Writes: ~$0.18 per 100K
- With 1 device, 3s intervals: ~$2-5/month

---

## Impact

### Development (Quota Saving Mode)

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Writes/day | 28,800 | 2,880 | **90%** |
| Reads/day (reports) | 5,000+ | 500-1,000 | **80%** |
| Quota usage | Over limit | Well within | ✅ |

### Production (Full Performance)

| Feature | Status |
|---------|--------|
| Real-time updates | 3-second intervals |
| Data persistence | 3-second intervals |
| Caching | Enabled (improves performance) |
| Historical data | Fully tracked |

---

## File Structure

```
capstone-nilm-app/
├── config/
│   └── environment.ts          ⬅️ Configuration (UPDATE FOR DEPLOYMENT)
├── utils/
│   └── cache.ts                ⬅️ Caching utility
├── services/
│   ├── realtimeDataService.ts  ⬅️ Uses ENV config
│   └── reportService.ts        ⬅️ Uses caching
├── scripts/
│   └── cleanupTestData.ts      ⬅️ Cleanup script
└── docs/
    └── FIREBASE-QUOTA-OPTIMIZATION.md  ⬅️ This file
```

---

## Testing

### Verify Development Mode

1. Start the app
2. Check logs for:
```
⚠️  Running in DEVELOPMENT MODE - Firebase writes reduced
💾 [DEV MODE] Saved reading (reduced frequency to save quota)
```

3. Firebase Console should show reduced writes

### Verify Caching

1. Navigate to Reports screen
2. Check logs for:
```
💾 Cache SET: daily-report:device123:user456:Mon Feb 02 2026
```

3. Navigate away and back
4. Check logs for:
```
💾 Cache HIT: daily-report:device123:user456:Mon Feb 02 2026 (age: 15s)
```

### Test Cleanup Script

1. Dry run first:
```bash
npm run cleanup-data
```

2. Review what would be deleted

3. Run live (if safe):
```bash
npm run cleanup-data -- --live --days 7
```

---

## FAQ

**Q: Will development mode affect my testing?**  
A: No. UI still updates every 3 seconds. You'll see real-time data, it just saves to Firebase less frequently.

**Q: Should I disable caching in production?**  
A: No. Caching improves performance and reduces costs. Keep it enabled.

**Q: How do I know my quota is okay?**  
A: Check Firebase Console → Usage. Should see green bars, not red.

**Q: Can I use this in production?**  
A: No. Set `DEVELOPMENT_MODE = false` before deployment for full real-time capability.

**Q: Will I lose data with the cleanup script?**  
A: Only old raw readings. Daily summaries preserve aggregated data. Always do a dry run first!

**Q: What if I forget to change DEVELOPMENT_MODE?**  
A: App will work but data won't be fully real-time (30s delay). Check logs on startup.

---

## Related Documentation

- `config/environment.ts` - Configuration file
- `utils/cache.ts` - Caching implementation
- `scripts/cleanupTestData.ts` - Cleanup script
- `CONSUMPTION-SUMMARIES-INTEGRATION.md` - Summary generation

---

**🚀 Remember: Set DEVELOPMENT_MODE = false before final deployment!**
