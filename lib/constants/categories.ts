import type { Department, IssueCategory } from '@/lib/types/issue';

export const CATEGORY_META: Record<
  IssueCategory,
  { label: string; department: Department; color: string; slaHours: number }
> = {
  POTHOLE: { label: 'Pothole', department: 'Public Works', color: '#92400E', slaHours: 72 },
  WATER: { label: 'Water', department: 'Water Department', color: '#1D4ED8', slaHours: 24 },
  LIGHTING: { label: 'Lighting', department: 'Power & Lighting', color: '#D97706', slaHours: 48 },
  WASTE: { label: 'Waste', department: 'Sanitation', color: '#065F46', slaHours: 36 },
  ROAD: { label: 'Road Damage', department: 'Traffic', color: '#5B21B6', slaHours: 72 },
  BUILDING: { label: 'Building Safety', department: 'Building Safety', color: '#9F1239', slaHours: 12 },
  OTHER: { label: 'Other', department: 'Civic Response', color: '#4B5563', slaHours: 96 },
};

export const ISSUE_CATEGORIES = Object.keys(CATEGORY_META) as IssueCategory[];
