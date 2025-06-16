import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchRecipes, fetchRecipe } from '@/lib/recipes'
import { supabase } from '@/lib/supabase'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => ({
          contains: vi.fn(),
          not: vi.fn()
        })),
        eq: vi.fn(() => ({
          single: vi.fn()
        })),
        contains: vi.fn(),
        not: vi.fn()
      }))
    }))
  }
}))

describe('Recipe Fetching', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchRecipes', () => {
    it('should fetch recipes without filters', async () => {
      const mockRecipes = [
        {
          id: 'recipe-1',
          title: 'Chicken Soup',
          image_url: 'https://example.com/image1.jpg',
          prep_time: 15,
          servings: 4,
          difficulty: 'easy',
          dietary_tags: ['low-fiber', 'uc-safe'],
          calories_per_serving: 280,
          safety_validated: true,
          rating_average: 4.5
        },
        {
          id: 'recipe-2',
          title: 'Vegan Cookies',
          image_url: null,
          prep_time: 20,
          servings: 12,
          difficulty: 'medium',
          dietary_tags: ['vegan', 'dairy-free'],
          calories_per_serving: 160,
          safety_validated: true,
          rating_average: 4.2
        }
      ]

      const mockQuery = {
        select: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue({ data: mockRecipes, error: null })
        }))
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const result = await fetchRecipes(12)

      expect(supabase.from).toHaveBeenCalledWith('recipes')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'recipe-1',
        title: 'Chicken Soup',
        image: 'https://example.com/image1.jpg',
        prepTime: 15,
        difficulty: 'easy',
        servings: 4,
        dietaryCompliance: ['low-fiber', 'uc-safe'],
        safetyValidated: true,
        calories: 280,
        rating: 4.5
      })
    })

    it('should handle null values in database response', async () => {
      const mockRecipes = [
        {
          id: 'recipe-3',
          title: 'Simple Recipe',
          image_url: null,
          prep_time: null,
          servings: null,
          difficulty: null,
          dietary_tags: null,
          calories_per_serving: null,
          safety_validated: null,
          rating_average: null
        }
      ]

      const mockQuery = {
        select: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue({ data: mockRecipes, error: null })
        }))
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const result = await fetchRecipes()

      expect(result[0]).toEqual({
        id: 'recipe-3',
        title: 'Simple Recipe',
        image: undefined,
        prepTime: 0,
        difficulty: 'easy',
        servings: 1,
        dietaryCompliance: [],
        safetyValidated: true,
        calories: undefined,
        rating: undefined
      })
    })

    it('should apply dietary preference filters', async () => {
      const mockRecipes = []
      const mockContains = vi.fn().mockResolvedValue({ data: mockRecipes, error: null })
      const mockLimit = vi.fn(() => ({ contains: mockContains }))
      const mockSelect = vi.fn(() => ({ limit: mockLimit }))

      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

      const filters = {
        dietaryPreferences: ['vegan', 'gluten-free'],
        excludedIngredients: [],
        ingredients: [],
        mealType: [],
        cuisine: [],
        cookingMethod: [],
        nutritionGoals: [],
        prepConstraints: [],
        dishes: []
      }

      await fetchRecipes(12, filters)

      expect(mockContains).toHaveBeenCalledWith('dietary_tags', ['vegan', 'gluten-free'])
    })

    it('should apply excluded ingredients filters', async () => {
      const mockRecipes = []
      const mockNot = vi.fn().mockResolvedValue({ data: mockRecipes, error: null })
      const mockLimit = vi.fn(() => ({ not: mockNot }))
      const mockSelect = vi.fn(() => ({ limit: mockLimit }))

      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

      const filters = {
        dietaryPreferences: [],
        excludedIngredients: ['nuts', 'dairy'],
        ingredients: [],
        mealType: [],
        cuisine: [],
        cookingMethod: [],
        nutritionGoals: [],
        prepConstraints: [],
        dishes: []
      }

      await fetchRecipes(12, filters)

      expect(mockNot).toHaveBeenCalledWith('ingredients', 'cs', ['nuts', 'dairy'])
    })

    it('should handle database errors gracefully', async () => {
      const mockError = { message: 'Database connection failed' }
      const mockQuery = {
        select: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue({ data: null, error: mockError })
        }))
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await fetchRecipes()

      // In database-only mode, should return empty array on error
      expect(result.length).toBe(0)
      expect(consoleSpy).toHaveBeenCalledWith('fetchRecipes database error:', mockError)

      consoleSpy.mockRestore()
    })
  })

  describe('fetchRecipe', () => {
    it('should fetch single recipe by id', async () => {
      const mockRecipe = {
        id: 'recipe-1',
        title: 'Test Recipe',
        image_url: 'https://example.com/image.jpg',
        prep_time: 30,
        servings: 2,
        difficulty: 'medium',
        dietary_tags: ['vegetarian'],
        calories_per_serving: 350,
        safety_validated: true,
        rating_average: 4.8
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: mockRecipe, error: null })
      const mockEq = vi.fn(() => ({ single: mockSingle }))
      const mockSelect = vi.fn(() => ({ eq: mockEq }))

      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

      const result = await fetchRecipe('recipe-1')

      expect(supabase.from).toHaveBeenCalledWith('recipes')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', 'recipe-1')
      expect(result).toEqual(mockRecipe)
    })

    it('should handle recipe not found', async () => {
      const mockError = { message: 'Recipe not found' }
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockEq = vi.fn(() => ({ single: mockSingle }))
      const mockSelect = vi.fn(() => ({ eq: mockEq }))

      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await fetchRecipe('nonexistent-id')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('fetchRecipe database error:', mockError)
      expect(consoleSpy).toHaveBeenCalledWith('No fallback recipe found for ID: nonexistent-id')

      consoleSpy.mockRestore()
    })
  })

  describe('Recipe Data Mapping', () => {
    it('should map database recipe to RecipeCardData correctly', async () => {
      const mockDbRecipe = {
        id: 'recipe-test',
        title: 'Mapping Test Recipe',
        image_url: 'https://example.com/test.jpg',
        prep_time: 25,
        servings: 3,
        difficulty: 'hard',
        dietary_tags: ['keto', 'high-protein'],
        calories_per_serving: 450,
        safety_validated: false,
        rating_average: 3.9
      }

      const mockQuery = {
        select: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue({ data: [mockDbRecipe], error: null })
        }))
      }

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

      const result = await fetchRecipes(1)

      expect(result[0]).toEqual({
        id: 'recipe-test',
        title: 'Mapping Test Recipe',
        image: 'https://example.com/test.jpg',
        prepTime: 25,
        difficulty: 'hard',
        servings: 3,
        dietaryCompliance: ['keto', 'high-protein'],
        safetyValidated: false,
        calories: 450,
        rating: 3.9
      })
    })
  })
}) 