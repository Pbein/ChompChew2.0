/**
 * @jest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateRecipeAction } from './actions'
import { RecipeGenerationService } from '@/features/core/services/recipeGenerationService'
import { canGenerateRecipes } from '@/lib/auth-utils'
import { createServerComponentClient } from '@/lib/supabase-server'

// Mock dependencies
vi.mock('@/features/core/services/recipeGenerationService')
vi.mock('@/lib/auth-utils')
vi.mock('@/lib/supabase-server')
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock implementations
const mockGenerateRecipe = vi.fn()
const mockCanGenerateRecipes = canGenerateRecipes as ReturnType<typeof vi.fn>
const mockCreateServerComponentClient = createServerComponentClient as ReturnType<typeof vi.fn>

// Create chainable mock functions
const createMockChain = () => {
  const mockSelect = vi.fn()
  const mockEq = vi.fn()
  const mockSingle = vi.fn()
  const mockInsert = vi.fn()
  
  // Setup chaining
  mockSelect.mockReturnValue({ eq: mockEq })
  mockEq.mockReturnValue({ single: mockSingle })
  mockInsert.mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn() }) })
  
  return {
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
    })),
    mockSelect,
    mockEq,
    mockSingle,
    mockInsert,
  }
}

// Mock rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

describe('Recipe Generation Actions', () => {
  let mockChain: ReturnType<typeof createMockChain>
  
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Reset rate limit store
    rateLimitStore.clear()
    
    // Create fresh mock chain
    mockChain = createMockChain()
    
    // Mock RecipeGenerationService
    vi.mocked(RecipeGenerationService.generateRecipe).mockImplementation(mockGenerateRecipe)

    // Setup default mock implementations
    mockCreateServerComponentClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
              created_at: '2024-01-01T00:00:00Z'
            }
          },
          error: null
        })
      },
      ...mockChain
    })
    
    // Mock user profile lookup  
    mockChain.mockSingle.mockResolvedValue({
      data: {
        id: 'test-user-id',
        role: 'premium',
        subscription_status: 'active',
        subscription_tier: 'premium',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      error: null
    })
    
    mockCanGenerateRecipes.mockReturnValue(true)
  })

  describe('generateRecipeAction', () => {
    it('should generate recipe successfully for authorized user', async () => {
      // Mock successful AI generation with new RecipeGenerationService format
      const mockRecipe = {
        title: 'Test Chicken Burrito',
        description: 'A delicious test recipe',
        ingredients: [
          { name: 'chicken breast', amount: '200g', unit: 'g' },
          { name: 'tortilla', amount: '2', unit: 'pieces' }
        ],
        instructions: [
          { step: 1, instruction: 'Cook the chicken' },
          { step: 2, instruction: 'Warm the tortillas' },
          { step: 3, instruction: 'Assemble the burrito' }
        ],
        metadata: {
          prepTime: 15,
          cookTime: 20,
          totalTime: 35,
          servings: 2,
          difficulty: 'easy' as const,
          cuisineType: 'Mexican'
        },
        tags: ['high-protein'],
        nutrition: {
          calories: 450
        },
        imageUrl: 'https://example.com/test-image.jpg'
      }

      mockGenerateRecipe.mockResolvedValue(mockRecipe)
      
      // Mock successful database insertion
      const mockInsertSingle = vi.fn().mockResolvedValue({
        data: { id: 'recipe-123', ...mockRecipe },
        error: null
      })
      mockChain.mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: mockInsertSingle
        })
      })

      // Create form data
      const formData = new FormData()
      formData.append('prompt', 'chicken burrito')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)
      
      expect(result.success).toBe(true)
      expect(result.recipeMarkdown).toContain('# Test Chicken Burrito')
      expect(result.recipeMarkdown).toContain('chicken breast')
      expect(result.recipeId).toBe('recipe-123')
      expect(result.imageUrl).toBe('https://example.com/test-image.jpg')
      expect(mockGenerateRecipe).toHaveBeenCalledWith({
        ingredients: ['chicken burrito'],
        dietaryRestrictions: [],
        allergies: [],
        difficulty: 'medium',
        servings: 4,
        equipment: []
      })
    })

    it('should reject unauthorized users', async () => {
      mockCanGenerateRecipes.mockReturnValue(false)

      const formData = new FormData()
      formData.append('prompt', 'test recipe')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Premium subscription required')
      expect(mockGenerateRecipe).not.toHaveBeenCalled()
    })

    it('should handle authentication errors', async () => {
      mockCreateServerComponentClient.mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Not authenticated' }
          })
        },
        ...mockChain
      })

      const formData = new FormData()
      formData.append('prompt', 'test recipe')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('You must be logged in')
    })

    it('should handle AI generation errors', async () => {
      mockGenerateRecipe.mockRejectedValue(new Error('OpenAI API error'))

      const formData = new FormData()
      formData.append('prompt', 'test recipe')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('An unexpected error occurred')
    })

    it('should handle database insertion errors', async () => {
      const mockRecipe = {
        title: 'Test Recipe',
        description: 'A test recipe',
        ingredients: [{ name: 'test ingredient', amount: '1', unit: 'cup' }],
        instructions: [{ step: 1, instruction: 'test instruction' }],
        metadata: {
          prepTime: 10,
          cookTime: 15,
          totalTime: 25,
          servings: 2,
          difficulty: 'easy' as const,
          cuisineType: 'American'
        },
        tags: [],
        nutrition: {
          calories: 200
        },
        imageUrl: 'https://example.com/test.jpg'
      }

      mockGenerateRecipe.mockResolvedValue(mockRecipe)
      const mockInsertSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      })
      mockChain.mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: mockInsertSingle
        })
      })

      const formData = new FormData()
      formData.append('prompt', 'test recipe')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to save recipe to database')
    })

    it('should handle missing prompt', async () => {
      const formData = new FormData()
      // No prompt added
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Recipe description is required')
      expect(mockGenerateRecipe).not.toHaveBeenCalled()
    })

    it('should handle empty prompt', async () => {
      const formData = new FormData()
      formData.append('prompt', '   ') // Only whitespace
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Recipe description is required')
      expect(mockGenerateRecipe).not.toHaveBeenCalled()
    })

    it('should parse dietary preferences from form data', async () => {
      const mockRecipe = {
        title: 'Healthy Recipe',
        description: 'A healthy test recipe',
        ingredients: [{ name: 'test ingredient', amount: '1', unit: 'cup' }],
        instructions: [{ step: 1, instruction: 'test instruction' }],
        metadata: {
          prepTime: 10,
          cookTime: 15,
          totalTime: 25,
          servings: 2,
          difficulty: 'easy' as const,
          cuisineType: 'American'
        },
        tags: ['vegetarian', 'high-protein'],
        nutrition: {
          calories: 300
        },
        imageUrl: 'https://example.com/healthy.jpg'
      }

      mockGenerateRecipe.mockResolvedValue(mockRecipe)
      const mockInsertSingle = vi.fn().mockResolvedValue({
        data: { id: 'recipe-123', ...mockRecipe },
        error: null
      })
      mockChain.mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: mockInsertSingle
        })
      })

      const formData = new FormData()
      formData.append('prompt', 'healthy recipe')
      formData.append('dietaryPreferences', JSON.stringify(['vegetarian', 'high-protein']))
      formData.append('allergens', JSON.stringify(['nuts', 'dairy']))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(true)
      expect(result.imageUrl).toBe('https://example.com/healthy.jpg')
      expect(mockGenerateRecipe).toHaveBeenCalledWith({
        ingredients: ['healthy recipe'],
        dietaryRestrictions: ['vegetarian', 'high-protein'],
        allergies: ['nuts', 'dairy'],
        difficulty: 'medium',
        servings: 4,
        equipment: []
      })
    })
  })
}) 