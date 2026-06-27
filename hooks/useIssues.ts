'use client';

import { useEffect, useState } from 'react';
import type { Issue } from '@/lib/types/issue';

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/issues')
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load issues.');
        return response.json() as Promise<{ issues: Issue[] }>;
      })
      .then((result) => {
        if (active) setIssues(result.issues);
      })
      .catch((caught) => {
        if (active) setError(caught instanceof Error ? caught : new Error('Could not load issues.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { issues, loading, error };
}
