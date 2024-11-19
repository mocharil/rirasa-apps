// src/app/api/search/route.ts

import { NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'

const client = new Client({
  node: 'http://localhost:9200'
})

export async function POST(request: Request) {
  try {
    const { query, source, page = 1, itemsPerPage = 10 } = await request.json()

    const searchBody = {
      size: itemsPerPage,
      from: (page - 1) * itemsPerPage,
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
        "affected_region"
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
        "views_count"
      ],
      query: query ? {
        multi_match: {
          query,
          fields: ["content", "title", "description", "full_text"],
          type: "best_fields" as const, // Menambahkan `as const` untuk memastikan tipe literal
          operator: "and" as const, // Menambahkan `as const` di sini juga
          minimum_should_match: "75%"
        }
      } : {
        match_all: {}
      },
      sort: [
        { [source === 'news' ? 'publish_at' : 'date']: "desc" as const } // Tambahkan `as const` di sini
      ]
    }
    

    const result = await client.search({
      index: source === 'news' ? 'news_jakarta' : 'twitter_jakarta',
      body: searchBody
    })

    // Get total safely
    const total = typeof result.hits.total === 'number'
      ? result.hits.total
      : result.hits.total?.value || 0

    return NextResponse.json({
      hits: result.hits.hits,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / itemsPerPage),
        itemsPerPage
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search content' },
      { status: 500 }
    )
  }
}