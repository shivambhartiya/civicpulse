import { IssueDetail } from '@/components/issues/IssueDetail'; import { PageWrapper } from '@/components/layout/PageWrapper'; import { getIssue } from '@/lib/local-data/store';
export const dynamic = 'force-dynamic';
export default async function IssuePage({ params }: { params: { id: string } }) { const issue = await getIssue(params.id); return <PageWrapper title={issue?.title ?? 'Issue not found'} eyebrow="Issue detail">{issue ? <IssueDetail issue={issue} /> : <p>No issue found.</p>}</PageWrapper>; }
