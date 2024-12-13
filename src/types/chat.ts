// src/types/chat.ts
export interface ChatLog {
    user_id: string;
    username: number | string;
    message_id: string;
    message_text: string;
    bot_response: string;
    response_time_ms: number;
    timestamp: string;
    is_start_command: boolean;
    session_id: string;
    classification_topic: string;
    answer: string;
    topic_classification: string;
    urgency_level: number;
    sentiment: string;
    target_audience: string[];
    affected_region: string;
    contextual_content: string;
  }
  
  export interface ChatInsights {
    topTopics: Array<{topic: string; count: number}>;
    sentimentDistribution: {
      positive: number;
      negative: number;
      neutral: number;
    };
    averageUrgencyLevel: number;
    totalSessions: number;
    regionalDistribution: Array<{region: string; count: number}>;
    targetAudienceDistribution: Array<{audience: string; count: number}>;
  }