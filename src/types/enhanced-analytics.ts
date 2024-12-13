// src/types/enhanced-analytics.ts

export interface EnhancedAnalyticsData {
    timeRange: string;
    region: string;
    sentimentDistribution: {
      buckets: Array<{
        key: string;
        doc_count: number;
      }>;
    };
    sentimentTrends: {
      buckets: Array<{
        key_as_string: string;
        key: number;
        doc_count: number;
        sentiments: {
          buckets: Array<{
            key: string;
            doc_count: number;
          }>;
        };
      }>;
    };
    urgencyDistribution: {
      buckets: Array<{
        key: string;
        doc_count: number;
        top_topics: {
          buckets: Array<{
            key: string;
            doc_count: number;
          }>;
        };
      }>;
    };
    topPosts: {
      hits: {
        hits: Array<{
          _source: {
            full_text: string;
            views_count: number;
            favorite_count: number;
            retweet_count: number;
            sentiment: string;
            urgency_level: number;
            affected_region: string;
            link_post: string;
          };
        }>;
      };
    };
    keywords: {
      buckets: Array<{
        key: string;
        doc_count: number;
      }>;
    };
    hashtags: {
      buckets: Array<{
        key: string;
        doc_count: number;
      }>;
    };
    regionalSentiment: {
      buckets: Array<{
        key: string;
        doc_count: number;
        sentiment_breakdown: {
          buckets: Array<{
            key: string;
            doc_count: number;
          }>;
        };
      }>;
    };
    engagementTrends: {
      buckets: Array<{
        key_as_string: string;
        key: number;
        doc_count: number;
        avg_views: { value: number };
        avg_favorites: { value: number };
        avg_retweets: { value: number };
        avg_replies: { value: number };
      }>;
    };
    audienceDistribution: {
      buckets: Array<{
        key: string;
        doc_count: number;
      }>;
    };
    recommendations: Array<{
      topic: string;
      region: string;
      sentiment: string;
      urgencyLevel: string;
      recommendation: string;
    }>;
  }