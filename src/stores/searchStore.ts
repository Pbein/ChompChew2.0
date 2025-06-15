import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Search query structure matching the specification
export interface SearchQuery {
  ingredients: string[]
  excludedIngredients: string[]
  dietaryPreferences: string[]
  mealType: string[]
  cuisine: string[]
  cookingMethod: string[]
  nutritionGoals: string[]
  prepConstraints: string[]
  dishes: string[]
}

// Token categories for semantic parsing
export type TokenCategory = 
  | 'ingredients' 
  | 'excludedIngredients' 
  | 'dietaryPreferences' 
  | 'mealType' 
  | 'cuisine' 
  | 'cookingMethod' 
  | 'nutritionGoals' 
  | 'prepConstraints' 
  | 'dishes'

// Parsed token with suggested categories
export interface ParsedToken {
  text: string
  suggestedCategories: {
    category: TokenCategory
    confidence: number
    label: string
  }[]
  confirmed?: {
    category: TokenCategory
    label: string
  }
}

// Search chip representing a confirmed token
export interface SearchChip {
  id: string
  text: string
  category: TokenCategory
  label: string
  color: string
}

// Search store state
interface SearchStoreState {
  // Current input
  currentInput: string
  
  // Parsed tokens from current input
  parsedTokens: ParsedToken[]
  
  // Confirmed search chips
  searchChips: SearchChip[]
  
  // Final structured query
  structuredQuery: SearchQuery
  
  // UI state
  showSuggestions: boolean
  activeTokenIndex: number | null
  isLoading: boolean
  
  // Search history
  searchHistory: SearchQuery[]
  
  // Actions
  setCurrentInput: (input: string) => void
  parseInput: (input: string) => void
  confirmToken: (tokenIndex: number, category: TokenCategory, label: string) => void
  removeChip: (chipId: string) => void
  editChip: (chipId: string, newText: string) => void
  clearSearch: () => void
  executeSearch: () => void
  addToHistory: (query: SearchQuery) => void
  setShowSuggestions: (show: boolean) => void
  setActiveTokenIndex: (index: number | null) => void
  setLoading: (loading: boolean) => void
}

