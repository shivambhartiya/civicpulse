'use client';
import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { mockIssues } from '@/lib/mock-data';
import type { Issue } from '@/lib/types/issue';
export function useIssues() { const [issues, setIssues] = useState<Issue[]>(mockIssues); const [loading, setLoading] = useState(false); useEffect(() => { if (!db) return; setLoading(true); return onSnapshot(query(collection(db, 'issues'), orderBy('reportedAt', 'desc'), limit(50)), (snap) => { setIssues(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Issue))); setLoading(false); }, () => setLoading(false)); }, []); return { issues, loading }; }
