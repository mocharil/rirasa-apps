"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
    baseColor: '#97B95A'
  },
  west: {
    path: "M40,150 L140,90 L160,120 L180,150 L220,160 L240,200 L220,240 L180,280 L140,300 L100,280 L60,240 L40,200 Z",
    name: "West Jakarta",
    baseColor: '#FFA726'
  },
  central: {
    path: "M220,160 L280,165 L340,160 L360,200 L340,240 L280,245 L220,240 L240,200 Z",
    name: "Central Jakarta",
    baseColor: '#BA68C8'
  },
  east: {
    path: "M340,160 L380,150 L420,120 L460,150 L480,200 L460,250 L420,280 L380,300 L340,280 L360,240 L340,240 L360,200 Z",
    name: "East Jakarta",
    baseColor: '#B5997B'
  },
  south: {
    path: "M180,280 L220,240 L280,245 L340,240 L340,280 L380,300 L360,340 L320,380 L280,400 L240,420 L200,400 L160,360 L140,300 Z",
    name: "South Jakarta",
    baseColor: '#42A5F5'
  }
};

export const JakartaMap: React.FC<JakartaMapProps> = ({ data }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const maxValue = Math.max(...data.map(item => item.value));

  const getRegionValue = (regionName: string): number => {
    const region = data.find(r => r.region.includes(regionName));
    if (data.length === 1 && data[0].region === 'DKI Jakarta') {
      return data[0].value;
    }
    return region ? region.value : 0;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const regionKeys = Object.keys(regions) as RegionKey[];

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 520 470" className="w-full h-full">
        <rect width="520" height="470" fill="#FAFAFA" />
        
        {regionKeys.map((key) => {
          const region = regions[key];
          const value = getRegionValue(region.name);
          const isHovered = hoveredRegion === region.name;
          
          return (
            <g key={key}>
              <motion.path
                d={region.path}
                fill={isHovered ? region.baseColor : region.baseColor}
                stroke="white"
                strokeWidth={2}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
                }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setHoveredRegion(region.name)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="transition-all duration-300 cursor-pointer"
              />
              <text
                fill="white"
                fontSize="14"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none uppercase"
                x={key === 'west' ? "140" : 
                   key === 'east' ? "400" : 
                   key === 'north' ? "270" :
                   key === 'south' ? "270" : "280"}
                y={key === 'north' ? "110" : 
                   key === 'south' ? "340" :
                   key === 'west' ? "200" :
                   key === 'east' ? "220" : "200"}
              >
                {key}
              </text>
              
              <text
                fill="white"
                fontSize="12"
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none"
                x={key === 'west' ? "140" : 
                   key === 'east' ? "400" : 
                   key === 'north' ? "270" :
                   key === 'south' ? "270" : "280"}
                y={key === 'north' ? 130 : 
                   key === 'south' ? 360 :
                   key === 'west' ? 220 :
                   key === 'east' ? 240 : 220}
              >
                {formatNumber(value)}
              </text>
            </g>
          );
        })}

        <g transform="translate(20, 420)" className="text-xs">
          <text className="fill-gray-900 font-medium">Distribution of Issues</text>
          <g transform="translate(0, 20)">
            {[0, maxValue/4, maxValue/2, maxValue*3/4, maxValue].map((value, i) => (
              <g key={value} transform={`translate(${i * 80}, 0)`}>
                <rect
                  width="20"
                  height="20"
                  fill={regions[regionKeys[i]].baseColor}
                  stroke="#fff"
                />
                <text
                  x="10"
                  y="35"
                  textAnchor="middle"
                  className="fill-gray-600"
                >
                  {formatNumber(Math.round(value))}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>

      {hoveredRegion && (
        <div className="absolute bg-white px-4 py-2 rounded-lg shadow-lg text-sm"
             style={{
               left: '50%',
               top: '50%',
               transform: 'translate(-50%, -50%)'
             }}>
          <p className="font-medium">{hoveredRegion}</p>
          <p className="text-[#E86A33]">{formatNumber(getRegionValue(hoveredRegion))} issues</p>
        </div>
      )}

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-100">
        <h4 className="font-medium text-sm mb-2">Regional Distribution</h4>
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{item.region}</span>
            <span className="font-medium text-[#E86A33]">{formatNumber(item.value)}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total</span>
            <span className="font-medium text-[#E86A33]">
              {formatNumber(data.reduce((sum, item) => sum + item.value, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JakartaMap;