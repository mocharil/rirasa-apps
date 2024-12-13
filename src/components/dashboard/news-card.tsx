"use client";

// src/components/dashboard/news-card.tsx
import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  Users,
  MapPin,
  ExternalLink,
  Tag,
  Calendar,
  Building2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NewsItem {
  _source: {
    title: string;
    url: string;
    image_url?: string;
    content: string;
    description: string;
    publish_at: string;
    sentiment: string;
    topic_classification: string;
    urgency_level: number;
    target_audience: string[] | string;
    affected_region: string;
    creator?: string[];
  };
}

export function NewsCard({ item }: { item: NewsItem }) {
  const {
    title,
    url,
    image_url,
    content,
    description,
    publish_at,
    sentiment,
    topic_classification,
    urgency_level,
    target_audience,
    affected_region,
    creator = []
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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="flex gap-4 p-4">
          {/* Image Section */}
          {image_url && (
            <div className="relative flex-shrink-0 w-48 h-48 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={image_url}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/jakarta-insight-logo.png";
                }}
              />
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title and Source */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-xl text-gray-900 line-clamp-2">
                {title}
              </h3>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-blue-500 hover:text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Description */}
            <p className="text-gray-600 line-clamp-2">
              {description || content}
            </p>

            {/* Tags Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* Topic */}
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {topic_classification}
              </Badge>

              {/* Sentiment */}
              <Badge 
                variant="outline" 
                className={cn("flex items-center gap-1", getSentimentColor(sentiment))}
              >
                {sentiment === 'Positive' && '😊'}
                {sentiment === 'Negative' && '😞'}
                {sentiment === 'Neutral' && '😐'}
                {sentiment}
              </Badge>

              {/* Urgency */}
              <Badge 
                variant="outline"
                className={cn("flex items-center gap-1", getUrgencyColor(urgency_level))}
              >
                <AlertTriangle className="h-3 w-3" />
                Urgency: {urgency_level}
              </Badge>

              {/* Region */}
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {affected_region}
              </Badge>
            </div>

            {/* Additional Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
              <div className="flex items-center gap-4">
                {creator?.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span>{creator[0]}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {Array.isArray(target_audience) 
                      ? target_audience[0] 
                      : target_audience}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time>
                  {new Date(publish_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}