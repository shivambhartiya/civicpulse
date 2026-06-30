import { IssueDetail } from '@/components/issues/IssueDetail'; import { PageWrapper } from '@/components/layout/PageWrapper'; import { getIssue } from '@/lib/local-data/store';
export const dynamic = 'force-dynamic';
export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const issue = await getIssue(id); return <PageWrapper title={issue?.title ?? 'Issue not found'} eyebrow="Issue detail">{issue ? <IssueDetail issue={issue} /> : <p>No issue found.</p>}</PageWrapper>; }
