// src/components/analytics/government-insights.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { AlertCircle, Users, Building2, MessageSquare, TrendingUp, BarChart2 } from 'lucide-react';

// Define proper TypeScript interfaces
interface SentimentTrend {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface TopIssue {
  topic: string;
  count: number;
  urgency: number;
}

interface DepartmentMetric {
  department: string;
  mentions: number;
}

interface RegionalDistribution {
  region: string;
  value: number;
}

interface AnalyticsData {
  publicIssuesCount: number;
  citizenReach: number;
  activeDiscussions: number;
  totalTweets: number;
  criticalTopicsCount: number;
  departmentMentionsCount: number;
  weeklyChanges: {
    publicIssues: string;
    citizenReach: string;
    activeDiscussions: string;
    departmentMentions: string;
  };
  sentimentTrends: SentimentTrend[];
  topIssues: TopIssue[];
  departmentMetrics: DepartmentMetric[];
  regionalDistribution: RegionalDistribution[];
  publicSentiment: string;
}

interface GovernmentInsightsProps {
  data: AnalyticsData;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEEAD', '#D4A5A5', '#9FA8DA', '#FFE082'
];

export function GovernmentInsights({ data }: GovernmentInsightsProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-gray-500">Loading analytics data...</p>
      </div>
    );
  }

  // Format percentage changes for display
  const formatChange = (value: string) => {
    if (value === 'N/A') return 'N/A';
    const num = parseFloat(value);
    return `${num > 0 ? '+' : ''}${value}`;
  };

  // Helper function to get color class based on change value
  const getChangeColorClass = (value: string) => {
    if (value === 'N/A') return 'text-gray-500';
    return parseFloat(value) >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="space-y-6">


      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sentiment Trends */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Public Sentiment Trends</h3>
            <div className="h-80">
              <ResponsiveContainer>
                <LineChart data={data.sentimentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="positive" 
                    stroke="#4CAF50" 
                    name="Positive"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="negative" 
                    stroke="#F44336" 
                    name="Negative"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="neutral" 
                    stroke="#9E9E9E" 
                    name="Neutral"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Priority Issues */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Priority Issues</h3>
            <div className="h-80">
              <ResponsiveContainer>
                <BarChart data={data.topIssues}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="topic" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    name="Mentions"
                  >
                    {data.topIssues.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.urgency > 70 ? '#EF4444' : '#3B82F6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Department Mentions</h3>
            <div className="h-80">
              <ResponsiveContainer>
                <BarChart 
                  layout="vertical" 
                  data={data.departmentMetrics}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="department" 
                    type="category" 
                    width={150}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="mentions" 
                    fill="#8884d8"
                    name="Mentions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Regional Issue Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.regionalDistribution}
                    dataKey="value"
                    nameKey="region"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.region}: ${entry.value}`}
                  >
                    {data.regionalDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}