'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useSearchStore, SearchQuery, TokenCategory } from '@/features/core/stores/searchStore'
import { useProfileStore } from '@/store/profileStore'
import { SuggestionPopover } from './SuggestionPopover'
import { SearchChip } from './SearchChip'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  className?: string
  onSearch?: (query: SearchQuery) => void
  autoFocus?: boolean
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search for recipes, ingredients, or dietary needs...",
  className,
  onSearch,
  autoFocus = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inputFocused, setInputFocused] = useState(false)
  
  const {
    currentInput,
    parsedTokens,
    searchChips,
    structuredQuery,
    showSuggestions,
    isLoading,
    setCurrentInput,
    confirmToken,
    removeChip,
    clearSearch,
    executeSearch,
    setShowSuggestions
  } = useSearchStore()

  const { profile } = useProfileStore()
  const profileFilterSummary = React.useMemo(() => {
    if (!profile) return ''
    const tags = [...(profile.dietary_preferences || []), ...(profile.allergens || [])]
    return tags.slice(0, 3).join(', ') + (tags.length > 3 ? ` +${tags.length - 3}` : '')
  }, [profile])

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Handle input changes with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrentInput(value)
  }

  // Handle key presses
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (currentInput.trim() && parsedTokens.length > 0) {
        // Auto-confirm first suggestion for each unconfirmed token
        parsedTokens.forEach((token, index) => {
          if (!token.confirmed && token.suggestedCategories.length > 0) {
            const bestSuggestion = token.suggestedCategories[0]
            confirmToken(index, bestSuggestion.category, bestSuggestion.label)
          }
        })
        setCurrentInput('')
      } else if (searchChips.length > 0) {
        // Execute search if we have chips
        executeSearch()
        if (onSearch) {
          onSearch(structuredQuery)
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setInputFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setShowSuggestions])

  // Handle search execution
  const handleSearch = () => {
    if (searchChips.length > 0) {
      executeSearch()
      if (onSearch) {
        onSearch(structuredQuery)
      }
    }
  }

  // Handle clear all
  const handleClearAll = () => {
    clearSearch()
    inputRef.current?.focus()
  }

  // Handle token confirmation with input clearing
  const handleConfirmToken = (tokenIndex: number, category: TokenCategory, label: string) => {
    confirmToken(tokenIndex, category, label)
    // Clear the input after confirming a token
    setCurrentInput('')
    // Keep focus on input for continued typing
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div className={cn(
        "relative flex items-center bg-white rounded-xl border-2 transition-all duration-200",
        inputFocused || showSuggestions 
          ? "border-emerald-500 shadow-lg ring-4 ring-emerald-100" 
          : "border-gray-200 shadow-md hover:border-gray-300"
      )}>
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            setInputFocused(true)
            if (parsedTokens.length > 0) {
              setShowSuggestions(true)
            }
          }}
          onBlur={() => setInputFocused(false)}
          placeholder={searchChips.length > 0 ? "Add more ingredients or filters..." : placeholder}
          className="w-full pl-4 pr-32 py-4 text-base text-gray-900 bg-transparent border-none outline-none placeholder-gray-500"
          disabled={isLoading}
        />

        {/* Action Buttons */}
        <div className="absolute right-2 flex items-center space-x-1">
          {(currentInput || searchChips.length > 0) && (
            <button
              onClick={handleClearAll}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Clear all"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          {/* Search Icon - positioned on the right */}
          <div className="flex items-center pointer-events-none px-2">
            <svg className={cn(
              "h-5 w-5 transition-colors",
              inputFocused ? "text-emerald-500" : "text-gray-400"
            )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {searchChips.length > 0 && (
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl hover:scale-105"
              )}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          )}
        </div>
      </div>

      {/* Search Chips */}
      {searchChips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchChips.map((chip) => (
            <SearchChip
              key={chip.id}
              chip={chip}
              onRemove={removeChip}
            />
          ))}
        </div>
      )}

      {/* Profile Filters Active Indicator */}
      {profile && (profile.dietary_preferences?.length || profile.allergens?.length) && (
        <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
          <span className="px-2 py-1 bg-emerald-100 rounded-full">Personalized: {profileFilterSummary}</span>
        </div>
      )}

      {/* Suggestion Popover */}
      {showSuggestions && parsedTokens.length > 0 && (
        <SuggestionPopover
          tokens={parsedTokens}
          onConfirmToken={handleConfirmToken}
          onClose={() => setShowSuggestions(false)}
        />
      )}

      {/* Search Status */}
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 mr-2"></div>
          Searching for recipes...
        </div>
      )}

      {/* Search Summary */}
      {searchChips.length > 0 && !isLoading && (
        <div className="mt-2 text-sm text-gray-600">
          {searchChips.length} filter{searchChips.length !== 1 ? 's' : ''} applied
          {Object.values(structuredQuery).some(arr => arr.length > 0) && (
            <span className="ml-2 text-emerald-600 cursor-pointer hover:underline" onClick={handleSearch}>
              → Search recipes
            </span>
          )}
        </div>
      )}
    </div>
  )
} 