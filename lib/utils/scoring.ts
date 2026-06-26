import { addHours } from 'date-fns';
import { CATEGORY_META } from '@/lib/constants/categories';
import { LEVELS, POINTS } from '@/lib/constants/scoring';
import type { IssueCategory } from '@/lib/types/issue';
export function calculateSLADeadline(category: IssueCategory, severity: number, from = new Date()) { const base = CATEGORY_META[category]?.slaHours ?? 72; const multiplier = severity >= 8 ? 0.5 : severity >= 6 ? 0.75 : 1; return addHours(from, Math.max(4, Math.round(base * multiplier))).toISOString(); }
export function pointsFor(action: keyof typeof POINTS) { return POINTS[action]; }
export function levelFor(points: number) { return LEVELS.reduce((level, threshold, index) => (points >= threshold ? index + 1 : level), 1); }
