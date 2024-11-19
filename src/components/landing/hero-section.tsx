// component/landing/hero-section.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BarChart2, Brain, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/contexts/auth-context";
import StatsGrid from '@/components/landing/stats-grid';

const HeroSection = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleExplore = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleLearnMore = () => {
    // Scroll to product showcase section smoothly
    const showcaseSection = document.querySelector('#product-showcase');
    if (showcaseSection) {
      showcaseSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Background with improved animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F1] via-white to-white">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 -left-4 w-96 h-96 bg-[#E86A33]/10 rounded-full mix-blend-multiply filter blur-xl"
            animate={{ 
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-20 -right-4 w-96 h-96 bg-[#1E40AF]/10 rounded-full mix-blend-multiply filter blur-xl"
            animate={{ 
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-20 w-96 h-96 bg-orange-200/20 rounded-full mix-blend-multiply filter blur-xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          {/* Enhanced Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 mb-8 bg-white/50 backdrop-blur-sm rounded-full shadow-sm border border-white/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 text-[#E86A33]" />
            </motion.div>
            <span className="text-sm font-medium text-gray-600">Powered by AI & Big Data</span>
          </motion.div>

          {/* Enhanced Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold text-center mb-6 leading-tight relative"
          >
            <motion.span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-[#E86A33] via-[#1E40AF] to-[#E86A33] inline-block"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% auto',
              }}
            >
              Real-Time City
            </motion.span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Intelligence Platform
            </span>
          </motion.h1>

          {/* Enhanced Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 text-center max-w-3xl mb-12"
          >
            Empowering Jakarta's leaders with AI-driven insights and real-time monitoring for better 
            decision-making and enhanced citizen engagement.
          </motion.p>

          {/* Enhanced Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {[
              { icon: BarChart2, text: "Real-time Analytics" },
              { icon: Brain, text: "AI-Powered Insights" },
              { icon: Cpu, text: "Smart Monitoring" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-white/20"
              >
                <feature.icon className="h-5 w-5 text-[#E86A33]" />
                <span className="text-sm font-medium text-gray-700">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleExplore}
                className="relative bg-gradient-to-r from-[#E86A33] to-[#1E40AF] text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                size="lg"
              >
                <span className="relative z-10 flex items-center">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E40AF] to-[#E86A33] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline"
                onClick={handleLearnMore}
                className="border-gray-300 hover:border-[#E86A33] px-8 py-6 text-lg shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                size="lg"
              >
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#E86A33]/10 to-[#1E40AF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-20"
        >
          <StatsGrid />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;