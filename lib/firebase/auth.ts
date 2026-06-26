'use client';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './config';
function requireAuth() { if (!auth) throw new Error('Firebase Auth is not configured. Add NEXT_PUBLIC_FIREBASE_* values to enable live auth.'); return auth; }
export function signInWithGoogle() { return signInWithPopup(requireAuth(), new GoogleAuthProvider()); }
export function signInWithEmail(email: string, password: string) { return signInWithEmailAndPassword(requireAuth(), email, password); }
export function signUpWithEmail(email: string, password: string) { return createUserWithEmailAndPassword(requireAuth(), email, password); }
export function signOut() { return firebaseSignOut(requireAuth()); }
