import { IssueCard } from '@/components/issues/IssueCard'; import { mockIssues } from '@/lib/mock-data';
export function RecentIssues() { return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{mockIssues.map((issue) => <IssueCard key={issue.id} issue={issue} />)}</div>; }
