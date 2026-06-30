'use client';

import { AchievementCard } from '@/components/gamification/AchievementCard';
import { LevelProgress } from '@/components/gamification/LevelProgress';
import { PointsBadge } from '@/components/gamification/PointsBadge';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { BADGES } from '@/lib/constants/badges';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageWrapper title="Your civic profile" eyebrow="Participation and rewards"><p className="text-sm text-muted-foreground">Loading profile...</p></PageWrapper>;
  }

  if (!user) {
    return <PageWrapper title="Your civic profile" eyebrow="Participation and rewards"><p className="text-sm text-muted-foreground">Sign in to view your profile.</p></PageWrapper>;
  }

  const earnedBadgeIds = new Set(user.badges.map((badge) => badge.id));

  return (
    <PageWrapper title="Your civic profile" eyebrow="Participation and rewards" action={<PointsBadge points={user.points} />}>
      <Card>
        <CardHeader><CardTitle>{user.name}</CardTitle></CardHeader>
        <CardContent><LevelProgress level={user.level} points={user.points} /></CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {BADGES.map((badge) => <AchievementCard key={badge.id} name={badge.name} description={badge.description} progress={earnedBadgeIds.has(badge.id) ? 100 : 0} />)}
      </div>
    </PageWrapper>
  );
}
