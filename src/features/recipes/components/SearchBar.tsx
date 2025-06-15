'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { CalorieGoalInput } from './CalorieGoalInput'
import { MacroTargetSliders } from './MacroTargetSliders'
import { EnhancedSearchQuery, MacroTargets } from '@/types/dietary-preferences'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: EnhancedSearchQuery) => void
  onFocus?: () => void
  onBlur?: () => void
  suggestions?: string[]
  className?: string
}

// Enhanced ingredient categories with emojis and popular items
const INGREDIENT_CATEGORIES = {
  proteins: {
    name: 'Proteins',
    emoji: '🥩',
    color: 'from-red-100 to-orange-100',
    items: ['chicken breast', 'salmon', 'ground beef', 'tofu', 'eggs', 'shrimp', 'turkey', 'pork chops']
  },
  vegetables: {
    name: 'Vegetables',
    emoji: '🥬',
    color: 'from-green-100 to-emerald-100',
    items: ['broccoli', 'spinach', 'carrots', 'bell peppers', 'onions', 'tomatoes', 'mushrooms', 'zucchini']
  },
  grains: {
    name: 'Grains & Starches',
    emoji: '🌾',
    color: 'from-amber-100 to-yellow-100',
    items: ['rice', 'pasta', 'quinoa', 'potatoes', 'bread', 'oats', 'barley', 'couscous']
  },
  dairy: {
    name: 'Dairy & Cheese',
    emoji: '🧀',
    color: 'from-blue-100 to-cyan-100',
    items: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'mozzarella', 'parmesan', 'feta']
  },
  herbs: {
    name: 'Herbs & Spices',
    emoji: '🌿',
    color: 'from-green-100 to-lime-100',
    items: ['basil', 'garlic', 'ginger', 'oregano', 'thyme', 'rosemary', 'cilantro', 'parsley']
  },
  pantry: {
    name: 'Pantry Staples',
    emoji: '🥫',
    color: 'from-gray-100 to-slate-100',
    items: ['olive oil', 'soy sauce', 'vinegar', 'flour', 'sugar', 'salt', 'pepper', 'canned tomatoes']
  }
} as const

type CategoryKey = keyof typeof INGREDIENT_CATEGORIES

