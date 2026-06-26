import { IssueForm } from '@/components/issues/IssueForm'; import { PageWrapper } from '@/components/layout/PageWrapper';
export default function ReportPage() { return <PageWrapper title="Report a civic issue" eyebrow="AI-assisted submission"><div className="mx-auto w-full max-w-3xl"><IssueForm /></div></PageWrapper>; }
