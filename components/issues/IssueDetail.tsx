import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATUS_META } from '@/lib/constants/status';
import { AIAnalysisCard } from './AIAnalysisCard';
import { CategoryBadge } from './CategoryBadge';
import { CommentThread } from './CommentThread';
import { SeverityMeter } from './SeverityMeter';
import { StatusTimeline } from './StatusTimeline';
import { VerificationPanel } from './VerificationPanel';
import type { Issue } from '@/lib/types/issue';

export function IssueDetail({ issue }: { issue: Issue }) {
  const status = STATUS_META[issue.status];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="relative aspect-[16/9]">
            <Image
              src={issue.images[0] || issue.thumbnailUrl}
              alt={issue.title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={issue.category} />
              <Badge style={{ backgroundColor: status.color }}>{status.label}</Badge>
            </div>
            <CardTitle className="text-2xl">{issue.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{issue.description}</p>
            <SeverityMeter value={issue.severity} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments and field notes</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentThread issueId={issue.id} comments={issue.comments} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <VerificationPanel issue={issue} />
        <AIAnalysisCard analysis={issue.aiAnalysis} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lifecycle</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusTimeline events={issue.statusHistory} status={issue.status} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