export function SearchBar({
  placeholder = "What ingredients do you have?",
  onSearch,
  onFocus,
  onBlur,
  suggestions = [],
  className
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [calorieGoal, setCalorieGoal] = useState<number | undefined>()
  const [macroTargets, setMacroTargets] = useState<MacroTargets | undefined>()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Get all ingredients from categories for search
  const allCategoryIngredients = Object.values(INGREDIENT_CATEGORIES).flatMap(cat => cat.items)
  
  // Filter suggestions based on query - combine provided suggestions with category ingredients
  const allIngredients = [...new Set([...suggestions, ...allCategoryIngredients])]
  const filteredSuggestions = query 
    ? allIngredients.filter(ingredient =>
        ingredient.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  // Get popular ingredients when no query
  const popularIngredients = [
    'chicken breast', 'pasta', 'rice', 'eggs', 'onions', 'garlic', 
    'tomatoes', 'cheese', 'olive oil', 'broccoli', 'salmon', 'potatoes'
  ]

  const handleFocus = () => {
    setIsFocused(true)
    setShowSuggestions(true)
    onFocus?.()
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Don't blur if clicking on suggestions
    if (suggestionsRef.current?.contains(e.relatedTarget as Node)) {
      return
    }
    setIsFocused(false)
    setShowSuggestions(false)
    setActiveCategory(null)
    onBlur?.()
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const searchQuery: EnhancedSearchQuery = {
        ingredients: [query.trim()],
        calorieGoal,
        macroTargets,
        dietaryRestrictions: [], // TODO: Connect to diet preferences
        avoidFoods: [] // TODO: Connect to diet preferences
      }
      await onSearch?.(searchQuery)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    setActiveCategory(null)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveCategory(null)
      inputRef.current?.blur()
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setActiveCategory(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isHeroSearch = className?.includes('hero-search')

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      {/* Search bar container with focus expansion animation */}
      <div className={cn(
        // Base search bar styling
        "relative flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 ease-out",
        "border-2 shadow-lg",
        // Hero-specific styling
        isHeroSearch ? [
          "bg-white/95 backdrop-blur-md border-white/30",
          isFocused && "scale-105 shadow-2xl shadow-black/20 bg-white border-white/50"
        ] : [
          "bg-background border-border",
          isFocused && "border-primary shadow-xl"
        ]
      )}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground",
            "px-4 py-3 min-h-touch",
            isHeroSearch ? "text-gray-900 placeholder:text-gray-500" : "text-foreground placeholder:text-muted-foreground/70"
          )}
          aria-label="Search for recipes by ingredients"
        />
        
        <Button
          onClick={handleSearch}
          loading={isLoading}
          disabled={!query.trim()}
          className={cn(
            "px-6 py-3 rounded-xl font-semibold transition-all duration-200",
            isHeroSearch ? [
              "bg-primary hover:bg-primary/90 text-white shadow-lg",
              "hover:scale-105 active:scale-95"
            ] : ""
          )}
          aria-label="Search recipes"
        >
          {isLoading ? 'Searching...' : 'Find Safe Recipes'}
        </Button>
      </div>

      {/* Advanced Search Toggle */}
      <div className="mt-3 flex justify-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span>Advanced Search (Calories & Macros)</span>
          <svg 
            className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Advanced Search Inputs */}
      {showAdvanced && (
        <div className={cn(
          "mt-4 p-4 bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg",
          "animate-in fade-in slide-in-from-top-3 duration-300 ease-out"
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CalorieGoalInput
              value={calorieGoal}
              onChange={setCalorieGoal}
              className="w-full"
            />
            <MacroTargetSliders
              value={macroTargets}
              onChange={setMacroTargets}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Enhanced ingredient suggestions with categories */}
      {showSuggestions && (isFocused || query) && (
        <div
          ref={suggestionsRef}
          className={cn(
            "absolute top-full left-0 right-0 mt-3 z-[9999]",
            "bg-white/98 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl",
            "max-h-[70vh] overflow-hidden",
            "animate-in fade-in slide-in-from-top-3 duration-300 ease-out"
          )}
        >
          {/* Search Results */}
          {query && filteredSuggestions.length > 0 && (
            <div className="p-4 border-b border-gray-200/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🔍</span>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Search Results
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filteredSuggestions.map((ingredient, index) => (
                  <button
                    key={`search-${index}`}
                    onClick={() => handleSuggestionClick(ingredient)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-left group"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md flex items-center justify-center text-xs">
                      🥘
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium capitalize">
                      {ingredient}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Ingredients (when no search query) */}
          {!query && (
            <div className="p-4 border-b border-gray-200/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⭐</span>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Popular Ingredients
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularIngredients.slice(0, 8).map((ingredient, index) => (
                  <button
                    key={`popular-${index}`}
                    onClick={() => handleSuggestionClick(ingredient)}
                    className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 text-gray-700 text-sm rounded-full hover:from-primary/20 hover:to-secondary/20 hover:text-gray-900 transition-all font-medium capitalize border border-transparent hover:border-primary/20"
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Browser */}
          {!query && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📂</span>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Browse by Category
                </h4>
              </div>
              
              {!activeCategory ? (
                // Category Grid
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(INGREDIENT_CATEGORIES).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key as CategoryKey)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group",
                        "bg-gradient-to-br", category.color,
                        "hover:scale-[1.02] hover:shadow-md border border-transparent hover:border-white/50"
                      )}
                    >
                      <div className="text-2xl">{category.emoji}</div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{category.name}</div>
                        <div className="text-xs text-gray-600">{category.items.length} items</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                // Category Items
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ← Back
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{INGREDIENT_CATEGORIES[activeCategory].emoji}</span>
                      <span className="font-semibold text-gray-800">
                        {INGREDIENT_CATEGORIES[activeCategory].name}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-thin">
                    {INGREDIENT_CATEGORIES[activeCategory].items.map((ingredient: string, index: number) => (
                      <button
                        key={`category-${index}`}
                        onClick={() => handleSuggestionClick(ingredient)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left group"
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-md flex items-center justify-center text-xs bg-gradient-to-br",
                          INGREDIENT_CATEGORIES[activeCategory].color
                        )}>
                          {INGREDIENT_CATEGORIES[activeCategory].emoji}
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium capitalize">
                          {ingredient}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No results state */}
          {query && filteredSuggestions.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤔</span>
              </div>
              <p className="text-gray-900 font-semibold mb-2">No ingredients found</p>
              <p className="text-sm text-gray-600 mb-4">
                Try browsing our categories or searching for something else
              </p>
              <button
                onClick={() => setQuery('')}
                className="px-4 py-2 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20 transition-colors font-medium"
              >
                Browse Categories
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 