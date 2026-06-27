'use client';

import { useEffect, useState } from 'react';
import type { Issue } from '@/lib/types/issue';

export function useIssue(issueId: string) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!issueId) return;
    let active = true;
    setLoading(true);
    fetch(`/api/issues/${encodeURIComponent(issueId)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 404 ? 'Issue not found.' : 'Could not load issue.');
        return response.json() as Promise<{ issue: Issue }>;
      })
      .then((result) => {
        if (active) setIssue(result.issue);
      })
      .catch((caught) => {
        if (active) setError(caught instanceof Error ? caught : new Error('Could not load issue.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [issueId]);

  return { issue, loading, error };
}
