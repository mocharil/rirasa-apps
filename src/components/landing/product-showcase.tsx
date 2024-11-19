"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { 
  ChevronLeft, 
  ChevronRight, 
  MonitorDot,
  BarChart2,
  MessageSquareMore,
  ArrowRight 
} from 'lucide-react';

const ProductShowcase = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Stop autoplay when hovering
  useEffect(() => {
    if (isHovering) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % products.length);
    }, 8000); // Reduced to 8 seconds for better UX

    return () => clearInterval(timer);
  }, [isHovering]);

  const products = [
    {
      title: "Real-Time Dashboard",
      icon: <MonitorDot className="h-6 w-6" />,
      description: "Comprehensive monitoring and analysis platform featuring Metric Monitoring, Root Cause Analysis, and Trending Topics tracking. Our dashboard provides timely insights into public sentiment and engagement, identifies underlying issues, and keeps leaders informed about the latest news and social media discussions.",
      image: "/dashboard.jpg",
      features: [
        "Tracks key metrics for timely insights",
        "Identifies underlying issues",
        "Highlights latest discussions"
      ],
      details: [
        "Metric Monitoring: Tracks key metrics like public sentiment and engagement for timely insights",
        "Root Cause Analysis: Identifies the underlying issues of trending topics to address community concerns",
        "Trending Topics: Highlights the latest news and social media discussions to keep leaders informed"
      ],
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      title: "Government Social Analytics",
      icon: <BarChart2 className="h-6 w-6" />,
      description: "Advanced analytics platform combining social media monitoring, sentiment analysis, and network visualization. Features comprehensive tracking of public issues, citizen reach, and department mentions for real-time engagement insights.",
      image: "/analytics.jpg",
      features: [
        "Government Social Analytics",
        "Government Insights",
        "Network Analysis"
      ],
      details: [
        "Tracks public issues, citizen reach, and discussions for real-time engagement insights",
        "Offers trends in sentiment, priority issues, and regional distribution",
        "Maps social media interactions, revealing influencers and discussion clusters"
      ],
      color: "from-orange-500/20 to-orange-600/20"
    },
    {
      title: "AI-Powered Citizen Engagement",
      icon: <MessageSquareMore className="h-6 w-6" />,
      description: "Intelligent virtual assistant providing immediate, accurate responses to citizen inquiries. Features direct answers, real-time engagement, and comprehensive tracking of user interactions.",
      image: "/chatbot.jpg",
      features: [
        "Direct and specific answers",
        "Real-time engagement",
        "Interaction tracking"
      ],
      details: [
        "Gives direct and specific answers instantly",
        "Provides immediate responses without extra navigation",
        "Engages users interactively in real-time",
        "Tracks user interactions and provides valuable data",
        "Updated regularly with the latest, relevant information"
      ],
      color: "from-purple-500/20 to-purple-600/20"
    }
  ];

  const handleExploreClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push(`/dashboard/${activeSlide === 0 ? 'dashboard' : activeSlide === 1 ? 'analytics' : 'citizen-engagement'}`);
    }
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="py-20 relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      <div className="max-w-[90rem] mx-auto px-4 relative">
        {/* Section Header with improved animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E40AF]/5 rounded-full mb-6">
            <div className="w-2 h-2 rounded-full bg-[#1E40AF]" />
            <span className="text-sm font-medium text-[#1E40AF]">Our Solutions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Intelligent Solutions for{' '}
            <motion.span 
              className="bg-gradient-to-r from-[#E86A33] to-[#1E40AF] text-transparent bg-clip-text inline-block"
              animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              Smart Governance
            </motion.span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive platform combining real-time monitoring, AI-powered analytics, and citizen engagement
          </p>
        </motion.div>
        
        {/* Product Display with improved navigation */}
        <div className="relative">
         {/* Navigation Arrows */}
         <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-12 z-20">
            <motion.button
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/90 p-4 rounded-full shadow-lg backdrop-blur-sm border border-gray-100 hover:border-[#E86A33]/20 transition-all duration-300"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/90 p-4 rounded-full shadow-lg backdrop-blur-sm border border-gray-100 hover:border-[#E86A33]/20 transition-all duration-300"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </motion.button>
          </div>

          {/* Product Content with improved layout */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-16"
            >
              <div className="space-y-8">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${products[activeSlide].color} transform hover:scale-105 transition-transform duration-300`}>
                      {products[activeSlide].icon}
                    </div>
                    <h3 className="text-2xl font-bold">{products[activeSlide].title}</h3>
                  </motion.div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {products[activeSlide].description}
                  </p>
                </div>
                
                {/* Enhanced Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  {products[activeSlide].features.map((feature, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-2 rounded-full text-sm font-medium cursor-default ${
                        index === 0 
                          ? 'bg-gradient-to-r from-[#E86A33] to-[#1E40AF] text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors'
                      }`}
                    >
                      {feature}
                    </motion.span>
                  ))}
                </div>

                {/* Enhanced Detailed Features */}
                <div className="space-y-4">
                  {products[activeSlide].details.map((detail, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#E86A33] to-[#1E40AF] mt-2.5" />
                      <p className="text-sm text-gray-600 leading-relaxed">{detail}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleExploreClick}
                    className="bg-gradient-to-r from-[#E86A33] to-[#1E40AF] hover:opacity-90 text-white group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <span className="relative z-10 flex items-center">
                      Explore Features
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1E40AF] to-[#E86A33] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </motion.div>
              </div>
              
              {/* Enhanced Product Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5 z-10 rounded-2xl group-hover:opacity-0 transition-opacity duration-300" />
                <motion.img
                  src={products[activeSlide].image}
                  alt={products[activeSlide].title}
                  className="w-full h-full object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Slide Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className="group focus:outline-none"
              >
                <motion.div
                  animate={{
                    width: index === activeSlide ? 32 : 8,
                    backgroundColor: index === activeSlide 
                      ? "#1E40AF" 
                      : "#D1D5DB"
                  }}
                  className="h-2 rounded-full transition-all duration-300 group-hover:bg-[#1E40AF]/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;