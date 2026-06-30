import { NextResponse } from 'next/server';
import { getUser } from '@/lib/local-data/store';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);
  return user ? NextResponse.json({ user }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}
