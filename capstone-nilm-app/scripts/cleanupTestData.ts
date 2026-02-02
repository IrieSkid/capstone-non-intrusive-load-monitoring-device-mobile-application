/**
 * Cleanup Test Data Script
 * Removes old test data from Firestore to free up quota
 * 
 * ⚠️ USAGE:
 * npm run cleanup-data
 * 
 * ⚠️ WARNING:
 * This script deletes data. Use with caution!
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';

// Firebase configuration (same as in firebase.ts)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

interface CleanupOptions {
  dryRun?: boolean;
  daysToKeep?: number;
  collections?: string[];
}

/**
 * Main cleanup function
 */
async function cleanupTestData(options: CleanupOptions = {}) {
  const {
    dryRun = true,
    daysToKeep = 7,
    collections = ['realTimeReadings', 'consumptionSummaries']
  } = options;

  console.log('\n🧹 Firebase Cleanup Script');
  console.log('==========================');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no deletion)' : 'LIVE (will delete data)'}`);
  console.log(`Days to keep: ${daysToKeep}`);
  console.log(`Collections: ${collections.join(', ')}`);
  console.log('');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  console.log(`Cutoff date: ${cutoffDate.toISOString()}`);
  console.log('');

  let totalDeleted = 0;

  for (const collectionName of collections) {
    const count = await cleanupCollection(collectionName, cutoffDate, dryRun);
    totalDeleted += count;
  }

  console.log('\n==========================');
  console.log(`Total documents ${dryRun ? 'to delete' : 'deleted'}: ${totalDeleted}`);
  
  if (dryRun) {
    console.log('\n⚠️  This was a DRY RUN. No data was deleted.');
    console.log('Run with --live to actually delete data.');
  } else {
    console.log('\n✅ Cleanup complete!');
  }
}

/**
 * Cleanup a specific collection
 */
async function cleanupCollection(
  collectionName: string,
  cutoffDate: Date,
  dryRun: boolean
): Promise<number> {
  console.log(`\n📂 Processing collection: ${collectionName}`);
  
  try {
    const q = query(
      collection(firestore, collectionName),
      where('timestamp', '<', Timestamp.fromDate(cutoffDate)),
      orderBy('timestamp', 'asc')
    );

    const snapshot = await getDocs(q);
    console.log(`   Found ${snapshot.size} documents to delete`);

    if (snapshot.empty) {
      return 0;
    }

    if (dryRun) {
      // Just count
      return snapshot.size;
    }

    // Delete documents in batches
    let deleted = 0;
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(doc(firestore, collectionName, docSnapshot.id));
      deleted++;
      
      if (deleted % 100 === 0) {
        console.log(`   Deleted ${deleted}/${snapshot.size}...`);
      }
    }

    console.log(`   ✅ Deleted ${deleted} documents from ${collectionName}`);
    return deleted;
  } catch (error) {
    console.error(`   ❌ Error cleaning ${collectionName}:`, error);
    return 0;
  }
}

/**
 * Keep only the last N documents
 */
async function keepLastN(collectionName: string, keepCount: number, dryRun: boolean) {
  console.log(`\n📂 Keeping last ${keepCount} documents in: ${collectionName}`);
  
  try {
    // Get total count
    const allDocs = await getDocs(collection(firestore, collectionName));
    const totalCount = allDocs.size;
    
    if (totalCount <= keepCount) {
      console.log(`   No cleanup needed (${totalCount} <= ${keepCount})`);
      return 0;
    }

    const deleteCount = totalCount - keepCount;
    console.log(`   Will delete ${deleteCount} old documents`);

    if (dryRun) {
      return deleteCount;
    }

    // Get oldest documents
    const q = query(
      collection(firestore, collectionName),
      orderBy('timestamp', 'asc'),
      limit(deleteCount)
    );

    const snapshot = await getDocs(q);
    
    let deleted = 0;
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(doc(firestore, collectionName, docSnapshot.id));
      deleted++;
      
      if (deleted % 100 === 0) {
        console.log(`   Deleted ${deleted}/${deleteCount}...`);
      }
    }

    console.log(`   ✅ Deleted ${deleted} documents from ${collectionName}`);
    return deleted;
  } catch (error) {
    console.error(`   ❌ Error cleaning ${collectionName}:`, error);
    return 0;
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): CleanupOptions {
  const args = process.argv.slice(2);
  const options: CleanupOptions = {
    dryRun: true,
    daysToKeep: 7,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--live') {
      options.dryRun = false;
    } else if (arg === '--days' && i + 1 < args.length) {
      options.daysToKeep = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === '--collections' && i + 1 < args.length) {
      options.collections = args[i + 1].split(',');
      i++;
    }
  }

  return options;
}

// Run the script
const options = parseArgs();
cleanupTestData(options)
  .then(() => {
    console.log('\n👋 Goodbye!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

/**
 * USAGE EXAMPLES:
 * 
 * 1. Dry run (preview what would be deleted):
 *    npm run cleanup-data
 * 
 * 2. Delete data older than 7 days:
 *    npm run cleanup-data -- --live
 * 
 * 3. Delete data older than 30 days:
 *    npm run cleanup-data -- --live --days 30
 * 
 * 4. Clean specific collections:
 *    npm run cleanup-data -- --live --collections realTimeReadings,consumptionSummaries
 * 
 * 5. Clean only realTimeReadings:
 *    npm run cleanup-data -- --live --collections realTimeReadings --days 3
 */
