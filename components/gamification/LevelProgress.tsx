import { Progress } from '@/components/ui/progress';
export function LevelProgress({ level, points }: { level: number; points: number }) { const progress = points % 100; return <div className="space-y-2"><div className="flex justify-between text-sm"><span>Level {level}</span><span>{points} XP</span></div><Progress value={progress} /></div>; }