// Category configurations with colors and labels
export const CATEGORY_CONFIG: Record<TokenCategory, { label: string; color: string; emoji: string }> = {
  ingredients: { label: 'Ingredient', color: 'bg-green-100 text-green-800 border-green-200', emoji: '🥕' },
  excludedIngredients: { label: 'Avoid', color: 'bg-red-100 text-red-800 border-red-200', emoji: '🚫' },
  dietaryPreferences: { label: 'Diet', color: 'bg-blue-100 text-blue-800 border-blue-200', emoji: '🥗' },
  mealType: { label: 'Meal', color: 'bg-purple-100 text-purple-800 border-purple-200', emoji: '🍽️' },
  cuisine: { label: 'Cuisine', color: 'bg-orange-100 text-orange-800 border-orange-200', emoji: '🌍' },
  cookingMethod: { label: 'Method', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', emoji: '👨‍🍳' },
  nutritionGoals: { label: 'Nutrition', color: 'bg-pink-100 text-pink-800 border-pink-200', emoji: '💪' },
  prepConstraints: { label: 'Time', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', emoji: '⏱️' },
  dishes: { label: 'Dish', color: 'bg-teal-100 text-teal-800 border-teal-200', emoji: '🍲' }
}

// Simple NLP parsing logic (can be enhanced with GPT later)
const parseTokenToCategories = (token: string): ParsedToken['suggestedCategories'] => {
  const lowerToken = token.toLowerCase()
  const suggestions: ParsedToken['suggestedCategories'] = []
  
  // Ingredients dictionary (simplified)
  const ingredients = ['chicken', 'beef', 'fish', 'salmon', 'broccoli', 'spinach', 'tomato', 'onion', 'garlic', 'rice', 'pasta', 'bread', 'cheese', 'milk', 'eggs', 'butter', 'oil', 'salt', 'pepper']
  
  // Dietary preferences
  const diets = ['keto', 'paleo', 'vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'low-carb', 'mediterranean', 'whole30']
  
  // Meal types
  const meals = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'appetizer']
  
  // Cuisines
  const cuisines = ['italian', 'mexican', 'asian', 'chinese', 'indian', 'thai', 'japanese', 'mediterranean', 'american', 'french']
  
  // Cooking methods
  const methods = ['grilled', 'baked', 'fried', 'steamed', 'roasted', 'sautéed', 'boiled', 'slow-cooked']
  
  // Time constraints
  const timeConstraints = ['quick', 'fast', '30 minutes', '15 minutes', 'under 30', 'under 20', 'slow cook']
  
  // Dishes
  const dishes = ['soup', 'salad', 'pasta', 'pizza', 'sandwich', 'stir-fry', 'curry', 'stew', 'casserole']
  
  // Exclusion patterns
  if (lowerToken.startsWith('no ') || lowerToken.startsWith('without ') || lowerToken.startsWith('avoid ')) {
    const ingredient = lowerToken.replace(/^(no |without |avoid )/, '')
    suggestions.push({
      category: 'excludedIngredients',
      confidence: 0.9,
      label: `Avoid ${ingredient}`
    })
  }
  
  // Check each category
  if (ingredients.includes(lowerToken)) {
    suggestions.push({
      category: 'ingredients',
      confidence: 0.8,
      label: `Add ${token} to ingredients`
    })
  }
  
  if (diets.includes(lowerToken)) {
    suggestions.push({
      category: 'dietaryPreferences',
      confidence: 0.9,
      label: `${token} diet`
    })
  }
  
  if (meals.includes(lowerToken)) {
    suggestions.push({
      category: 'mealType',
      confidence: 0.8,
      label: `${token} meal`
    })
  }
  
  if (cuisines.includes(lowerToken)) {
    suggestions.push({
      category: 'cuisine',
      confidence: 0.8,
      label: `${token} cuisine`
    })
  }
  
  if (methods.includes(lowerToken)) {
    suggestions.push({
      category: 'cookingMethod',
      confidence: 0.7,
      label: `${token} cooking`
    })
  }
  
  if (timeConstraints.some(constraint => lowerToken.includes(constraint))) {
    suggestions.push({
      category: 'prepConstraints',
      confidence: 0.8,
      label: `${token} preparation time`
    })
  }
  
  if (dishes.includes(lowerToken)) {
    suggestions.push({
      category: 'dishes',
      confidence: 0.8,
      label: `${token} dish type`
    })
  }
  
  // If no specific matches, suggest as ingredient (fallback)
  if (suggestions.length === 0) {
    suggestions.push({
      category: 'ingredients',
      confidence: 0.3,
      label: `Add ${token} to ingredients`
    })
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence)
}

export const useSearchStore = create<SearchStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentInput: '',
      parsedTokens: [],
      searchChips: [],
      structuredQuery: {
        ingredients: [],
        excludedIngredients: [],
        dietaryPreferences: [],
        mealType: [],
        cuisine: [],
        cookingMethod: [],
        nutritionGoals: [],
        prepConstraints: [],
        dishes: []
      },
      showSuggestions: false,
      activeTokenIndex: null,
      isLoading: false,
      searchHistory: [],
      
      // Actions
      setCurrentInput: (input) => {
        set({ currentInput: input })
        if (input.trim()) {
          get().parseInput(input)
        } else {
          set({ parsedTokens: [], showSuggestions: false })
        }
      },
      
      parseInput: (input) => {
        // Split input into tokens (by space, comma, or enter)
        const tokens = input.split(/[\s,]+/).filter(token => token.trim().length > 0)
        
        const parsedTokens: ParsedToken[] = tokens.map(token => ({
          text: token,
          suggestedCategories: parseTokenToCategories(token)
        }))
        
        set({ 
          parsedTokens,
          showSuggestions: parsedTokens.length > 0 && parsedTokens.some(token => !token.confirmed)
        })
      },
      
      confirmToken: (tokenIndex, category, label) => {
        const state = get()
        const token = state.parsedTokens[tokenIndex]
        
        if (!token) return
        
        // Create new chip
        const newChip: SearchChip = {
          id: `${category}-${Date.now()}-${Math.random()}`,
          text: token.text,
          category,
          label,
          color: CATEGORY_CONFIG[category].color
        }
        
        // Update structured query
        const newStructuredQuery = { ...state.structuredQuery }
        newStructuredQuery[category] = [...newStructuredQuery[category], token.text]
        
        // Mark token as confirmed
        const updatedTokens = [...state.parsedTokens]
        updatedTokens[tokenIndex] = {
          ...token,
          confirmed: { category, label }
        }
        
        set({
          searchChips: [...state.searchChips, newChip],
          structuredQuery: newStructuredQuery,
          parsedTokens: updatedTokens,
          showSuggestions: updatedTokens.some(t => !t.confirmed)
        })
      },
      
      removeChip: (chipId) => {
        const state = get()
        const chipToRemove = state.searchChips.find(chip => chip.id === chipId)
        
        if (!chipToRemove) return
        
        // Remove from chips
        const newChips = state.searchChips.filter(chip => chip.id !== chipId)
        
        // Remove from structured query
        const newStructuredQuery = { ...state.structuredQuery }
        newStructuredQuery[chipToRemove.category] = newStructuredQuery[chipToRemove.category]
          .filter(item => item !== chipToRemove.text)
        
        set({
          searchChips: newChips,
          structuredQuery: newStructuredQuery
        })
      },
      
      editChip: (chipId, newText) => {
        const state = get()
        const chipIndex = state.searchChips.findIndex(chip => chip.id === chipId)
        
        if (chipIndex === -1) return
        
        const chip = state.searchChips[chipIndex]
        const updatedChips = [...state.searchChips]
        updatedChips[chipIndex] = { ...chip, text: newText }
        
        // Update structured query
        const newStructuredQuery = { ...state.structuredQuery }
        const categoryArray = [...newStructuredQuery[chip.category]]
        const itemIndex = categoryArray.indexOf(chip.text)
        if (itemIndex !== -1) {
          categoryArray[itemIndex] = newText
          newStructuredQuery[chip.category] = categoryArray
        }
        
        set({
          searchChips: updatedChips,
          structuredQuery: newStructuredQuery
        })
      },
      
      clearSearch: () => {
        set({
          currentInput: '',
          parsedTokens: [],
          searchChips: [],
          structuredQuery: {
            ingredients: [],
            excludedIngredients: [],
            dietaryPreferences: [],
            mealType: [],
            cuisine: [],
            cookingMethod: [],
            nutritionGoals: [],
            prepConstraints: [],
            dishes: []
          },
          showSuggestions: false,
          activeTokenIndex: null
        })
      },
      
      executeSearch: () => {
        const state = get()
        set({ isLoading: true })
        
        // Add to history
        get().addToHistory(state.structuredQuery)
        
        // Here you would trigger the actual search
        console.log('Executing search with query:', state.structuredQuery)
        
        // Simulate search completion
        setTimeout(() => {
          set({ isLoading: false })
        }, 1000)
      },
      
      addToHistory: (query) => {
        const state = get()
        const newHistory = [query, ...state.searchHistory].slice(0, 10) // Keep last 10 searches
        set({ searchHistory: newHistory })
      },
      
      setShowSuggestions: (show) => set({ showSuggestions: show }),
      setActiveTokenIndex: (index) => set({ activeTokenIndex: index }),
      setLoading: (loading) => set({ isLoading: loading })
    }),
    { name: 'search-store' }
  )
) 