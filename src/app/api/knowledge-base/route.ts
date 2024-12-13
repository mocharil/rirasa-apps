// app/api/knowledge-base/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/lib/elasticsearch'
import type { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

// Define the structure of the documents in your knowledge base
interface KnowledgeBaseDocument {
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}



export async function GET() {
  try {
    // Specify the type for _source in the search response
    const result = await client.search<SearchResponse<KnowledgeBaseDocument>>({
      index: 'knowledge_base',
      body: {
        sort: [{ created_at: 'desc' }],
        size: 100,
      },
    });

    // Ensure _source is safely accessed and typed
    const entries = result.hits.hits.map((hit) => {
      const source = hit._source; // Optional chaining to ensure _source exists
      if (!source) {
        throw new Error(`Missing _source for document with ID ${hit._id}`);
      }
      return {
        id: hit._id,
        ...source, // Spread only after confirming _source exists
      };
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const result = await client.index({
      index: 'knowledge_base',
      document: {
        ...body,
        created_at: now,
        updated_at: now,
      },
    });

    return NextResponse.json({
      success: true,
      id: result._id,
    });
  } catch (error) {
    console.error('Error adding knowledge base entry:', error);
    return NextResponse.json(
      { error: 'Failed to add knowledge base entry' },
      { status: 500 }
    );
  }
}
