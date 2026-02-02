/**
 * Firebase Server Configuration
 * For use in Node.js scripts (no React Native dependencies)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2s6fo_goz-D-JT2sawhMTKTQqEHiHZt0",
  authDomain: "capstone-nilm-app.firebaseapp.com",
  projectId: "capstone-nilm-app",
  storageBucket: "capstone-nilm-app.firebasestorage.app",
  messagingSenderId: "223044937764",
  appId: "1:223044937764:android:d88b8bb6d9bb3f60a590b1"
};

// Initialize Firebase (server-side, no AsyncStorage)
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const firestore = db; // Alias for compatibility

// Initialize Auth (without React Native persistence)
export const auth = getAuth(app);

export const storage = getStorage(app);

export default app;
