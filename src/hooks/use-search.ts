import { useState } from 'react'
import type { DataSource, PaginationState } from '@/types/dashboard'

export function useSearch() {
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10
  })

  const handleSearch = async (query: string, source: DataSource) => {
    if (!query.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      setSearchLoading(true)
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          source,
          page: pagination.currentPage,
          itemsPerPage: pagination.itemsPerPage
        })
      })
      const result = await response.json()
      setSearchResults(result.hits || [])
      setPagination(prev => ({
        ...prev,
        totalPages: result.pagination?.totalPages || 1,
        currentPage: result.pagination?.currentPage || 1
      }))
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  return {
    searchResults,
    isSearching,
    searchLoading,
    pagination,
    handleSearch,
    handlePageChange
  }
}