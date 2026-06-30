import { PageWrapper } from '@/components/layout/PageWrapper';
import { IssueMap } from '@/components/map/IssueMap';
import { DEFAULT_CITY_CENTER } from '@/lib/constants/app';
import { listIssues } from '@/lib/local-data/store';

export const dynamic = 'force-dynamic';

export default async function MapPage() {
  const issues = (await listIssues()).map((issue) => ({
    ...issue,
    reportedAt: new Date(issue.reportedAt),
  }));

  return (
    <PageWrapper title="Hyperlocal issue map" eyebrow="Current and predicted hotspots">
      <IssueMap issues={issues} center={DEFAULT_CITY_CENTER} height="calc(100vh - 9rem)" />
    </PageWrapper>
  );
}
