import { NextRequest, NextResponse } from 'next/server';
import { getIssue, updateIssue } from '@/lib/local-data/store';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issue = await getIssue(id);
  return issue ? NextResponse.json({ issue }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issue = await updateIssue(id, await request.json());
  return issue ? NextResponse.json({ issue }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Issues are never deleted; close them instead.' }, { status: 405 });
}
