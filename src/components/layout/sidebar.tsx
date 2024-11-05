import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, MessageSquare, PieChart, Settings } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="ghost" className="w-full justify-start">
                <PieChart className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/social-monitoring">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Social Monitoring
              </Button>
            </Link>
            <Link href="/citizen-engagement">
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Citizen Engagement
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Settings
          </h2>
          <div className="space-y-1">
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}