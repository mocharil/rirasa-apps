"use client"

import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { BarChart2, AlertTriangle, Target, MapPin } from "lucide-react";
import type { NewsItem } from "@/types/dashboard";

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  if (!item?._source) return null;

  const {
    title,
    url,
    content,
    description,
    publish_at,
    sentiment,
    topic_classification,
    urgency_level,
    target_audience,
    affected_region,
    image_url
  } = item._source;

  // Convert target_audience to array if it's a string
  const audiences = Array.isArray(target_audience) 
    ? target_audience 
    : typeof target_audience === 'string'
    ? [target_audience]
    : ['General'];

  return (
    <div className="bg-white border rounded-lg hover:bg-gray-50 transition-all duration-200">
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex gap-4 p-4">
          {/* Image */}
          {image_url && (
            <div className="relative w-48 h-48 flex-shrink-0">
              <Image
                src={image_url}
                alt={title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title */}
            <h3 className="text-xl font-semibold line-clamp-2">
              {title}
            </h3>

            {/* Description/Content */}
            <p className="text-gray-600 line-clamp-2">
              {description || content}
            </p>

            {/* Primary Tags */}
            <div className="flex flex-wrap gap-2">
              {/* Topic Classification */}
              <Badge variant="outline" className="flex items-center gap-1">
                <BarChart2 className="w-3 h-3" />
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

              {/* Urgency Level */}
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
            </div>

            {/* Secondary Info */}
            <div className="flex flex-wrap gap-4 pt-2 text-sm text-gray-500">
              {/* Target Audience */}
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>Audience:</span>
                <div className="flex gap-1">
                  {audiences.map((audience, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Region:</span>
                <Badge variant="secondary" className="text-xs">
                  {affected_region}
                </Badge>
              </div>

              {/* Date */}
              <span className="ml-auto">
                {new Date(publish_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}