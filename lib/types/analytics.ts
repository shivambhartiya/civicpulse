import type { IssueCategory } from './issue';
export interface CategoryMetric { category: IssueCategory; count: number; fill: string; }
export interface TrendMetric { date: string; reported: number; resolved: number; }
export interface HotspotPrediction { id: string; lat: number; lng: number; ward: string; category: IssueCategory; risk: number; explanation: string; }
export interface CivicInsight { id: string; title: string; summary: string; recommendations: string[]; generatedAt: string; confidence: number; hotspots: HotspotPrediction[]; }
