// src/app/(dashboard)/analytics/page.tsx
'use client';

import dynamic from 'next/dynamic';

const TwitterAnalytics = dynamic(
  () => import('@/components/analytics/twitter-analytics').then(mod => mod.TwitterAnalytics),
  { ssr: false }
);

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Government Social Analytics</h1>
      </div>
      <TwitterAnalytics />
    </div>
  );
}