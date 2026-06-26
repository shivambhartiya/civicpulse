import { NextResponse } from 'next/server'; import { predictHotspots } from '@/lib/gemini/agents/insightsAgent';
export async function GET() { return NextResponse.json({ hotspots: await predictHotspots() }); }
