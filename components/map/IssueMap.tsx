'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const LeafletIssueMap = dynamic(() => import('./LeafletIssueMap').then((mod) => mod.LeafletIssueMap), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[520px] place-items-center rounded-lg border bg-card">
      <LoadingSpinner label="Loading map" />
    </div>
  )
});

export function IssueMap({ center = { lat: 12.9716, lng: 77.5946 }, zoom = 13 }: { center?: { lat: number; lng: number }; zoom?: number }) {
  return <LeafletIssueMap center={center} zoom={zoom} />;
}
