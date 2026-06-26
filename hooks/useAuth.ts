'use client';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuthStore } from '@/store/authStore';
import { mockUsers } from '@/lib/mock-data';
export function useAuth() { const state = useAuthStore(); useEffect(() => { if (!auth) { state.setUser(mockUsers[0]); return; } return onAuthStateChanged(auth, (user) => state.setUser(user ? { id: user.uid, name: user.displayName || 'Civic user', email: user.email || '', ward: 'Ward 12', role: 'citizen', points: 0, level: 1, badges: [], reportsFiled: 0, verifications: 0, resolvedHelp: 0 } : null)); }, []); return state; }
