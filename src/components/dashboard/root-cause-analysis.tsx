"use client"

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, AlertTriangle, Lightbulb, FileText, BarChart2, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Image from "next/image"

interface InsightItem {
  topic: string;
  main_issue: string;
  problem: string;
  suggestion: string;
  urgency_score: number;
}

interface RootCauseProps {
  activeSource: 'news' | 'twitter';
  newsInsight: {
    date: string;
    insight: InsightItem[];
  };
  twitterInsight: {
    date: string;
    insight: InsightItem[];
  };
}

// Map topics to their corresponding image files
const topicImages: { [key: string]: string } = {
  "Infrastructure": "/infrastructure_and_transportation.png",
  "Transportation": "/infrastructure_and_transportation.png",
  "Environment": "/environment_and_disaster.png",
  "Public Health": "/public_health.png",
  "Education": "/education_and_culture.png",
  "Culture": "/education_and_culture.png",
  "Housing": "/city_planning_and_housing.png",
  "City Planning": "/city_planning_and_housing.png",
  "Technology": "/technology_and_innovation.png",
  "Innovation": "/technology_and_innovation.png",
  "Safety": "/safety_and_crime.png",
  "Crime": "/safety_and_crime.png",
  "Social": "/social_and_economy.png",
  "Economy": "/social_and_economy.png",
  "Tourism": "/tourism_and_entertainment.png",
  "Entertainment": "/tourism_and_entertainment.png",
  "Green Spaces": "/ecology_and_green_spaces.png",
  "Ecology": "/ecology_and_green_spaces.png",
  "Government": "/government_and_public_policy.png",
  "Public Policy": "/government_and_public_policy.png"
}

const getTopicImage = (topic: string): string => {
  const normalizedTopic = topic.toLowerCase()
  const matchedTopic = Object.keys(topicImages).find(key => 
    normalizedTopic.includes(key.toLowerCase())
  )
  return matchedTopic 
    ? topicImages[matchedTopic] 
    : "/jakarta-insight-logo.png"
}

export function RootCauseAnalysis({ activeSource, newsInsight, twitterInsight }: RootCauseProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [expanded, setExpanded] = useState(false)
    const insights = activeSource === 'news' ? newsInsight.insight : twitterInsight.insight
  
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
      initial: 0,
      slides: {
        perView: 1,
        spacing: 16,
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      loop: true,
      mode: "free-snap",
    })
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (instanceRef.current && !expanded) {
          instanceRef.current.next()
        }
      }, 10000)
  
      return () => clearInterval(interval)
    }, [instanceRef, expanded])
  
    const handleExpandClick = (e: React.MouseEvent) => {
      setExpanded(!expanded)
    }
  
    const handleCarouselClick = (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent card expansion when interacting with carousel
    }

    return (
        <Card 
          className={`bg-[#f2c0b8] text-black overflow-hidden relative transition-all duration-300 ${expanded ? 'h-auto' : 'h-[280px]'} cursor-pointer hover:bg-[#edb5ad]`}
        >
          <div 
            className="p-6 h-full"
            onClick={handleExpandClick}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Root Cause Analysis</h2>
              </div>
              <ChevronDown 
                className={`h-5 w-5 transition-transform duration-300 ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </div>
    
            {/* Carousel Container */}
            <div className="relative" onClick={handleCarouselClick}>
              <div ref={sliderRef} className="keen-slider">
                {insights.map((item, index) => (
                  <div 
                    key={index} 
                    className="keen-slider__slide"
                  >
                    <CompactInsightCard 
                      item={item} 
                      expanded={expanded}
                    />
                  </div>
                ))}
              </div>
    
              {/* Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  instanceRef.current?.prev()
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-black/10 rounded-full p-2 backdrop-blur-sm hover:bg-black/20 transition-colors z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  instanceRef.current?.next()
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-black/10 rounded-full p-2 backdrop-blur-sm hover:bg-black/20 transition-colors z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
    
              {/* Dots */}
              <div 
                className="flex justify-center gap-2 mt-4" 
                onClick={e => e.stopPropagation()}
              >
                {insights.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation()
                      instanceRef.current?.moveToIdx(idx)
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === idx ? 'bg-black' : 'bg-black/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      )
    }

    function CompactInsightCard({ item, expanded }: { item: InsightItem; expanded: boolean }) {
        const topicImage = getTopicImage(item.topic)
      
        return (
          <div 
            className="bg-white/10 rounded-lg p-6 backdrop-blur-sm"
            onClick={e => e.stopPropagation()} // Prevent expansion when interacting with card content
          >
            <div className={`flex gap-6 transition-all duration-300 ${expanded ? 'flex-row' : 'flex-row items-center'}`}>
              {/* Image Section */}
              <div className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                expanded ? 'w-80 h-64' : 'w-40 h-32'
              }`}>
                <Image
                  src={topicImage}
                  alt={item.topic}
                  fill
                  className="object-cover"
                />
              </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="bg-[#292625] text-white border-none text-xl">
              {item.topic}
            </Badge>
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 ${
                item.urgency_score >= 80 ? 'bg-red-500/20' :
                item.urgency_score >= 60 ? 'bg-yellow-500/20' :
                'bg-green-500/20'
              } bg-[#292625] text-white border-none`}
            >
              <AlertTriangle className="h-3 w-3" />
              Urgency: {item.urgency_score}
            </Badge>
          </div>

          {!expanded ? (
            // Compact View
            <div>
              <div className="flex items-center gap-1 text-black/80 text-sl font-bold mb-1">
                <FileText className="h-6 w-auto" />
                Main Issue
              </div>
              <p className="text-sm leading-relaxed line-clamp-2">{item.main_issue}</p>
            </div>
          ) : (
            // Expanded View
            <div className="grid gap-4">
              <div>
                <div className="flex items-center gap-1 text-black/80 text-sl font-bold mb-1">
                  <FileText className="h-6 w-auto" />
                  Main Issue
                </div>
                <p className="text-base leading-relaxed">{item.main_issue}</p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-black/80 text-sl font-bold mb-1">
                  <AlertTriangle className="h-6 w-auto" />
                  Problem
                </div>
                <p className="text-base leading-relaxed">{item.problem}</p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-black/80 text-sl font-bold mb-1">
                  <Lightbulb className="h-6 w-auto" />
                  Suggestion
                </div>
                <p className="text-base leading-relaxed">{item.suggestion}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}