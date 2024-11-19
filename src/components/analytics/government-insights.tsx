"use client";

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell , LabelList
} from 'recharts';

import { 
  AlertCircle, Users, Building2, MessageSquare, 
  TrendingUp, BarChart2, Activity 
} from 'lucide-react';
import { JakartaMap } from '@/components/maps/jakarta-map';

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
// Custom gradient colors for charts
const gradients = {
  positive: ["#22c55e", "#4ade80"],
  negative: ["#ef4444", "#f87171"],
  neutral: ["#6b7280", "#9ca3af"]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900"></p>
        {payload.map((pld: any, index: number) => (
          <p key={index} className="flex items-center gap-2 mt-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pld.color }} />
            <span className="text-sm font-medium" style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value.toFixed(1)} Post`}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function GovernmentInsights({ data }: GovernmentInsightsProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center p-6">
        <Activity className="w-6 h-6 text-gray-400 animate-spin" />
        <p className="ml-2 text-gray-500">Loading analytics data...</p>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6 p-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sentiment Trends */}
        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Public Sentiment Trends
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Daily sentiment analysis from social media
                  </p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer>
                  <AreaChart 
                    data={data.sentimentTrends}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <defs>
                      {Object.entries(gradients).map(([key, [startColor, endColor]]) => (
                        <linearGradient key={key} id={`gradient${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={startColor} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={endColor} stopOpacity={0.1}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { weekday: 'short' })}
                      fontSize={12}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      fontSize={12}
                      stroke="#6b7280"
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      formatter={(value) => (
                        <span className="text-sm font-medium">{value}</span>
                      )}
                    />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      name="Positive"
                      stroke={gradients.positive[0]}
                      fill={`url(#gradientpositive)`}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      name="Negative"
                      stroke={gradients.negative[0]}
                      fill={`url(#gradientnegative)`}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      name="Neutral"
                      stroke={gradients.neutral[0]}
                      fill={`url(#gradientneutral)`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Issues */}
        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Priority Issues
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Top issues requiring attention
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-1" />
                    High
                  </span>
                  <span className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                    Normal
                  </span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart 
                    data={data.topIssues}
                    margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                    barCategoryGap={8}
                  >
                    <defs>
                      <linearGradient id="priorityHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#f87171" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="priorityNormal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="topic" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={10}
                      stroke="#6b7280"
                    />
                    <YAxis fontSize={12} stroke="#6b7280" />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                      content={<CustomTooltip />} 
                    />
                    <Bar 
                      dataKey="count" 
                      name="Mentions"
                      radius={[4, 4, 0, 0]}
                    >
                      {data.topIssues.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={`url(#priority${entry.urgency > 70 ? 'High' : 'Normal'})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      {/* Department Mentions */}
      <motion.div variants={cardVariants}>
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    Department Mentions
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Government department activity analysis
                  </p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={data.departmentMetrics}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 50,
                      left: 100,
                      bottom: 5,
                    }}
                    barSize={20}
                  >
                    <defs>
                      <linearGradient id="departmentBarColor" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#818CF8" stopOpacity={0.9}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      type="number" 
                      domain={[0, 'dataMax + 5']}
                      ticks={[0, 5, 10, 15, 20, 25, 30]}
                      tickLine={false}
                      axisLine={false}
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Inter',
                      }}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="department"
                      axisLine={false}
                      tickLine={false}
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Inter',
                        fontWeight: 500,
                      }}
                      tick={{ fill: '#374151' }}
                      width={90}
                    />
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      horizontal={true} 
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-100">
                              <p className="text-sm font-medium text-gray-900">{label}</p>
                              <p className="text-sm font-medium text-indigo-600">
                                {payload[0].value} mentions
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="mentions" 
                      fill="url(#departmentBarColor)"
                      radius={[0, 4, 4, 0]}
                    >
                      <LabelList 
                        dataKey="mentions" 
                        position="right"
                        style={{
                          fill: '#4F46E5',
                          fontSize: '12px',
                          fontFamily: 'Inter',
                          fontWeight: '500'
                        }}
                        offset={10}
                      />
                      {data.departmentMetrics.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Regional Distribution Map */}
        <motion.div variants={cardVariants}>
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-violet-500" />
                    Regional Distribution
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Geographic distribution of issues
                  </p>
                </div>
              </div>
              <div className="h-80">
                <JakartaMap data={data.regionalDistribution} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}