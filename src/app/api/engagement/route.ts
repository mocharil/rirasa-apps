import { NextResponse } from 'next/server';

import type {
  AggregationsTermsAggregateBase,
  AggregationsAvgAggregate,
  AggregationsValueCountAggregate,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';

import { client } from '@/lib/elasticsearch'

export async function GET() {
  try {
    // Elasticsearch Queries

    // Critical Issues (High urgency conversations in last 24h)
    const criticalIssues = await client.count({
      index: 'chat_interactions',
      query: {
        bool: {
          must: [
            { range: { timestamp: { gte: 'now-7d/d' } } },
            { range: { urgency_level: { gte: 70 } } },
          ],
        },
      },
    });

    // Active Sessions (Unique users today)
    const activeUsers = await client.search<SearchResponse<Record<string, unknown>>>({
      index: 'chat_interactions',
      size: 0,
      query: {
        range: {
          timestamp: { gte: 'now-7d/d' },
        },
      },
      aggs: {
        unique_users: {
          cardinality: {
            field: 'user_id.keyword',
          },
        },
      },
    });

    // Response Metrics
    const responseMetrics = await client.search<SearchResponse<Record<string, unknown>>>({
      index: 'chat_interactions',
      size: 0,
      query: {
        range: {
          timestamp: { gte: 'now-7d/d' },
        },
      },
      aggs: {
        avg_response_time: {
          avg: {
            field: 'response_time_ms',
          },
        },
        response_count: {
          value_count: {
            field: 'bot_response.keyword',
          },
        },
        total_interactions: {
          value_count: {
            field: 'message_text.keyword',
          },
        },
      },
    });

    // Sentiment Analysis
    const sentimentAnalysis = await client.search<SearchResponse<Record<string, unknown>>>({
      index: 'chat_interactions',
      size: 0,
      query: {
        range: {
          timestamp: { gte: 'now-7d/d' },
        },
      },
      aggs: {
        sentiments: {
          terms: {
            field: 'sentiment.keyword',
          },
        },
      },
    });

    // Trends
    const trends = await client.search<SearchResponse<Record<string, unknown>>>({
      index: 'chat_interactions',
      size: 0,
      query: {
        range: {
          timestamp: { gte: 'now-7d/d' },
        },
      },
      aggs: {
        by_hour: {
          date_histogram: {
            field: 'timestamp',
            fixed_interval: '24h',
          },
          aggs: {
            response_rate: {
              avg: {
                script: {
                  source: "doc['bot_response.keyword'].size() > 0 ? 100 : 0",
                },
              },
            },
            sentiment_score: {
              avg: {
                script: {
                  source: "doc['sentiment.keyword'].value == 'Positive' ? 100 : doc['sentiment.keyword'].value == 'Negative' ? 0 : 50",
                },
              },
            },
            avg_urgency: {
              avg: {
                field: 'urgency_level',
              },
            },
          },
        },
      },
    });

    // Calculate metrics
    const responseAggs = responseMetrics.aggregations!;
    const totalInteractions = (responseAggs.total_interactions as AggregationsValueCountAggregate)?.value || 0;
    const responseCount = (responseAggs.response_count as AggregationsValueCountAggregate)?.value || 0;
    const responseRate = totalInteractions > 0 ? (responseCount / totalInteractions) * 100 : 0;

    const avgResponseTime = ((responseAggs.avg_response_time as AggregationsAvgAggregate)?.value || 0) / 1000; // Convert to seconds

    const activeSessions = (activeUsers.aggregations?.unique_users as AggregationsValueCountAggregate)?.value || 0;

    // Process sentimentAnalysis
    const sentimentBuckets = (sentimentAnalysis.aggregations?.sentiments as AggregationsTermsAggregateBase)?.buckets || [];
    const typedSentimentBuckets = sentimentBuckets as Array<{ key: string; doc_count: number }>;
    const positiveSentiments = typedSentimentBuckets.find((b) => b.key === 'Positive')?.doc_count || 0;
    const totalSentiments = typedSentimentBuckets.reduce((acc, curr) => acc + curr.doc_count, 0);
    const sentimentScore = totalSentiments > 0 ? (positiveSentiments / totalSentiments) * 10 : 0;

    // Process trends
    const trendsBuckets = (trends.aggregations?.by_hour as AggregationsTermsAggregateBase)?.buckets || [];
    const typedTrendsBuckets = trendsBuckets as Array<{
      key_as_string: string;
      response_rate: AggregationsAvgAggregate;
      sentiment_score: AggregationsAvgAggregate;
      avg_urgency: AggregationsAvgAggregate;
    }>;
    const trendsData = typedTrendsBuckets.map((bucket) => ({
      timestamp: bucket.key_as_string,
      responseRate: bucket.response_rate?.value || 0,
      sentiment: bucket.sentiment_score?.value || 0,
      urgency: bucket.avg_urgency?.value || 0,
    }));

    return NextResponse.json({
      criticalIssues: criticalIssues.count,
      activeSessions,
      responseRate,
      averageResponseTime: avgResponseTime,
      sentimentScore,
      trendsData,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching metrics:', errorMessage);
    return NextResponse.json({ error: 'Failed to fetch metrics', details: errorMessage }, { status: 500 });
  }
}
