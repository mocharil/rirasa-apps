// src/app/api/analytics/enhanced-twitter/route.ts
import { NextResponse } from 'next/server';
// Menjadi:
import { client } from '@/lib/elasticsearch'

interface DateRange {
    gte: string;
    lt: string;
  }

  // Define possible query types
type QueryTypes = {
    range?: { date: DateRange };
    term?: { [key: string]: string };
  }
  
  // Define the base query interface
  interface ESBaseQuery {
    bool: {
      must: QueryTypes[];
    }
  }

  export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const timeRange = searchParams.get('timeRange') || 'daily';
      const region = searchParams.get('region') || 'all';
  
      // Calculate date ranges
      let dateRange: DateRange;
      switch (timeRange) {
        case 'weekly':
          dateRange = { gte: 'now-7d/d', lt: 'now/d' };
          break;
        case 'monthly':
          dateRange = { gte: 'now-30d/d', lt: 'now/d' };
          break;
        default: // daily
          dateRange = { gte: 'now-24h', lt: 'now' };
      }
  
      // Initialize base query with proper typing
      const baseQuery: ESBaseQuery = {
        bool: {
          must: [
            { range: { date: dateRange } }
          ]
        }
      };
  
      // Add region filter if specified
      if (region !== 'all') {
        baseQuery.bool.must.push({
          term: { 'affected_region.keyword': region }
        });
      }

    // Fetch comprehensive analytics
    const result = await client.search({
      index: 'twitter_jakarta',
      size: 0,
      body: {
        query: baseQuery,
        aggs: {
          // Sentiment Distribution
          sentiment_distribution: {
            terms: {
              field: 'sentiment.keyword'
            }
          },

          // Sentiment Over Time
          sentiment_trends: {
            date_histogram: {
              field: 'date',
              calendar_interval: timeRange === 'monthly' ? 'day' : 'hour'
            },
            aggs: {
              sentiments: {
                terms: {
                  field: 'sentiment.keyword'
                }
              }
            }
          },

          // Urgency Levels Distribution
          urgency_distribution: {
            range: {
              field: 'urgency_level',
              ranges: [
                { to: 30, key: 'Low' },
                { from: 30, to: 70, key: 'Medium' },
                { from: 70, key: 'High' }
              ]
            },
            aggs: {
              top_topics: {
                terms: {
                  field: 'topic_classification.keyword',
                  size: 3
                }
              }
            }
          },

          // Top Engaging Posts
          top_posts: {
            top_hits: {
              size: 10,
              sort: [
                { views_count: { order: 'desc' } },
                { favorite_count: { order: 'desc' } }
              ],
              _source: {
                includes: [
                  'full_text',
                  'views_count',
                  'favorite_count',
                  'retweet_count',
                  'sentiment',
                  'urgency_level',
                  'affected_region',
                  'link_post'
                ]
              }
            }
          },

          // Keyword Analysis
          keyword_analysis: {
            terms: {
              field: 'contextual_keywords.keyword',
              size: 50
            }
          },

          // Hashtag Analysis
          hashtag_analysis: {
            terms: {
              field: 'hastags.keyword',
              size: 30
            }
          },

          // Regional Sentiment
          regional_sentiment: {
            terms: {
              field: 'affected_region.keyword'
            },
            aggs: {
              sentiment_breakdown: {
                terms: {
                  field: 'sentiment.keyword'
                }
              }
            }
          },

          // Engagement Metrics Over Time
          engagement_trends: {
            date_histogram: {
              field: 'date',
              calendar_interval: timeRange === 'monthly' ? 'day' : 'hour'
            },
            aggs: {
              avg_views: { avg: { field: 'views_count' } },
              avg_favorites: { avg: { field: 'favorite_count' } },
              avg_retweets: { avg: { field: 'retweet_count' } },
              avg_replies: { avg: { field: 'reply_count' } }
            }
          },

          // Audience Analysis
          audience_distribution: {
            terms: {
              field: 'target_audience.keyword',
              size: 10
            }
          },

          // AI Recommendations
          critical_issues: {
            filter: {
              bool: {
                must: [
                  { range: { urgency_level: { gte: 70 } } }
                ]
              }
            },
            aggs: {
              by_topic: {
                terms: {
                  field: 'topic_classification.keyword',
                  size: 5
                },
                aggs: {
                  by_region: {
                    terms: {
                      field: 'affected_region.keyword'
                    },
                    aggs: {
                      sentiment_analysis: {
                        terms: {
                          field: 'sentiment.keyword'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Process and format recommendations
    const recommendations = processRecommendations(result.aggregations?.critical_issues);

    return NextResponse.json({
      timeRange,
      region,
      sentimentDistribution: result.aggregations?.sentiment_distribution,
      sentimentTrends: result.aggregations?.sentiment_trends,
      urgencyDistribution: result.aggregations?.urgency_distribution,
      topPosts: result.aggregations?.top_posts,
      keywords: result.aggregations?.keyword_analysis,
      hashtags: result.aggregations?.hashtag_analysis,
      regionalSentiment: result.aggregations?.regional_sentiment,
      engagementTrends: result.aggregations?.engagement_trends,
      audienceDistribution: result.aggregations?.audience_distribution,
      recommendations
    });

  } catch (error) {
    console.error('Enhanced Twitter Analytics Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enhanced analytics data' },
      { status: 500 }
    );
  }
}

function processRecommendations(criticalIssues: any) {
  if (!criticalIssues?.by_topic?.buckets) return [];

  return criticalIssues.by_topic.buckets.map((topic: any) => {
    const topRegion = topic.by_region.buckets[0];
    const dominantSentiment = topRegion?.sentiment_analysis.buckets[0]?.key || 'neutral';

    return {
      topic: topic.key,
      region: topRegion?.key,
      sentiment: dominantSentiment,
      urgencyLevel: 'High',
      recommendation: generateRecommendation(topic.key, topRegion?.key, dominantSentiment)
    };
  });
}

function generateRecommendation(topic: string, region: string, sentiment: string) {
  const actions = {
    negative: [
      'Increase public communication',
      'Schedule community meetings',
      'Develop action plans',
      'Allocate emergency resources'
    ],
    neutral: [
      'Monitor situation closely',
      'Gather public feedback',
      'Prepare contingency plans',
      'Enhance public awareness'
    ],
    positive: [
      'Maintain current approach',
      'Share success stories',
      'Build on positive momentum',
      'Expand successful programs'
    ]
  };

  const sentimentKey = sentiment.toLowerCase() as keyof typeof actions;
  const action = actions[sentimentKey][Math.floor(Math.random() * actions[sentimentKey].length)];

  return `${action} regarding ${topic} in ${region}.`;
}