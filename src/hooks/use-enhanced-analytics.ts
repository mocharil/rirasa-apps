// src/hooks/use-enhanced-analytics.ts

import { useState, useEffect } from 'react';
import type { EnhancedAnalyticsData } from '@/types/enhanced-analytics';

interface UseEnhancedAnalyticsOptions {
  timeRange?: 'daily' | 'weekly' | 'monthly';
  region?: string;
}

export function useEnhancedAnalytics(options: UseEnhancedAnalyticsOptions = {}) {
  const [data, setData] = useState<EnhancedAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { timeRange = 'daily', region = 'all' } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          timeRange,
          region
        });

        const response = await fetch(`/api/analytics/enhanced-twitter?${params}`);
        
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
        console.error('Error fetching enhanced analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Optional: Set up polling for real-time updates
    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(intervalId);
  }, [timeRange, region]);

  return { data, isLoading, error };
}