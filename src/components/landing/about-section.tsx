"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent`;

const AboutSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative py-24 bg-gradient-to-b from-[#FAFAFA] to-white overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-[#E86A33]/10 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-[#1E40AF]/10 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-6">
        {/* Main Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-[#E86A33]" />
            <span className="text-sm font-medium text-[#E86A33] tracking-wider uppercase">Empowering Smart Governance</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Bridging Citizens and Government Through{' '}
            <span className="bg-gradient-to-r from-[#E86A33] to-[#1E40AF] bg-clip-text text-transparent relative">
              Intelligent Analytics
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E86A33]/20 to-[#1E40AF]/20 blur-lg opacity-50" />
            </span>
          </h2>
        </motion.div>

        {/* Narrative Sections */}
        <div className="space-y-16">
          {/* Introduction */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-orange-50 opacity-50 blur-3xl" />
            <p className="relative text-lg leading-relaxed text-gray-800 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <span className="font-semibold text-[#E86A33]">Insight Jakarta</span> is an AI-powered
              <span className="bg-blue-50 px-2 py-1 mx-1 rounded-md font-medium">dashboard</span> 
              that provides <span className="bg-blue-50 px-2 py-1 mx-1 rounded-md font-medium">real-time</span> 
              analysis of online news and social media content on critical issues in Jakarta. This platform helps 
              the government understand public sentiment, identify critical issues, and respond more quickly.
            </p>
          </motion.div>

          {/* Process Flow */}
          <div className="space-y-8">
            <motion.h3
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={fadeInUp}
              className="text-2xl font-bold text-gray-900 flex items-center gap-2"
            >
              <div className="h-8 w-1 bg-[#E86A33] rounded-full" />
              How It Works
            </motion.h3>

            {/* Process Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              {[
                {
                  title: "1. Citizens Input",
                  description: "Citizens share information and feedback through social media",
                  delay: 0.2
                },
                {
                  title: "2. AI Processing",
                  description: "Analysis using Big Data and AI to generate insights",
                  delay: 0.4
                },
                {
                  title: "3. Government Action",
                  description: "Government takes action based on data-driven recommendations",
                  delay: 0.6
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: step.delay }}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className={`${shimmer} bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="text-[#E86A33] font-bold text-lg mb-2">{step.title}</div>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="h-8 w-1 bg-[#E86A33] rounded-full" />
              Key Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Real-time & accurate insights",
                "Early issue detection",
                "Direct citizen engagement",
                "Data-driven decision making",
                "Improved government efficiency",
                "Enhanced public trust"
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  variants={fadeInUp}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowRight className="h-4 w-4 text-[#E86A33]" />
                  <span className="text-gray-800">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            variants={fadeInUp}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#E86A33] to-[#1E40AF] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000" />
            <p className="relative text-lg leading-relaxed text-gray-800 bg-white rounded-lg p-6 shadow-lg">
              With <span className="font-semibold text-[#E86A33]">Insight Jakarta</span>, we're creating 
              a more adaptive and responsive Jakarta for its citizens. This platform bridges the two-way 
              communication between government and community, creating a continuous feedback loop for a 
              better Jakarta.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;