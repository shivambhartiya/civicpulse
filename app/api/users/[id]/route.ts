import { NextResponse } from 'next/server'; import { mockUsers } from '@/lib/mock-data';
export async function GET(_: Request, { params }: { params: { id: string } }) { const user = mockUsers.find((u) => u.id === params.id); return user ? NextResponse.json({ user }) : NextResponse.json({ error: 'Not found' }, { status: 404 }); }
