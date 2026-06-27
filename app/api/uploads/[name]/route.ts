import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getUploadsDirectory } from '@/lib/local-data/paths';

export const runtime = 'nodejs';

const contentTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export async function GET(_: Request, { params }: { params: { name: string } }) {
  if (!/^[a-f0-9-]+\.(jpg|png|webp|gif)$/i.test(params.name)) {
    return NextResponse.json({ error: 'Invalid upload path.' }, { status: 400 });
  }
  try {
    const data = await readFile(path.join(await getUploadsDirectory(), params.name));
    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type': contentTypes[path.extname(params.name).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ error: 'Upload not found.' }, { status: 404 });
    }
    throw error;
  }
}
