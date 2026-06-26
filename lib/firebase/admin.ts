import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { getStorage } from 'firebase-admin/storage';
function privateKey() { return process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'); }
export function hasAdminConfig() { return Boolean(process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && privateKey()); }
export function getAdminApp() { if (getApps().length) return getApps()[0]; if (!hasAdminConfig()) return null; return initializeApp({ credential: cert({ projectId: process.env.FIREBASE_ADMIN_PROJECT_ID, clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL, privateKey: privateKey() }), storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }); }
export function getAdminDb() { const app = getAdminApp(); return app ? getFirestore(app) : null; }
export function getAdminMessaging() { const app = getAdminApp(); return app ? getMessaging(app) : null; }
export function getAdminStorage() { const app = getAdminApp(); return app ? getStorage(app) : null; }
