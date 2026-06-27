import { mkdir } from 'node:fs/promises';
import path from 'node:path';

export function getDataDirectory() {
  return process.env.CIVICPULSE_DATA_DIR || path.join(process.cwd(), '.civicpulse-data');
}

export async function ensureDataDirectory() {
  const directory = getDataDirectory();
  await mkdir(directory, { recursive: true });
  return directory;
}

export async function getUploadsDirectory() {
  const directory = path.join(await ensureDataDirectory(), 'uploads');
  await mkdir(directory, { recursive: true });
  return directory;
}
