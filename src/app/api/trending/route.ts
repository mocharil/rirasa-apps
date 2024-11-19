import { NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'
import { type NextRequest } from 'next/server'

const client = new Client({
  node: 'http://localhost:9200'
})

export async function GET(request: NextRequest) {
  // Get source from query parameter
  const searchParams = request.nextUrl.searchParams
  const source = searchParams.get('source')

  try {
    if (source === 'twitter') {
      // Fetch Twitter insights
      const result = await client.search({
        index: 'insight_twitter_jakarta',
        body: {
          size: 1,
          sort: [
            {
              date: {
                order: "desc"
              }
            }
          ]
        }
      })

      if (result.hits.hits.length === 0) {
        return NextResponse.json({ data: null })
      }

      return NextResponse.json({ data: result.hits.hits[0]._source })
    } else {
      // Fetch News trending topics
      const result = await client.search({
        index: 'news_jakarta',
        body: {
          size: 0,
          query: {
            bool: {
              must: [
                {
                  range: {
                    publish_at: {
                      gte: 'now-7d/d',
                      lte: 'now'
                    }
                  }
                }
              ],
              must_not: [
                {
                  multi_match: {
                    query: "israel gaza palestina",
                    fields: ["content", "title", "description"],
                    operator: "or"
                  }
                }
              ]
            }
          },
          aggs: {
            filtered_trending_keywords: {
              filter: {
                range: {
                  urgency_level: {
                    gt: 0
                  }
                }
              },
              aggs: {
                trending_keywords: {
                  terms: {
                    field: 'contextual_keywords.keyword',
                    size: 10
                  }
                }
              }
            }
          }
        }
      })

      // Type assertion to help TypeScript understand the structure
      const trending = (result.aggregations?.filtered_trending_keywords as {
        trending_keywords: { buckets: Array<{ key: string; doc_count: number }> }
      })?.trending_keywords?.buckets || [];

      return NextResponse.json({ trending })
    }
  } catch (error) {
    console.error('Failed to fetch trending topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending topics' },
      { status: 500 }
    )
  }
}

// Add types to help with response typing
export type TwitterInsightResponse = {
  data: {
    id: string;
    date: string;
    total_location: Array<{
      name: string;
      total: number;
    }>;
    total_hashtags: Array<{
      name: string;
      total: number;
    }>;
    total_mentions: Array<{
      name: string;
      total: number;
    }>;
  } | null;
}

export type NewsTopicsResponse = {
  trending: Array<{
    key: string;
    doc_count: number;
  }>;
}
