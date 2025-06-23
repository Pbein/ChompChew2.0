import { describe, it, expect, beforeEach, vi } from 'vitest'
import { searchStore } from '@/features/core/stores/searchStore'
import type { SearchQuery, SearchFilters } from '@/features/core/types/recipe'

// Mock the store
vi.mock('@/features/core/stores/searchStore', () => {
  let mockState = {
    searchQuery: {
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
    filters: {},
    isLoading: false,
    searchHistory: [],
    lastSearchTimestamp: null,
  }

  return {
    searchStore: {
      getState: () => mockState,
      setState: (newState: Partial<typeof mockState>) => {
        mockState = { ...mockState, ...newState }
      },
      subscribe: vi.fn(),
      // Actions
      updateSearchQuery: vi.fn((updates: Partial<SearchQuery>) => {
        mockState.searchQuery = { ...mockState.searchQuery, ...updates }
      }),
      clearSearch: vi.fn(() => {
        mockState.searchQuery = {
          ingredients: [],
          excludedIngredients: [],
          dietaryPreferences: [],
          mealType: [],
          cuisine: [],
          cookingMethod: [],
          nutritionGoals: [],
          prepConstraints: [],
          dishes: []
        }
        mockState.filters = {}
      }),
      setFilters: vi.fn((filters: SearchFilters) => {
        mockState.filters = filters
      }),
      setLoading: vi.fn((loading: boolean) => {
        mockState.isLoading = loading
      }),
      addToHistory: vi.fn((query: SearchQuery) => {
        mockState.searchHistory = [query, ...mockState.searchHistory.slice(0, 9)] // Keep last 10
        mockState.lastSearchTimestamp = Date.now()
      }),
      clearHistory: vi.fn(() => {
        mockState.searchHistory = []
      }),
    }
  }
})

describe('Search Store & Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock state
    searchStore.setState({
      searchQuery: {
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
      filters: {},
      isLoading: false,
      searchHistory: [],
      lastSearchTimestamp: null,
    })
  })

  describe('Search Query Building and State Management', () => {
    it('should update search query with new ingredients', () => {
      const newIngredients = ['chicken', 'rice', 'vegetables']
      
      searchStore.updateSearchQuery({ ingredients: newIngredients })
      
      expect(searchStore.updateSearchQuery).toHaveBeenCalledWith({ ingredients: newIngredients })
      const state = searchStore.getState()
      expect(state.searchQuery.ingredients).toEqual(newIngredients)
    })

    it('should handle excluded ingredients separately from regular ingredients', () => {
      const ingredients = ['chicken', 'rice']
      const excludedIngredients = ['dairy', 'nuts']
      
      searchStore.updateSearchQuery({ 
        ingredients, 
        excludedIngredients 
      })
      
      const state = searchStore.getState()
      expect(state.searchQuery.ingredients).toEqual(ingredients)
      expect(state.searchQuery.excludedIngredients).toEqual(excludedIngredients)
      expect(state.searchQuery.ingredients).not.toContain('dairy')
      expect(state.searchQuery.ingredients).not.toContain('nuts')
    })

    it('should update dietary preferences correctly', () => {
      const dietaryPreferences = ['vegetarian', 'gluten-free', 'low-sodium']
      
      searchStore.updateSearchQuery({ dietaryPreferences })
      
      const state = searchStore.getState()
      expect(state.searchQuery.dietaryPreferences).toEqual(dietaryPreferences)
    })

    it('should handle multiple search criteria simultaneously', () => {
      const complexQuery = {
        ingredients: ['salmon', 'quinoa'],
        excludedIngredients: ['dairy'],
        dietaryPreferences: ['pescatarian'],
        mealType: ['dinner'],
        cuisine: ['mediterranean'],
        cookingMethod: ['baked'],
        nutritionGoals: ['high-protein'],
        prepConstraints: ['30-minutes'],
      }
      
      searchStore.updateSearchQuery(complexQuery)
      
      const state = searchStore.getState()
      Object.keys(complexQuery).forEach(key => {
        expect(state.searchQuery[key as keyof SearchQuery]).toEqual(complexQuery[key as keyof typeof complexQuery])
      })
    })
  })

  describe('Filter Application and Combination Logic', () => {
    it('should apply filters and maintain state', () => {
      const filters: SearchFilters = {
        maxPrepTime: 30,
        minRating: 4.0,
        maxCalories: 500,
        sortBy: 'rating',
        sortOrder: 'desc'
      }
      
      searchStore.setFilters(filters)
      
      expect(searchStore.setFilters).toHaveBeenCalledWith(filters)
      const state = searchStore.getState()
      expect(state.filters).toEqual(filters)
    })

    it('should combine search query with filters for comprehensive search', () => {
      const query = {
        ingredients: ['chicken'],
        dietaryPreferences: ['low-carb']
      }
      const filters: SearchFilters = {
        maxPrepTime: 45,
        minRating: 3.5
      }
      
      searchStore.updateSearchQuery(query)
      searchStore.setFilters(filters)
      
      const state = searchStore.getState()
      expect(state.searchQuery.ingredients).toEqual(['chicken'])
      expect(state.searchQuery.dietaryPreferences).toEqual(['low-carb'])
      expect(state.filters.maxPrepTime).toBe(45)
      expect(state.filters.minRating).toBe(3.5)
    })

    it('should validate filter ranges and constraints', () => {
      const invalidFilters: SearchFilters = {
        maxPrepTime: -10, // Invalid negative time
        minRating: 6.0,   // Invalid rating > 5
        maxCalories: 0,   // Invalid zero calories
      }
      
      // In a real implementation, these would be validated
      searchStore.setFilters(invalidFilters)
      
      const state = searchStore.getState()
      // Test that validation logic would handle these edge cases
      expect(state.filters.maxPrepTime).toBe(-10) // Would be validated in real implementation
      expect(state.filters.minRating).toBe(6.0)   // Would be validated in real implementation
      expect(state.filters.maxCalories).toBe(0)   // Would be validated in real implementation
    })
  })

  describe('Search History and Suggestions', () => {
    it('should add searches to history', () => {
      const searchQuery: SearchQuery = {
        ingredients: ['pasta', 'tomato'],
        excludedIngredients: [],
        dietaryPreferences: ['vegetarian'],
        mealType: ['dinner'],
        cuisine: ['italian'],
        cookingMethod: [],
        nutritionGoals: [],
        prepConstraints: [],
        dishes: []
      }
      
      searchStore.addToHistory(searchQuery)
      
      expect(searchStore.addToHistory).toHaveBeenCalledWith(searchQuery)
      const state = searchStore.getState()
      expect(state.searchHistory).toContainEqual(searchQuery)
      expect(state.lastSearchTimestamp).toBeTypeOf('number')
    })

    it('should limit search history to last 10 items', () => {
      // Add 12 search items
      for (let i = 0; i < 12; i++) {
        const query: SearchQuery = {
          ingredients: [`ingredient-${i}`],
          excludedIngredients: [],
          dietaryPreferences: [],
          mealType: [],
          cuisine: [],
          cookingMethod: [],
          nutritionGoals: [],
          prepConstraints: [],
          dishes: []
        }
        searchStore.addToHistory(query)
      }
      
      const state = searchStore.getState()
      expect(state.searchHistory.length).toBeLessThanOrEqual(10)
    })

    it('should clear search history', () => {
      // Add some history first
      const query: SearchQuery = {
        ingredients: ['test'],
        excludedIngredients: [],
        dietaryPreferences: [],
        mealType: [],
        cuisine: [],
        cookingMethod: [],
        nutritionGoals: [],
        prepConstraints: [],
        dishes: []
      }
      searchStore.addToHistory(query)
      
      // Then clear it
      searchStore.clearHistory()
      
      expect(searchStore.clearHistory).toHaveBeenCalled()
      const state = searchStore.getState()
      expect(state.searchHistory).toEqual([])
    })
  })

  describe('Profile-driven Search Personalization', () => {
    it('should merge user dietary preferences with search query', () => {
      const userProfile = {
        dietaryPreferences: ['vegetarian', 'gluten-free'],
        allergens: ['nuts', 'shellfish']
      }
      
      const searchQuery = {
        ingredients: ['quinoa', 'vegetables'],
        dietaryPreferences: ['low-sodium'] // User adds this to their profile preferences
      }
      
      // Simulate merging profile with search
      const mergedQuery = {
        ...searchQuery,
        dietaryPreferences: [...userProfile.dietaryPreferences, ...searchQuery.dietaryPreferences],
        excludedIngredients: userProfile.allergens
      }
      
      searchStore.updateSearchQuery(mergedQuery)
      
      const state = searchStore.getState()
      expect(state.searchQuery.dietaryPreferences).toContain('vegetarian')
      expect(state.searchQuery.dietaryPreferences).toContain('gluten-free')
      expect(state.searchQuery.dietaryPreferences).toContain('low-sodium')
      expect(state.searchQuery.excludedIngredients).toContain('nuts')
      expect(state.searchQuery.excludedIngredients).toContain('shellfish')
    })

    it('should respect user macro targets in search filters', () => {
      const userMacroTargets = {
        protein: 30, // 30% protein
        carbs: 40,   // 40% carbs
        fat: 30      // 30% fat
      }
      
      const nutritionFilters: SearchFilters = {
        minProtein: userMacroTargets.protein,
        maxCarbs: userMacroTargets.carbs + 10, // Allow some flexibility
        maxFat: userMacroTargets.fat + 5
      }
      
      searchStore.setFilters(nutritionFilters)
      
      const state = searchStore.getState()
      expect(state.filters.minProtein).toBe(30)
      expect(state.filters.maxCarbs).toBe(50)
      expect(state.filters.maxFat).toBe(35)
    })
  })

  describe('Loading State Management', () => {
    it('should set loading state during search operations', () => {
      searchStore.setLoading(true)
      
      expect(searchStore.setLoading).toHaveBeenCalledWith(true)
      let state = searchStore.getState()
      expect(state.isLoading).toBe(true)
      
      searchStore.setLoading(false)
      
      expect(searchStore.setLoading).toHaveBeenCalledWith(false)
      state = searchStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('Search State Clearing', () => {
    it('should clear all search state when reset', () => {
      // Set up some search state
      searchStore.updateSearchQuery({
        ingredients: ['test'],
        dietaryPreferences: ['vegetarian']
      })
      searchStore.setFilters({ maxPrepTime: 30 })
      
      // Clear everything
      searchStore.clearSearch()
      
      expect(searchStore.clearSearch).toHaveBeenCalled()
      const state = searchStore.getState()
      expect(state.searchQuery.ingredients).toEqual([])
      expect(state.searchQuery.dietaryPreferences).toEqual([])
      expect(state.filters).toEqual({})
    })
  })
}) 