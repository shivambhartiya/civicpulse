import type { IssueStatus } from '@/lib/types/issue';

export const ISSUE_STATUS_ORDER: IssueStatus[] = [
  'REPORTED',
  'VERIFIED',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
];

export const STATUS_META: Record<IssueStatus, { label: string; color: string; ring: number }> = {
  REPORTED: { label: 'Reported', color: '#6366F1', ring: 2 },
  VERIFIED: { label: 'Verified', color: '#F59E0B', ring: 3 },
  ASSIGNED: { label: 'Assigned', color: '#3B82F6', ring: 3 },
  IN_PROGRESS: { label: 'In Progress', color: '#8B5CF6', ring: 4 },
  RESOLVED: { label: 'Resolved', color: '#10B981', ring: 1 },
  CLOSED: { label: 'Closed', color: '#6B7280', ring: 1 },
};
