"use client"

import { Badge } from "@/components/ui/badge"
import {
  Target,
  MapPin,
  AlertTriangle,
  MessageCircle,
  Heart,
  Repeat,
  Eye,
  TwitterIcon, // Import Twitter icon for default avatar
} from "lucide-react"

interface TweetItem {
  _source: {
    id: string;
    full_text: string;
    link_post: string;
    link_image_url?: string;
    username: string;
    name: string;
    date: string;
    time: string;
    sentiment: string;
    topic_classification: string;
    urgency_level: number;
    target_audience: string;
    affected_region: string;
    favorite_count: number;
    retweet_count: number;
    reply_count: number;
    views_count: number;
  };
}

export function TweetCard({ item }: { item: TweetItem }) {
  if (!item?._source) return null;

  const {
    full_text,
    link_post,
    link_image_url,
    username,
    name,
    date,
    time,
    sentiment,
    topic_classification,
    urgency_level,
    target_audience,
    affected_region,
    favorite_count,
    retweet_count,
    reply_count,
    views_count,
  } = item._source;

  return (
    <div className="bg-white border rounded-lg hover:bg-gray-50 transition-all duration-200">
      <a 
        href={link_post} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block p-4"
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {link_image_url ? (
              <img
                src={link_image_url}
                alt={name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <TwitterIcon className="w-6 h-6 text-blue-500" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate">{name}</span>
              <span className="text-gray-500 text-sm truncate">{username}</span>
              {affected_region && (
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {affected_region}
                </span>
              )}
            </div>

            {/* Tweet Text */}
            <p className="mt-1 text-[15px] whitespace-pre-wrap break-words">
              {full_text}
            </p>

            {/* Engagement Stats */}
            <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {favorite_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Repeat className="w-4 h-4" />
                {retweet_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {reply_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {views_count || 0}
              </span>
            </div>

            {/* Classification & Metadata */}
            <div className="flex flex-wrap gap-2 mt-3">
              {/* Topic */}
              <Badge variant="outline">
                {topic_classification}
              </Badge>

              {/* Sentiment */}
              <Badge
                variant={
                  sentiment?.toLowerCase() === 'positive' ? 'success' :
                  sentiment?.toLowerCase() === 'negative' ? 'destructive' :
                  'default'
                }
              >
                {sentiment}
              </Badge>

              {/* Urgency */}
              <Badge
                variant={
                  urgency_level > 80 ? 'destructive' :
                  urgency_level > 50 ? 'warning' :
                  'default'
                }
                className="flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                Urgency: {urgency_level}
              </Badge>

              {/* Target Audience */}
              <Badge variant="secondary" className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {target_audience}
              </Badge>
            </div>

            {/* Timestamp */}
            <div className="mt-2 text-sm text-gray-500">
              {date} {time}
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}