import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateUser } from '@/lib/local-data/store';
import { createSessionToken, setSessionCookie } from '@/lib/local-data/session';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const parsed = LoginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid email and password.' }, { status: 400 });
  }
  const user = await authenticateUser(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
  }
  const response = NextResponse.json({ user });
  setSessionCookie(response, await createSessionToken(user.id));
  return response;
}
