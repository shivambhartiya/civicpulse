import { CATEGORY_META } from '@/lib/constants/categories';
import type { Department, IssueCategory } from '@/lib/types/issue';
export function categorizeIssue(category: IssueCategory, severity: number): { department: Department; slaHours: number; escalationPriority: number } { const meta = CATEGORY_META[category] ?? CATEGORY_META.OTHER; return { department: meta.department, slaHours: meta.slaHours, escalationPriority: Math.ceil((severity / 10) * 3) }; }
