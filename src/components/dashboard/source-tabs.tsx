"use client"

import { Newspaper, Twitter } from "lucide-react"

interface SourceTabsProps {
  activeSource: 'news' | 'twitter';
  onChange: (source: 'news' | 'twitter') => void;
}

export function SourceTabs({ activeSource, onChange }: SourceTabsProps) {
  return (
    <div className="inline-flex items-center rounded-lg border bg-background p-1 text-muted-foreground">
      <button
        className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          activeSource === 'news'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'hover:bg-muted hover:text-foreground'
        }`}
        onClick={() => onChange('news')}
      >
        <Newspaper className="mr-2 h-4 w-4" />
        News
      </button>
      <button
        className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          activeSource === 'twitter'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'hover:bg-muted hover:text-foreground'
        }`}
        onClick={() => onChange('twitter')}
      >
        <Twitter className="mr-2 h-4 w-4" />
        Twitter
      </button>
    </div>
  )
}