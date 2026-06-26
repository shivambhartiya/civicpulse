import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { connectStorageEmulator, getStorage, type FirebaseStorage } from 'firebase/storage';
const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (useEmulators ? 'demo-key' : undefined),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (useEmulators ? 'demo-civicpulse.firebaseapp.com' : undefined),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (useEmulators ? 'demo-civicpulse' : undefined),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (useEmulators ? 'demo-civicpulse.appspot.com' : undefined),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (useEmulators ? '000000000000' : undefined),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || (useEmulators ? '1:000000000000:web:demo' : undefined),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
export const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
export const app: FirebaseApp | null = hasFirebaseConfig ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig as Record<string, string>)) : null;
export const auth: Auth | null = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;
if (typeof window !== 'undefined' && useEmulators && auth && db && storage && !('__civicpulseEmulatorsConnected' in window)) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  Object.defineProperty(window, '__civicpulseEmulatorsConnected', { value: true });
}
if (typeof window !== 'undefined' && hasFirebaseConfig && db) { enableIndexedDbPersistence(db).catch(() => undefined); }
export async function initAnalytics() { return typeof window !== 'undefined' && hasFirebaseConfig && app && (await isSupported()) ? getAnalytics(app) : null; }
