import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTwitterAnalytics } from '@/hooks/use-twitter-analytics';
import { NetworkAnalysis } from './network-analysis';
import EnhancedAnalyticsGrid from './enhanced-analytics-grid';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2,Building2, Share2 } from 'lucide-react';
import { GovernmentInsights } from './government-insights';

export function TwitterAnalytics() {
  const { data, isLoading, error } = useTwitterAnalytics();
  const [activeTab, setActiveTab] = useState('insights');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px] space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="text-gray-500">Loading analytics data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Card className="max-w-lg w-full">
          <div className="p-6">
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load analytics data</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <EnhancedAnalyticsGrid
          data={data}
          isLoading={isLoading}
          error={error}
        />
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="sticky top-0 z-1 bg-white pb-4 border-b">
          <TabsList className="inline-flex items-center rounded-lg border bg-background p-1 text-muted-foreground">
            <button
              className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeTab === 'insights'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-muted hover:text-foreground'
              }`}
              onClick={() => setActiveTab('insights')}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Government Insights
            </button>
            <button
              className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeTab === 'network'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-muted hover:text-foreground'
              }`}
              onClick={() => setActiveTab('network')}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Network Analysis
            </button>
          </TabsList>
        </div>

        <TabsContent value="insights" className="mt-6">
          <GovernmentInsights data={data} />
        </TabsContent>
        <TabsContent value="network" className="mt-6">
          <NetworkAnalysis data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
