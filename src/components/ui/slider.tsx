// src/components/ui/slider.tsx
"use client"

import * as React from "react"

interface SliderProps {
  min: number
  max: number
  step?: number
  value: number[]
  onValueChange: (value: number[]) => void
  className?: string
}

export function Slider({ min, max, step = 1, value, onValueChange, className = "" }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    // For range slider, we keep both values but only update the one being dragged
    const index = Number(e.target.dataset.index) || 0
    const newValues = [...value]
    newValues[index] = newValue
    onValueChange(newValues)
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative h-2 bg-gray-200 rounded-full">
        {/* Track for first thumb */}
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{
            left: `${(value[0] - min) / (max - min) * 100}%`,
            right: `${100 - (value[1] - min) / (max - min) * 100}%`
          }}
        />
      </div>
      {/* First thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        data-index="0"
        className="absolute w-full h-2 opacity-0 cursor-pointer"
      />
      {/* Second thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[1]}
        onChange={handleChange}
        data-index="1"
        className="absolute w-full h-2 opacity-0 cursor-pointer"
      />
      {/* Thumb indicators */}
      <div 
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full -mt-1.5 transform -translate-x-1/2"
        style={{ left: `${(value[0] - min) / (max - min) * 100}%` }}
      />
      <div 
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full -mt-1.5 transform -translate-x-1/2"
        style={{ left: `${(value[1] - min) / (max - min) * 100}%` }}
      />
    </div>
  )
}
