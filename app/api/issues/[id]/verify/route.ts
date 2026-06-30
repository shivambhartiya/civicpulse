import { NextRequest, NextResponse } from 'next/server';
import { POINTS } from '@/lib/constants/scoring';
import { getRequestUser } from '@/lib/local-data/session';
import { getDemoUser, verifyIssue } from '@/lib/local-data/store';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = (await getRequestUser(request)) ?? (await getDemoUser());
  const issue = await verifyIssue(id, user.id);
  return issue
    ? NextResponse.json({ issue, verified: true, pointsAwarded: POINTS.verify, message: 'Community verification recorded.' })
    : NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
}
