'use client'

import React from 'react'
import { SearchInput } from './SearchInput'
import { useSearchStore, SearchQuery } from '@/stores/searchStore'

interface SmartSemanticSearchProps {
  className?: string
  placeholder?: string
  onSearch?: (query: SearchQuery) => void
  autoFocus?: boolean
}

export const SmartSemanticSearch: React.FC<SmartSemanticSearchProps> = ({
  className,
  placeholder = "Type 'chicken paleo no dairy dinner' and watch the magic happen...",
  onSearch,
  autoFocus = false
}) => {
  const { structuredQuery } = useSearchStore()

  const handleSearch = (query: SearchQuery) => {
    console.log('Smart Semantic Search executed:', query)
    
    // Call the parent's onSearch callback if provided
    if (onSearch) {
      onSearch(query)
    }
    
    // Here you would typically:
    // 1. Send the structured query to your recipe API
    // 2. Navigate to search results page
    // 3. Update global search state
  }

  return (
    <div className={className}>
      <SearchInput
        placeholder={placeholder}
        onSearch={handleSearch}
        autoFocus={autoFocus}
        className="w-full max-w-4xl"
      />
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && Object.values(structuredQuery).some(arr => arr.length > 0) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
          <div className="font-medium text-gray-700 mb-2">Structured Query (Debug):</div>
          <pre className="text-gray-600 overflow-x-auto">
            {JSON.stringify(structuredQuery, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 