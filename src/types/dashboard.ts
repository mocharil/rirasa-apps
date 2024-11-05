export type DataSource = 'news' | 'twitter'

export interface DashboardStats {
  totalMentions: number;
  citizenEngagements: number;
  activeDiscussions: number;
  sentimentScore: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface TrendingTopic {
  key: string;
  doc_count: number;
}

// Define NewsItem interface
export interface NewsItem {
  _source: {
    title: string;
    url: string;
    content: string;
    description?: string;
    publish_at: string;
    sentiment: string;
    topic_classification: string;
    urgency_level: number;
    target_audience: string[] | string;
    affected_region: string;
    image_url?: string;
  };
}

// Define TweetItem interface
export interface TweetItem {
  _source: {
    id: string;
    full_text: string;
    link_post: string;
    link_image_url?: string;
    username: string;
    name: string;
    date: string;
    time: string;
    sentiment: string;
    topic_classification: string;
    urgency_level: number;
    target_audience: string;
    affected_region: string;
    favorite_count: number;
    retweet_count: number;
    reply_count: number;
    views_count: number;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  news: NewsItem[];
  tweets: TweetItem[];
}