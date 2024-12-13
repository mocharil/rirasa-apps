// src/hooks/use-search-filters.ts

import { useState, useCallback } from 'react';

export interface FilterState {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  categories: string[];
  urgencyLevel: string[];
  sentiment: string[];
  region: string[];
}

export interface SearchState {
  query: string;
  filters: FilterState;
  page: number;
  itemsPerPage: number;
}

export function useSearchFilters(initialItemsPerPage = 10) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filters: {
      dateRange: { from: undefined, to: undefined },
      categories: [],
      urgencyLevel: [],
      sentiment: [],
      region: []
    },
    page: 1,
    itemsPerPage: initialItemsPerPage
  });

  const [results, setResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (source: 'news' | 'twitter') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...searchState,
          source
        })
      });

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data.hits || []);
      setTotalResults(data.total || 0);

      return {
        results: data.hits,
        total: data.total,
        pagination: data.pagination
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during search';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [searchState]);

  const updateSearchState = useCallback((updates: Partial<SearchState>) => {
    setSearchState(prev => ({
      ...prev,
      ...updates,
      // Reset page to 1 when anything other than page is updated
      page: 'page' in updates ? updates.page! : 1
    }));
  }, []);

  const updateFilters = useCallback((filterUpdates: Partial<FilterState>) => {
    setSearchState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...filterUpdates
      },
      page: 1 // Reset to first page when filters change
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      filters: {
        dateRange: { from: undefined, to: undefined },
        categories: [],
        urgencyLevel: [],
        sentiment: [],
        region: []
      },
      page: 1
    }));
  }, []);

  return {
    searchState,
    results,
    totalResults,
    isLoading,
    error,
    search,
    updateSearchState,
    updateFilters,
    clearFilters
  };
}