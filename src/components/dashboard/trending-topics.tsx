"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, MapPin, Hash, AtSign } from "lucide-react"

interface LocationItem {
  name: string;
  total: number;
}

interface HashtagItem {
  name: string;
  total: number;
}

interface MentionItem {
  name: string;
  total: number;
}

interface TwitterInsight {
  id: string;
  date: string;
  total_location: LocationItem[];
  total_hashtags: HashtagItem[];
  total_mentions: MentionItem[];
}

interface TrendingTopicsProps {
  activeSource: 'news' | 'twitter';
  twitterInsight?: TwitterInsight | null;
  newsTopics?: Array<{ key: string; doc_count: number }> | null;
}

type CombinedTrendItem = {
  name: string;
  total: number;
  type: 'location' | 'hashtag' | 'mention';
};

export function TrendingTopics({ activeSource, twitterInsight, newsTopics }: TrendingTopicsProps) {
  if (activeSource === 'twitter' && twitterInsight) {
    // Combine and format all items
    const combinedItems: CombinedTrendItem[] = [
      // Add locations with "Region" prefix
      ...(twitterInsight.total_location?.map(item => ({
        name: `Region ${item.name}`,
        total: item.total,
        type: 'location' as const
      })) || []),
      // Add hashtags (they already have # in their names)
      ...(twitterInsight.total_hashtags?.map(item => ({
        name: item.name,
        total: item.total,
        type: 'hashtag' as const
      })) || []),
      // Add mentions (they already have @ in their names)
      ...(twitterInsight.total_mentions?.map(item => ({
        name: item.name,
        total: item.total,
        type: 'mention' as const
      })) || [])
    ];

    // Sort by total and take top 10
    const topTrends = combinedItems
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Trending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTrends.map((item, index) => (
              <div key={item.name} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {item.type === 'location' && <MapPin className="h-4 w-4 text-blue-500" />}
                    {item.type === 'hashtag' && <Hash className="h-4 w-4 text-green-500" />}
                    {item.type === 'mention' && <AtSign className="h-4 w-4 text-purple-500" />}
                    <p className="font-medium">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.total.toLocaleString()} posts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render news topics
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsTopics?.map((topic, index) => (
            <div key={topic.key} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium">#{topic.key}</p>
                <p className="text-sm text-muted-foreground">
                  {topic.doc_count.toLocaleString()} mentions
                </p>
              </div>
            </div>
          ))} 
          {(!newsTopics || newsTopics.length === 0) && (
            <div className="text-center py-4 text-muted-foreground">
              No trending topics available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}