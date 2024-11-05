// src/components/analytics/sentiment-analysis.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

interface SentimentAnalysisProps {
  data?: Array<{
    name: string;
    value: number;
  }>;
}

export function SentimentAnalysis({ data = [] }: SentimentAnalysisProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Sentiment Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}