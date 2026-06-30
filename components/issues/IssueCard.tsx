import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, ShieldCheck, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { STATUS_META } from '@/lib/constants/status';
import { timeAgo } from '@/lib/utils/formatting';
import { CategoryBadge } from './CategoryBadge';
import { SeverityMeter } from './SeverityMeter';
import type { Issue } from '@/lib/types/issue';

export function IssueCard({ issue }: { issue: Issue }) {
  const status = STATUS_META[issue.status];

  return (
    <Link href={`/issues/${issue.id}`}>
      <Card className="relative overflow-hidden transition hover:border-primary/60">
        <span
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: status.color }}
          aria-hidden
        />
        <div className="relative aspect-[16/9]">
          <Image
            src={issue.thumbnailUrl}
            alt={issue.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />
        </div>
        <CardContent className="space-y-4 p-4 pl-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-2 font-semibold">{issue.title}</h3>
              <p className="text-xs text-muted-foreground">
                {issue.location.ward} - {timeAgo(issue.reportedAt)}
              </p>
            </div>
            <Badge variant={issue.status === 'RESOLVED' ? 'secondary' : 'default'}>
              {status.label}
            </Badge>
          </div>
          <CategoryBadge category={issue.category} />
          <SeverityMeter value={issue.severity} />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              {issue.verificationCount}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              {issue.upvotes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {issue.comments.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
