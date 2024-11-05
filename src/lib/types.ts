export interface NewsItem {
    title: string;
    description: string;
    content: string;
    publish_at: string;
    sentiment: string;
    topic_classification: string;
    urgency_level: number;
    creator: string[];
    list_keyword: string[];
    list_person: string[];
  }
  
  export interface SearchResponse {
    hits: {
      total: {
        value: number;
        relation: string;
      };
      hits: Array<{
        _source: NewsItem;
        _id: string;
        _index: string;
        _score: number;
      }>;
    };
  }