'use client';

import { useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpRight, AlertTriangle } from 'lucide-react';

// Category color mapping. Includes current app enums and production aliases.
const CATEGORY_COLORS: Record<string, string> = {
  POTHOLE:      '#92400E',
  ROAD:         '#5B21B6',
  WATER_LEAK:   '#1D4ED8',
  WATER:        '#1D4ED8',
  STREETLIGHT:  '#D97706',
  LIGHTING:     '#D97706',
  WASTE:        '#065F46',
  ROAD_DAMAGE:  '#5B21B6',
  BUILDING:     '#9F1239',
  FLOODING:     '#1E40AF',
  SEWAGE:       '#065F46',
  OTHER:        '#4B5563',
};

// Status border width
const STATUS_RING: Record<string, number> = {
  REPORTED:    2,
  VERIFIED:    3,
  ASSIGNED:    3,
  IN_PROGRESS: 4,
  RESOLVED:    1,
  CLOSED:      1,
};

const STATUS_LABEL: Record<string, string> = {
  REPORTED:    'Reported',
  VERIFIED:    'Verified',
  ASSIGNED:    'Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED:    'Resolved',
  CLOSED:      'Closed',
};

const STATUS_COLOR: Record<string, string> = {
  REPORTED:    '#6366F1',
  VERIFIED:    '#F59E0B',
  ASSIGNED:    '#3B82F6',
  IN_PROGRESS: '#8B5CF6',
  RESOLVED:    '#10B981',
  CLOSED:      '#6B7280',
};

interface MapIssue {
  id: string;
  title: string;
  category: string;
  status: string;
  severity: number;
  location: { lat: number; lng: number; address: string };
  reportedAt: Date;
  verificationCount: number;
  thumbnailUrl?: string;
}

interface IssueMapProps {
  issues: MapIssue[];
  center: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (issue: MapIssue) => void;
}

// Custom SVG pin
function IssuePin({ issue, isSelected }: { issue: MapIssue; isSelected: boolean }) {
  const color = CATEGORY_COLORS[issue.category] ?? '#4B5563';
  const ring = STATUS_RING[issue.status] ?? 2;
  const size = isSelected ? 38 : issue.severity >= 8 ? 34 : 28;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        cursor: 'pointer',
        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform 0.15s ease',
      }}
    >
      {/* Pulse ring for critical issues */}
      {issue.severity >= 8 && (
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            opacity: 0.4,
            animation: 'ping 1.5s cubic-bezier(0,0,.2,1) infinite',
          }}
        />
      )}
      {/* Main pin */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: color,
          border: `${ring}px solid white`,
          boxShadow: `0 2px 8px rgba(0,0,0,0.3), 0 0 0 ${ring}px ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: size < 32 ? '10px' : '12px',
          fontWeight: '700',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {issue.severity}
      </div>
    </div>
  );
}

// Info popup
function IssuePopup({ issue, onClose }: { issue: MapIssue; onClose: () => void }) {
  const statusColor = STATUS_COLOR[issue.status] ?? '#6B7280';
  const catColor = CATEGORY_COLORS[issue.category] ?? '#4B5563';

  return (
    <InfoWindow
      position={{ lat: issue.location.lat, lng: issue.location.lng }}
      onCloseClick={onClose}
      pixelOffset={[0, -20]}
    >
      <div
        style={{
          width: 260,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 13,
          color: '#1E293B',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {/* Category header strip */}
        <div
          style={{
            background: catColor,
            padding: '8px 12px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <span>{issue.category.replace('_', ' ')}</span>
          <span
            style={{
              background: 'rgba(255,255,255,0.25)',
              padding: '2px 8px',
              borderRadius: 9999,
              fontSize: 11,
            }}
          >
            {issue.severity}/10
          </span>
        </div>

        <div style={{ padding: '10px 12px 12px' }}>
          {/* Title */}
          <p
            style={{
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 6,
              lineHeight: 1.3,
              color: '#0F172A',
            }}
          >
            {issue.title}
          </p>

          {/* Address */}
          <p style={{ color: '#64748B', fontSize: 12, marginBottom: 8 }}>
            {issue.location.address}
          </p>

          {/* Status + verifications */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                background: `${statusColor}18`,
                color: statusColor,
                padding: '2px 8px',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {STATUS_LABEL[issue.status]}
            </span>
            <span style={{ color: '#94A3B8', fontSize: 12 }}>
              {issue.verificationCount} verifications
            </span>
          </div>

          {/* Time + link */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#94A3B8', fontSize: 11 }}>
              {formatDistanceToNow(issue.reportedAt, { addSuffix: true })}
            </span>
            <a
              href={`/issues/${issue.id}`}
              style={{
                color: '#F97316',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                textDecoration: 'none',
              }}
            >
              View details
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </InfoWindow>
  );
}

// Main map component
export function IssueMap({
  issues,
  center,
  zoom = 14,
  height = '100%',
  onMarkerClick,
}: IssueMapProps) {
  const [selectedIssue, setSelectedIssue] = useState<MapIssue | null>(null);

  const handleMarkerClick = useCallback(
    (issue: MapIssue) => {
      setSelectedIssue(prev => (prev?.id === issue.id ? null : issue));
      onMarkerClick?.(issue);
    },
    [onMarkerClick]
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID;

  if (!apiKey) {
    return (
      <div
        style={{ height, background: '#F1F5F9' }}
        className="flex items-center justify-center rounded-lg border border-border"
      >
        <div className="text-center text-muted-foreground p-6">
          <AlertTriangle className="mx-auto mb-2 text-amber-500" size={24} />
          <p className="text-sm font-medium">Google Maps API key not configured</p>
          <p className="text-xs mt-1">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId={mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{ width: '100%', height }}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        {issues.map(issue => (
          <AdvancedMarker
            key={issue.id}
            position={{ lat: issue.location.lat, lng: issue.location.lng }}
            onClick={() => handleMarkerClick(issue)}
            zIndex={selectedIssue?.id === issue.id ? 100 : issue.severity}
          >
            <IssuePin
              issue={issue}
              isSelected={selectedIssue?.id === issue.id}
            />
          </AdvancedMarker>
        ))}

        {selectedIssue && (
          <IssuePopup
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
          />
        )}
      </Map>
    </APIProvider>
  );
}
