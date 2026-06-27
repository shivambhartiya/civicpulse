'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { IssueComment } from '@/lib/types/issue';
import { timeAgo } from '@/lib/utils/formatting';

export function CommentThread({ issueId, comments: initialComments }: { issueId: string; comments: IssueComment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function postComment() {
    if (body.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/issues/${issueId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not post comment.');
      setComments((current) => [...current, result.comment]);
      setBody('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not post comment.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => <div key={comment.id} className="flex gap-3"><Avatar><AvatarFallback>{comment.authorName.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar><div><p className="text-sm font-medium">{comment.authorName} <span className="font-normal text-muted-foreground">{timeAgo(comment.createdAt)}</span></p><p className="text-sm text-muted-foreground">{comment.body}</p></div></div>)}
      <div className="space-y-2">
        <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add local evidence, repair updates, or context" />
        <Button onClick={postComment} disabled={loading || body.trim().length < 2}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Post comment</Button>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
