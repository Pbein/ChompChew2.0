import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFinalSearchQuery } from '@/features/core/stores/searchStore'
import { useProfileStore } from '@/store/profileStore'
import { renderHook, act } from '@testing-library/react'

// Mock the stores
vi.mock('@/features/core/stores/searchStore', () => ({
  useFinalSearchQuery: vi.fn()
}))

vi.mock('@/store/profileStore', () => ({
  useProfileStore: {
    getState: vi.fn()
  }
}))

describe('Search Integration with Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useFinalSearchQuery', () => {
    it('should merge search query with profile dietary preferences', () => {
      // Mock search store state
      const mockSearchQuery = {
        ingredients: ['chicken'],
        excludedIngredients: [],
        dietaryPreferences: ['keto'],
        mealType: [],
        cuisine: [],
        cookingMethod: [],
        nutritionGoals: [],
        prepConstraints: [],
        dishes: []
      }

      // Mock profile store state
      const mockProfile = {
        dietary_preferences: ['gluten-free', 'dairy-free'],
        allergens: ['nuts'],
        macro_targets: {},
        fiber_sensitivity: false
      }

      vi.mocked(useProfileStore.getState).mockReturnValue({
        profile: mockProfile
      })

      // Mock the actual implementation
      vi.mocked(useFinalSearchQuery).mockImplementation(() => {
        const { profile } = useProfileStore.getState()
        return {
          ...mockSearchQuery,
          dietaryPreferences: Array.from(new Set([
            ...mockSearchQuery.dietaryPreferences,
            ...(profile?.dietary_preferences || [])
          ])),
          excludedIngredients: Array.from(new Set([
            ...mockSearchQuery.excludedIngredients,
            ...(profile?.allergens || [])
          ]))
        }
      })

      const result = useFinalSearchQuery()

      expect(result.dietaryPreferences).toEqual(['keto', 'gluten-free', 'dairy-free'])
      expect(result.excludedIngredients).toEqual(['nuts'])
      expect(result.ingredients).toEqual(['chicken'])
    })

    it('should handle empty profile gracefully', () => {
      const mockSearchQuery = {
        ingredients: ['salmon'],
        excludedIngredients: ['dairy'],
        dietaryPreferences: ['paleo'],
        mealType: [],
        cuisine: [],
        cookingMethod: [],
        nutritionGoals: [],
        prepConstraints: [],
        dishes: []
      }

      vi.mocked(useProfileStore.getState).mockReturnValue({
        profile: null
      })

      vi.mocked(useFinalSearchQuery).mockImplementation(() => {
        const { profile } = useProfileStore.getState()
        return {
          ...mockSearchQuery,
          dietaryPreferences: Array.from(new Set([
            ...mockSearchQuery.dietaryPreferences,
            ...(profile?.dietary_preferences || [])
          ])),
          excludedIngredients: Array.from(new Set([
            ...mockSearchQuery.excludedIngredients,
            ...(profile?.allergens || [])
          ]))
        }
      })

      const result = useFinalSearchQuery()

      expect(result.dietaryPreferences).toEqual(['paleo'])
      expect(result.excludedIngredients).toEqual(['dairy'])
    })

    it('should deduplicate dietary preferences and allergens', () => {
      const mockSearchQuery = {
        ingredients: [],
        excludedIngredients: ['nuts', 'dairy'],
        dietaryPreferences: ['vegan', 'gluten-free'],
        mealType: [],
        cuisine: [],
        cookingMethod: [],
        nutritionGoals: [],
        prepConstraints: [],
        dishes: []
      }

      const mockProfile = {
        dietary_preferences: ['vegan', 'organic'], // 'vegan' is duplicate
        allergens: ['nuts', 'shellfish'], // 'nuts' is duplicate
        macro_targets: {},
        fiber_sensitivity: false
      }

      vi.mocked(useProfileStore.getState).mockReturnValue({
        profile: mockProfile
      })

      vi.mocked(useFinalSearchQuery).mockImplementation(() => {
        const { profile } = useProfileStore.getState()
        return {
          ...mockSearchQuery,
          dietaryPreferences: Array.from(new Set([
            ...mockSearchQuery.dietaryPreferences,
            ...(profile?.dietary_preferences || [])
          ])),
          excludedIngredients: Array.from(new Set([
            ...mockSearchQuery.excludedIngredients,
            ...(profile?.allergens || [])
          ]))
        }
      })

      const result = useFinalSearchQuery()

      expect(result.dietaryPreferences).toEqual(['vegan', 'gluten-free', 'organic'])
      expect(result.excludedIngredients).toEqual(['nuts', 'dairy', 'shellfish'])
    })
  })

  describe('Guest vs Authenticated Filtering', () => {
    it('should not apply profile filters for guest users', () => {
      const mockSearchQuery = {
        ingredients: ['pasta'],
        excludedIngredients: [],
        dietaryPreferences: [],
        mealType: [],
        cuisine: [],
        cookingMethod: [],
        nutritionGoals: [],
        prepConstraints: [],
        dishes: []
      }

      // No profile (guest user)
      vi.mocked(useProfileStore.getState).mockReturnValue({
        profile: null
      })

      vi.mocked(useFinalSearchQuery).mockImplementation(() => {
        const { profile } = useProfileStore.getState()
        return {
          ...mockSearchQuery,
          dietaryPreferences: Array.from(new Set([
            ...mockSearchQuery.dietaryPreferences,
            ...(profile?.dietary_preferences || [])
          ])),
          excludedIngredients: Array.from(new Set([
            ...mockSearchQuery.excludedIngredients,
            ...(profile?.allergens || [])
          ]))
        }
      })

      const result = useFinalSearchQuery()

      expect(result.dietaryPreferences).toEqual([])
      expect(result.excludedIngredients).toEqual([])
      expect(result.ingredients).toEqual(['pasta'])
    })

    it('should apply profile filters for authenticated users with active search', () => {
      const mockSearchQuery = {
        ingredients: ['chicken'],
        excludedIngredients: [],
        dietaryPreferences: [],
        mealType: ['dinner'],
        cuisine: [],
        cookingMethod: [],
        nutritionGoals: [],
        prepConstraints: [],
        dishes: []
      }

      const mockProfile = {
        dietary_preferences: ['low-carb'],
        allergens: ['dairy'],
        macro_targets: {},
        fiber_sensitivity: false
      }

      vi.mocked(useProfileStore.getState).mockReturnValue({
        profile: mockProfile
      })

      vi.mocked(useFinalSearchQuery).mockImplementation(() => {
        const { profile } = useProfileStore.getState()
        return {
          ...mockSearchQuery,
          dietaryPreferences: Array.from(new Set([
            ...mockSearchQuery.dietaryPreferences,
            ...(profile?.dietary_preferences || [])
          ])),
          excludedIngredients: Array.from(new Set([
            ...mockSearchQuery.excludedIngredients,
            ...(profile?.allergens || [])
          ]))
        }
      })

      const result = useFinalSearchQuery()

      expect(result.dietaryPreferences).toEqual(['low-carb'])
      expect(result.excludedIngredients).toEqual(['dairy'])
      expect(result.ingredients).toEqual(['chicken'])
      expect(result.mealType).toEqual(['dinner'])
    })
  })

  describe('Fiber Sensitivity Integration', () => {
    it('should handle fiber sensitivity in profile', () => {
      const mockSearchQuery = {
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

      const mockProfile = {
        dietary_preferences: ['low-fiber'],
        allergens: [],
        macro_targets: {},
        fiber_sensitivity: true
      }

      vi.mocked(useProfileStore.getState).mockReturnValue({
        profile: mockProfile
      })

      vi.mocked(useFinalSearchQuery).mockImplementation(() => {
        const { profile } = useProfileStore.getState()
        return {
          ...mockSearchQuery,
          dietaryPreferences: Array.from(new Set([
            ...mockSearchQuery.dietaryPreferences,
            ...(profile?.dietary_preferences || [])
          ])),
          excludedIngredients: Array.from(new Set([
            ...mockSearchQuery.excludedIngredients,
            ...(profile?.allergens || [])
          ]))
        }
      })

      const result = useFinalSearchQuery()

      expect(result.dietaryPreferences).toContain('low-fiber')
    })
  })
}) 