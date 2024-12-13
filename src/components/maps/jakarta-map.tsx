"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleLinear } from 'd3-scale';
import { AlertCircle, Info } from 'lucide-react';

interface RegionData {
  region: string;
  value: number;
}

interface JakartaMapProps {
  data: RegionData[];
}

interface Region {
  path: string;
  name: string;
  baseColor: string;
  center: { x: number; y: number };
}

type RegionKey = 'north' | 'west' | 'central' | 'east' | 'south';

interface Regions {
  north: Region;
  west: Region;
  central: Region;
  east: Region;
  south: Region;
}

const regions: Regions = {
  north: {
    path: "M180,50 L350,50 C360,50 370,60 380,70 L400,90 L420,120 L380,150 L340,160 L280,165 L220,160 L180,150 L160,120 L140,90 L160,70 Z",
    name: "North Jakarta",
    baseColor: '#60A5FA', // Blue
    center: { x: 270, y: 110 }
  },
  west: {
    path: "M40,150 L140,90 L160,120 L180,150 L220,160 L240,200 L220,240 L180,280 L140,300 L100,280 L60,240 L40,200 Z",
    name: "West Jakarta",
    baseColor: '#34D399', // Green
    center: { x: 140, y: 200 }
  },
  central: {
    path: "M220,160 L280,165 L340,160 L360,200 L340,240 L280,245 L220,240 L240,200 Z",
    name: "Central Jakarta",
    baseColor: '#A78BFA', // Purple
    center: { x: 280, y: 200 }
  },
  east: {
    path: "M340,160 L380,150 L420,120 L460,150 L480,200 L460,250 L420,280 L380,300 L340,280 L360,240 L340,240 L360,200 Z",
    name: "East Jakarta",
    baseColor: '#F472B6', // Pink
    center: { x: 400, y: 220 }
  },
  south: {
    path: "M180,280 L220,240 L280,245 L340,240 L340,280 L380,300 L360,340 L320,380 L280,400 L240,420 L200,400 L160,360 L140,300 Z",
    name: "South Jakarta",
    baseColor: '#FBBF24', // Yellow
    center: { x: 270, y: 340 }
  }
};

const REGION_COLORS = {
  north: {
    base: '#84cc16', // Light green
    hover: '#65a30d',
    light: '#ecfccb'
  },
  west: {
    base: '#f97316', // Orange
    hover: '#ea580c',
    light: '#ffedd5'
  },
  central: {
    base: '#a855f7', // Purple
    hover: '#9333ea',
    light: '#f3e8ff'
  },
  east: {
    base: '#92400e', // Brown
    hover: '#78350f',
    light: '#fef3c7'
  },
  south: {
    base: '#0ea5e9', // Blue
    hover: '#0284c7',
    light: '#e0f2fe'
  }
};

