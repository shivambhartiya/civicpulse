import { CheckCircle2, Circle } from 'lucide-react';
import { ISSUE_STATUS_ORDER, STATUS_META } from '@/lib/constants/status';
import { timeAgo } from '@/lib/utils/formatting';
import type { IssueStatus, StatusEvent } from '@/lib/types/issue';

export function StatusTimeline({
  events,
  status,
}: {
  events: StatusEvent[];
  status: IssueStatus;
}) {
  const active = ISSUE_STATUS_ORDER.indexOf(status);

  return (
    <div className="space-y-3">
      {ISSUE_STATUS_ORDER.slice(0, 5).map((step, index) => {
        const event = events.find((item) => item.status === step);
        const done = index <= active;

        return (
          <div key={step} className="flex gap-3">
            <span className={done ? 'text-primary' : 'text-muted-foreground'}>
              {done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
            </span>
            <div>
              <p className="text-sm font-medium">{STATUS_META[step].label}</p>
              <p className="text-xs text-muted-foreground">
                {event ? `${event.note} - ${timeAgo(event.at)}` : 'Awaiting update'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
