'use client';

import { useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, Circle } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { mockHotspots } from '@/lib/mock-data';
import { useNearbyIssues } from '@/hooks/useNearbyIssues';
import { useMapStore } from '@/store/mapStore';
import type { Issue } from '@/lib/types/issue';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function LeafletIssueMap({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const issues = useNearbyIssues(center.lat, center.lng, 8);
  const [selected, setSelected] = useState<Issue | null>(null);
  const { showPredicted, togglePredicted } = useMapStore();

  return (
    <div className="relative h-[calc(100vh-9rem)] min-h-[520px] overflow-hidden rounded-lg border">
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showPredicted
          ? mockHotspots.map((hotspot) => (
              <Circle
                key={hotspot.id}
                center={[hotspot.lat, hotspot.lng]}
                radius={250 + hotspot.risk * 5}
                pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.18, weight: 1 }}
              />
            ))
          : null}
        {issues.map((issue) => (
          <Marker key={issue.id} position={[issue.location.lat, issue.location.lng]} icon={icon} eventHandlers={{ click: () => setSelected(issue) }}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{issue.title}</p>
                <p>{issue.location.address}</p>
                <a href={`/issues/${issue.id}`}>Open report</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="absolute right-4 top-4 z-[500]">
        <Button variant="secondary" onClick={togglePredicted}>
          {showPredicted ? 'Hide' : 'Show'} predicted hotspots
        </Button>
      </div>
      {selected ? (
        <div className="absolute bottom-4 left-4 z-[500] max-w-xs rounded-lg border bg-card p-3 text-sm shadow-lg">
          <p className="font-semibold">{selected.title}</p>
          <p className="text-muted-foreground">{selected.department}</p>
        </div>
      ) : null}
    </div>
  );
}
