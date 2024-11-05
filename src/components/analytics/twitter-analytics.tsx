// src/components/analytics/twitter-analytics.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTwitterAnalytics } from '@/hooks/use-twitter-analytics';
import { NetworkAnalysis } from './network-analysis';
import { GovernmentInsights } from './government-insights';
import { AnalyticsData } from '@/types/analytics';
import { 
  AlertCircle, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Building2, 
  AlertTriangle,
  Loader2 
} from 'lucide-react';



interface StatConfig {
  title: string;
  getValue: (data: AnalyticsData) => string | number;
  description: string;
  icon: any;
  getChange: (data: AnalyticsData) => string;
  color: string;
  bgColor: string;
}

export function TwitterAnalytics() {
  const { data, isLoading, error } = useTwitterAnalytics();
  const [activeTab, setActiveTab] = useState('insights');

  const statsConfig: StatConfig[] = [
    {
      title: "Public Issues",
      getValue: (data) => data.publicIssuesCount,
      description: "Active public concerns",
      icon: AlertCircle,
      getChange: (data) => `${data.weeklyChanges.publicIssues}% from last week`,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Citizen Reach",
      getValue: (data) => data.citizenReach.toLocaleString(),
      description: "Total citizens engaged",
      icon: Users,
      getChange: (data) => `${data.weeklyChanges.citizenReach}% from last week`,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Department Mentions",
      getValue: (data) => data.departmentMentionsCount,
      description: "Government offices mentioned",
      icon: Building2,
      getChange: (data) => `${data.weeklyChanges.departmentMentions}% from last week`,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Critical Topics",
      getValue: (data) => data.criticalTopicsCount,
      description: "High urgency matters",
      icon: AlertTriangle,
      getChange: (data) => `${data.weeklyChanges.publicIssues}% from last week`,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Public Sentiment",
      getValue: (data) => `${data.publicSentiment}%`,
      description: "Overall positive mentions",
      icon: TrendingUp,
      getChange: () => `+2% from last week`,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Discussions",
      getValue: (data) => data.activeDiscussions.toLocaleString(),
      description: "Ongoing public conversations",
      icon: MessageSquare,
      getChange: (data) => `${data.weeklyChanges.activeDiscussions}% from last week`,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px] space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="text-gray-500">Loading analytics data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Card className="max-w-lg w-full">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load analytics data</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const getChangeColor = (change: string) => {
    if (change.includes('N/A')) return 'bg-gray-100 text-gray-800';
    return change.startsWith('+') 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsConfig.map((stat, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </span>
                  <div className="flex flex-col space-y-2">
                    <span className="text-2xl font-bold">
                      {stat.getValue(data)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                      getChangeColor(stat.getChange(data))
                    }`}>
                      {stat.getChange(data)}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs with Content */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="sticky top-0 z-1 bg-white pb-4 border-b">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="insights">Government Insights</TabsTrigger>
            <TabsTrigger value="network">Network Analysis</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="insights" className="mt-6">
          <GovernmentInsights data={data} />
        </TabsContent>
        <TabsContent value="network" className="mt-6">
          <NetworkAnalysis data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}