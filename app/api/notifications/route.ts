import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) { const body = await req.json(); return NextResponse.json({ queued: true, audience: body.audience ?? 'ward', message: body.message ?? 'CivicPulse update queued.' }); }
