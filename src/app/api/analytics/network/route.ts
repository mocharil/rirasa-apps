// src/app/api/analytics/network/route.ts
import { NextResponse } from 'next/server';
import type { Node, Edge } from 'reactflow';
import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://57.155.112.231:9200'
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'Jakarta Pusat';

    // Build query dynamically based on region
    const mustQuery = region === 'All Data' ? [] : [
      {
        match: {
          'affected_region.keyword': region
        }
      }
    ];

    const result = await client.search({
      index: 'twitter_jakarta',
      size: 10000,
      query: {
        bool: {
          must: mustQuery,
          filter: [
            { exists: { field: 'hastags' } },
            { exists: { field: 'mentions' } }
          ]
        }
      },
      sort: [{ "date": "desc" }]
    });

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeMap = new Map(); // Stores nodes and connection counts
    const edgeSet = new Set(); // Prevent duplicate edges

    // Helper function to add a unique node with connection count tracking
    const addNode = (id: string, label: string, type: string) => {
      if (!nodeMap.has(id)) {
        nodeMap.set(id, { label, type, connections: 0 });
      }
    };

    // Helper function to add a unique edge and update connection count for nodes
    const addEdge = (source: string, target: string, type: string) => {
      const edgeId = `${source}-${target}-${type}`;
      if (!edgeSet.has(edgeId)) {
        edges.push({
          id: edgeId,
          source,
          target,
          animated: true,
          style: {
            stroke: type === 'hashtag' ? '#22c55e' : '#ef4444'
          }
        });
        edgeSet.add(edgeId);

        // Increment connection counts for source and target nodes
        if (nodeMap.has(source)) nodeMap.get(source).connections += 1;
        if (nodeMap.has(target)) nodeMap.get(target).connections += 1;
      }
    };

    // Process tweets
    result.hits.hits.forEach((hit: any) => {
      const tweet = hit._source;

      // Add user node
      const userId = `user-${tweet.username}`;
      addNode(userId, tweet.username, 'user');

      // Process hashtags and create edges
      if (tweet.hastags && Array.isArray(tweet.hastags)) {
        tweet.hastags.forEach((hashtag: string) => {
          const hashtagId = `hashtag-${hashtag}`;
          addNode(hashtagId, hashtag, 'hashtag');
          addEdge(userId, hashtagId, 'hashtag');
        });
      }

      // Process mentions and create edges
      if (tweet.mentions && Array.isArray(tweet.mentions)) {
        tweet.mentions.forEach((mention: string) => {
          const mentionId = `mention-${mention}`;
          addNode(mentionId, mention, 'mention');
          addEdge(userId, mentionId, 'mention');
        });
      }
    });

    // Transform nodeMap to nodes array with weights based on connections
    nodeMap.forEach((value, id) => {
      const weight = Math.min(10, value.connections + 1); // Limit max weight to 10 for visualization
      nodes.push({
        id,
        type: value.type,
        position: {
          x: Math.random() * 1200,
          y: Math.random() * 800
        },
        data: {
          label: value.label,
          type: value.type,
          weight
        },
        style: {
          background: value.type === 'user' ? '#6366f1' :
                     value.type === 'hashtag' ? '#22c55e' : '#ef4444',
          color: 'white',
          padding: '5px',
          borderRadius: '3px',
          fontSize: '10px',
          width: 'auto',
          minWidth: '80px',
          maxWidth: '120px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          cursor: 'pointer'
        }
      });
    });

    return NextResponse.json({
      nodes,
      edges,
      meta: {
        region,
        totalNodes: nodes.length,
        totalEdges: edges.length
      }
    });

  } catch (error) {
    console.error('Network analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch network data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
