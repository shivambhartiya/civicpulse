import type { Issue, IssueAIAnalysis } from './issue';
import type { CivicInsight, HotspotPrediction } from './analytics';
export type ImageAnalysisResult = IssueAIAnalysis;
export interface DuplicateResult { isDuplicate: boolean; duplicateIssueId?: string; confidence: number; reasoning: string; }
export interface EscalationResult { issueId: string; level: number; notice: string; nextAction: string; }
export type InsightsAgentResult = CivicInsight;
export interface ChatAgentResult { answer: string; relatedIssues: Issue[]; suggestedActions: string[]; }
export type HotspotAgentResult = HotspotPrediction[];
