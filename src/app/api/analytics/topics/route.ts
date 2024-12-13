// src/app/api/analytics/topics/route.ts
// Menjadi:


import { NextResponse } from 'next/server';
import type {
  AggregationsTermsAggregateBase,
  AggregationsAvgAggregate,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { client } from '@/lib/elasticsearch'

interface SentimentDistributionAggregation extends AggregationsTermsAggregateBase {
  buckets: Array<{
    key: string;
    doc_count: number;
  }>;
}

interface TopicBucket {
  key: string;
  doc_count: number;
  avg_urgency: AggregationsAvgAggregate;
  sentiment_distribution: SentimentDistributionAggregation;
}

interface TopicsAggregation extends AggregationsTermsAggregateBase {
  buckets: TopicBucket[];
}

interface CustomResponse {
  aggregations: {
    topics: TopicsAggregation;
  };
}

type ElasticsearchResponse = SearchResponse<unknown> & CustomResponse;

function calculateSentiment(sentimentBuckets: Array<{ key: string; doc_count: number }>): string {
  const scores = { Positive: 100, Neutral: 50, Negative: 0 };
  let totalScore = 0;
  let totalCount = 0;

  sentimentBuckets.forEach((bucket) => {
    const sentimentScore = scores[bucket.key as keyof typeof scores] ?? 0;
    totalScore += sentimentScore * bucket.doc_count;
    totalCount += bucket.doc_count;
  });

  return totalCount > 0 ? (totalScore / totalCount).toFixed(2) : '0';
}

export async function GET() {
  try {
    console.log('Connecting to Elasticsearch...');

    const searchResponse = await client.search<ElasticsearchResponse>({
      index: 'chat_interactions',
      size: 0,
      body: {
        query: {
          range: {
            timestamp: {
              gte: 'now-7d/d',
            },
          },
        },
        aggs: {
          topics: {
            terms: {
              field: 'topic_classification.keyword',
              size: 9,
            },
            aggs: {
              avg_urgency: {
                avg: {
                  field: 'urgency_level',
                },
              },
              sentiment_distribution: {
                terms: {
                  field: 'sentiment.keyword',
                },
              },
            },
          },
        },
      },
    });

    const aggregations = searchResponse.aggregations;

    // Assert the type of `topics` explicitly
    const topicsAgg = aggregations?.topics as TopicsAggregation;
    if (!topicsAgg?.buckets || topicsAgg.buckets.length === 0) {
      console.log('No topics found in aggregations');
      return NextResponse.json({ topics: [] });
    }

    const topics = topicsAgg.buckets.map((bucket) => ({
      name: bucket.key,
      count: bucket.doc_count,
      urgency: Math.round(bucket.avg_urgency?.value ?? 0),
      sentiment: calculateSentiment(bucket.sentiment_distribution?.buckets || []),
    }));

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch topic data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}