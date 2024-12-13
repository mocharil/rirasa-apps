import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, X, SlidersHorizontal, Calendar, 
  Tag, AlertCircle, Filter
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface SearchBarProps {
  onSearch: (query: string, filters: FilterState) => void;
  value?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
  activeSource: 'news' | 'twitter';
}

const categories = [
  "Infrastructure",
  "Transportation",
  "Public Health",
  "Environment",
  "Education",
  "Social Services",
  "Public Safety",
  "Government Policy"
];

const regions = [
  "North Jakarta",
  "South Jakarta",
  "East Jakarta",
  "West Jakarta",
  "Central Jakarta"
];

const urgencyLevels = [
  "High",
  "Medium",
  "Low"
];

const sentiments = [
  "Positive",
  "Neutral",
  "Negative"
];

export function EnhancedSearchBar({ onSearch, value = "", onChange }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(value);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    dateRange: { from: undefined, to: undefined },
    categories: [],
    urgencyLevel: [],
    sentiment: [],
    region: []
  });
  
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleSearch = () => {
    onSearch(searchValue, selectedFilters);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onChange?.("");
    onSearch("", selectedFilters);
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      dateRange: { from: undefined, to: undefined },
      categories: [],
      urgencyLevel: [],
      sentiment: [],
      region: []
    });
    setActiveFiltersCount(0);
  };

  const updateFilters = (key: keyof FilterState, value: any) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Calculate active filters count
      let count = 0;
      if (newFilters.dateRange.from || newFilters.dateRange.to) count++;
      count += newFilters.categories.length;
      count += newFilters.urgencyLevel.length;
      count += newFilters.sentiment.length;
      count += newFilters.region.length;
      
      setActiveFiltersCount(count);
      return newFilters;
    });
  };

  const toggleFilter = (key: keyof Omit<FilterState, 'dateRange'>, value: string) => {
    const currentFilters = selectedFilters[key] as string[];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    updateFilters(key, newFilters);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by keyword..."
            className="pl-10 pr-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          {searchValue && (
            <button
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
            <Button 
              variant="outline" 
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearFilters}
                    className="h-8 text-sm"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </label>
                <DatePickerWithRange
                  date={selectedFilters.dateRange}
                  onDateChange={(date) => updateFilters('dateRange', date)}
                />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories
                </label>
                <div className="flex flex-wrap gap-1">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedFilters.categories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter('categories', category)}
                      className="text-xs h-7"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Urgency Level */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Urgency Level
                </label>
                <div className="flex gap-1">
                  {urgencyLevels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedFilters.urgencyLevel.includes(level) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter('urgencyLevel', level)}
                      className="text-xs h-7"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sentiment */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sentiment</label>
                <Select
                  value={selectedFilters.sentiment[0] || ""}
                  onValueChange={(value) => updateFilters('sentiment', [value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    {sentiments.map((sentiment) => (
                      <SelectItem key={sentiment} value={sentiment}>
                        {sentiment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Region
                </label>
                <div className="flex flex-wrap gap-1">
                  {regions.map((region) => (
                    <Button
                      key={region}
                      variant={selectedFilters.region.includes(region) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter('region', region)}
                      className="text-xs h-7"
                    >
                      {region}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full mt-4" 
                onClick={() => {
                  handleSearch();
                  setIsFiltersOpen(false);
                }}
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFilters.dateRange.from && selectedFilters.dateRange.to && (
            <Badge variant="secondary" className="h-6">
              {new Date(selectedFilters.dateRange.from).toLocaleDateString()} - {new Date(selectedFilters.dateRange.to).toLocaleDateString()}
              <button
                onClick={() => updateFilters('dateRange', { from: undefined, to: undefined })}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {Object.entries(selectedFilters).map(([key, values]) => {
            if (key === 'dateRange') return null;
            return (values as string[]).map((value) => (
              <Badge key={`${key}-${value}`} variant="secondary" className="h-6">
                {value}
                <button
                  onClick={() => toggleFilter(key as keyof Omit<FilterState, 'dateRange'>, value)}
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