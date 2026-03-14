'use client';

import type { FirebaseApp } from 'firebase/app';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator, 
  setPersistence, 
  browserLocalPersistence,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  Firestore
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';

// Firebase configuration for Provincial Safety Dashboard
const firebaseConfig = {
  apiKey: "AIzaSyDXB6eNiNJEU0RdGTwMSwWSBXiJ8kWiNOk",
  authDomain: "provincial-safety-dashboard.firebaseapp.com",
  projectId: "provincial-safety-dashboard",
  storageBucket: "provincial-safety-dashboard.firebasestorage.app",
  messagingSenderId: "782632363879",
  appId: "1:782632363879:web:f9758ef4c5b274a601b1c2",
  measurementId: "G-DTN0SVCZES",
};

// Initialize Firebase (only once)
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : (getApps()[0] as FirebaseApp);

// Initialize Auth
export const auth: Auth = getAuth(app);

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence).catch((error: Error) => {
  console.warn('Failed to set persistence:', error);
});

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Enable offline persistence for Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err: unknown) => {
    if (err && typeof err === 'object' && 'code' in err) {
      const errCode = (err as any).code;
      if (errCode === 'failed-precondition') {
        console.log('Multiple tabs open, persistence disabled');
      } else if (errCode === 'unimplemented') {
        console.log('Browser does not support persistence');
      }
    }
  });
}

// Initialize Storage
export const storage: FirebaseStorage = getStorage(app);

// Connect to emulators in development
if (typeof window !== 'undefined') {
  const isDev = process.env.NODE_ENV === 'development';
  const isVercel = window.location.hostname.includes('vercel');
  
  if (isDev && !isVercel) {
    const localEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST ?? 'localhost:9099';
    const [host] = localEmulatorHost.split(':');
    
    // Check if already connected to avoid re-connection
    try {
      if ((auth as any).emulatorConfig === null) {
        connectAuthEmulator(auth, `http://${host}:9099`, {
          disableWarnings: true,
        });
      }
    } catch (error) {
      // Emulator already connected or not available
    }

    try {
      if (!(db as any)._settingsFrozen) {
        connectFirestoreEmulator(db, host, 8080);
      }
    } catch (error) {
      // Emulator already connected or not available
    }

    try {
      connectStorageEmulator(storage, host, 9199);
    } catch (error) {
      // Emulator already connected or not available
    }
  }
}

export default app;
