'use client'

import React, { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { 
  EnhancedSearchQuery, 
  SearchState, 
  SearchFilterCategory
} from '@/types/dietary-preferences'

interface EnhancedSearchBarProps {
  onSearch?: (query: EnhancedSearchQuery) => void
  onStateChange?: (state: SearchState) => void
  placeholder?: string
  className?: string
  resultCount?: number
}

// Configuration for progressive filter disclosure (inspired by Airbnb)
const FILTER_CATEGORIES: SearchFilterCategory[] = [
  {
    id: 'ingredients',
    name: 'Ingredients',
    emoji: '🥘',
    description: 'What you have or want to use',
    priority: 1,
    filters: [
      {
        id: 'include-ingredients',
        name: 'Include ingredients',
        type: 'tags',
        validation: { required: true }
      },
      {
        id: 'exclude-ingredients', 
        name: 'Avoid ingredients',
        type: 'tags'
      }
    ]
  },
  {
    id: 'nutrition',
    name: 'Nutrition',
    emoji: '💪',
    description: 'Calorie and macro targets',
    priority: 2,
    filters: [
      {
        id: 'calories',
        name: 'Calories',
        type: 'range',
        validation: { min: 100, max: 3000 }
      },
      {
        id: 'prep-time',
        name: 'Prep time (minutes)',
        type: 'range',
        validation: { min: 5, max: 180 }
      }
    ]
  },
  {
    id: 'preferences',
    name: 'Dietary Preferences',
    emoji: '🌱',
    description: 'Diet types and restrictions',
    priority: 3,
    filters: [
      {
        id: 'diet-types',
        name: 'Diet types',
        type: 'multiselect',
        options: ['vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean']
      },
      {
        id: 'meal-type',
        name: 'Meal type',
        type: 'multiselect',
        options: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert']
      }
    ]
  },
  {
    id: 'details',
    name: 'Recipe Details',
    emoji: '👨‍🍳',
    description: 'Cuisine, difficulty, and more',
    priority: 4,
    filters: [
      {
        id: 'cuisine',
        name: 'Cuisine type',
        type: 'multiselect',
        options: ['italian', 'asian', 'mexican', 'indian', 'american', 'mediterranean']
      },
      {
        id: 'difficulty',
        name: 'Difficulty level',
        type: 'multiselect',
        options: ['easy', 'medium', 'hard']
      },
      {
        id: 'servings',
        name: 'Servings',
        type: 'range',
        validation: { min: 1, max: 12 }
      }
    ]
  }
]

// Popular ingredient suggestions (like Airbnb's popular destinations)
const POPULAR_INGREDIENTS = [
  'chicken breast', 'salmon', 'ground beef', 'tofu', 'eggs',
  'broccoli', 'spinach', 'tomatoes', 'onions', 'garlic',
  'rice', 'pasta', 'quinoa', 'potatoes', 'avocado'
]

export function EnhancedSearchBar({
  onSearch,
  onStateChange,
  placeholder = "What ingredients do you have?",
  className,
  resultCount = 0
}: EnhancedSearchBarProps) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: {
      ingredients: [],
      dietaryRestrictions: [],
      avoidFoods: []
    },
    activeFilters: [],
    resultCount: 0,
    appliedFilters: {},
    searchHistory: []
  })

  const [currentInput, setCurrentInput] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle ingredient addition (multi-ingredient support)
  const addIngredient = useCallback((ingredient: string) => {
    const trimmed = ingredient.trim().toLowerCase()
    if (trimmed && !selectedIngredients.includes(trimmed)) {
      const newIngredients = [...selectedIngredients, trimmed]
      setSelectedIngredients(newIngredients)
      
      // Update search state
      const newState = {
        ...searchState,
        query: {
          ...searchState.query,
          ingredients: newIngredients
        }
      }
      setSearchState(newState)
      onStateChange?.(newState)
    }
    setCurrentInput('')
  }, [selectedIngredients, searchState, onStateChange])

  // Handle ingredient removal
  const removeIngredient = useCallback((ingredient: string) => {
    const newIngredients = selectedIngredients.filter(i => i !== ingredient)
    setSelectedIngredients(newIngredients)
    
    const newState = {
      ...searchState,
      query: {
        ...searchState.query,
        ingredients: newIngredients
      }
    }
    setSearchState(newState)
    onStateChange?.(newState)
  }, [selectedIngredients, searchState, onStateChange])

  // Handle search execution
  const handleSearch = useCallback(() => {
    if (searchState.query.ingredients.length === 0) return
    
    onSearch?.(searchState.query)
  }, [searchState.query, onSearch])

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (currentInput.trim()) {
        addIngredient(currentInput)
      } else {
        handleSearch()
      }
    } else if (e.key === 'Backspace' && !currentInput && selectedIngredients.length > 0) {
      removeIngredient(selectedIngredients[selectedIngredients.length - 1])
    }
  }

  // Filter suggestions based on input
  const filteredSuggestions = currentInput 
    ? POPULAR_INGREDIENTS.filter(ingredient =>
        ingredient.toLowerCase().includes(currentInput.toLowerCase()) &&
        !selectedIngredients.includes(ingredient.toLowerCase())
      ).slice(0, 6)
    : POPULAR_INGREDIENTS.filter(ingredient => 
        !selectedIngredients.includes(ingredient.toLowerCase())
      ).slice(0, 8)

  // Count active filters (like Airbnb's filter count indicator)
  const activeFilterCount = Object.keys(searchState.appliedFilters).length + 
    selectedIngredients.length

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto", className)}>
      {/* Main Search Input Container - Inspired by Airbnb's design */}
      <div className={cn(
        "relative flex items-center gap-2 p-3 rounded-2xl transition-all duration-300 ease-out",
        "border-2 shadow-lg bg-white",
        showSuggestions || showFilters 
          ? "border-primary shadow-2xl scale-105" 
          : "border-gray-200 hover:border-gray-300"
      )}>
        {/* Selected Ingredients Tags */}
        <div className="flex flex-wrap gap-2 max-w-md">
          {selectedIngredients.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(ingredient)}
                className="ml-2 hover:text-primary/70 transition-colors"
                aria-label={`Remove ${ingredient}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedIngredients.length === 0 ? placeholder : "Add another ingredient..."}
          className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-gray-500 min-w-0"
        />

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200",
            "hover:shadow-md active:scale-95",
            showFilters || activeFilterCount > 0
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          <span className="text-sm font-medium">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </span>
        </button>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={selectedIngredients.length === 0}
          className="px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {resultCount > 0 ? `Search (${resultCount})` : 'Search'}
        </Button>
      </div>

      {/* Ingredient Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-hidden">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              {currentInput ? 'Matching ingredients' : 'Popular ingredients'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {filteredSuggestions.map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => addIngredient(ingredient)}
                  className="flex items-center gap-2 px-3 py-2 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">🥘</span>
                  <span className="text-sm capitalize">{ingredient}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Tray - Inspired by Airbnb's mobile overlay */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-40 max-h-[70vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FILTER_CATEGORIES.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.emoji}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  
                  {/* Category filters would be implemented here */}
                  <div className="pl-10 space-y-3">
                    {category.filters.map((filter) => (
                      <div key={filter.id} className="text-sm text-gray-500">
                        {filter.name} ({filter.type})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Clear all
              </button>
              <Button
                onClick={() => {
                  setShowFilters(false)
                  handleSearch()
                }}
                className="px-6 py-2"
              >
                Show results
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Background overlay when filters are open */}
      {(showSuggestions || showFilters) && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => {
            setShowSuggestions(false)
            setShowFilters(false)
          }}
        />
      )}
    </div>
  )
} 