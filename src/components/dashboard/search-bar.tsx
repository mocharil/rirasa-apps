// src/components/dashboard/search-bar.tsx
"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, X, SlidersHorizontal, Calendar, 
  Tag, AlertCircle, Filter, Loader2, Heart
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface FilterState {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  categories: string[];
  urgencyLevel: string[];
  sentiment: string[];
  region: string[];
}
interface ConfigItem {
  label: string;
  icon: string;
  color: string;
}

// Then, let's create a type for our config mapping
type FilterConfig = {
  categories: ConfigItem[];
  urgencyLevel: ConfigItem[];
  sentiment: ConfigItem[];
  region: ConfigItem[];
}

interface SearchBarProps {
  onSearch: (query: string, filters: FilterState) => void;
  value?: string;
  totalResults?: number;
  isLoading?: boolean;
  onChange?: (value: string) => void;
}

const CATEGORY_CONFIG = [
  { 
    label: "Social and Economy", 
    icon: "💰",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200" 
  },
  { 
    label: "Infrastructure and Transportation", 
    icon: "🚆",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  },
  { 
    label: "Public Health", 
    icon: "🏥",
    color: "bg-green-100 text-green-800 hover:bg-green-200"
  },
  { 
    label: "Environment and Disaster", 
    icon: "🌍",
    color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
  },
  { 
    label: "Safety and Crime", 
    icon: "🚨",
    color: "bg-red-100 text-red-800 hover:bg-red-200"
  },
  { 
    label: "Government and Public Policy", 
    icon: "📜",
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200"
  },
  { 
    label: "Technology and Innovation", 
    icon: "💻",
    color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
  },
  { 
    label: "City Planning and Housing", 
    icon: "🏘️",
    color: "bg-amber-100 text-amber-800 hover:bg-amber-200"
  },
  { 
    label: "Education and Culture", 
    icon: "📚",
    color: "bg-teal-100 text-teal-800 hover:bg-teal-200"
  },
  { 
    label: "Tourism and Entertainment", 
    icon: "🎭",
    color: "bg-pink-100 text-pink-800 hover:bg-pink-200"
  },
  { 
    label: "Ecology and Green Spaces", 
    icon: "🌿",
    color: "bg-lime-100 text-lime-800 hover:bg-lime-200"
  }
];

const REGION_CONFIG = [
  { 
    label: "North Jakarta", 
    icon: "🌊", // Ocean icon for North Jakarta (coastal area)
    color: "bg-sky-100 text-sky-800 hover:bg-sky-200"
  },
  { 
    label: "South Jakarta", 
    icon: "🏢", // Building icon for South Jakarta (business district)
    color: "bg-violet-100 text-violet-800 hover:bg-violet-200"
  },
  { 
    label: "East Jakarta", 
    icon: "🏭", // Factory icon for East Jakarta (industrial area)
    color: "bg-rose-100 text-rose-800 hover:bg-rose-200"
  },
  { 
    label: "West Jakarta", 
    icon: "🏛️", // Historic building for West Jakarta (old town)
    color: "bg-orange-100 text-orange-800 hover:bg-orange-200"
  },
  { 
    label: "Central Jakarta", 
    icon: "🏪", // Shopping icon for Central Jakarta (commercial area)
    color: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200"
  },
  { 
    label: "DKI Jakarta", 
    icon: "🏛️", // Government building for DKI Jakarta
    color: "bg-slate-100 text-slate-800 hover:bg-slate-200"
  }
];

const URGENCY_CONFIG = [
  { 
    label: "High", 
    icon: "🔴",
    color: "bg-red-100 text-red-800 hover:bg-red-200" 
  },
  { 
    label: "Medium", 
    icon: "🟡",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
  },
  { 
    label: "Low", 
    icon: "🟢",
    color: "bg-green-100 text-green-800 hover:bg-green-200" 
  }
];

const SENTIMENT_CONFIG = [
  { 
    label: "Positive", 
    icon: "😊",
    color: "bg-green-100 text-green-800 hover:bg-green-200" 
  },
  { 
    label: "Neutral", 
    icon: "😐",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200" 
  },
  { 
    label: "Negative", 
    icon: "😞",
    color: "bg-red-100 text-red-800 hover:bg-red-200" 
  }
];

