import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';
import type { SortOrder } from '@elastic/elasticsearch/lib/api/types';

interface TweetSource {
  username: string;
  full_text: string;
  date: string;
  topic_classification?: string;
  sentiment?: string;
  urgency_level?: number;
  target_audience?: string[];
  link_post?: string;
  mentions?: string | string[];
  hastags?: string | string[];
}

const client = new Client({
    node: 'http://localhost:9200',
    requestTimeout: 30000,
    maxRetries: 3,
    tls: {
      rejectUnauthorized: false
    }
  });

// Helper function to ensure array type
const ensureArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }
  if (typeof value === 'string') {
    return [value];
  }
  return [];
};

// Helper function to format mentions
const formatMentions = (mentions: unknown): string[] => {
  const mentionsArray = ensureArray(mentions);
  return mentionsArray.map(mention => {
    const cleanMention = String(mention).replace(/^@+/, '');
    return `@${cleanMention}`;
  });
};

// Helper function to format hashtags
const formatHashtags = (hashtags: unknown): string[] => {
  const hashtagsArray = ensureArray(hashtags);
  return hashtagsArray.map(hashtag => {
    const cleanHashtag = String(hashtag).replace(/^#+/, '');
    return `#${cleanHashtag}`;
  });
};

export async function GET(request: Request) {
  let originalUsername = '';
  let cleanUsername = '';

  try {
    const { searchParams } = new URL(request.url);
    originalUsername = searchParams.get('username') || '';

    if (!originalUsername) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Hapus @ dan # dari input
    cleanUsername = originalUsername.replace(/[@#]/g, '');
    console.log('Original input:', originalUsername);
    console.log('Cleaned username:', cleanUsername);

    // Tentukan jenis node berdasarkan input original
    const nodeType = originalUsername.startsWith('@') ? 'user/mention' :
                    originalUsername.startsWith('#') ? 'hashtag' : 'user';

    console.log('Node type:', nodeType);

    const searchQuery = {
      index: 'twitter_jakarta',
      _source: [
        'username',
        'full_text',
        'date',
        'topic_classification',
        'sentiment',
        'urgency_level',
        'target_audience',
        'link_post',
        'mentions',
        'hastags'
      ],
      body: {
        query: nodeType === 'hashtag' ? {
          match: {
            'hastags': originalUsername
          }
        } : {
          bool: {
            should: [
              { match: { 'username': cleanUsername } },
              { match: { 'mentions': originalUsername } }
            ],
            minimum_should_match: 1
          }
        },
        sort: [{ 'urgency_level': { order: 'desc' as SortOrder } }],
        size: 30
      }
    };

    const result = await client.search(searchQuery);

    if (!result.hits.hits.length) {
      return NextResponse.json({
        tweets: [],
        meta: {
          total: 0,
          query_term: originalUsername,
          clean_query_term: cleanUsername,
          node_type: nodeType,
          breakdown: { as_author: 0, as_mentioned: 0, in_hashtag: 0 }
        }
      });
    }

    const tweets = result.hits.hits.map((hit: any) => {
      const source = hit._source as TweetSource;
      
      return {
        username: source.username,
        full_text: source.full_text,
        date: source.date,
        topic_classification: source.topic_classification || 'Unclassified',
        sentiment: source.sentiment || 'Neutral',
        urgency_level: source.urgency_level || 0,
        target_audience: source.target_audience || [],
        link_post: source.link_post,
        mentions: formatMentions(source.mentions),
        hastags: formatHashtags(source.hastags),
        relation_type: nodeType === 'hashtag' ? 'hashtag' :
                      cleanUsername === source.username ? 'author' :
                      formatMentions(source.mentions).includes(`@${cleanUsername}`) ? 'mentioned' : 'unknown'
      };
    });

    const meta = {
      total: typeof result.hits.total === 'object' ? result.hits.total.value : result.hits.total || 0,
      query_term: originalUsername,
      clean_query_term: cleanUsername,
      node_type: nodeType,
      breakdown: {
        as_author: tweets.filter(t => t.relation_type === 'author').length,
        as_mentioned: tweets.filter(t => t.relation_type === 'mentioned').length,
        in_hashtag: tweets.filter(t => t.relation_type === 'hashtag').length
      }
    };

    return NextResponse.json({ tweets, meta });

  } catch (error: any) {
    console.error('Error details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch related tweets',
        details: error instanceof Error ? error.message : 'Unknown error',
        query: {
          original: originalUsername,
          clean: cleanUsername
        }
      }, 
      { status: 500 }
    );
  }
}