"use client";

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { 
  MessageCircle, 
  Clock, 
  AlertCircle, 
  Filter,
  Search,
  Bot,
  MapPin,
  X,
  Heart,
  Tag
} from 'lucide-react';

interface ChatLog {
  user_id: string;
  username: string | number;
  message_text: string;
  bot_response: string;
  response_time_ms: number;
  timestamp: string;
  topic_classification: string;
  urgency_level: number;
  sentiment: string;
  target_audience: string[];
  affected_region: string;
}

interface ChatLogsProps {
  logs: ChatLog[];
}

const SENTIMENT_CONFIG = [
  { 
    label: "Positive", 
    icon: "😊",
    color: "bg-green-100 text-green-800 hover:bg-green-200" 
  },
  { 
    label: "Neutral", 
    icon: "😐",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200" 
  },
  { 
    label: "Negative", 
    icon: "😞",
    color: "bg-red-100 text-red-800 hover:bg-red-200" 
  }
];

const URGENCY_CONFIG = [
  { 
    label: "High", 
    icon: "🔴",
    color: "bg-red-100 text-red-800 hover:bg-red-200" 
  },
  { 
    label: "Medium", 
    icon: "🟡",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
  },
  { 
    label: "Low", 
    icon: "🟢",
    color: "bg-green-100 text-green-800 hover:bg-green-200" 
  }
];

const CATEGORY_CONFIG = [
    { 
      label: "Social and Economy", 
      icon: "💰",
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200" 
    },
    { 
      label: "Infrastructure and Transportation", 
      icon: "🚆",
      color: "bg-gray-100 text-gray-800 hover:bg-gray-200"
    },
    { 
      label: "Public Health", 
      icon: "🏥",
      color: "bg-green-100 text-green-800 hover:bg-green-200"
    },
    { 
      label: "Environment and Disaster", 
      icon: "🌍",
      color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
    },
    { 
      label: "Safety and Crime", 
      icon: "🚨",
      color: "bg-red-100 text-red-800 hover:bg-red-200"
    },
    { 
      label: "Government and Public Policy", 
      icon: "📜",
      color: "bg-purple-100 text-purple-800 hover:bg-purple-200"
    },
    { 
      label: "Technology and Innovation", 
      icon: "💻",
      color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
    },
    { 
      label: "City Planning and Housing", 
      icon: "🏘️",
      color: "bg-amber-100 text-amber-800 hover:bg-amber-200"
    },
    { 
      label: "Education and Culture", 
      icon: "📚",
      color: "bg-teal-100 text-teal-800 hover:bg-teal-200"
    },
    { 
      label: "Tourism and Entertainment", 
      icon: "🎭",
      color: "bg-pink-100 text-pink-800 hover:bg-pink-200"
    },
    { 
      label: "Ecology and Green Spaces", 
      icon: "🌿",
      color: "bg-lime-100 text-lime-800 hover:bg-lime-200"
    }
  ];

