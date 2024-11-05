// src/components/dashboard/search-bar.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({ onSearch, value: externalValue, onChange }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    if (externalValue !== undefined) {
      setSearchValue(externalValue)
    }
  }, [externalValue])

  const handleClear = () => {
    setSearchValue("")
    onSearch("")
    onChange?.("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onSearch(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        value={searchValue}
        onChange={handleChange}
        placeholder="Search news and content..."
        className="pl-10 pr-10"
      />
      {searchValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}