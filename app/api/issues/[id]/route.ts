import { NextRequest, NextResponse } from 'next/server';
import { getIssue, updateIssue } from '@/lib/local-data/store';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const issue = await getIssue(params.id);
  return issue ? NextResponse.json({ issue }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const issue = await updateIssue(params.id, await request.json());
  return issue ? NextResponse.json({ issue }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Issues are never deleted; close them instead.' }, { status: 405 });
}
