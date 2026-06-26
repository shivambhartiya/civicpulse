import { isPast } from 'date-fns';
import type { EscalationResult } from '@/lib/types/agents';
import type { Issue } from '@/lib/types/issue';
export async function runEscalationAgent(issues: Issue[]): Promise<EscalationResult[]> { return issues.filter((issue) => !['RESOLVED','CLOSED'].includes(issue.status) && isPast(new Date(issue.slaDeadline))).map((issue) => ({ issueId: issue.id, level: issue.escalationLevel + 1, notice: 'SLA breach detected for ' + issue.title + '. Escalating to ' + issue.department + ' supervisor.', nextAction: 'Dispatch field inspection and publish update within 6 hours.' })); }
