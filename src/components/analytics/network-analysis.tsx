// src/components/analytics/network-analysis.tsx
'use client';

import { X } from 'lucide-react';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { forceCollide, forceManyBody } from 'd3-force';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnalyticsData } from '@/types/analytics';

// Types
interface NetworkData {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    weight?: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    value?: number;
  }>;
  meta: {
    region: string;
    totalNodes: number;
    totalEdges: number;
  };
}

interface Tweet {
  username: string;
  full_text: string;
  date: string;
  topic_classification: string;
  sentiment: string;
  urgency_level: number;
  target_audience: string[];
  link_post?: string;
  mentions: string[];
  hastags: string[];
  relation_type: 'author' | 'mentioned' | 'hashtag' | 'unknown';
}

interface Summary {
  main_issue: string;
  problem: string;
  suggestion: string;
  urgency_score: string;
}

interface NetworkAnalysisProps {
  data: AnalyticsData;
}

// Constants and Helpers
const initialGraphData: NetworkData = {
  nodes: [],
  links: [],
  meta: { region: '', totalNodes: 0, totalEdges: 0 },
};

const regions = [
  "All Data",
  "DKI Jakarta",
  "East Jakarta",
  "Central Jakarta",
  "North Jakarta",
  "West Jakarta",
  "South Jakarta"
];

const getNodeColorByType = (type: string) => {
  switch (type) {
    case 'user':
      return '#6366f1';
    case 'hashtag':
      return '#22c55e';
    case 'mention':
      return '#ef4444';
    default:
      return '#94a3b8';
  }
};

