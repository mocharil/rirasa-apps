"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BarChart2, AlertCircle, Building2, TrendingUp, Twitter } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  isPercentage?: boolean;
}

const StatsCard = ({ title, value, description, icon, delay = 0, isPercentage = false }: StatsCardProps) => {
  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        <div className="text-3xl font-bold tracking-tight flex items-end">
          <NumberTicker
            value={value}
            className="text-3xl font-bold"
            delay={delay}
            decimalPlaces={isPercentage ? 1 : 0}
          />
          {isPercentage && <span className="ml-1">%</span>}
        </div>
      </div>
      <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </Card>
  );
};

const StatsGrid = () => {
  const [newsStats, setNewsStats] = useState<any | null>(null);
  const [twitterStats, setTwitterStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch news stats
        const newsResponse = await fetch("/api/dashboard?source=news");
        if (!newsResponse.ok) throw new Error("Failed to fetch news stats");
        const newsData = await newsResponse.json();
        setNewsStats(newsData.stats);

        // Fetch Twitter stats
        const twitterResponse = await fetch("/api/dashboard?source=twitter");
        if (!twitterResponse.ok) throw new Error("Failed to fetch Twitter stats");
        const twitterData = await twitterResponse.json();
        setTwitterStats(twitterData.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setNewsStats(null);
        setTwitterStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const newsCards = [
    {
      title: "Total Articles",
      key: "totalArticles",
      description: "Total monitored news articles",
      icon: <BarChart2 className="h-5 w-5 text-blue-600" />,
      delay: 0,
    },
    {
      title: "High Urgency Issues",
      key: "urgentArticles",
      description: "Articles requiring immediate attention",
      icon: <AlertCircle className="h-5 w-5 text-[#E86A33]" />,
      delay: 0.2,
    },
    {
      title: "Government Coverage",
      key: "governmentMentions",
      description: "Articles about government policies",
      icon: <Building2 className="h-5 w-5 text-green-600" />,
      delay: 0.4,
    },
    {
      title: "Public Sentiment",
      key: "publicSentiment",
      description: "Positive news sentiment",
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      delay: 0.6,
      isPercentage: true,
    },
  ];

  const twitterCards = [
    {
      title: "Total Engagements",
      key: "totalEngagements",
      description: "Total user engagements on Twitter",
      icon: <Twitter className="h-5 w-5 text-blue-400" />,
      delay: 0.8,
    },
    {
      title: "Citizen Reach",
      key: "citizenReach",
      description: "Total reach of tweets",
      icon: <TrendingUp className="h-5 w-5 text-green-400" />,
      delay: 1.0,
    },
    {
      title: "Active Discussions",
      key: "activeDiscussions",
      description: "Tweets with active replies",
      icon: <BarChart2 className="h-5 w-5 text-yellow-500" />,
      delay: 1.2,
    },
    {
      title: "Public Response",
      key: "publicResponse",
      description: "Positive sentiment in Twitter posts",
      icon: <TrendingUp className="h-5 w-5 text-purple-400" />,
      delay: 1.4,
      isPercentage: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {loading
        ? Array.from({ length: 8 }).map((_, idx) => (
            <Card
              key={idx}
              className="bg-white/50 backdrop-blur-sm border-none shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-pulse"
            >
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </Card>
          ))
        : newsStats &&
          twitterStats &&
          [...newsCards, ...twitterCards].map((stat, idx) => (
            <StatsCard
              key={idx}
              title={stat.title}
              value={stat.key in newsStats ? newsStats[stat.key] : twitterStats[stat.key] || 0}
              description={stat.description}
              icon={stat.icon}
              delay={stat.delay}
              isPercentage={stat.isPercentage}
            />
          ))}
    </div>
  );
};

export default StatsGrid;
