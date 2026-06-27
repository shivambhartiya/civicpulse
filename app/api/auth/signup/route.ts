import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUserAccount } from '@/lib/local-data/store';
import { createSessionToken, setSessionCookie } from '@/lib/local-data/session';

const SignupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  ward: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(30).optional(),
});

export async function POST(request: NextRequest) {
  const parsed = SignupSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check your details. Passwords need at least 8 characters.' }, { status: 400 });
  }
  try {
    const user = await createUserAccount(parsed.data);
    const response = NextResponse.json({ user }, { status: 201 });
    setSessionCookie(response, await createSessionToken(user.id));
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not create account.' },
      { status: 409 },
    );
  }
}
