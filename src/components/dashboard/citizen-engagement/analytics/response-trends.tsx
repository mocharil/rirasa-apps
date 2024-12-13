import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  timestamp: string;
  responseRate: number;
  sentiment: number;
  urgency: number;
}

interface ResponseTrendsProps {
  data: TrendData[];
}

export function ResponseTrends({ data }: ResponseTrendsProps) {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }),
    }));
  }, [data]);

  return (
    <Card className="shadow-xl rounded-lg border-none bg-white p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800 mb-4">Response Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.5)" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fill: '#4B5563', fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fill: '#4B5563', fontSize: 12 }}
                domain={[0, 100]} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(220, 220, 220, 0.8)',
                  borderRadius: '6px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="responseRate"
                name="Response Rate"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="sentiment"
                name="Sentiment"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="urgency"
                name="Urgency"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
