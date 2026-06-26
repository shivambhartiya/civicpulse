import { NextResponse } from 'next/server'; import { generateCivicInsights } from '@/lib/gemini/agents/insightsAgent'; import { mockIssues } from '@/lib/mock-data';
export async function POST() { return NextResponse.json(await generateCivicInsights(mockIssues)); }
