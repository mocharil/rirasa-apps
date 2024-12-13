// src/app/api/analytics/twitter/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/lib/elasticsearch'


export async function GET() {
  try {
    const currentDate = new Date();
    const lastWeekDate = new Date(currentDate);
    lastWeekDate.setDate(currentDate.getDate() - 7);

    const previousWeekDate = new Date(lastWeekDate);
    previousWeekDate.setDate(lastWeekDate.getDate() - 7);

    // Query untuk mendapatkan metrik minggu ini
    const currentWeekMetrics = await client.search({
      index: 'twitter_jakarta',
      body: {
        size: 0,
        query: {
          range: {
            date: {
              gte: lastWeekDate.toISOString(),
              lt: currentDate.toISOString()
            }
          }
        },
        aggs: {
          // Agregasi untuk engagement total
          total_engagement: {
            sum: {
              script: {
                source: "doc['favorite_count'].value + doc['retweet_count'].value + doc['reply_count'].value + doc['views_count'].value"
              }
            }
          },
          // Agregasi untuk pengguna unik
          unique_users: {
            cardinality: {
              field: "username.keyword"
            }
          },
          // Distribusi sentiment
          sentiment_distribution: {
            terms: {
              field: "sentiment.keyword",
              size: 3
            }
          },
          // Critical Topics (topics with urgency)
          critical_topics: {
            terms: {
              field: "topic_classification.keyword",
              size: 10
            },
            aggs: {
              high_urgency_count: {
                filter: {
                  range: {
                    urgency_level: { gte: 70 }
                  }
                }
              },
              avg_urgency: {
                avg: {
                  field: "urgency_level"
                }
              }
            }
          },
          // Department Mentions dengan klasifikasi lebih detail
          dept_mentions: {
            filters: {
              filters: {
                pemprov: { match_phrase: { "contextual_keywords": "Pemprov" }},
                dinas: { match_phrase: { "contextual_keywords": "Dinas" }},
                dprd: { match_phrase: { "contextual_keywords": "DPRD" }},
                walikota: { match_phrase: { "contextual_keywords": "Walikota" }},
                gubernur: { match_phrase: { "contextual_keywords": "Gubernur" }},
            
                pemerintah: { match_phrase: { "contextual_keywords": "Pemerintah" }}
              }
            }
          },
          // Trend sentiment per hari
          sentiment_trends: {
            date_histogram: {
              field: "date",
              calendar_interval: "day",
              format: "yyyy-MM-dd"
            },
            aggs: {
              sentiments: {
                terms: {
                  field: "sentiment.keyword",
                  size: 3
                }
              }
            }
          },
          // Distribusi regional yang lebih detail
          regional_distribution: {
            terms: {
              field: "affected_region.keyword",
              size: 6
            }
          },
          // Total high urgency issues
          high_urgency_total: {
            filter: {
              range: {
                urgency_level: { gte: 70 }
              }
            }
          }
        }
      }
    });

    // Query untuk metrik minggu sebelumnya
    const previousWeekMetrics = await client.search({
      index: 'twitter_jakarta',
      body: {
        size: 0,
        query: {
          range: {
            date: {
              gte: previousWeekDate.toISOString(),
              lt: lastWeekDate.toISOString()
            }
          }
        },
        aggs: {
          total_engagement: {
            sum: {
              script: {
                source: "doc['favorite_count'].value + doc['retweet_count'].value + doc['reply_count'].value + doc['views_count'].value"
              }
            }
          },
          unique_users: {
            cardinality: {
              field:  "username.keyword"
            }
          },
          high_urgency_count: {
            filter: {
              range: {
                urgency_level: { gte: 70 }
              }
            }
          },
          dept_mentions: {
            filters: {
              filters: {
                pemprov: { match_phrase: { "contextual_keywords": "Pemprov" }},
                dinas: { match_phrase: { "contextual_keywords": "Dinas" }},
                dprd: { match_phrase: { "contextual_keywords": "DPRD" }},
                walikota: { match_phrase: { "contextual_keywords": "Walikota" }},
                gubernur: { match_phrase: { "contextual_keywords": "Gubernur" }},
                pemerintah: { match_phrase: { "contextual_keywords": "Pemerintah" }}
              }
            }
          }
        }
      }
    });

    const currentAggs = currentWeekMetrics.aggregations;
    const previousAggs = previousWeekMetrics.aggregations;

    // Helper function untuk menghitung perubahan persentase
    const calculateChange = (current: number, previous: number): string => {
      if (previous === 0) return 'N/A';
      const change = ((current - previous) / previous) * 100;
      return change.toFixed(1);
    };

    // Calculate department mentions totals
// Calculate department mentions totals
    const getCurrentDeptMentions = () => {
        const deptCounts = (currentAggs?.dept_mentions as { buckets: any })?.buckets || [];
        return Object.values(deptCounts).reduce((sum: number, dept: any) => sum + dept.doc_count, 0);
    };
    
    const getPreviousDeptMentions = () => {
        const deptCounts = (previousAggs?.dept_mentions as { buckets: any })?.buckets || [];
        return Object.values(deptCounts).reduce((sum: number, dept: any) => sum + dept.doc_count, 0);
    };
  

    // Prepare sentiment trends data
// Prepare sentiment trends data
const sentimentTrends = (currentAggs?.sentiment_trends as { buckets: any[] })?.buckets?.map((bucket: any) => {
    const sentimentCounts: { date: any; positive: number; negative: number; neutral: number } = {
      date: bucket.key_as_string,
      positive: 0,
      negative: 0,
      neutral: 0
    };
  
    bucket.sentiments.buckets.forEach((sentiment: any) => {
      const key = sentiment.key.toLowerCase() as 'positive' | 'negative' | 'neutral';
      if (key in sentimentCounts) {
        sentimentCounts[key] = sentiment.doc_count;
      }
    });
  
    return sentimentCounts;
  }) || []; // Jika undefined, sentimentTrends akan menjadi array kosong
  

    // Get total tweets
    const totalTweets = await client.count({ index: 'twitter_jakarta' });

    // Calculate positive sentiment percentage
    const positiveTweets = (currentAggs?.sentiment_distribution as { buckets: any[] })?.buckets?.find(
        (b: any) => b.key.toLowerCase() === 'positive'
      )?.doc_count || 0;

    const positiveSentimentPercentage = (positiveTweets / totalTweets.count) * 100;

    // Current metrics
    const currentDeptMentions = getCurrentDeptMentions();
    const previousDeptMentions = getPreviousDeptMentions();

    // Prepare response data
    const response = {
        // Metrics utama
        publicIssuesCount: (currentAggs?.high_urgency_total as { doc_count: number })?.doc_count || 0,
        citizenReach: (currentAggs?.unique_users as { value: number })?.value || 0,
        activeDiscussions: Math.round((currentAggs?.total_engagement as { value: number })?.value || 0),
        totalTweets: totalTweets.count || 0,
        criticalTopicsCount: (currentAggs?.critical_topics as { buckets: any[] })?.buckets?.filter(
          (bucket) => bucket?.high_urgency_count?.doc_count > 0
        ).length || 0,
        departmentMentionsCount: getCurrentDeptMentions(),

      // Perubahan mingguan
      weeklyChanges: {
        publicIssues: calculateChange(
          (currentAggs?.high_urgency_total as { doc_count: number })?.doc_count || 0,
          (previousAggs?.high_urgency_count as { doc_count: number })?.doc_count || 0
        ),
        citizenReach: calculateChange(
          (currentAggs?.unique_users as { value: number })?.value || 0,
          (previousAggs?.unique_users as { value: number })?.value || 0
        ),
        activeDiscussions: calculateChange(
          (currentAggs?.total_engagement as { value: number })?.value || 0,
          (previousAggs?.total_engagement as { value: number })?.value || 0
        ),
        departmentMentions: calculateChange(getCurrentDeptMentions(), getPreviousDeptMentions())
      },

      // Data charts
      sentimentTrends,
      
      // Top issues with urgency information

    topIssues: (currentAggs?.critical_topics as { buckets: any[] })?.buckets
        ?.filter(bucket => bucket?.high_urgency_count?.doc_count > 0)
        ?.map((bucket: any) => ({
        topic: bucket.key,
        count: bucket?.high_urgency_count?.doc_count || 0,
        urgency: Math.round(bucket?.avg_urgency?.value || 0)
        }))
        ?.sort((a, b) => b.count - a.count) || [],

    // Department metrics dengan filter
    departmentMetrics: Object.entries((currentAggs?.dept_mentions as { buckets: Record<string, any> })?.buckets || {})
        ?.map(([key, value]: [string, any]) => ({
        department: key.charAt(0).toUpperCase() + key.slice(1),
        mentions: value.doc_count || 0
        }))
        ?.filter(dept => dept.mentions > 0)
        ?.sort((a, b) => b.mentions - a.mentions) || [],

      // Regional distribution
  // Regional distribution
  regionalDistribution: (currentAggs?.regional_distribution as { buckets: any[] })?.buckets
    ?.map((bucket: any) => ({
      region: bucket.key,
      value: bucket.doc_count || 0
    }))
    ?.sort((a, b) => b.value - a.value) || [],

      publicSentiment: positiveSentimentPercentage.toFixed(1)
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error in Twitter Analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error.message },
      { status: 500 }
    );
  }
}