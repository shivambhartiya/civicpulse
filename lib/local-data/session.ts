import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { NextRequest, NextResponse } from 'next/server';
import type { UserProfile } from '@/lib/types/user';
import { ensureDataDirectory } from './paths';
import { getUser } from './store';

export const SESSION_COOKIE = 'civicpulse_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;

interface SessionPayload {
  userId: string;
  expiresAt: number;
}

let secretPromise: Promise<string> | null = null;

async function getSessionSecret() {
  if (process.env.APP_SECRET) return process.env.APP_SECRET;
  if (!secretPromise) {
    secretPromise = (async () => {
      const file = path.join(await ensureDataDirectory(), '.session-secret');
      try {
        return (await readFile(file, 'utf8')).trim();
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
        const generated = randomBytes(48).toString('base64url');
        try {
          await writeFile(file, generated, { encoding: 'utf8', flag: 'wx' });
          return generated;
        } catch (writeError) {
          if ((writeError as NodeJS.ErrnoException).code !== 'EEXIST') throw writeError;
          return (await readFile(file, 'utf8')).trim();
        }
      }
    })();
  }
  return secretPromise;
}

async function signature(payload: string) {
  return createHmac('sha256', await getSessionSecret()).update(payload).digest('base64url');
}

export async function createSessionToken(userId: string) {
  const payload: SessionPayload = {
    userId,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${await signature(encoded)}`;
}

async function readSessionToken(token?: string): Promise<SessionPayload | null> {
  if (!token) return null;
  const [encoded, suppliedSignature] = token.split('.');
  if (!encoded || !suppliedSignature) return null;
  const expectedSignature = await signature(encoded);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.userId || payload.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getRequestUser(request: NextRequest): Promise<UserProfile | null> {
  const payload = await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  return payload ? getUser(payload.userId) : null;
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DURATION_SECONDS,
    path: '/',
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/',
  });
}
