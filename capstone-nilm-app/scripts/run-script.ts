/**
 * Script Runner
 * Sets up Firebase for Node.js environment before running scripts
 */

// Override the firebase config module BEFORE any services load
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB2s6fo_goz-D-JT2sawhMTKTQqEHiHZt0",
  authDomain: "capstone-nilm-app.firebaseapp.com",
  projectId: "capstone-nilm-app",
  storageBucket: "capstone-nilm-app.firebasestorage.app",
  messagingSenderId: "223044937764",
  appId: "1:223044937764:android:d88b8bb6d9bb3f60a590b1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mock the firebase config module
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id: string) {
  if (id === '@/config/firebase' || id.includes('config/firebase')) {
    return { db, firestore: db, auth: null, storage: null };
  }
  return originalRequire.apply(this, arguments);
};

// Now run the actual script
const scriptPath = process.argv[2];
const scriptArgs = process.argv.slice(3);

if (!scriptPath) {
  console.error('Usage: tsx run-script.ts <script-path> [args...]');
  process.exit(1);
}

import(scriptPath).catch((error) => {
  console.error('Error running script:', error);
  process.exit(1);
});
