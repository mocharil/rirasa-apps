// src/components/dashboard/citizen-engagement/analytics/topic-heatmap.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Topic {
  name: string;
  count: number;
  urgency: number;
  details: string;
}

interface TopicHeatmapProps {
  topics: Topic[];
}

const topicImages: { [key: string]: string } = {
  "Infrastructure and Transportation": "/infrastructure_and_transportation.png",
  "Environment and Disaster": "/environment_and_disaster.png",
  "Public Health": "/public_health.png",
  "Education and Culture": "/education_and_culture.png",
  "City Planning and Housing": "/city_planning_and_housing.png",
  "Technology and Innovation": "/technology_and_innovation.png",
  "Safety and Crime": "/safety_and_crime.png",
  "Social and Economy": "/social_and_economy.png",
  "Tourism and Entertainment": "/tourism_and_entertainment.png",
  "Ecology and Green Spaces": "/ecology_and_green_spaces.png",
  "Government and Public Policy": "/government_and_public_policy.png"
};

export function TopicHeatmap({ topics }: TopicHeatmapProps) {
  // Sort topics by count primarily, and urgency secondarily
  const sortedTopics = [...topics].sort((a, b) => {
    if (b.count === a.count) {
      return b.urgency - a.urgency;
    }
    return b.count - a.count;
  });

  return (
    <Card className="shadow-xl rounded-lg border-none bg-white p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800 mb-4">Popular Topics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
          {sortedTopics.map((topic, index) => {
            const urgencyColor =
              topic.urgency > 70
                ? "#ef4444"
                : topic.urgency > 40
                ? "#facc15"
                : "#4caf50";
            const imageUrl = topicImages[topic.name] || "/default_topic.png";

            return (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-center p-4 rounded-lg bg-gray-50 shadow-md hover:shadow-lg transition-transform transform hover:scale-105 group"
              >
                <img
                  src={imageUrl}
                  alt={topic.name}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{topic.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{topic.count} posts</p>
                  <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${topic.urgency}%`,
                        background: urgencyColor,
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Urgency: {topic.urgency}%</p>
                </div>
                {/* Hover details */}
                
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
