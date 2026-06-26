'use client';
import { useMemo } from 'react';
import { useIssues } from './useIssues';
import { distanceKm } from '@/lib/utils/geolocation';
export function useNearbyIssues(lat: number, lng: number, radiusKm = 2) { const { issues } = useIssues(); return useMemo(() => issues.filter((issue) => distanceKm({ lat, lng }, issue.location) <= radiusKm), [issues, lat, lng, radiusKm]); }
