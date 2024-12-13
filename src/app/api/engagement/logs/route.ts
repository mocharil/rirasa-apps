import { client } from '@/lib/elasticsearch'
import { NextResponse } from 'next/server';

interface ChatLog {
  user_id: string;
  username: string;
  message_text: string;
  bot_response: string;
  timestamp: string;
  response_time_ms: number;
  affected_region: string;
  topic_classification: string;
  urgency_level: number;
  sentiment:string;
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || '';

    const query = {
      bool: {
        must: [
          searchQuery
            ? {
                multi_match: {
                  query: searchQuery,
                  fields: ['message_text', 'bot_response', 'user_id'],
                },
              }
            : {
                match_all: {},
              },
        ],
      },
    };

    const response = await client.search({
      index: 'chat_interactions',
      body: {
        query,
        sort: [{ timestamp: { order: 'desc' } }],
        size: 100, // Limit to last 100 messages
      },
    });

    const logs = response.hits.hits.map(hit => {
      const source = hit._source as ChatLog;

      return {
        user_id: source.user_id,
        username: source.username,
        message_text: source.message_text,
        bot_response: source.bot_response,
        timestamp: source.timestamp,
        response_time_ms: source.response_time_ms,
        affected_region: source.affected_region, // Add affected_region
        topic_classification: source.topic_classification, // Add topic_classification
        urgency_level: source.urgency_level, // Add urgency_level
        sentiment: source.sentiment, // Add urgency_level
      };
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching chat logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat logs' },
      { status: 500 }
    );
  }
}
