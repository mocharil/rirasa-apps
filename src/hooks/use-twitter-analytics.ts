// src/hooks/use-twitter-analytics.ts
import { useState, useEffect } from 'react';

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
  sentimentTrends: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
  topIssues: Array<{
    topic: string;
    count: number;
    urgency: number;
  }>;
  departmentMetrics: Array<{
    department: string;
    mentions: number;
  }>;
  regionalDistribution: Array<{
    region: string;
    value: number;
  }>;
  publicSentiment: string;
}

export function useTwitterAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/analytics/twitter');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();

        if (jsonData.error) {
          throw new Error(jsonData.error);
        }

        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        console.error('Error fetching Twitter analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Optional: Set up polling for real-time updates
    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  return { data, isLoading, error };
}