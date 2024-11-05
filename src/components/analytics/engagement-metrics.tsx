// src/components/analytics/engagement-metrics.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EngagementMetricsProps {
  data?: Array<{
    date: string;
    likes: number;
    retweets: number;
    replies: number;
  }>;
}

export function EngagementMetrics({ data = [] }: EngagementMetricsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Engagement Over Time</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="likes" stroke="#8884d8" name="Likes" />
              <Line type="monotone" dataKey="retweets" stroke="#82ca9d" name="Retweets" />
              <Line type="monotone" dataKey="replies" stroke="#ffc658" name="Replies" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}