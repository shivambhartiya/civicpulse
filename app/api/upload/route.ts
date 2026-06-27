import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { getUploadsDirectory } from '@/lib/local-data/paths';

export const runtime = 'nodejs';

const imageTypes: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const image = form.get('image');
  if (!(image instanceof File)) return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 });
  const extension = imageTypes[image.type];
  if (!extension) return NextResponse.json({ error: 'Use a JPEG, PNG, WebP, or GIF image.' }, { status: 415 });
  if (image.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Images must be smaller than 10 MB.' }, { status: 413 });

  const fileName = `${randomUUID()}${extension}`;
  await writeFile(path.join(await getUploadsDirectory(), fileName), Buffer.from(await image.arrayBuffer()));
  return NextResponse.json({ publicUrl: `/api/uploads/${fileName}` }, { status: 201 });
}
