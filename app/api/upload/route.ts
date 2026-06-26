import { NextResponse } from 'next/server';
export async function POST() { return NextResponse.json({ uploadUrl: '/api/upload/demo-signed-url', publicUrl: 'https://storage.googleapis.com/civicpulse-uploads/demo.jpg', expiresIn: 900 }); }
