import { NextResponse } from 'next/server';
import { getUser } from '@/lib/local-data/store';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  return user ? NextResponse.json({ user }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}
