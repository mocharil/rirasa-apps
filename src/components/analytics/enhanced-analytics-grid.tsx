import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Users,
  MessageSquare,
  TrendingUp,
  Building2,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color?: string;
  tooltip?: string;
  trend?: {
    value: number;
    label: string;
  };
}

const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  color = "text-gray-900",
  tooltip,
  trend
}: StatsCardProps) => {
  // Default tooltip if none provided
  const tooltipText = tooltip || `This represents the ${title.toLowerCase()} tracked in our system. ${description}`;

  // Extract color class and generate matching background color
  const colorClass = color.split('-')[1];
  const bgClass = `bg-${colorClass}-50`;
  const ringClass = `ring-${colorClass}-100`;
  const iconBgClass = `bg-${colorClass}-100`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className={cn(
              "relative overflow-hidden p-6 transition-all",
              "hover:shadow-lg hover:ring-2",
              ringClass,
              bgClass
            )}>
              {/* Background Decoration */}
              <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full opacity-10 bg-gradient-to-br from-current to-transparent" />

              {/* Icon Container */}
              <div className={cn(
                "mb-4 inline-flex items-center justify-center rounded-lg p-3",
                iconBgClass,
                "transition-transform duration-200 ease-in-out"
              )}>
                <Icon className={cn("h-6 w-6", color)} />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-600">{title}</h3>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-baseline justify-between">
                  <span className={cn("text-3xl font-bold tracking-tight", color)}>
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </span>
                  {trend && (
                    <div className={cn(
                      "text-sm font-medium",
                      trend.value > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">
                  {description}
                </p>
              </div>

              {/* Interactive Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 transform translate-x-[-100%] hover:translate-x-[100%]" />
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="max-w-xs p-4 text-sm bg-white shadow-xl rounded-lg border"
        >
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{title}</p>
            <p className="text-gray-600">{tooltipText}</p>
            {trend && (
              <p className="text-sm text-gray-500">
                {trend.label}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const EnhancedAnalyticsGrid = ({ data, isLoading, error }: any) => {
  if (!data) return null;

  const statsConfig = [
    {
      title: "Public Issues",
      value: data.publicIssuesCount,
      description: "Active public concerns",
      icon: AlertCircle,
      color: "text-red-600",
      tooltip: "Number of active public issues requiring attention, categorized by urgency and impact.",
      trend: {
        value: parseFloat(data.weeklyChanges.publicIssues),
        label: "Change from previous week"
      }
    },
    {
      title: "Citizen Reach",
      value: data.citizenReach,
      description: "Total citizens engaged",
      icon: Users,
      color: "text-blue-600",
      tooltip: "Total number of unique citizens reached through social media interactions and engagements.",
      trend: {
        value: parseFloat(data.weeklyChanges.citizenReach),
        label: "Engagement growth rate"
      }
    },
    {
      title: "Department Mentions",
      value: data.departmentMentionsCount,
      description: "Government offices mentioned",
      icon: Building2,
      color: "text-purple-600",
      tooltip: "Frequency of government department mentions in social media discussions.",
      trend: {
        value: parseFloat(data.weeklyChanges.departmentMentions),
        label: "Mention frequency change"
      }
    },
    {
      title: "Critical Topics",
      value: data.criticalTopicsCount,
      description: "High urgency matters",
      icon: AlertTriangle,
      color: "text-yellow-600",
      tooltip: "Number of topics identified as critical based on urgency and public impact analysis.",
      trend: {
        value: parseFloat(data.weeklyChanges.publicIssues),
        label: "Critical topics trend"
      }
    },
    {
      title: "Public Sentiment",
      value: `${data.publicSentiment}%`,
      description: "Overall positive mentions",
      icon: TrendingUp,
      color: "text-green-600",
      tooltip: "Percentage of positive sentiment in public discussions and social media mentions.",
      trend: {
        value: 2,
        label: "Sentiment improvement"
      }
    },
    {
      title: "Active Discussions",
      value: data.activeDiscussions,
      description: "Ongoing public conversations",
      icon: MessageSquare,
      color: "text-indigo-600",
      tooltip: "Number of active public discussions across social media platforms.",
      trend: {
        value: parseFloat(data.weeklyChanges.activeDiscussions),
        label: "Discussion activity change"
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-10 w-10 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-8 w-1/3 bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statsConfig.map((stat, index) => (
        <StatsCard
          key={index}
          {...stat}
        />
      ))}
    </div>
  );
};

export default EnhancedAnalyticsGrid;