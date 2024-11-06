"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Search } from "lucide-react"

interface ChatLog {
  user_id: string
  username: string
  message_text: string
  bot_response: string
  timestamp: string
  response_time_ms: number
}

const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const past = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}d ago`
  }

  // Format as date for older messages
  return past.toLocaleDateString()
}

export function ChatLogs() {
  const [logs, setLogs] = useState<ChatLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/engagement/logs?' + new URLSearchParams({
        search: searchQuery
      }))
      if (!response.ok) {
        throw new Error('Failed to fetch chat logs')
      }
      const data = await response.json()
      setLogs(data.logs)
      setError(null)
    } catch (error) {
      console.error('Error fetching logs:', error)
      setError('Failed to load chat logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 30000)
    return () => clearInterval(interval)
  }, [searchQuery])

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Chat Logs</CardTitle>
            <p className="text-sm text-gray-500">Recent interactions with the chatbot</p>
          </div>
          <Button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-center text-red-500 py-4">{error}</p>
        ) : (
          <div className="relative overflow-auto max-h-[500px] w-full">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Time</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">User ID</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">User Message</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Bot Response</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 text-right">Response Time</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No chat logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatTimeAgo(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-sm">{log.username}</td>
                      <td className="px-4 py-3 text-sm max-w-[300px] truncate">
                        {log.message_text}
                      </td>
                      <td className="px-4 py-3 text-sm max-w-[300px] truncate">
                        {log.bot_response}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {(log.response_time_ms / 1000).toFixed(2)}s
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}