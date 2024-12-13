import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { JakartaMap } from '@/components/maps/jakarta-map';
import { motion } from 'framer-motion';
import {
  AlertCircle, TrendingUp, MessageSquare, Users, Building2,
  Bell, FileText, Share2, ChevronRight, BarChart2
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// Analytics Dashboard Sections
const SentimentAnalysis = ({ data }: any) => (
  <Card className="col-span-2">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Real-Time Sentiment Analysis
        </CardTitle>
        <Button variant="outline" size="sm">
          Set Alert <Bell className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer>
          <AreaChart data={data?.sentimentTrends}>
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-4 rounded-lg shadow-lg border">
                    <p className="font-medium">{label}</p>
                    <div className="space-y-1">
                      {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }}>
                          {entry.name}: {entry.value.toFixed(1)}%
                        </p>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm text-gray-600">
                        Top Keywords: #banjir, #infrastruktur
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }} />
            <Area
              type="monotone"
              dataKey="positive"
              stroke="#22c55e"
              fill="url(#positiveGradient)"
              name="Positive"
            />
            <Area
              type="monotone"
              dataKey="negative"
              stroke="#ef4444"
              fill="url(#negativeGradient)"
              name="Negative"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const UrgencyAnalysis = ({ data }: any) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Priority Issues
        </CardTitle>
        <Button variant="outline" size="sm">
          Export <FileText className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-[400px]">
        <ResponsiveContainer>
          <BarChart
            data={data?.priorityIssues}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="topic" type="category" width={100} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const issue = payload[0].payload;
                  return (
                    <div className="bg-white p-4 rounded-lg shadow-lg border">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm mt-1">Urgency: {issue.urgency}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        {issue.description}
                      </p>
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-sm font-medium">Recommended Action:</p>
                        <p className="text-sm text-gray-600">
                          {issue.recommendation}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" fill="#3b82f6">
              {data?.priorityIssues?.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.urgency >= 70 ? '#ef4444' : '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const RegionalInsights = ({ data = { regionalData: [] } }: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-purple-500" />
        Regional Distribution
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[400px] relative">
        <JakartaMap data={data?.regionalData} />
        <div className="absolute top-4 right-4 bg-white/90 p-4 rounded-lg shadow-sm border space-y-2">
          <p className="text-sm font-medium">Issue Distribution</p>
          {data?.regionalData?.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{item.region}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const PredictiveAnalytics = ({ data }: any) => (
  <Card className="col-span-2">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-green-500" />
          Emerging Issues & Predictions
        </CardTitle>
        <Button variant="outline" size="sm">
          Share Insights <Share2 className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {data?.emergingIssues?.map((issue: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{issue.topic}</h4>
                <p className="text-sm text-gray-600 mt-1">{issue.prediction}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                issue.confidence > 80 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {issue.confidence}% confidence
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-500">Expected Impact: {issue.impact}</span>
                <span className="text-gray-500">Timeline: {issue.timeline}</span>
              </div>
              <Button variant="ghost" size="sm">
                View Details <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main Analytics Dashboard
export const AdvancedAnalytics = ({ data }: any) => {
  const [selectedView, setSelectedView] = useState('overview');

  return (
    <div className="space-y-6">
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SentimentAnalysis data={data} />
              <UrgencyAnalysis data={data} />
              <RegionalInsights data={data} />
              <PredictiveAnalytics data={data} />
            </div>
          </TabsContent>

          <TabsContent value="predictive">
            {/* Additional predictive analytics content */}
          </TabsContent>

          <TabsContent value="engagement">
            {/* Engagement metrics content */}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};