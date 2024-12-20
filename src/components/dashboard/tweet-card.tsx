"use client";

import { Card } from "@/components/ui/card";
import {
  MessageSquare,
  Heart,
  Repeat2,
  Eye,
  AlertTriangle,
  Users,
  MapPin,
  ExternalLink,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TwitterMediaGrid from "./TwitterMediaGrid"; // Import the separated component

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
    list_media?: string[];
  };
}

export function TweetCard({ item }: { item: TweetItem }) {
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
    favorite_count = 0,
    retweet_count = 0,
    reply_count = 0,
    views_count = 0,
    list_media = [],
  } = item._source;


  const getSentimentColor = (sentiment: string) => {
    const sentimentMap = {
      'Positive': 'bg-green-100 text-green-800 border-green-200',
      'Negative': 'bg-red-100 text-red-800 border-red-200',
      'Neutral': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return sentimentMap[sentiment as keyof typeof sentimentMap] || sentimentMap.Neutral;
  };

  const getUrgencyColor = (level: number) => {
    if (level >= 80) return 'bg-red-100 text-red-800 border-red-200';
    if (level >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Profile Image */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={link_image_url || "/jakarta-insight-logo.png"}
              alt={name}
              className="w-full h-full object-cover transition-opacity"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/jakarta-insight-logo.png";
                target.classList.add('animate-pulse');
              }}
            />
          </div>

          {/* User Info & Date */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                  {name}
                </h3>
                <p className="text-sm text-gray-500">{username}</p>
              </div>
              <a
                href={link_post}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Tweet Content */}
        <p className="text-gray-700 mb-4 whitespace-pre-wrap break-words">{full_text}</p>

        {/* Media Grid - only show if list_media exists and is not empty */}
        {list_media && list_media.length > 0 && (
          <TwitterMediaGrid mediaUrls={list_media} />
        )}

        {/* Metrics */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <Heart className="h-4 w-4" />
            <span>{favorite_count.toLocaleString()}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
            <Repeat2 className="h-4 w-4" />
            <span>{retweet_count.toLocaleString()}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>{reply_count.toLocaleString()}</span>
          </button>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{views_count.toLocaleString()}</span>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Badge variant="outline" className="flex items-center gap-1 hover:bg-gray-50 transition-colors">
            <Tag className="h-3 w-3" />
            {topic_classification}
          </Badge>

          <Badge 
            variant="outline" 
            className={cn("flex items-center gap-1 hover:opacity-90 transition-opacity", getSentimentColor(sentiment))}
          >
            {sentiment === 'Positive' && '😊'}
            {sentiment === 'Negative' && '😞'}
            {sentiment === 'Neutral' && '😐'}
            {sentiment}
          </Badge>

          <Badge 
            variant="outline"
            className={cn("flex items-center gap-1 hover:opacity-90 transition-opacity", getUrgencyColor(urgency_level))}
          >
            <AlertTriangle className="h-3 w-3" />
            Urgency: {urgency_level}
          </Badge>

          <Badge variant="outline" className="flex items-center gap-1 hover:bg-gray-50 transition-colors">
            <MapPin className="h-3 w-3" />
            {affected_region}
          </Badge>
        </div>

        {/* Additional Metadata */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{target_audience}</span>
          </div>
          <time className="text-xs">
            {new Date(date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {" "}
            {time}
          </time>
        </div>
      </Card>
    </motion.div>
  );
}
