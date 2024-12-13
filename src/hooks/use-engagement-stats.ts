// src/hooks/use-engagement-stats.ts
import { useState, useEffect } from 'react';

interface EngagementStats {
  activeUsers: number;
  dailyInteractions: number;
  responseRate: number;
  avgResponseTime: number;
}

export function useEngagementStats() {
  const [stats, setStats] = useState<EngagementStats>({
    activeUsers: 0,
    dailyInteractions: 0,
    responseRate: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/engagement');
      
      if (!response.ok) {
        throw new Error('Failed to fetch engagement statistics');
      }
      
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching engagement stats:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchStats, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const refetchStats = () => {
    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetchStats
  };
}