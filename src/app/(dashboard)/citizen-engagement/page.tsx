import { Metadata } from "next"
import { CitizenEngagementView } from "@/components/dashboard/citizen-engagement/citizen-engagement-view"

export const metadata: Metadata = {
  title: "Citizen Engagement",
  description: "Engage with citizens through our Telegram chatbot",
}

export default function CitizenEngagementPage() {
  return <CitizenEngagementView />
}