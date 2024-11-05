// src/components/analytics/topic-distribution.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TopicDistributionProps {
  data?: Array<{
    topic: string;
    count: number;
  }>;
}

export function TopicDistribution({ data = [] }: TopicDistributionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Topic Distribution</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Tweet Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}