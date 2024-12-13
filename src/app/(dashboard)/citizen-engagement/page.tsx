import { Metadata } from "next"
import { CitizenEngagementView } from "@/components/dashboard/citizen-engagement/citizen-engagement-view"

export const metadata: Metadata = {
  title: "Citizen Engagement",
  description: "Manage and monitor citizen interactions through our platform",
}

export default function CitizenEngagementPage() {
  return <CitizenEngagementView />
}