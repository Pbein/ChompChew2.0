'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { EnhancedSearchQuery } from '@/types/dietary-preferences'

interface SearchIntent {
  type: 'recipe' | 'ingredient' | 'hybrid' | 'unknown'
  confidence: number
  parsedElements: {
    recipeType?: string
    ingredients?: string[]
    cuisine?: string
    dietary?: string[]
    mealType?: string
    constraints?: string[]
  }
}

interface IntelligentSearchBarProps {
  onSearch?: (query: EnhancedSearchQuery, intent: SearchIntent) => void
  placeholder?: string
  className?: string
}

// Intent detection patterns
const INTENT_PATTERNS = {
  recipe: [
    // Recipe names/types
    /\b(soup|stew|salad|pasta|pizza|cake|bread|curry|stir[- ]?fry|casserole)\b/i,
    // Meal types with descriptors
    /\b(breakfast|lunch|dinner|snack|dessert)\b/i,
    // Cooking methods as recipe indicators
    /\b(baked|grilled|fried|roasted|steamed)\s+\w+/i
  ],
  ingredient: [
    // Multiple ingredients with separators
    /\w+\s*[\+&,]\s*\w+/,
    // "leftover" or "using" keywords
    /\b(leftover|using|have|got)\b/i,
    // Quantity indicators
    /\d+\s*(cups?|lbs?|ounces?|pieces?)/i
  ],
  dietary: [
    /\b(keto|vegan|vegetarian|paleo|gluten[- ]?free|dairy[- ]?free|low[- ]?carb|high[- ]?protein)\b/i
  ],
  cuisine: [
    /\b(italian|asian|chinese|mexican|indian|mediterranean|thai|french|japanese)\b/i
  ],
  constraints: [
    /\b(quick|easy|healthy|simple|fast|under \d+|in \d+|minutes?)\b/i
  ]
}

// Common ingredients for detection
const COMMON_INGREDIENTS = [
  'chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'tofu', 'eggs',
  'rice', 'pasta', 'bread', 'quinoa', 'potatoes', 'noodles',
  'tomatoes', 'onions', 'garlic', 'peppers', 'broccoli', 'spinach',
  'cheese', 'milk', 'butter', 'cream', 'yogurt',
  'flour', 'sugar', 'salt', 'pepper', 'oil', 'broth'
]