export const JakartaMap: React.FC<JakartaMapProps> = ({ data }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Enhanced memoized calculations
  const { maxValue, colorScale, totalIssues, urgencyLevel } = useMemo(() => {
    const max = Math.max(...data.map(item => item.value));
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    const scale = scaleLinear<string>()
      .domain([0, max])
      .range(['#f0fdfa', '#0d9488']); // Lighter teal to darker teal

    // Calculate urgency level based on total issues
    const urgency = total > 1000 ? 'high' : total > 500 ? 'medium' : 'low';

    return { maxValue: max, colorScale: scale, totalIssues: total, urgencyLevel: urgency };
  }, [data]);

  const getRegionValue = (regionName: string): number => {
    const region = data.find(r => r.region.includes(regionName));
    return region ? region.value : 0;
  };
  const getRegionKey = (regionName: string): keyof typeof REGION_COLORS | undefined => {
    const key = Object.keys(regions).find(
      key => regions[key as keyof typeof regions].name === regionName
    );
    return key as keyof typeof REGION_COLORS | undefined;
  };
  
  // Then update anywhere you're using region colors:
  const getRegionColor = (value: number, baseColor: string, isHovered: boolean) => {
    const intensity = value / maxValue; // Calculate intensity based on value
    
    if (isHovered) {
      return REGION_COLORS[baseColor as keyof typeof REGION_COLORS]?.hover || baseColor;
    }
  
    // Convert hex to RGB for better color manipulation
    const hex = REGION_COLORS[baseColor as keyof typeof REGION_COLORS]?.base || baseColor;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
  
    // Darken the color based on intensity
    const darkenFactor = 0.5 + (intensity * 0.5); // 50% to 100% of original color
    const newR = Math.round(r * darkenFactor);
    const newG = Math.round(g * darkenFactor);
    const newB = Math.round(b * darkenFactor);
  
    return `rgb(${newR}, ${newG}, ${newB})`;
  };
  

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const regionKeys = Object.keys(regions) as RegionKey[];

  const legendSteps = 5;
  const legendValues = Array.from({ length: legendSteps }, (_, i) => 
    Math.round((maxValue / (legendSteps - 1)) * i)
  );




  return (
    <div className="relative w-full h-full bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Jakarta Regional Map</h3>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            urgencyLevel === 'high' ? 'bg-red-100 text-red-700' :
            urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {urgencyLevel === 'high' ? 'High Activity' :
             urgencyLevel === 'medium' ? 'Moderate Activity' :
             'Low Activity'}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Distribution of reported issues across Jakarta
        </p>
      </div>

      {/* Main Map */}
      <svg viewBox="0 0 520 470" className="w-full h-full">
        {/* Background with subtle grid */}
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
        </pattern>
        <rect width="520" height="470" fill="url(#grid)" />

        {/* Regions with enhanced styling */}
        {regionKeys.map((key) => {
          const region = regions[key];
          const value = getRegionValue(region.name);
          const isHovered = hoveredRegion === region.name;
          const isSelected = selectedRegion === region.name;
          
          return (
            <g key={key}>
              <motion.path
  d={region.path}
  fill={getRegionColor(value, key, isHovered)}
  stroke={isSelected ? REGION_COLORS[key].hover : "white"}
  strokeWidth={isSelected ? 3 : 1.5}
  initial={{ opacity: 0 }}
  animate={{ 
    opacity: 1,
    scale: isHovered ? 1.02 : 1,
    filter: `drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) brightness(${isHovered ? 1.1 : 1})`
  }}
  transition={{ 
    duration: 0.2,
    ease: "easeOut"
  }}
  onMouseEnter={() => setHoveredRegion(region.name)}
  onMouseLeave={() => setHoveredRegion(null)}
  onClick={() => setSelectedRegion(region.name)}
  className="transition-all duration-200 cursor-pointer"
/>

              {/* Enhanced Labels */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  scale: isHovered ? 1.1 : 1
                }}
                className="pointer-events-none"
              >
                <text
                  x={region.center.x}
                  y={region.center.y - 10}
                  textAnchor="middle"
                  className={`font-semibold fill-current ${
                    isHovered ? 'text-white' : 'text-white'
                  }`}
                  fontSize="14"
                >
                  {region.name}
                </text>
               
              </motion.g>
            </g>
          );
        })}

        
      </svg>

      {/* Enhanced Statistics Panel */}
<div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 max-w-[240px]">
  <div className="flex items-center justify-between mb-3">
    <h4 className="font-semibold text-gray-900">Statistics</h4>
    <span className="text-sm text-gray-500">{formatNumber(totalIssues)} total</span>
  </div>
  <div className="space-y-2">
    {data.map((item, index) => {
      // Get the region key safely
      const regionKey = Object.keys(regions).find(
        key => regions[key as keyof typeof regions].name === item.region
      ) as keyof typeof REGION_COLORS | undefined;

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
            hoveredRegion === item.region ? 'bg-gray-50' : ''
          }`}
          onMouseEnter={() => setHoveredRegion(item.region)}
          onMouseLeave={() => setHoveredRegion(null)}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ 
                backgroundColor: regionKey ? 
                  REGION_COLORS[regionKey].base : 
                  '#CBD5E1' // default color if region not found
              }} 
            />
            <span className="text-sm text-gray-700">{item.region}</span>
          </div>
          <span className="font-medium text-gray-900">{formatNumber(item.value)}</span>
        </motion.div>
      );
    })}
  </div>
</div>

      {/* Interactive Tooltip */}
      <AnimatePresence>
        {hoveredRegion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-gray-200"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <h4 className="font-semibold text-gray-900 mb-1">{hoveredRegion}</h4>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">
                {formatNumber(getRegionValue(hoveredRegion))} reported issues
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JakartaMap;