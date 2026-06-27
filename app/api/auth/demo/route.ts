import { NextResponse } from 'next/server';
import { getDemoUser } from '@/lib/local-data/store';
import { createSessionToken, setSessionCookie } from '@/lib/local-data/session';

export async function POST() {
  const user = await getDemoUser();
  const response = NextResponse.json({ user });
  setSessionCookie(response, await createSessionToken(user.id));
  return response;
}
