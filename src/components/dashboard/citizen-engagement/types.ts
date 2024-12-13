// components/dashboard/citizen-engagement/types.ts
export interface ChatLogEntry {
    user_id: string;
    username: string;
    message_text: string;
    bot_response: string;
    response_time_ms: number;
    timestamp: string;
    classification_topic: string;
    urgency_level: number;
    sentiment: string;
    target_audience: string[];
    affected_region: string;
    contextual_content?: string;
  }
  
  export interface DashboardMetrics {
    criticalIssues: number;
    activeSessions: number;
    responseRate: number;
    averageResponseTime: number;
    sentimentScore: number;
  }