// src/types/analytics.ts

export interface AnalyticsData {
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
  