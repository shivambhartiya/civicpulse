import { mockInsight, mockHotspots } from '@/lib/mock-data';
import type { CivicInsight, HotspotPrediction } from '@/lib/types/analytics';
import type { Issue } from '@/lib/types/issue';
export async function generateCivicInsights(issues: Issue[]): Promise<CivicInsight> { const highSeverity = issues.filter((issue) => issue.severity >= 7).length; return { ...mockInsight, summary: highSeverity + " high-severity reports are driving this week's routing priorities. " + mockInsight.summary, generatedAt: new Date().toISOString() }; }
export async function predictHotspots(): Promise<HotspotPrediction[]> { return mockHotspots; }
