// src/app/api/dashboard/route.ts

import { NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'

const client = new Client({
  node: 'http://localhost:9200'
})

interface NewsMetrics {
  totalArticles: number;
  urgentArticles: number;
  governmentMentions: number;
  publicSentiment: number;
  regionalImpact: number;
  topicDistribution: {
    [key: string]: number;
  };
}

interface TwitterMetrics {
  totalEngagements: number;
  citizenReach: number;
  activeDiscussions: number;
  publicResponse: number;
  totalTweets: number;
  avgEngagementRate: number;
}

interface TweetSource {
  favorite_count: number;
  retweet_count: number;
  reply_count: number;
  views_count: number;
}

interface Insight {
  date: string;
  insight: Array<{ urgency_score: number }>;
}

const calculateNewsMetrics = async (hits: any[]): Promise<NewsMetrics> => {
  // Filter urgent articles (urgency_level >= 80)
  const urgentArticles = hits.filter(hit => 
    hit._source.urgency_level >= 80
  ).length;
  
  // Count government-related articles
  const govMentions = hits.filter(hit => 
    hit._source.topic_classification === "Government and Public Policy"
  ).length;
  
  // Calculate positive sentiment percentage
  const positiveSentiment = hits.filter(hit => 
    hit._source.sentiment === "Positive"
  ).length;

  // Count articles with regional impact
  const regionalImpact = hits.filter(hit => 
    hit._source.affected_region === "DKI Jakarta"
  ).length;

  // Calculate topic distribution
  const topicDistribution = hits.reduce((acc: { [key: string]: number }, hit) => {
    const topic = hit._source.topic_classification;
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {});

  return {
    totalArticles: hits.length,
    urgentArticles,
    governmentMentions: govMentions,
    publicSentiment: hits.length > 0 ? (positiveSentiment / hits.length) * 100 : 0,
    regionalImpact,
    topicDistribution
  };
};

const calculateTwitterMetrics = async (hits: any[]): Promise<TwitterMetrics> => {
  // Calculate total engagements
  const totalEngagements = hits.reduce((acc, tweet) => {
    const source = tweet._source as TweetSource;
    return acc + 
      Number(source.favorite_count || 0) +
      Number(source.retweet_count || 0) +
      Number(source.reply_count || 0);
  }, 0);

  // Calculate total reach (views)
  const totalReach = hits.reduce((acc, tweet) => {
    const source = tweet._source as TweetSource;
    return acc + Number(source.views_count || 0);
  }, 0);

  // Count active discussions (tweets with replies)
  const activeDiscussions = hits.filter(tweet => 
    Number(tweet._source.reply_count) > 0
  ).length;

  // Calculate positive sentiment percentage
  const positiveSentiment = hits.filter(tweet => 
    tweet._source.sentiment === "Positive"
  ).length;

  // Calculate average engagement rate
  const avgEngagementRate = hits.length > 0 ? 
    (totalEngagements / hits.length) : 0;

  return {
    totalEngagements,
    citizenReach: totalReach,
    activeDiscussions,
    publicResponse: hits.length > 0 ? (positiveSentiment / hits.length) * 100 : 0,
    totalTweets: hits.length,
    avgEngagementRate
  };
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const source = url.searchParams.get('source') || 'news';
    const page = parseInt(url.searchParams.get('page') || '1');
    const itemsPerPage = parseInt(url.searchParams.get('itemsPerPage') || '10');
    const from = (page - 1) * itemsPerPage;

    // First, get overall stats (without pagination)
    const statsQuery = await client.search({
      index: source === 'news' ? 'news_jakarta' : 'twitter_jakarta',
      body: {
        size: 0, // We don't need the documents, just the aggregations
        aggs: {
          urgent_count: {
            filter: {
              range: {
                urgency_level: { gte: 80 }
              }
            }
          },
          government_coverage: {
            filter: {
              term: {
                'topic_classification.keyword': 'Government and Public Policy'
              }
            }
          },
          sentiment_distribution: {
            terms: {
              field: 'sentiment.keyword'
            }
          },
          total_engagements: {
            sum: {
              field: source === 'twitter' ? 'favorite_count' : '_score'
            }
          },
          total_views: {
            sum: {
              field: source === 'twitter' ? 'views_count' : '_score'
            }
          },
          active_discussions: {
            filter: {
              range: {
                [source === 'twitter' ? 'reply_count' : '_score']: { gt: 0 }
              }
            }
          }
        }
      }
    });

    // Get total documents
    const totalDocs = await client.count({
      index: source === 'news' ? 'news_jakarta' : 'twitter_jakarta'
    });

    // Get paginated content for display
    const contentResult = await client.search({
      index: source === 'news' ? 'news_jakarta' : 'twitter_jakarta',
      body: {
        size: itemsPerPage,
        from,
        sort: [{ [source === 'news' ? 'publish_at' : 'date']: "desc" }],
        _source: source === 'news' ? [
          "title",
          "url",
          "image_url",
          "content",
          "description",
          "publish_at",
          "sentiment",
          "topic_classification",
          "urgency_level",
          "target_audience",
          "affected_region",
          "contextual_keywords",
          "creator"
        ] : [
          "id",
          "full_text",
          "link_post",
          "link_image_url",
          "username",
          "name",
          "date",
          "time",
          "sentiment",
          "topic_classification",
          "urgency_level",
          "target_audience",
          "affected_region",
          "favorite_count",
          "retweet_count",
          "reply_count",
          "views_count",
          "contextual_keywords"
        ]
      }
    });

    // Calculate metrics from aggregations
    const aggs = statsQuery.aggregations;
    const metrics = source === 'news' 
    ? {
        totalArticles: totalDocs.count,
        urgentArticles: (aggs?.urgent_count as { doc_count: number })?.doc_count || 0,
        governmentMentions: (aggs?.government_coverage as { doc_count: number })?.doc_count || 0,
        publicSentiment: totalDocs.count > 0 ? 
          ((aggs?.sentiment_distribution as { buckets: Array<{ key: string, doc_count: number }> })?.buckets?.find(
            b => b.key === 'Positive'
          )?.doc_count || 0) / totalDocs.count * 100 : 0,
        regionalImpact: 0, // Add appropriate calculation if needed
        topicDistribution: {}
      }
    : {
        totalEngagements: (aggs?.total_engagements as { value: number })?.value || 0,
        citizenReach: (aggs?.total_views as { value: number })?.value || 0,
        activeDiscussions: (aggs?.active_discussions as { doc_count: number })?.doc_count || 0,
        publicResponse: totalDocs.count > 0 ? 
          ((aggs?.sentiment_distribution as { buckets: Array<{ key: string, doc_count: number }> })?.buckets?.find(
            b => b.key === 'Positive'
          )?.doc_count || 0) / totalDocs.count * 100 : 0,
        totalTweets: totalDocs.count,
        avgEngagementRate: totalDocs.count > 0 ? 
          ((aggs?.total_engagements as { value: number })?.value || 0) / totalDocs.count : 0
      };

    // Get insights (unchanged)
    const insightResult = await client.search({
      index: source === 'news' ? 'insight_news_jakarta' : 'insight_twitter_jakarta',
      body: {
        size: 1,
        sort: [{ date: "desc" }]
      }
    });

    // Format insights (unchanged)
    const formattedInsight = insightResult.hits.hits[0]?._source as Insight || {
      date: new Date().toISOString().split('T')[0],
      insight: []
    };

    formattedInsight.insight = formattedInsight.insight
      .sort((a, b) => b.urgency_score - a.urgency_score)
      .slice(0, 5);

    return NextResponse.json({
      stats: metrics,
      data: contentResult.hits.hits,
      total: totalDocs.count,
      insights: {
        [source]: formattedInsight
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalDocs.count / itemsPerPage),
        itemsPerPage
      }
    });

  } catch (error: any) {
    console.error('API error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      meta: error.meta?.body?.error,
      status: error.meta?.statusCode
    });

    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data',
        details: {
          message: error.message,
          meta: error.meta?.body?.error,
          status: error.meta?.statusCode
        }
      },
      { status: error.meta?.statusCode || 500 }
    );
  }
}