"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, RefreshCw, TrendingUp, User, Clock, LucideIcon } from "lucide-react";
import { ChatLogs } from "./chat-logs";

interface EngagementStats {
  activeUsers: number;
  dailyInteractions: number;
  responseRate: number;
  avgResponseTime: number;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  loading: boolean;
  trend?: number;
}

function StatsCard({ title, value, icon: Icon, loading, trend }: StatsCardProps) {
  return (
    <div className="space-y-3 p-5 bg-white/70 backdrop-blur-lg rounded-lg border border-gray-200 shadow-lg hover:scale-105 transition-transform">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <Icon className="w-6 h-6 text-gray-500" />
      </div>
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      ) : (
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend > 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function CitizenEngagementView() {
  const [stats, setStats] = useState<EngagementStats>({
    activeUsers: 0,
    dailyInteractions: 0,
    responseRate: 0,
    avgResponseTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/engagement");
      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  const handleTelegramRedirect = () => {
    window.open("https://t.me/jakarta_insight_bot", "_blank");
  };

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-white  min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Citizen Engagement</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center bg-black text-white gap-2 border-gray-500 hover:bg-gray-100 hover:shadow-lg"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1 bg-white/70 backdrop-blur-lg shadow-lg border border-gray-200 transition-transform hover:scale-105">
          <CardHeader className="flex flex-row items-center gap-6">
            <img
              src="/bot jaki.png"
              alt="Bot JakSee Logo"
              className="w-20 h-20 rounded-full shadow-md border border-gray-300"
            />
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">Insight Jakarta Chatbot</CardTitle>
              <CardDescription>
                Connect with our AI-powered chatbot to get instant information about Jakarta
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Real-time updates about Jakarta</li>
              <li>Quick responses to common inquiries</li>
              <li>24/7 automated assistance</li>
              <li>Easy access to public services information</li>
            </ul>
            <Button
              onClick={handleTelegramRedirect}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat with Bot JakSee on Telegram
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-white/70 backdrop-blur-lg shadow-lg border border-gray-200 transition-transform hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-800">
              Engagement Statistics
              {error && <span className="text-sm text-red-500">{error}</span>}
            </CardTitle>
            <CardDescription className="text-gray-600">
              Overview of citizen interactions with our chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Active Users"
                value={stats.activeUsers.toLocaleString()}
                icon={User}
                loading={loading}
                trend={5}
              />
              <StatsCard
                title="Daily Interactions"
                value={stats.dailyInteractions.toLocaleString()}
                icon={MessageCircle}
                loading={loading}
                trend={-3}
              />
              <StatsCard
                title="Response Rate"
                value={`${stats.responseRate}%`}
                icon={TrendingUp}
                loading={loading}
                trend={8}
              />
              <StatsCard
                title="Avg. Response Time"
                value={`${stats.avgResponseTime}s`}
                icon={Clock}
                loading={loading}
              />
            </div>
          </CardContent>
        </Card>

        <ChatLogs />
      </div>
    </div>
  );
}