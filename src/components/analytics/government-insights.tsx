//src/components/analytics/government-insights.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { 
  AlertCircle, Users, Building2, MessageSquare, 
  TrendingUp, BarChart2, Activity 
} from 'lucide-react';
import { JakartaMap } from '@/components/maps/jakarta-map';

// Interface definitions remain the same...

// Enhanced color scheme
const COLORS = {
  positive: "#10B981",  // Emerald 500
  neutral: "#6B7280",   // Gray 500
  negative: "#EF4444",  // Red 500
  urgentHigh: "#DC2626", // Red 600
  urgentMedium: "#F59E0B", // Amber 500
  urgentLow: "#10B981", // Emerald 500,
  regions: {
    north: "#60A5FA",   // Blue 400
    south: "#34D399",   // Emerald 400
    east: "#F472B6",    // Pink 400
    west: "#FBBF24",    // Amber 400
    central: "#A78BFA"  // Violet 400
  }
};

interface GovernmentInsightsProps {
  data: {
    sentimentTrends: Array<{
      date: string;
      positive: number;
      negative: number;
      neutral: number;
    }>;
    publicSentiment: string; // Percentage as a string
    topIssues: Array<{
      topic: string;
      count: number;
      urgency: number;
    }>;
    regionalDistribution: Array<{
      region: string;
      value: number;
    }>;
  };
}


export function GovernmentInsights({ data }: GovernmentInsightsProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const renderSentimentTrends = () => (
    <Card className="hover:shadow-xl transition-transform duration-300 border border-gray-200 rounded-lg bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          Public Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          {/* Trend Chart */}
          <div className="h-[300px] p-4 rounded-lg bg-gray-50 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.sentimentTrends}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="#d1d5db" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
                  }
                  tick={{ fill: '#6b7280', fontWeight: '500' }}
                />
                <YAxis
                  fontSize={12}
                  tick={{ fill: '#6b7280', fontWeight: '500' }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '10px',
                  }}
                  formatter={(value, name) => {
                    const formattedName = typeof name === 'string'
                      ? name.charAt(0).toUpperCase() + name.slice(1)
                      : name; // Handle non-string cases
                    return [`${value}`, formattedName];
                  }}
                  labelStyle={{ color: '#374151', fontWeight: '500' }}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    fontSize: '12px',
                    fill: '#374151',
                  }}
                  iconSize={12}
                />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ef4444' }}
                  activeDot={{ r: 6, fill: '#ef4444', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke="#6b7280"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6b7280' }}
                  activeDot={{ r: 6, fill: '#6b7280', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
  
          {/* Donut Chart */}
          <div className="h-[300px] p-4 rounded-lg bg-gray-50 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Positive', value: parseFloat(data.publicSentiment) },
                    { name: 'Neutral', value: 100 - parseFloat(data.publicSentiment) - 20 },
                    { name: 'Negative', value: 20 },
                  ]}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                  isAnimationActive
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#6b7280" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '10px',
                  }}
                  formatter={(value, name) => [`${value}%`, name]}
                  labelStyle={{ color: '#374151', fontWeight: '500' }}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    fontSize: '12px',
                    fill: '#374151',
                    marginTop: '20px',
                  }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPriorityIssues = () => (
    <Card className="hover:shadow-xl transition-transform duration-300 border border-gray-300 rounded-lg bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <AlertCircle className="h-5 w-5 text-red-600" />
          Priority Issues
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data.topIssues}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={24}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#e5e7eb" />
              <XAxis 
                dataKey="topic" 
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                fontSize={12}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '500',
                  fill: '#4b5563',
                }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#4b5563', fontWeight: '500' }}
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <Tooltip
                content={({ payload, label }) => {
                  if (payload && payload.length) {
                    const { count, urgency } = payload[0].payload;
                    return (
                      <div className="p-3 bg-white border border-gray-300 rounded shadow-md">
                        <p className="text-sm font-medium text-gray-800">{label}</p>
                        <p className="text-sm text-gray-600">Count: <span className="font-semibold">{count}</span></p>
                        <p className="text-sm text-gray-600">Urgency Score: <span className="font-semibold">{urgency}</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
                wrapperStyle={{
                  outline: 'none',
                }}
              />
              <Bar dataKey="count">
                {data.topIssues.map((entry, index) => {
                  // Logic to determine bar color based on urgency score
                  let fillColor;
                  if (entry.urgency > 70) {
                    fillColor = '#ef4444'; // High urgency (Red)
                  } else if (entry.urgency > 40) {
                    fillColor = '#f59e0b'; // Medium urgency (Yellow)
                  } else {
                    fillColor = '#10b981'; // Low urgency (Green)
                  }
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 flex justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            High Urgency
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            Medium Urgency
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Low Urgency
          </div>
        </div>
      </CardContent>
      </Card>
);
  const renderRegionalDistribution = () => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          Regional Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] relative">
          <JakartaMap 
            data={data.regionalDistribution}
          />

        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {renderSentimentTrends()}
        {renderPriorityIssues()}
      </div>
      <div className="grid gap-6">
        {renderRegionalDistribution()}
      </div>
    </motion.div>
  );
}