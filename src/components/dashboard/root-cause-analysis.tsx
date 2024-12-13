// src/components/dashboard/root-cause-analysis.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, AlertTriangle, Lightbulb, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const topicImages: { [key: string]: string } = {
  "Infrastructure and Transportation": "/infrastructure_and_transportation.png",
  "Environment and Disaster": "/environment_and_disaster.png",
  "Public Health": "/public_health.png",
  "Education and Culture": "/education_and_culture.png",
  "City Planning and Housing": "/city_planning_and_housing.png",
  "Technology and Innovation": "/technology_and_innovation.png",
  "Safety and Crime": "/safety_and_crime.png",
  "Social and Economy": "/social_and_economy.png",
  "Tourism and Entertainment": "/tourism_and_entertainment.png",
  "Ecology and Green Spaces": "/ecology_and_green_spaces.png",
  "Government and Public Policy": "/government_and_public_policy.png"
};

const getTopicImage = (topic: string): string => {
  return topicImages[topic] || "/jakarta-insight-logo.png";
};

// Function to format text with bold sections
const formatText = (text: string): React.ReactNode => {
  if (!text) return null;
  const parts = text.split('**');
  return parts.map((part, index) => 
    index % 2 === 0 ? part : <strong key={index}>{part}</strong>
  );
};

interface RootCauseProps {
  activeSource: 'news' | 'twitter';
  newsInsight: {
    date: string;
    insight: Array<{
      topic: string;
      main_issue: string;
      problem: string;
      suggestion: string;
      urgency_score: number;
    }>;
  };
  twitterInsight: {
    date: string;
    insight: Array<{
      topic: string;
      main_issue: string;
      problem: string;
      suggestion: string;
      urgency_score: number;
    }>;
  };
}

export function RootCauseAnalysis({ activeSource, newsInsight, twitterInsight }: RootCauseProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const insights = activeSource === 'news' ? newsInsight : twitterInsight;
  const currentInsight = insights.insight[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % insights.insight.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + insights.insight.length) % insights.insight.length);
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card 
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer",
        "bg-gradient-to-br from-[#FFF1F1] to-[#FFE4E4]",
        "hover:shadow-lg border-none",
        isExpanded ? "h-auto" : "h-[330px]"
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

      {/* Main Content */}
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/50 rounded-lg">
              <FileText className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Root Cause Analysis</h2>
              <p className="text-sm text-gray-600">AI-powered insights from {activeSource} data</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative"
          >
            {/* Topic and Image Section */}
            <div className="flex gap-6">
              <div className="relative w-64 h-48 rounded-lg overflow-hidden">
                <img
                  src={getTopicImage(currentInsight?.topic)}
                  alt={currentInsight?.topic}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                      {currentInsight?.topic}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-white text-xs",
                      getUrgencyColor(currentInsight?.urgency_score || 0)
                    )}>
                      Urgency: {currentInsight?.urgency_score}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-4">
                {/* Main Issue */}
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <FileText className="h-4 w-4" />
                    Main Issue
                  </div>
                  <p className="text-gray-600">
                    {formatText(currentInsight?.main_issue)}
                  </p>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Problem */}
                    <div>
                      <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Problem
                      </div>
                      <ul className="space-y-2 text-gray-600">
                        {currentInsight?.problem.split('\n').map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                            <span>{formatText(item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestion */}
                    <div>
                      <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Suggestion
                      </div>
                      <p className="text-gray-600">
                        {formatText(currentInsight?.suggestion)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-1">
          {insights.insight.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === idx ? "bg-red-500 w-4" : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
