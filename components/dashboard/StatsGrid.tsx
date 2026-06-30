import { AlertTriangle, CheckCircle2, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { listIssues, listUsers } from '@/lib/local-data/store';

function averageResolutionHours(resolutionTimes: number[]) {
  if (resolutionTimes.length === 0) return '--';
  const averageMs = resolutionTimes.reduce((total, duration) => total + duration, 0) / resolutionTimes.length;
  return `${Math.round(averageMs / 3_600_000)}h`;
}

export async function StatsGrid() {
  const [issues, users] = await Promise.all([listIssues(), listUsers()]);
  const resolved = issues.filter((issue) => ['RESOLVED', 'CLOSED'].includes(issue.status));
  const resolutionTimes = resolved.flatMap((issue) => {
    const resolvedEvent = issue.statusHistory.find((event) => event.status === 'RESOLVED');
    if (!resolvedEvent) return [];
    return [new Date(resolvedEvent.at).getTime() - new Date(issue.reportedAt).getTime()];
  }).filter((duration) => duration >= 0);
  const stats = [
    { label: 'Open reports', value: issues.length - resolved.length, icon: AlertTriangle },
    { label: 'Resolved reports', value: resolved.length, icon: CheckCircle2 },
    { label: 'Avg resolution', value: averageResolutionHours(resolutionTimes), icon: Clock },
    { label: 'Active heroes', value: users.length, icon: Users },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div><p className="text-sm text-muted-foreground">{stat.label}</p><p className="text-2xl font-semibold">{stat.value}</p></div>
              <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
