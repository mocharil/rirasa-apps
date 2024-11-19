import { Client } from '@elastic/elasticsearch'
import { NextResponse } from 'next/server'

// Definisikan interface untuk struktur data source
interface ChatLog {
  user_id: string;
  username: string;
  message_text: string;
  bot_response: string;
  timestamp: string;
  response_time_ms: number;
}

const client = new Client({
  node: 'http://localhost:9200'
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('search') || ''

    const query = {
      bool: {
        must: [
          searchQuery ? {
            multi_match: {
              query: searchQuery,
              fields: ['message_text', 'bot_response', 'user_id']
            }
          } : {
            match_all: {}
          }
        ]
      }
    }

    const response = await client.search({
      index: 'chat_interactions',
      body: {
        query,
        sort: [
          { timestamp: { order: 'desc' } }
        ],
        size: 100 // Limit to last 100 messages
      }
    })

    const logs = response.hits.hits.map(hit => ({
      user_id: (hit._source as ChatLog).user_id,
      username: (hit._source as ChatLog).username,
      message_text: (hit._source as ChatLog).message_text,
      bot_response: (hit._source as ChatLog).bot_response,
      timestamp: (hit._source as ChatLog).timestamp,
      response_time_ms: (hit._source as ChatLog).response_time_ms
    }))

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error fetching chat logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat logs' },
      { status: 500 }
    )
  }
}