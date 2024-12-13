import { NextResponse } from 'next/server';
import { client } from '@/lib/elasticsearch'
import type { QueryDslOperator } from '@elastic/elasticsearch/lib/api/types';



export async function POST(request: Request) {
  try {
    const {
      query,
      source = 'news',
      page = 1,
      itemsPerPage = 10,
      filters,
    } = await request.json();

    const mustConditions: any[] = [];

    if (query) {
      mustConditions.push({
        multi_match: {
          query,
          fields: ['content', 'title', 'description', 'full_text'],
          type: 'best_fields',
          operator: 'and' as QueryDslOperator, // Fixing the operator type
          minimum_should_match: '75%',
        },
      });
    }

    if (filters?.dateRange?.from && filters?.dateRange?.to) {
      mustConditions.push({
        range: {
          [source === 'news' ? 'publish_at' : 'date']: {
            gte: filters.dateRange.from,
            lte: filters.dateRange.to,
          },
        },
      });
    }

    if (filters?.categories?.length) {
      mustConditions.push({
        terms: {
          'topic_classification.keyword': filters.categories,
        },
      });
    }

    if (filters?.urgencyLevel?.length) {
      const urgencyRanges = filters.urgencyLevel.map((level: string) => {
        switch (level) {
          case 'High':
            return { range: { urgency_level: { gte: 80 } } };
          case 'Medium':
            return {
              range: { urgency_level: { gte: 50, lt: 80 } },
            };
          case 'Low':
            return { range: { urgency_level: { lt: 50 } } };
          default:
            return null;
        }
      }).filter(Boolean);

      if (urgencyRanges.length) {
        mustConditions.push({
          bool: {
            should: urgencyRanges,
            minimum_should_match: 1,
          },
        });
      }
    }

    if (filters?.sentiment?.length) {
      mustConditions.push({
        terms: {
          'sentiment.keyword': filters.sentiment,
        },
      });
    }

    if (filters?.region?.length) {
      mustConditions.push({
        terms: {
          'affected_region.keyword': filters.region,
        },
      });
    }

    const searchBody = {
      size: itemsPerPage,
      from: (page - 1) * itemsPerPage,
      _source: source === 'news'
        ? [
            'title',
            'url',
            'image_url',
            'content',
            'description',
            'publish_at',
            'sentiment',
            'topic_classification',
            'urgency_level',
            'target_audience',
            'affected_region',
          ]
        : [
            'id',
            'full_text',
            'link_post',
            'link_image_url',
            'username',
            'name',
            'date',
            'time',
            'sentiment',
            'topic_classification',
            'urgency_level',
            'target_audience',
            'affected_region',
            'favorite_count',
            'retweet_count',
            'reply_count',
            'views_count',
          ],
      query: {
        bool: {
          must: mustConditions.length ? mustConditions : [{ match_all: {} }],
        },
      },
      sort: [{ [source === 'news' ? 'publish_at' : 'date']: 'desc' }],
      track_total_hits: true,
    };


    const result = await client.search({
      index: source === 'news' ? 'news_jakarta' : 'twitter_jakarta',
      body: searchBody,
    });

    const total =
      typeof result.hits.total === 'number'
        ? result.hits.total
        : result.hits.total?.value || 0;

    return NextResponse.json({
      hits: result.hits.hits,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / itemsPerPage),
        itemsPerPage,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search content' },
      { status: 500 }
    );
  }
}
