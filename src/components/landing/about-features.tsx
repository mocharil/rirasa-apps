"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  Brain,
  Users,
  LineChart,
  TrendingUp,
  MessageSquare,
  Share2,
  Shield,
  Search
} from 'lucide-react';

const AboutFeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Root Cause Analysis",
      description: "Identify underlying issues of trending topics using Natural Language Processing (NLP) to understand and address community concerns effectively.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: BarChart2,
      title: "Real-Time Monitoring",
      description: "Track key metrics and public sentiment in real-time using Elasticsearch for comprehensive data analysis from news and social media.",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning models for sentiment analysis, topic modeling, and predictive insights to support data-driven decision making.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Users,
      title: "Citizen Engagement",
      description: "Interactive chatbot platform for direct communication with citizens, providing real-time responses and gathering valuable feedback.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Share2,
      title: "Network Analysis",
      description: "Visualize and analyze social network patterns to detect information manipulation and understand discussion clusters.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      icon: LineChart,
      title: "Trend Analysis",
      description: "Track emerging trends and patterns in public discourse to help leaders stay ahead of important issues.",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: Shield,
      title: "Smart Governance",
      description: "Enable data-driven policy making and response planning through comprehensive analytical insights.",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      icon: TrendingUp,
      title: "Performance Metrics",
      description: "Monitor government performance and public response to policies with detailed analytics and feedback tracking.",
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <section id="learn-more" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Empowering Smart Governance Through{' '}
            <span className="bg-gradient-to-r from-[#E86A33] to-[#1E40AF] text-transparent bg-clip-text">
              Advanced Technology
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Discover how our comprehensive suite of features enables better decision-making
            and enhanced citizen engagement through AI-powered analytics and real-time monitoring.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className={`${feature.bgColor} p-3 rounded-lg w-fit mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl font-bold mb-4">Powered by Advanced Technology</h3>
            <p className="text-gray-600">Built with cutting-edge technologies for performance and reliability</p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              "Next.js", "Elasticsearch", "Machine Learning", "BigQuery",
              "spaCy", "Python", "React", "Natural Language Processing"
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span className="text-gray-700 font-medium">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFeaturesSection;