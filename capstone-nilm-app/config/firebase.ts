import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
// IMPORTANT: Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2s6fo_goz-D-JT2sawhMTKTQqEHiHZt0",
  authDomain: "capstone-nilm-app.firebaseapp.com",
  projectId: "capstone-nilm-app",
  storageBucket: "capstone-nilm-app.firebasestorage.app",
  messagingSenderId: "223044937764",
  appId: "1:223044937764:android:d88b8bb6d9bb3f60a590b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);

// Initialize Auth with AsyncStorage persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const storage = getStorage(app);

export default app;
