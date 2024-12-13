import { useState, useEffect } from 'react';

interface AnalyticsMetrics {
  totalUsers: number;
  responseRate: string;
  averageResolutionTime: string;
  satisfactionScore: string;
}

interface IssueCategory {
  category: string;
  count: number;
  averageSeverity: number;
  maxSeverity: number;
}

interface RegionalStat {
  region: string;
  userCount: number;
  engagementScore: number;
}

interface TimeSeriesData {
  date: string;
  interactions: number;
  successRate: number;
}

interface SentimentData {
  sentiment: string;
  count: number;
}

interface EngagementAnalytics {
  metrics: AnalyticsMetrics;
  issueCategories: IssueCategory[];
  regionalStats: RegionalStat[];
  timeSeriesData: TimeSeriesData[];
  sentimentAnalysis: SentimentData[];
}

interface AnalyticsFilters {
  timeframe: string;
  region: string;
}

export function useEngagementAnalytics() {
  const [data, setData] = useState<EngagementAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    timeframe: 'all',
    region: 'all'
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          timeframe: filters.timeframe,
          region: filters.region
        });

        const response = await fetch(`/api/engagement/analytics?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const analyticsData = await response.json();
        setData(analyticsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [filters]);

  const updateFilters = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    data,
    isLoading,
    error,
    filters,
    updateFilters
  };
}