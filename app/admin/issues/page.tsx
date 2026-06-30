import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATUS_META } from '@/lib/constants/status';
import { mockIssues } from '@/lib/mock-data';

export default function AdminIssuesPage() {
  const issues = [...mockIssues].sort((a, b) => b.severity - a.severity);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Issue management queue</h1>
      <Card>
        <CardHeader>
          <CardTitle>Prioritized by severity, SLA, and community validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {issues.map((issue) => (
            <div key={issue.id} className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_auto_auto]">
              <div>
                <p className="font-semibold">{issue.title}</p>
                <p className="text-sm text-muted-foreground">
                  {issue.department} - {issue.location.ward} - SLA{' '}
                  {new Date(issue.slaDeadline).toLocaleString()}
                </p>
              </div>
              <Badge>{STATUS_META[issue.status].label}</Badge>
              <Button variant="outline">Assign team</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
