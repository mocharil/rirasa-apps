// src/app/(dashboard)/dashboard/page.tsx

"use client"

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  BarChart,
  Users,
  MessageSquare,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Building2,
  Newspaper,
  Heart,
} from "lucide-react"
import { SearchBar } from "@/components/dashboard/search-bar"
import { NewsCard } from "@/components/dashboard/news-card"
import { TweetCard } from "@/components/dashboard/tweet-card"
import { SourceTabs } from "@/components/dashboard/source-tabs"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RootCauseAnalysis } from "@/components/dashboard/root-cause-analysis"
import { TrendingTopics } from "@/components/dashboard/trending-topics"

type DataSource = 'news' | 'twitter'

interface TwitterInsight {
  id: string;
  date: string;
  total_location: Array<{ name: string; total: number }>;
  total_hashtags: Array<{ name: string; total: number }>;
  total_mentions: Array<{ name: string; total: number }>;
}

interface NewsMetrics {
  totalArticles: number;
  urgentArticles: number;
  governmentMentions: number;
  publicSentiment: number;
  regionalImpact: number;
  topicDistribution: {
    [key: string]: number;
  };
}

interface TwitterMetrics {
  totalEngagements: number;
  citizenReach: number;
  activeDiscussions: number;
  publicResponse: number;
  totalTweets: number;
  avgEngagementRate: number;
}

