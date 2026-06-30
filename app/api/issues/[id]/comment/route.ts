import { NextRequest, NextResponse } from 'next/server';
import { POINTS } from '@/lib/constants/scoring';
import { getRequestUser } from '@/lib/local-data/session';
import { addIssueComment, getDemoUser } from '@/lib/local-data/store';
import { CommentSchema } from '@/lib/utils/validation';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = CommentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const user = (await getRequestUser(request)) ?? (await getDemoUser());
  const comment = await addIssueComment(id, user, parsed.data.body);
  return comment
    ? NextResponse.json({ issueId: id, comment, pointsAwarded: POINTS.comment })
    : NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
}