export function IntelligentSearchBar({
  onSearch,
  placeholder = "Search for recipes or ingredients...",
  className
}: IntelligentSearchBarProps) {
  const [query, setQuery] = useState('')
  const [intent, setIntent] = useState<SearchIntent>({ type: 'unknown', confidence: 0, parsedElements: {} })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchMode, setSearchMode] = useState<'auto' | 'recipe' | 'ingredient'>('auto')
  const inputRef = useRef<HTMLInputElement>(null)

  // Analyze search intent
  const analyzeIntent = useCallback((searchQuery: string): SearchIntent => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return { type: 'unknown', confidence: 0, parsedElements: {} }

    let recipeScore = 0
    let ingredientScore = 0
    const parsedElements: SearchIntent['parsedElements'] = {}

    // Check for recipe patterns
    INTENT_PATTERNS.recipe.forEach(pattern => {
      if (pattern.test(query)) recipeScore += 0.3
    })

    // Check for ingredient patterns
    INTENT_PATTERNS.ingredient.forEach(pattern => {
      if (pattern.test(query)) ingredientScore += 0.4
    })

    // Check for known ingredients
    const foundIngredients = COMMON_INGREDIENTS.filter(ingredient => 
      query.includes(ingredient.toLowerCase())
    )
    if (foundIngredients.length > 0) {
      parsedElements.ingredients = foundIngredients
      ingredientScore += foundIngredients.length * 0.2
    }

    // Check for dietary keywords
    const dietaryMatch = query.match(INTENT_PATTERNS.dietary[0])
    if (dietaryMatch) {
      parsedElements.dietary = [dietaryMatch[0]]
      recipeScore += 0.25
    }

    // Check for cuisine keywords
    const cuisineMatch = query.match(INTENT_PATTERNS.cuisine[0])
    if (cuisineMatch) {
      parsedElements.cuisine = cuisineMatch[0]
      recipeScore += 0.25
    }

    // Check for constraint keywords
    const constraintMatch = query.match(INTENT_PATTERNS.constraints[0])
    if (constraintMatch) {
      parsedElements.constraints = [constraintMatch[0]]
      recipeScore += 0.2
    }

    // Determine intent type
    let type: SearchIntent['type'] = 'unknown'
    let confidence = 0

    if (recipeScore > ingredientScore && recipeScore > 0.3) {
      type = 'recipe'
      confidence = Math.min(recipeScore, 1)
    } else if (ingredientScore > recipeScore && ingredientScore > 0.3) {
      type = 'ingredient'
      confidence = Math.min(ingredientScore, 1)
    } else if (recipeScore > 0.1 || ingredientScore > 0.1) {
      type = 'hybrid'
      confidence = Math.max(recipeScore, ingredientScore)
    }

    return { type, confidence, parsedElements }
  }, [])

  // Update intent when query changes
  useEffect(() => {
    const newIntent = analyzeIntent(query)
    setIntent(newIntent)
  }, [query, analyzeIntent])

  const handleSearch = useCallback(() => {
    if (!query.trim()) return

    // Convert parsed intent to EnhancedSearchQuery
    const searchQuery: EnhancedSearchQuery = {
      ingredients: intent.parsedElements.ingredients || [],
      dietaryRestrictions: intent.parsedElements.dietary || [],
      avoidFoods: [],
      cuisineTypes: intent.parsedElements.cuisine ? [intent.parsedElements.cuisine] : undefined,
      mealTypes: intent.parsedElements.mealType ? [intent.parsedElements.mealType] : undefined
    }

    // If it's a recipe search, add the query as a recipe name/description
    if (intent.type === 'recipe' || intent.type === 'hybrid') {
      // Store original query for recipe name/description matching
      searchQuery.recipeQuery = query
    }

    onSearch?.(searchQuery, intent)
  }, [query, intent, onSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  // Get appropriate suggestions based on intent
  const getSuggestions = () => {
    if (!query) return []

    switch (intent.type) {
      case 'recipe':
        return [
          'chicken soup recipes',
          'easy chicken soup',
          'healthy chicken soup',
          'quick chicken soup'
        ]
      case 'ingredient':
        return [
          'chicken + broth + vegetables',
          'chicken recipes',
          'what to make with chicken',
          'chicken meal ideas'
        ]
      case 'hybrid':
        return [
          'healthy chicken recipes',
          'quick chicken meals',
          'chicken soup with vegetables',
          'easy chicken dinner'
        ]
      default:
        return [
          'chicken soup',
          'pasta recipes',
          'quick dinner ideas',
          'healthy meals'
        ]
    }
  }

  // Get intent indicator color and text
  const getIntentIndicator = () => {
    switch (intent.type) {
      case 'recipe':
        return { color: 'text-blue-600 bg-blue-50', text: '🍽️ Recipe', icon: '🍽️' }
      case 'ingredient':
        return { color: 'text-green-600 bg-green-50', text: '🥕 Ingredients', icon: '🥕' }
      case 'hybrid':
        return { color: 'text-purple-600 bg-purple-50', text: '🎯 Smart', icon: '🎯' }
      default:
        return { color: 'text-gray-600 bg-gray-50', text: '🔍 Search', icon: '🔍' }
    }
  }

  const intentIndicator = getIntentIndicator()

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto", className)}>
      {/* Search Mode Toggle */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-600">Search mode:</span>
        <div className="flex rounded-lg border border-gray-200 p-1">
          {[
            { key: 'auto', label: '🤖 Auto', desc: 'Detects intent automatically' },
            { key: 'recipe', label: '🍽️ Recipe', desc: 'Search for specific dishes' },
            { key: 'ingredient', label: '🥕 Ingredient', desc: 'Search by what you have' }
          ].map(mode => (
            <button
              key={mode.key}
                             onClick={() => setSearchMode(mode.key as 'auto' | 'recipe' | 'ingredient')}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-colors",
                searchMode === mode.key
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-800"
              )}
              title={mode.desc}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Container */}
      <div className={cn(
        "relative flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ease-out",
        "border-2 shadow-lg bg-white",
        showSuggestions 
          ? "border-primary shadow-2xl scale-105" 
          : "border-gray-200 hover:border-gray-300"
      )}>
        
        {/* Intent Indicator */}
        {searchMode === 'auto' && intent.confidence > 0.3 && (
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
            intentIndicator.color
          )}>
            <span>{intentIndicator.icon}</span>
            <span>{intentIndicator.text}</span>
            <span className="text-xs opacity-70">
              {Math.round(intent.confidence * 100)}%
            </span>
          </div>
        )}

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-gray-500"
        />

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!query.trim()}
          className={cn(
            "px-6 py-2 rounded-xl font-semibold transition-all duration-200",
            "hover:scale-105 active:scale-95"
          )}
        >
          Search
        </Button>
      </div>

      {/* Intent Analysis Display */}
      {query && intent.confidence > 0.1 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-700">Detected:</span>
            <span className={cn("px-2 py-1 rounded text-xs font-medium", intentIndicator.color)}>
              {intentIndicator.text}
            </span>
          </div>
          
          {intent.parsedElements.ingredients && (
            <div className="mb-1">
              <span className="text-gray-600">Ingredients:</span> {intent.parsedElements.ingredients.join(', ')}
            </div>
          )}
          
          {intent.parsedElements.cuisine && (
            <div className="mb-1">
              <span className="text-gray-600">Cuisine:</span> {intent.parsedElements.cuisine}
            </div>
          )}
          
          {intent.parsedElements.dietary && (
            <div className="mb-1">
              <span className="text-gray-600">Dietary:</span> {intent.parsedElements.dietary.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Example Searches */}
      {!query && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Try searching like this:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-600 mb-2">🍽️ Recipe Search</div>
              <div className="space-y-1 text-gray-600">
                <div>"chicken soup"</div>
                <div>"keto breakfast"</div>
                <div>"Italian pasta"</div>
                <div>"quick dinner"</div>
              </div>
            </div>
            <div>
              <div className="font-medium text-green-600 mb-2">🥕 Ingredient Search</div>
              <div className="space-y-1 text-gray-600">
                <div>"chicken + broth"</div>
                <div>"leftover rice"</div>
                <div>"ground beef onions"</div>
                <div>"using tomatoes"</div>
              </div>
            </div>
            <div>
              <div className="font-medium text-purple-600 mb-2">🎯 Smart Search</div>
              <div className="space-y-1 text-gray-600">
                <div>"healthy chicken soup"</div>
                <div>"easy pasta recipes"</div>
                <div>"dairy-free dessert"</div>
                <div>"30 minute meals"</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Suggestions</h4>
            <div className="space-y-2">
              {getSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(suggestion)
                    setShowSuggestions(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Background overlay */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
} 