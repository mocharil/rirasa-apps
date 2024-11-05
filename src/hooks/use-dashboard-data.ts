import { useState, useEffect } from 'react'
import type { DataSource, DashboardData, TrendingTopic } from '@/types/dashboard'

export function useDashboardData(activeSource: DataSource) {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalMentions: 0,
      citizenEngagements: 0,
      activeDiscussions: 0,
      sentimentScore: 0
    },
    news: [],
    tweets: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])

  // Fetch main data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/dashboard?source=${activeSource}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeSource])

  // Fetch trending topics
  useEffect(() => {
    async function fetchTrending() {
      try {
        const response = await fetch('/api/trending')
        const result = await response.json()
        setTrendingTopics(result.trending || [])
      } catch (error) {
        console.error('Failed to fetch trending topics:', error)
      }
    }

    fetchTrending()
  }, [])

  return { data, loading, error, trendingTopics }
}