export function EnhancedChatLogs({ logs }: ChatLogsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string[]>([]);
  const [urgencyFilter, setUrgencyFilter] = useState<string[]>([]);
  const [topicFilter, setTopicFilter] = useState<string[]>([]);

  // Get unique topics for filter
  const uniqueTopics = Array.from(new Set(logs.map(log => log.topic_classification)));

  const getUrgencyLevel = (level: number) => {
    if (level >= 70) return 'high';
    if (level >= 40) return 'medium';
    return 'low';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.message_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.bot_response.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_id.includes(searchTerm);

    const matchesSentiment = sentimentFilter.length === 0 || 
      sentimentFilter.includes(log.sentiment);

    const matchesUrgency = urgencyFilter.length === 0 || 
      urgencyFilter.includes(getUrgencyLevel(log.urgency_level));

    const matchesTopic = topicFilter.length === 0 ||
      topicFilter.includes(log.topic_classification);

    return matchesSearch && matchesSentiment && matchesUrgency && matchesTopic;
  });

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Chat Logs</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[300px]"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  <Badge variant="secondary" className="ml-1">
                    {sentimentFilter.length + urgencyFilter.length + topicFilter.length}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {(sentimentFilter.length > 0 || urgencyFilter.length > 0 || topicFilter.length > 0) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSentimentFilter([]);
                          setUrgencyFilter([]);
                          setTopicFilter([]);
                        }}
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="sentiment" className="border-b">
                    <AccordionTrigger className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">Sentiment</span>
                      {sentimentFilter.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {sentimentFilter.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent className="p-2">
                      <div className="flex flex-wrap gap-1.5">
                        {SENTIMENT_CONFIG.map((item) => (
                          <Button
                            key={item.label}
                            size="sm"
                            variant={sentimentFilter.includes(item.label) ? "default" : "outline"}
                            onClick={() => {
                              setSentimentFilter(prev => 
                                prev.includes(item.label)
                                  ? prev.filter(s => s !== item.label)
                                  : [...prev, item.label]
                              );
                            }}
                            className={`text-xs h-8 gap-1.5 transition-colors
                              ${sentimentFilter.includes(item.label) 
                                ? item.color
                                : "hover:bg-gray-100"
                              }`}
                          >
                            <span>{item.icon}</span>
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="urgency" className="border-b">
                    <AccordionTrigger className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Urgency Level</span>
                      {urgencyFilter.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {urgencyFilter.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent className="p-2">
                      <div className="flex flex-wrap gap-1.5">
                        {URGENCY_CONFIG.map((item) => (
                          <Button
                            key={item.label}
                            size="sm"
                            variant={urgencyFilter.includes(item.label.toLowerCase()) ? "default" : "outline"}
                            onClick={() => {
                              const value = item.label.toLowerCase();
                              setUrgencyFilter(prev => 
                                prev.includes(value)
                                  ? prev.filter(u => u !== value)
                                  : [...prev, value]
                              );
                            }}
                            className={`text-xs h-8 gap-1.5 transition-colors
                              ${urgencyFilter.includes(item.label.toLowerCase()) 
                                ? item.color
                                : "hover:bg-gray-100"
                              }`}
                          >
                            <span>{item.icon}</span>
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="topics" className="border-b">
  <AccordionTrigger className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50">
    <Tag className="h-4 w-4" />
    <span className="text-sm font-medium">Topics</span>
    {topicFilter.length > 0 && (
      <Badge variant="secondary" className="ml-auto">
        {topicFilter.length}
      </Badge>
    )}
  </AccordionTrigger>
  <AccordionContent className="p-2">
    <div className="flex flex-wrap gap-1.5">
      {CATEGORY_CONFIG.map((item) => (
        <Button
          key={item.label}
          size="sm"
          variant={topicFilter.includes(item.label) ? "default" : "outline"}
          onClick={() => {
            setTopicFilter(prev => 
              prev.includes(item.label)
                ? prev.filter(t => t !== item.label)
                : [...prev, item.label]
            );
          }}
          className={`text-xs h-8 gap-1.5 transition-colors
            ${topicFilter.includes(item.label) 
              ? item.color
              : "hover:bg-gray-100"
            }`}
        >
          <span>{item.icon}</span>
          {item.label}
        </Button>
      ))}
    </div>
  </AccordionContent>
</AccordionItem>

                </Accordion>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters */}
        {(sentimentFilter.length > 0 || urgencyFilter.length > 0 || topicFilter.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {sentimentFilter.map((value) => (
              <Badge
                key={`sentiment-${value}`}
                variant="secondary"
                className={`flex items-center gap-1 ${
                  SENTIMENT_CONFIG.find(item => item.label === value)?.color
                }`}
              >
                {SENTIMENT_CONFIG.find(item => item.label === value)?.icon} {value}
                <button
                  onClick={() => setSentimentFilter(prev => prev.filter(s => s !== value))}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {urgencyFilter.map((value) => (
              <Badge
                key={`urgency-${value}`}
                variant="secondary"
                className={`flex items-center gap-1 ${
                  URGENCY_CONFIG.find(item => item.label.toLowerCase() === value)?.color
                }`}
              >
                {URGENCY_CONFIG.find(item => item.label.toLowerCase() === value)?.icon} {value}
                <button
                  onClick={() => setUrgencyFilter(prev => prev.filter(u => u !== value))}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {topicFilter.map((value) => (
  <Badge
    key={`topic-${value}`}
    variant="secondary"
    className={`flex items-center gap-1 ${
      CATEGORY_CONFIG.find(item => item.label === value)?.color
    }`}
  >
    {CATEGORY_CONFIG.find(item => item.label === value)?.icon} {value}
    <button
      onClick={() => setTopicFilter(prev => prev.filter(t => t !== value))}
      className="ml-2 hover:text-destructive"
    >
      <X className="h-3 w-3" />
    </button>
  </Badge>
))}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y max-h-[800px] overflow-y-auto">
          {filteredLogs.map((log, index) => (
            <div key={`${log.user_id}-${log.timestamp}-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {log.user_id}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Badge className={
                    SENTIMENT_CONFIG.find(item => item.label === log.sentiment)?.color || ''
                  }>
                    {log.sentiment}
                  </Badge>
                  <Badge className={
                    URGENCY_CONFIG.find(item => item.label.toLowerCase() === getUrgencyLevel(log.urgency_level))?.color || ''
                  }>
                    Urgency: {log.urgency_level}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
              <div className="space-y-3">
                {/* Message from user (left) */}
                <div className="flex items-start gap-2">
                    <MessageCircle className="h-6 w-6 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 bg-gray-50 rounded-lg p-3 ml-0 max-w-[80%]">
                    <p className="text-gray-900">{log.message_text}</p>
                    </div>
                </div>

                {/* Bot response (right) */}
                <div className="flex items-start gap-2 justify-end">
                    <Bot className="h-8 w-8 text-blue-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 bg-blue-50 rounded-lg p-3 mr-0 max-w-[80%]">
                    <p className="text-gray-900">{log.bot_response}</p>
                    </div>
                </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {(log.response_time_ms / 1000).toFixed(2)}s
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {log.affected_region}
                  </div>
                  <Badge variant="secondary">
                    {log.topic_classification}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}