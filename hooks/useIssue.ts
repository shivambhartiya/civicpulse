'use client';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '@/lib/firebase/config';
import { mockIssues } from '@/lib/mock-data';
import type { Issue } from '@/lib/types/issue';
export function useIssue(issueId: string) { const [issue, setIssue] = useState<Issue | null>(mockIssues.find((i) => i.id === issueId) ?? mockIssues[0]); const [loading, setLoading] = useState(false); const [error, setError] = useState<Error | null>(null); useEffect(() => { if (!hasFirebaseConfig || !db || !issueId) return; setLoading(true); return onSnapshot(doc(db, 'issues', issueId), (snap) => { setIssue(snap.exists() ? ({ id: snap.id, ...snap.data() } as Issue) : null); setLoading(false); }, (err) => { setError(err); setLoading(false); }); }, [issueId]); return { issue, loading, error }; }
