import { Client } from '@elastic/elasticsearch'
import { NextResponse } from 'next/server'

const client = new Client({
  node: 'http://localhost:9200'
})

export async function GET() {
  try {
    // Get active users (last 24 hours)
    const activeUsersResponse = await client.search({
      index: 'chat_interactions',
      body: {
        query: {
          range: {
            timestamp: {
              gte: 'now-24h'
            }
          }
        },
        aggs: {
          unique_users: {
            cardinality: {
              field: 'user_id'
            }
          }
        },
        size: 0
      }
    })

    // Get daily interactions count
    const dailyInteractionsResponse = await client.count({
      index: 'chat_interactions',
      body: {
        query: {
          range: {
            timestamp: {
              gte: 'now-24h'
            }
          }
        }
      }
    })

    // Get average response time
    const avgResponseTimeResponse = await client.search({
      index: 'chat_interactions',
      body: {
        aggs: {
          avg_response_time: {
            avg: {
              field: 'response_time_ms'
            }
          }
        },
        size: 0
      }
    })

    // Calculate response rate (successful responses / total interactions)
    const responseRateResponse = await client.count({
      index: 'chat_interactions',
      body: {
        query: {
          bool: {
            must_not: {
              term: {
                bot_response: ''
              }
            }
          }
        }
      }
    })

    const totalInteractions = await client.count({
      index: 'chat_interactions'
    })

    const responseRate = (responseRateResponse.count / totalInteractions.count) * 100

    // Prepare the response
    const stats = {
      activeUsers: (activeUsersResponse.aggregations?.unique_users as { value: number })?.value || 0,
      dailyInteractions: dailyInteractionsResponse.count,
      responseRate: Math.round(responseRate),
      avgResponseTime: Math.round(((avgResponseTimeResponse.aggregations?.avg_response_time as { value: number })?.value || 0) / 1000) // Convert to seconds
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching engagement stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch engagement statistics' },
      { status: 500 }
    )
  }
}
