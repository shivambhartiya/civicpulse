import { POINTS } from '@/lib/constants/scoring';
import { PointsBadge } from './PointsBadge';

export function RewardToast({ points = POINTS.report }: { points?: number }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-lg">
      <p className="font-semibold">You earned a civic reward</p>
      <PointsBadge points={points} />
    </div>
  );
}
