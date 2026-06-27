import { IssueCard } from '@/components/issues/IssueCard';
import { listIssues } from '@/lib/local-data/store';

export async function RecentIssues() {
  const issues = (await listIssues()).slice(0, 4);
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)}</div>;
}
