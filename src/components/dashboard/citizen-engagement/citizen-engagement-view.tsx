// src/components/dashboard/citizen-engagement/citizen-engagement-view.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Users, Clock, Smile, Loader2, BookOpen, Binoculars } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ResponseTrends } from "./analytics/response-trends";
import { TopicHeatmap } from "./analytics/topic-heatmap";
import { EnhancedChatLogs } from "./enhanced-chat-logs";
import KnowledgeBaseSection from './knowledge-base-section';

export function CitizenEngagementView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    criticalIssues: 0,
    activeSessions: 0,
    responseRate: 0,
    averageResponseTime: 0,
    sentimentScore: 0,
    trendsData: [],
  });
  const [topics, setTopics] = useState([]);
  const [chatLogs, setChatLogs] = useState([]);
  const [newKnowledge, setNewKnowledge] = useState({
    title: "",
    content: "",
    topic_classification: "",
    keywords: [],
    file: undefined,
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const metricsResponse = await fetch("/api/engagement");
      const metricsData = await metricsResponse.json();

      const topicsResponse = await fetch("/api/analytics/topics");
      const topicsData = await topicsResponse.json();

      const logsResponse = await fetch("/api/engagement/logs");
      const logsData = await logsResponse.json();

      setMetrics({
        criticalIssues: metricsData.criticalIssues || 0,
        activeSessions: metricsData.activeSessions || 0,
        responseRate: metricsData.responseRate || 0,
        averageResponseTime: metricsData.averageResponseTime || 0,
        sentimentScore: metricsData.sentimentScore || 0,
        trendsData: metricsData.trendsData || [],
      });

      setTopics(topicsData.topics || []);
      setChatLogs(logsData.logs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 600000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmitKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newKnowledge.title);
      formData.append("content", newKnowledge.content);
      formData.append("topic_classification", newKnowledge.topic_classification);
      formData.append("keywords", newKnowledge.keywords.join(", "));
      if (newKnowledge.file) formData.append("file", newKnowledge.file);

      const response = await fetch("/api/knowledge-base", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add knowledge");

      setNewKnowledge({
        title: "",
        content: "",
        topic_classification: "",
        keywords: [],
        file: undefined,
      });

      alert("Knowledge base entry added successfully");
    } catch (err) {
      setError("Failed to add knowledge base entry");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    
    <div className="space-y-6 p-6">
      <h2 className = "text-3xl font-bold tracking-tight">Citizen Engagement</h2>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="inline-flex items-center rounded-lg border bg-background p-1 text-muted-foreground">
        <button
          className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-muted hover:text-foreground"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          
          <Binoculars className="mr-2 h-4 w-4" />
          Overview
        </button>
        <button
          className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            activeTab === "chatLogs"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-muted hover:text-foreground"
          }`}
          onClick={() => setActiveTab("chatLogs")}
        >
          <Users className="mr-2 h-4 w-4" />
          Chat Logs
        </button>
        <button
          className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            activeTab === "knowledge"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-muted hover:text-foreground"
          }`}
          onClick={() => setActiveTab("knowledge")}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Knowledge Base
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Critical Issues"
              value={metrics.criticalIssues.toString()}
              description="High urgency issues in last 7 days"
              icon={AlertCircle}
              color="text-red-600"
              className="h-full"
            />
            <StatsCard
              title="Active Sessions"
              value={metrics.activeSessions.toString()}
              description="Unique users engaged in last 7 days"
              icon={Users}
              color="text-blue-600"
              className="h-full"
            />
            <StatsCard
              title="Response Rate"
              value={`${metrics.responseRate.toFixed(1)}%`}
              description={`Avg response time: ${metrics.averageResponseTime.toFixed(1)}s`}
              icon={Clock}
              color="text-green-600"
              className="h-full"
            />
            <StatsCard
              title="Sentiment Score"
              value={metrics.sentimentScore.toFixed(1)}
              description="Based on last 7 days conversations"
              icon={Smile}
              color="text-yellow-600"
              className="h-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponseTrends data={metrics.trendsData} />
            <TopicHeatmap topics={topics} />
          </div>
        </TabsContent>

        <TabsContent value="chatLogs">
          <EnhancedChatLogs logs={chatLogs} />
        </TabsContent>

        <TabsContent value="knowledge">
<KnowledgeBaseSection />
</TabsContent>

      </Tabs>
    </div>
  );
}