export default function DashboardPage() {
  const [activeSource, setActiveSource] = useState<DataSource>('news')
  
  const [data, setData] = useState({
    stats: {
      // Default values for both types of metrics
      totalArticles: 0,
      urgentArticles: 0,
      governmentMentions: 0,
      publicSentiment: 0,
      regionalImpact: 0,
      topicDistribution: {},
      totalEngagements: 0,
      citizenReach: 0,
      activeDiscussions: 0,
      publicResponse: 0,
      totalTweets: 0,
      avgEngagementRate: 0
    } as NewsMetrics & TwitterMetrics,
    data: [],
    insights: {
      news: { date: '', insight: [] },
      twitter: { date: '', insight: [] }
    }
  });

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  })

  const [trendingData, setTrendingData] = useState<{
    twitter?: TwitterInsight;
    news?: Array<{ key: string; doc_count: number }>;
  }>({})

  const getStatsConfig = (source: DataSource, stats: NewsMetrics | TwitterMetrics) => {
    if (source === 'news') {
      const newsStats = stats as NewsMetrics;
      return [
        {
          title: "Total Articles",
          value: Number(newsStats?.totalArticles || 0).toLocaleString(),
          description: "Total monitored news articles",
          icon: Newspaper,
          color: "text-blue-600"
        },
        {
          title: "High Urgency Issues",
          value: Number(newsStats?.urgentArticles || 0).toLocaleString(),
          description: "Articles requiring immediate attention",
          icon: AlertCircle,
          color: "text-red-600"
        },
        {
          title: "Government Coverage",
          value: Number(newsStats?.governmentMentions || 0).toLocaleString(),
          description: "Articles about government policies",
          icon: Building2,
          color: "text-green-600"
        },
        {
          title: "Public Sentiment",
          value: `${(newsStats?.publicSentiment || 0).toFixed(1)}%`,
          description: "Positive news sentiment",
          icon: TrendingUp,
          color: "text-yellow-600"
        }
      ];
    }
  
    const twitterStats = stats as TwitterMetrics;
    return [
      {
        title: "Citizen Engagement",
        value: Number(twitterStats?.totalEngagements || 0).toLocaleString(),
        description: "Total likes, retweets & replies",
        icon: Heart,
        color: "text-red-600"
      },
      {
        title: "Citizen Reach",
        value: Number(twitterStats?.citizenReach || 0).toLocaleString(),
        description: "Total views of discussions",
        icon: Users,
        color: "text-blue-600"
      },
      {
        title: "Active Discussions",
        value: Number(twitterStats?.activeDiscussions || 0).toLocaleString(),
        description: "Ongoing citizen conversations",
        icon: MessageSquare,
        color: "text-green-600"
      },
      {
        title: "Public Response",
        value: `${(twitterStats?.publicResponse || 0).toFixed(1)}%`,
        description: "Positive citizen sentiment",
        icon: TrendingUp,
        color: "text-yellow-600"
      }
    ];
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/dashboard?source=${activeSource}&page=${pagination.currentPage}&itemsPerPage=${pagination.itemsPerPage}`
        )
        if (!response.ok) throw new Error('Failed to fetch data')
        const result = await response.json()
        
        setData({
          stats: result.stats,
          data: result.data || [],
          insights: result.insights || {
            news: { date: '', insight: [] },
            twitter: { date: '', insight: [] }
          }
        })
        setTotalResults(result.total || 0)
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil((result.total || 0) / pagination.itemsPerPage)
        }))
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (!isSearching) {
      fetchData()
    }
  }, [activeSource, pagination.currentPage, pagination.itemsPerPage, isSearching])

  useEffect(() => {
    async function fetchTrending() {
      try {
        if (activeSource === 'twitter') {
          const response = await fetch('/api/trending?source=twitter')
          const data = await response.json()
          setTrendingData(prev => ({ ...prev, twitter: data.data }))
        } else {
          const response = await fetch('/api/trending?source=news')
          const data = await response.json()
          setTrendingData(prev => ({ ...prev, news: data.trending }))
        }
      } catch (error) {
        console.error('Failed to fetch trending topics:', error)
      }
    }

    fetchTrending()
  }, [activeSource])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setIsSearching(false)
      setSearchResults([])
      setTotalResults(0)
      return
    }

    try {
      setIsSearching(true)
      setSearchLoading(true)
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          source: activeSource,
          page: pagination.currentPage,
          itemsPerPage: pagination.itemsPerPage
        })
      })
      const result = await response.json()
      setSearchResults(result.hits || [])
      setTotalResults(result.total || 0)
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil((result.total || 0) / pagination.itemsPerPage),
        currentPage: result.pagination?.currentPage || 1
      }))
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      setTotalResults(0)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSourceChange = (source: DataSource) => {
    setActiveSource(source)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    setSearchQuery("")
    setIsSearching(false)
    setSearchResults([])
    setTotalResults(0)
  }

  const renderRootCauseAnalysis = () => {
    const insights = {
      news: data.insights?.news || { date: '', insight: [] },
      twitter: data.insights?.twitter || { date: '', insight: [] }
    }

    return (
      <RootCauseAnalysis 
        activeSource={activeSource}
        newsInsight={insights.news}
        twitterInsight={insights.twitter}
      />
    )
  }

  const handlePageChange = async (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
    
    if (isSearching && searchQuery) {
      setSearchLoading(true)
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: searchQuery,
            source: activeSource,
            page: page,
            itemsPerPage: pagination.itemsPerPage
          })
        })
        const result = await response.json()
        setSearchResults(result.hits || [])
        setTotalResults(result.total || 0)
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          totalPages: Math.ceil((result.total || 0) / pagination.itemsPerPage)
        }))
      } catch (error) {
        console.error('Search pagination error:', error)
      } finally {
        setSearchLoading(false)
      }
    }
  }

  const displayData = useMemo(() => {
    if (isSearching) return searchResults || []
    return data.data || []
  }, [isSearching, searchResults, data.data])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        <AlertCircle className="mr-2 h-5 w-5" />
        <span>{error}</span>
      </div>
    )
  }

  const statsConfig = getStatsConfig(activeSource, data.stats);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <SourceTabs 
            activeSource={activeSource}
            onChange={handleSourceChange}
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {renderRootCauseAnalysis()}

      <div className="w-full max-w-4xl mx-auto">
        <div className="space-y-2">
          <SearchBar 
            onSearch={handleSearch} 
            value={searchQuery}
            onChange={(value) => {
              if (!value.trim()) {
                setIsSearching(false)
                setSearchResults([])
                setTotalResults(0)
                setPagination(prev => ({ ...prev, currentPage: 1 }))
              }
            }}
          />
          {!loading && (
            <div className="text-sm text-muted-foreground">
              {isSearching ? (
                <span>Found {totalResults.toLocaleString()} results for "{searchQuery}"</span>
              ) : (
                <span>Total {activeSource === 'news' ? 'news' : 'tweets'}: {totalResults.toLocaleString()}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {isSearching ? `Search Results` : 
                 activeSource === 'news' ? 'Latest News' : 'Recent Tweets'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {displayData.length > 0 ? (
                      displayData.map((item: any, index: number) => (
                        activeSource === 'news' ? 
                          <NewsCard key={item._id || index} item={item} /> :
                          <TweetCard key={item._id || index} item={item} />
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        {isSearching ? 'No results found' : 'No data available'}
                      </p>
                    )}
                  </div>

                  {totalResults > pagination.itemsPerPage && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, totalResults)} of {totalResults}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        
                        {[...Array(pagination.totalPages)].map((_, idx) => {
                          const pageNumber = idx + 1;
                          const showPage = 
                            pageNumber === 1 ||
                            pageNumber === pagination.totalPages ||
                            (pageNumber >= pagination.currentPage - 1 &&
                              pageNumber <= pagination.currentPage + 1);
  
                            if (showPage) {
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`px-3 py-1 rounded-md ${
                                    pagination.currentPage === pageNumber
                                      ? 'bg-primary text-primary-foreground'
                                      : 'hover:bg-gray-100'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            }
                            
                            if (pageNumber === pagination.currentPage - 2 ||
                                pageNumber === pagination.currentPage + 2) {
                              return <span key={pageNumber}>...</span>;
                            }
                            
                            return null;
                          })}
  
                          <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
  
          <div className="md:col-span-1">
            <TrendingTopics
              activeSource={activeSource}
              twitterInsight={trendingData.twitter}
              newsTopics={trendingData.news}
            />
          </div>
        </div>
      </div>
    )
  }