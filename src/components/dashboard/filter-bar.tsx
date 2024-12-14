// src/components/dashboard/filter-bar.tsx
"use client"
import { useState, useEffect, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export interface FilterValues {
  urgencyLevel: number[];
  topics: string[];
  regions: string[];
  sentiments: string[];
  audiences: string[];
}

interface FilterBarProps {
  onFilter: (filters: FilterValues) => void;
  onClear?: () => void;  // Buat opsional dengan tanda ?
}

const TOPIC_OPTIONS = [
  "Social and Economy",
  "Infrastructure and Transportation",
  "Public Health",
  "Environment and Disaster",
  "Safety and Crime",
  "Government and Public Policy",
  "Technology and Innovation",
  "City Planning and Housing",
  "Education and Culture",
  "Tourism and Entertainment",
  "Ecology and Green Spaces",
];

const REGION_OPTIONS = [
  "DKI Jakarta",
  "South Jakarta",
  "North Jakarta",
  "East Jakarta",
  "West Jakarta",
  "Central Jakarta",
];

const SENTIMENT_OPTIONS = [
  "Positive",
  "Neutral",
  "Negative",
];

const TARGET_AUDIENCE_OPTIONS = [
  "Traditional Market Vendors",
  "Business Owners",
  "Local Government",
  "General Public",
  "Healthcare Workers",
  "Environmental Agencies",
  "Public Transport Users",
  "Tourists",
  "Students and Educators",
  "Technology Enthusiasts",
  "Safety and Security Agencies",
];

export function FilterBar({ onFilter, onClear }: FilterBarProps) {
    const [filters, setFilters] = useState<FilterValues>({
      urgencyLevel: [0, 100],
      topics: [],
      regions: [],
      sentiments: [],
      audiences: [],
    });
  
    const hasActiveFilters = 
      filters.topics.length > 0 ||
      filters.regions.length > 0 ||
      filters.sentiments.length > 0 ||
      filters.audiences.length > 0 ||
      filters.urgencyLevel[0] !== 0 ||
      filters.urgencyLevel[1] !== 100;
  
    const clearFilters = useCallback(() => {
      const newFilters = {
        urgencyLevel: [0, 100],
        topics: [],
        regions: [],
        sentiments: [],
        audiences: [],
      };
      setFilters(newFilters);
      onFilter(newFilters);
      onClear?.(); // Gunakan optional chaining
    }, [onFilter, onClear]);

  const handleUrgencyChange = useCallback((value: number[]) => {
    const newFilters = {
      ...filters,
      urgencyLevel: value,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  }, [filters, onFilter]);

  const handleMultiSelectChange = useCallback((
    field: keyof Omit<FilterValues, 'urgencyLevel'>,
    value: string
  ) => {
    const newValues = filters[field].includes(value)
      ? filters[field].filter(item => item !== value)
      : [...filters[field], value];

    const newFilters = {
      ...filters,
      [field]: newValues,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  }, [filters, onFilter]);

  const removeFilter = useCallback((
    field: keyof Omit<FilterValues, 'urgencyLevel'>,
    value: string
  ) => {
    const newFilters = {
      ...filters,
      [field]: filters[field].filter(item => item !== value),
    };
    setFilters(newFilters);
    onFilter(newFilters);
  }, [filters, onFilter]);


  const renderSelect = useCallback((
    field: keyof Omit<FilterValues, 'urgencyLevel'>,
    options: string[],
    placeholder: string
  ) => (
    <div key={field} className="relative">
      <Select
        value={filters[field][0] || ''} 
        onValueChange={(value) => handleMultiSelectChange(field, value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={placeholder}>
            {filters[field].length > 0 
              ? `${filters[field].length} selected` 
              : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className={filters[field].includes(option) ? 'bg-accent' : ''}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ), [filters, handleMultiSelectChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Urgency Level Slider */}
        <div className="w-full">
          <label className="text-sm font-medium mb-2 block">
            Urgency Level: {filters.urgencyLevel[0]} - {filters.urgencyLevel[1]}
          </label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={filters.urgencyLevel}
            onValueChange={handleUrgencyChange}
            className="w-full"
          />
        </div>

        {/* Selects */}
        {renderSelect('topics', TOPIC_OPTIONS, 'Topic')}
        {renderSelect('regions', REGION_OPTIONS, 'Region')}
        {renderSelect('sentiments', SENTIMENT_OPTIONS, 'Sentiment')}
        {renderSelect('audiences', TARGET_AUDIENCE_OPTIONS, 'Target Audience')}

        {hasActiveFilters && (
          <Button
            variant="outline"
            className="h-10"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([field, values]) => {
            if (field === 'urgencyLevel') return null;
            return (values as string[]).map((value) => (
              <Badge 
                key={`${field}-${value}`}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {value}
                <button
                  onClick={() => removeFilter(field as keyof Omit<FilterValues, 'urgencyLevel'>, value)}
                  className="ml-1 hover:text-destructive focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ));
          })}
        </div>
      )}
    </div>
  );
}
