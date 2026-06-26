import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, hasFirebaseConfig } from './config';
import { mockIssues } from '@/lib/mock-data';
import type { Issue } from '@/lib/types/issue';
export async function listIssues(status?: string): Promise<Issue[]> { if (!hasFirebaseConfig || !db) return status ? mockIssues.filter((issue) => issue.status === status) : mockIssues; const constraints = status ? [where('status', '==', status), orderBy('reportedAt', 'desc'), limit(50)] : [orderBy('reportedAt', 'desc'), limit(50)]; const snap = await getDocs(query(collection(db, 'issues'), ...constraints)); return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Issue)); }
export async function getIssue(id: string): Promise<Issue | null> { if (!hasFirebaseConfig || !db) return mockIssues.find((issue) => issue.id === id) ?? mockIssues[0]; const snap = await getDoc(doc(db, 'issues', id)); return snap.exists() ? ({ id: snap.id, ...snap.data() } as Issue) : null; }
export async function createIssue(data: Omit<Issue, 'id'>) { if (!hasFirebaseConfig || !db) return { id: 'demo-' + Date.now(), ...data } as Issue; const ref = await addDoc(collection(db, 'issues'), { ...data, createdAt: serverTimestamp() }); return { id: ref.id, ...data } as Issue; }
export async function updateIssue(id: string, data: Partial<Issue>) { if (!hasFirebaseConfig || !db) return; await updateDoc(doc(db, 'issues', id), data); }
