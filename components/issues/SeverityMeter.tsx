import { Progress } from '@/components/ui/progress';
export function SeverityMeter({ value }: { value: number }) { return <div className="space-y-1"><div className="flex justify-between text-xs"><span className="text-muted-foreground">Severity</span><span className="font-medium">{value}/10</span></div><Progress value={value * 10} /></div>; }
