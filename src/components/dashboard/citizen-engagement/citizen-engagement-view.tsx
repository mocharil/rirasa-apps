"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, RefreshCw } from "lucide-react"
import { ChatLogs } from './chat-logs'

interface EngagementStats {
  activeUsers: number
  dailyInteractions: number
  responseRate: number
  avgResponseTime: number
}

export function CitizenEngagementView() {
  const [stats, setStats] = useState<EngagementStats>({
    activeUsers: 0,
    dailyInteractions: 0,
    responseRate: 0,
    avgResponseTime: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/engagement')
      if (!response.ok) {
        throw new Error('Failed to fetch statistics')
      }
      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Set up auto-refresh every 1 minute
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    fetchStats()
  }

  const handleTelegramRedirect = () => {
    window.open("https://t.me/jakarta_insight_bot", "_blank")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Citizen Engagement</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <img 
              src="/bot jaki.png" 
              alt="Bot Jaki Logo" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <CardTitle>Jakarta Insight Chatbot</CardTitle>
              <CardDescription>
                Connect with our AI-powered chatbot to get instant information about Jakarta
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our Telegram chatbot provides citizens with:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
              <li>Real-time updates about Jakarta</li>
              <li>Quick responses to common inquiries</li>
              <li>24/7 automated assistance</li>
              <li>Easy access to public services information</li>
            </ul>
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <img 
                src="/bot jaki.png" 
                alt="Bot Jaki Preview" 
                className="w-32 h-32 object-contain"
              />
            </div>
            <Button 
              onClick={handleTelegramRedirect}
              className="w-full mt-4 bg-[#0088cc] hover:bg-[#0077b5] flex items-center justify-center"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat with Bot Jaki on Telegram
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Engagement Statistics
              {error && (
                <span className="text-sm text-red-500">{error}</span>
              )}
            </CardTitle>
            <CardDescription>
              Overview of citizen interactions with our chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2">
              <StatsCard 
                title="Active Users" 
                value={stats.activeUsers.toLocaleString()}
                loading={loading}
              />
              <StatsCard 
                title="Daily Interactions" 
                value={stats.dailyInteractions.toLocaleString()}
                loading={loading}
              />
              <StatsCard 
                title="Response Rate" 
                value={`${stats.responseRate}%`}
                loading={loading}
              />
              <StatsCard 
                title="Avg. Response Time" 
                value={`${stats.avgResponseTime}s`}
                loading={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Chat Logs Section */}
        <ChatLogs />
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string | number
  loading: boolean
}

function StatsCard({ title, value, loading }: StatsCardProps) {
  return (
    <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold">{value}</p>
      )}
    </div>
  )
}