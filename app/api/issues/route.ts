import { NextRequest, NextResponse } from 'next/server';
import * as geofire from 'geofire-common';
import { checkForDuplicates } from '@/lib/gemini/agents/duplicateAgent';
import { POINTS } from '@/lib/constants/scoring';
import { getRequestUser } from '@/lib/local-data/session';
import { createIssue, getDemoUser, listIssues } from '@/lib/local-data/store';
import type { IssueAIAnalysis } from '@/lib/types/issue';
import { calculateSLADeadline } from '@/lib/utils/scoring';
import { IssueCreateSchema } from '@/lib/utils/validation';

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status') ?? undefined;
  return NextResponse.json({ issues: await listIssues(status) });
}

export async function POST(request: NextRequest) {
  const parsed = IssueCreateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const input = parsed.data;
  const aiAnalysis: IssueAIAnalysis = input.aiAnalysis ?? {
    isIssue: true,
    confidence: 0.5,
    suggestedTitle: input.title,
    suggestedDescription: input.description,
    suggestedCategory: input.category,
    suggestedSubcategory: input.subcategory || 'General',
    suggestedDepartment: 'Civic Response',
    suggestedSeverity: input.severity,
    detectedObjects: [],
    safetyAssessment: input.severity >= 8 ? 'high' : input.severity >= 5 ? 'medium' : 'low',
    reasoning: 'Created from the submitted report details.',
  };
  const currentIssues = await listIssues();
  const duplicate = await checkForDuplicates(
    { title: input.title, description: input.description, category: input.category, location: input.location },
    currentIssues,
  );
  const user = (await getRequestUser(request)) ?? (await getDemoUser());
  const issue = await createIssue({
    title: input.title,
    description: input.description,
    category: input.category,
    subcategory: input.subcategory,
    severity: input.severity,
    images: input.images,
    thumbnailUrl: input.images[0] || 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=600&q=80',
    location: { ...input.location, geohash: geofire.geohashForLocation([input.location.lat, input.location.lng]) },
    status: duplicate.isDuplicate ? 'VERIFIED' : 'REPORTED',
    statusHistory: [{
      status: 'REPORTED',
      at: new Date().toISOString(),
      by: user.name,
      note: duplicate.isDuplicate ? 'Merged with likely duplicate signal.' : 'AI routed report.',
    }],
    assignedTo: null,
    department: aiAnalysis.suggestedDepartment,
    slaDeadline: calculateSLADeadline(input.category, input.severity),
    escalationLevel: 0,
    reportedBy: user.id,
    reportedByName: user.name,
    reportedAt: new Date().toISOString(),
    verifiedBy: [],
    verificationCount: 0,
    upvotes: 0,
    upvotedBy: [],
    comments: [],
    aiAnalysis,
    duplicateOf: duplicate.duplicateIssueId ?? null,
  });

  return NextResponse.json({ issue, duplicate, pointsAwarded: POINTS.report }, { status: 201 });
}
