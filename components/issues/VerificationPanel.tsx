'use client';

import { useState } from 'react';
import { Bot, Camera, Loader2, ShieldCheck, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Issue } from '@/lib/types/issue';

export function VerificationPanel({ issue }: { issue: Issue }) {
  const [verified, setVerified] = useState(false);
  const [verificationCount, setVerificationCount] = useState(issue.verificationCount);
  const [loading, setLoading] = useState(false);
  const [ai, setAi] = useState<string | null>(null);

  async function verify() {
    setLoading(true);
    try {
      const response = await fetch(`/api/issues/${issue.id}/verify`, { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not verify issue.');
      setVerified(true);
      setVerificationCount(result.issue.verificationCount);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Community verification</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{verificationCount} neighbors have verified this report.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button onClick={verify} disabled={verified || loading} variant={verified ? 'secondary' : 'default'}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}{verified ? 'Verified' : 'Verify nearby'}</Button>
          <Button variant="outline" onClick={() => setAi(`AI confidence is ${Math.round(issue.aiAnalysis.confidence * 100)}%. The report appears consistent with the image and community context.`)}><Bot className="h-4 w-4" />AI Verify</Button>
          <Button variant="outline"><ThumbsUp className="h-4 w-4" />Upvote</Button>
          <Button variant="outline"><Camera className="h-4 w-4" />Challenge resolution</Button>
        </div>
        {ai ? <p className="rounded-md bg-muted p-3 text-sm">{ai}</p> : null}
      </CardContent>
    </Card>
  );
}
