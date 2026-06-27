import { IssueCard } from '@/components/issues/IssueCard';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { listIssues } from '@/lib/local-data/store';

export const dynamic = 'force-dynamic';

export default async function IssuesPage() {
  const issues = await listIssues();
  return <PageWrapper title="Community issue queue" eyebrow="Transparent public ledger"><Tabs defaultValue="all"><TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="open">Open</TabsTrigger><TabsTrigger value="resolved">Resolved</TabsTrigger></TabsList><TabsContent value="all" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)}</TabsContent><TabsContent value="open" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{issues.filter((issue) => issue.status !== 'RESOLVED').map((issue) => <IssueCard key={issue.id} issue={issue} />)}</TabsContent><TabsContent value="resolved" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{issues.filter((issue) => issue.status === 'RESOLVED').map((issue) => <IssueCard key={issue.id} issue={issue} />)}</TabsContent></Tabs></PageWrapper>;
}
