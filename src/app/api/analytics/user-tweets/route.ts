// src/app/api/analytics/user-tweets/route.ts
import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';
import type { SortOrder } from '@elastic/elasticsearch/lib/api/types'; // Import tipe SortOrder

const client = new Client({
  node: 'http://57.155.112.231:9200'
});

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

    let searchQuery;

    if (nodeType === 'hashtag') {
      // Query untuk hashtag
      searchQuery = {
        index: 'twitter_jakarta',
        body: {
          query: {
            match: {
              'hastags': originalUsername
            }
          },
          sort: [{ 'date': { order: 'desc' as const } }], // Gunakan 'as const'
          size: 20
        }
      };
    } else {
      // Query untuk user/mention
      searchQuery = {
        index: 'twitter_jakarta',
        body: {
          query: {
            bool: {
              should: [
                {
                  match: {
                    'username': cleanUsername
                  }
                },
                {
                  match: {
                    'mentions': originalUsername
                  }
                }
              ],
              minimum_should_match: 1
            }
          },
          sort: [{ 'date': { order: 'desc' as const } }], // Gunakan 'as const'
          size: 20
        }
      };
    }

    const result = await client.search(searchQuery);

    if (!result.hits.hits.length) {
      return NextResponse.json({
        tweets: [],
        meta: {
          total: 0,
          query_term: originalUsername,
          clean_query_term: cleanUsername,
          node_type: nodeType,
          breakdown: {
            as_author: 0,
            as_mentioned: 0,
            in_hashtag: 0
          }
        }
      });
    }

    const tweets = result.hits.hits.map((hit: any) => {
      const source = hit._source;
      return {
        username: source.username,
        full_text: source.full_text,
        created_at: source.created_at,
        topic_classification: source.topic_classification || 'Unclassified',
        sentiment: source.sentiment || 'Neutral',
        urgency_level: source.urgency_level || 0,
        target_audience: source.target_audience || [],
        link_post: source.link_post,
        mentions: (source.mentions || []).map((m: string) => `@${m.replace('@', '')}`),
        hastags: (source.hastags || []).map((h: string) => `#${h.replace('#', '')}`),
        relation_type: nodeType === 'hashtag' ? 'hashtag' :
                       cleanUsername === source.username ? 'author' :
                       (source.mentions || []).includes(cleanUsername) ? 'mentioned' : 'unknown'
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
      

    return NextResponse.json({ 
      tweets,
      meta
    });

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
