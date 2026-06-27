import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/local-data/session';
import { getDemoUser, verifyIssue } from '@/lib/local-data/store';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = (await getRequestUser(request)) ?? (await getDemoUser());
  const issue = await verifyIssue(params.id, user.id);
  return issue
    ? NextResponse.json({ issue, verified: true, pointsAwarded: 10, message: 'Community verification recorded.' })
    : NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
}
