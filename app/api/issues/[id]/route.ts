import { NextRequest, NextResponse } from 'next/server'; import { getIssue, updateIssue } from '@/lib/firebase/firestore';
export async function GET(_: NextRequest, { params }: { params: { id: string } }) { const issue = await getIssue(params.id); return issue ? NextResponse.json({ issue }) : NextResponse.json({ error: 'Not found' }, { status: 404 }); }
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) { const body = await req.json(); await updateIssue(params.id, body); return NextResponse.json({ ok: true }); }
export async function DELETE() { return NextResponse.json({ error: 'Issues are never deleted; close them instead.' }, { status: 405 }); }