const formatTweetsForSummary = (tweets: Tweet[]) => {
  return tweets.map(tweet => ({
    full_text: tweet.full_text,
    contextual_content: `Tweet ini dari ${tweet.username} dengan topik ${tweet.topic_classification} dan sentiment ${tweet.sentiment}`
  }));
};
export function NetworkAnalysis({ data }: NetworkAnalysisProps) {
  // State declarations
  const [graphData, setGraphData] = useState<NetworkData>(initialGraphData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("All Data");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeDetails, setNodeDetails] = useState<Tweet[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  const forceRef = useRef<any>(null);
  const fetchInProgress = useRef(false);

  // Callbacks
  const getNodeColor = useCallback((node: any) => {
    return getNodeColorByType(node.type);
  }, []);

  const fetchNetworkData = useCallback(async () => {
    if (fetchInProgress.current) return;
    
    try {
      fetchInProgress.current = true;
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/analytics/network?region=${encodeURIComponent(selectedRegion)}`);
      
      if (!response.ok) throw new Error('Failed to fetch network data');
      
      const responseData = await response.json();
      
      setGraphData({
        nodes: responseData.nodes.map((node: any) => ({
          id: node.id,
          label: node.data.label,
          type: node.type,
          weight: node.data.weight || 1,
          size: 8
        })),
        links: responseData.edges.map((edge: any) => ({
          source: edge.source,
          target: edge.target,
          value: 20,
          distance: 60
        })),
        meta: responseData.meta
      });
    } catch (err) {
      console.error('Error fetching network data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [selectedRegion]);

  const onNodeClick = useCallback(async (node: any) => {
    if (!node?.label) return;

    try {
      setDetailsLoading(true);
      setSelectedNode(node.label);
      setIsDetailOpen(true);
      setSummary(null);
      setSummaryLoading(true);
      
      const response = await fetch(`/api/analytics/user-tweets?username=${encodeURIComponent(node.label)}`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch user tweets');
      }
      
      const data = await response.json();
      if (!Array.isArray(data.tweets)) {
        throw new Error('Invalid tweets data format');
      }
      
      const sortedTweets = [...data.tweets].sort((a, b) => b.urgency_level - a.urgency_level);
      setNodeDetails(sortedTweets);
      
      try {
        const top20Tweets = sortedTweets.slice(0, 20);
        const formattedTweets = formatTweetsForSummary(top20Tweets);
      
        const summaryResponse = (await Promise.race([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/summarize/`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ search_results: formattedTweets })
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ])) as Response;
        
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          if (summaryData.summary) {
            setSummary(summaryData.summary);
          }
        }
      } catch (summaryError) {
        console.error('Error fetching summary:', summaryError);
        // Tambahkan log lebih detail
        if (summaryError instanceof Error) {
          console.error('Summary Error details:', summaryError.message);
        }
      }
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setNodeDetails([]);
    } finally {
      setDetailsLoading(false);
      setSummaryLoading(false);
    }
  }, []);

  const closeDetails = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedNode(null);
    setNodeDetails([]);
    setSummary(null);
  }, []);
  // Effects
  useEffect(() => {
    if (selectedRegion) {
      fetchNetworkData();
    }
  }, [selectedRegion, fetchNetworkData]);

  useEffect(() => {
    if (forceRef.current && graphData.nodes.length > 0) {
      forceRef.current.d3Force('collide', forceCollide((node: any) => (node.weight || 1) * 3));
      forceRef.current.d3Force('charge', forceManyBody().strength(-200));
    }
  }, [graphData.nodes.length]);

  // Render Methods
  const renderDetailsPanel = () => (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {selectedNode ? `Tweets related to ${selectedNode}` : 'Tweet Details'}
          </h3>
          <button
            onClick={closeDetails}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {/* Summary Section */}
          {summaryLoading ? (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-center text-gray-500">Generating summary from top 20 most urgent tweets...</p>
            </div>
          ) : summary ? (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <h4 className="font-semibold text-lg">Summary (Based on Top 20 Urgent Tweets)</h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-sm">Main Issue:</span>
                  <p className="text-sm text-gray-700">{summary.main_issue}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Problem:</span>
                  <p className="text-sm text-gray-700">{summary.problem}</p>
                </div>
                {summary.suggestion && (
                  <div>
                    <span className="font-medium text-sm">Suggestion:</span>
                    <p className="text-sm text-gray-700">{summary.suggestion}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Urgency Score:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    parseInt(summary.urgency_score) > 75 ? 'bg-red-100 text-red-800' :
                    parseInt(summary.urgency_score) > 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {summary.urgency_score}
                  </span>
                </div>
              </div>
            </div>
          ) : nodeDetails.length > 0 ? (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">
                  Summary service unavailable. Showing tweets ordered by urgency.
                </span>
              </div>
            </div>
          ) : null}

          {/* Tweets List */}
          {detailsLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <div className="text-lg">Loading tweets...</div>
            </div>
          ) : nodeDetails.length === 0 ? (
            <p className="text-gray-500">No tweets found for {selectedNode}</p>
          ) : (
            <div className="space-y-4">
              {[...nodeDetails]
                .sort((a, b) => b.urgency_level - a.urgency_level)
                .map((tweet, index) => (
                  <Card key={index} className={`p-4 border ${index < 20 ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{tweet.username}</span>
                        <div className="flex items-center gap-2">
                          {index < 20 && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                              Top 20 Urgent
                            </span>
                          )}
                          <span className="text-gray-500 text-sm">
                            {new Date(tweet.date).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">{tweet.full_text}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          tweet.sentiment === 'Positive' ? 'bg-green-100' :
                          tweet.sentiment === 'Negative' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {tweet.sentiment}
                        </span>
                        <span className="px-2 py-1 rounded bg-blue-100">
                          {tweet.topic_classification}
                        </span>
                        <span className="px-2 py-1 rounded bg-yellow-100">
                          Urgency: {tweet.urgency_level}
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          tweet.relation_type === 'author' ? 'bg-purple-100' :
                          tweet.relation_type === 'mentioned' ? 'bg-indigo-100' :
                          'bg-pink-100'
                        }`}>
                          {tweet.relation_type}
                        </span>
                      </div>
                      {(tweet.mentions.length > 0 || tweet.hastags.length > 0) && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {tweet.mentions.map((mention, idx) => (
                            <span key={idx} className="text-blue-600">{mention}</span>
                          ))}
                          {tweet.hastags.map((hashtag, idx) => (
                            <span key={idx} className="text-green-600">{hashtag}</span>
                          ))}
                        </div>
                      )}
                      {tweet.link_post && (
                        <a
                          href={tweet.link_post}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View on Twitter
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
  // Main render
  return (
    <div className={`flex gap-4 h-[800px] ${isDetailOpen ? 'pr-[0px]' : ''}`}>
      <div className="w-full">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="text-sm text-muted-foreground">
                Nodes: {graphData.meta.totalNodes} | Edges: {graphData.meta.totalEdges}
              </div>
            </div>

            <div className="h-[700px] bg-white">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-lg">Loading network data...</div>
                </div>
              ) : error ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-lg text-red-500">{error}</div>
                </div>
              ) : (
                <ForceGraph2D
                  ref={forceRef}
                  graphData={graphData}
                  nodeColor={getNodeColor}
                  nodeRelSize={8}
                  nodeLabel={(node: any) => node.label}
                  linkColor={() => 'rgba(200, 200, 200, 0.6)'}
                  linkWidth={1}
                  nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const size = (node.weight || 1) * 2;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
                    ctx.fillStyle = getNodeColor(node);
                    ctx.fill();
                    ctx.strokeStyle = getNodeColor(node);
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    if (node.weight > 9) {
                      const label = node.label;
                      const fontSize = 12 / globalScale;
                      ctx.font = `${fontSize}px Sans-Serif`;
                      const textWidth = ctx.measureText(label).width;
                      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
              
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                      ctx.fillRect(
                        node.x - bckgDimensions[0] / 2,
                        node.y - bckgDimensions[1] / 2,
                        bckgDimensions[0],
                        bckgDimensions[1]
                      );
              
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';
                      ctx.fillStyle = '#000000';
                      ctx.fillText(label, node.x, node.y);
                    }
                  }}
                  onNodeClick={onNodeClick}
                  cooldownTicks={100}
                  onEngineStop={() => {
                    forceRef.current?.zoomToFit(400);
                  }}
                  enableNodeDrag={true}
                  enableZoomInteraction={true}
                  linkDirectionalParticles={2}
                  linkDirectionalParticleWidth={2}
                  linkDirectionalParticleSpeed={0.005}
                  d3AlphaDecay={0.05}
                  d3VelocityDecay={0.3}
                  width={1200}
                  height={700}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Panel */}
      <div 
        className={`fixed right-0 top-12 h-full w-[400px] bg-white shadow-lg transform transition-transform duration-300 ${
          isDetailOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {renderDetailsPanel()}
      </div>
    </div>
  );
}