import type { UserProfile } from '@/lib/types/user';

interface AuthResponse {
  user: UserProfile;
}

async function authRequest(path: string, body?: unknown): Promise<UserProfile> {
  const response = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = (await response.json()) as AuthResponse & { error?: string };
  if (!response.ok) throw new Error(result.error || 'Authentication failed.');
  return result.user;
}

export function getCurrentUser() {
  return authRequest('/api/auth/session');
}

export function signInWithEmail(email: string, password: string) {
  return authRequest('/api/auth/login', { email, password });
}

export function signUpWithEmail(input: {
  name: string;
  email: string;
  password: string;
  ward: string;
  phone?: string;
}) {
  return authRequest('/api/auth/signup', input);
}

export function signInAsDemo() {
  return authRequest('/api/auth/demo', {});
}

export async function signOutUser() {
  const response = await fetch('/api/auth/logout', { method: 'POST' });
  if (!response.ok) throw new Error('Could not sign out.');
}
