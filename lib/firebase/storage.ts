import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { hasFirebaseConfig, storage } from './config';
export async function uploadIssuePhoto(file: File, issueId = 'draft') { if (!hasFirebaseConfig || !storage) return URL.createObjectURL(file); const storageRef = ref(storage, 'issues/' + issueId + '/' + Date.now() + '-' + file.name); await uploadBytes(storageRef, file); return getDownloadURL(storageRef); }
