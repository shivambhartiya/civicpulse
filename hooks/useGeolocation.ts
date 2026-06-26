'use client';
import { useCallback, useState } from 'react';
import { getBrowserPosition } from '@/lib/utils/geolocation';
export function useGeolocation() { const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null); const [error, setError] = useState<string | null>(null); const locate = useCallback(async () => { try { const pos = await getBrowserPosition(); setPosition(pos); return pos; } catch (err) { setError(err instanceof Error ? err.message : 'Unable to locate'); return null; } }, []); return { position, error, locate }; }