export function SearchBar({ 
  onSearch, 
  value = "", 
  totalResults, 
  isLoading,
  onChange
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(value);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: undefined, to: undefined },
    categories: [],
    urgencyLevel: [],
    sentiment: [],
    region: []
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    return count + (value.from && value.to ? 1 : 0);
  }, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue, filters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleFilterChange = (type: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    // Trigger search when filters change
    onSearch(searchValue, newFilters);
  };

  const handleClearSearch = () => {
    const clearedFilters = {
      dateRange: { from: undefined, to: undefined },
      categories: [],
      urgencyLevel: [],
      sentiment: [],
      region: []
    };
    setSearchValue("");
    setFilters(clearedFilters);
    onChange?.("");
    // Trigger search with cleared values
    onSearch("", clearedFilters);
  };

  const renderFilterSection = (
    title: string,
    items: Array<{ label: string; icon: string; color: string }>,
    type: keyof FilterState,
    icon: React.ReactNode
  ) => (
    <AccordionItem value={title} className="border-b">
      <AccordionTrigger 
        className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50 transition-colors"
      >
        {icon}
        <span className="text-sm font-medium">{title}</span>
        {type !== 'dateRange' && Array.isArray(filters[type]) && (filters[type] as string[]).length > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {(filters[type] as string[]).length}
          </Badge>
        )}
      </AccordionTrigger>
      <AccordionContent className="p-2">
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <Button
              key={item.label}
              size="sm"
              variant={Array.isArray(filters[type]) && (filters[type] as string[]).includes(item.label) ? "default" : "outline"}
              onClick={() => {
                if (!Array.isArray(filters[type])) return;
                const currentFilters = filters[type] as string[];
                const newValues = currentFilters.includes(item.label)
                  ? currentFilters.filter(i => i !== item.label)
                  : [...currentFilters, item.label];
                handleFilterChange(type, newValues);
              }}
              className={`text-xs h-8 gap-1.5 transition-colors
                ${Array.isArray(filters[type]) && (filters[type] as string[]).includes(item.label)
                  ? item.color
                  : "hover:bg-gray-100"
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );


// Update the filter rendering in your return statement
<Accordion type="single" collapsible className="w-full">
  {/* Date Range remains the same */}
  <AccordionItem value="date" className="border-b">
    <AccordionTrigger className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50">
      <Calendar className="h-4 w-4" />
      <span className="text-sm font-medium">Date Range</span>
    </AccordionTrigger>
    <AccordionContent className="p-4">
      <DatePickerWithRange
        date={filters.dateRange}
        onDateChange={(date) => handleFilterChange('dateRange', date)}
      />
    </AccordionContent>
  </AccordionItem>

  {/* Updated filter sections with configurations */}
  {renderFilterSection("Categories", CATEGORY_CONFIG, "categories", 
    <Tag className="h-4 w-4" />)}
  {renderFilterSection("Urgency Level", URGENCY_CONFIG, "urgencyLevel",
    <AlertCircle className="h-4 w-4" />)}
  {renderFilterSection("Sentiment", SENTIMENT_CONFIG, "sentiment",
    <Heart className="h-4 w-4" />)}
  {renderFilterSection("Region", REGION_CONFIG, "region",
    <Filter className="h-4 w-4" />)}
</Accordion>

// Also update the badge rendering for active filters
{Object.entries(filters).map(([key, values]) => {
  if (key === 'dateRange') return null;
  return (values as string[]).map((value) => {
    const config: FilterConfig = {
      categories: CATEGORY_CONFIG,
      urgencyLevel: URGENCY_CONFIG,
      sentiment: SENTIMENT_CONFIG,
      region: REGION_CONFIG
    };
    
    const itemConfig = config[key as keyof FilterConfig]?.find(item => item.label === value);
    
    return (
      <Badge 
        key={`${key}-${value}`} 
        variant="secondary" 
        className={`flex items-center gap-1 ${itemConfig?.color}`}
      >
        {itemConfig?.icon} {value}
        <button
          type="button"
          onClick={() => {
            const newValues = (filters[key as keyof FilterState] as string[])
              .filter(v => v !== value);
            handleFilterChange(key as keyof FilterState, newValues);
          }}
          className="ml-2 hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    );
  });
})}
  return (
    <div className="w-full space-y-2">
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by keyword..."
            className="pl-10 pr-10"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Button */}
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {/* Date Range */}
              <AccordionItem value="date" className="border-b">
                <AccordionTrigger className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Date Range</span>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                  <DatePickerWithRange
                    date={filters.dateRange}
                    onDateChange={(date) => handleFilterChange('dateRange', date)}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Categories */}
              {renderFilterSection("Categories", CATEGORY_CONFIG , "categories", 
                <Tag className="h-4 w-4" />)}

              {/* Urgency Level */}
              {renderFilterSection("Urgency Level", URGENCY_CONFIG , "urgencyLevel",
                <AlertCircle className="h-4 w-4" />)}

              {/* Sentiment */}
              {renderFilterSection("Sentiment", SENTIMENT_CONFIG , "sentiment",
                <Heart className="h-4 w-4" />)}

              {/* Region */}
              {renderFilterSection("Region", REGION_CONFIG , "region",
                <Filter className="h-4 w-4" />)}
            </Accordion>
          </PopoverContent>
        </Popover>

        {/* Hidden submit button - allows form submission on Enter */}
        <button type="submit" className="hidden" />
      </form>

      {/* Results count and loading state */}
      <div className="flex items-center text-sm text-muted-foreground">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating results...</span>
          </div>
        ) : totalResults !== undefined ? (
          <>
            {searchValue ? (
              <span>Found {totalResults.toLocaleString()} results for "{searchValue}"</span>
            ) : activeFiltersCount > 0 ? (
              <span>Found {totalResults.toLocaleString()} filtered results</span>
            ) : (
              <span>{totalResults.toLocaleString()} results</span>
            )}
          </>
        ) : null}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.dateRange.from && filters.dateRange.to && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {filters.dateRange.from.toLocaleDateString()} - {filters.dateRange.to.toLocaleDateString()}
              <button
                type="button"
                onClick={() => handleFilterChange('dateRange', { from: undefined, to: undefined })}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {Object.entries(filters).map(([key, values]) => {
            if (key === 'dateRange') return null;
            return (values as string[]).map((value) => (
              <Badge key={`${key}-${value}`} variant="secondary" className="flex items-center gap-1">
                {value}
                <button
                  type="button"
                  onClick={() => {
                    const newValues = (filters[key as keyof FilterState] as string[])
                      .filter(v => v !== value);
                    handleFilterChange(key as keyof FilterState, newValues);
                  }}
                  className="ml-2 hover:text-destructive"
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