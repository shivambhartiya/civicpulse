'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATUS_META } from '@/lib/constants/status';
import { trendData } from '@/lib/mock-data';

export function ResolutionTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resolution trend</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="reported"
              stroke={STATUS_META.REPORTED.color}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke={STATUS_META.RESOLVED.color}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
