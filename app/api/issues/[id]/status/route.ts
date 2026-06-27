import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/local-data/session';
import { getDemoUser, setIssueStatus } from '@/lib/local-data/store';
import { StatusUpdateSchema } from '@/lib/utils/validation';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const parsed = StatusUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const user = (await getRequestUser(request)) ?? (await getDemoUser());
  const issue = await setIssueStatus(
    params.id,
    parsed.data.status,
    parsed.data.note ?? 'Status updated by authority.',
    user.name,
  );
  return issue ? NextResponse.json({ issue }) : NextResponse.json({ error: 'Issue not found.' }, { status: 404 });
}
