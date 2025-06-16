/**
 * @jest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateRecipeAction } from './actions'
import { generateRecipe } from '@/lib/openai'
import { canGenerateRecipes } from '@/lib/auth-utils'
import { createServerComponentClient } from '@/lib/supabase-server'

// Mock dependencies
vi.mock('@/lib/openai')
vi.mock('@/lib/auth-utils')
vi.mock('@/lib/supabase-server')
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock implementations
const mockGenerateRecipe = generateRecipe as ReturnType<typeof vi.fn>
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
      // Mock successful AI generation
      const mockRecipe = {
        title: 'Test Chicken Burrito',
        description: 'A delicious test recipe',
        ingredients: [
          { name: 'chicken breast', quantity: '200g' },
          { name: 'tortilla', quantity: '2' }
        ],
        instructions: [
          'Cook the chicken',
          'Warm the tortillas',
          'Assemble the burrito'
        ],
        prep_time: 15,
        cook_time: 20,
        total_time: 35,
        servings: 2,
        difficulty: 'easy' as const,
        cuisine_type: 'Mexican',
        dietary_tags: ['high-protein'],
        calories_per_serving: 450
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
      expect(mockGenerateRecipe).toHaveBeenCalledWith({
        prompt: 'chicken burrito',
        dietaryPreferences: [],
        allergens: []
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
        ingredients: [{ name: 'test ingredient' }],
        instructions: ['test instruction'],
        prep_time: 10,
        cook_time: 15,
        difficulty: 'easy' as const
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
        ingredients: [{ name: 'test ingredient' }],
        instructions: ['test instruction'],
        difficulty: 'easy' as const
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
      expect(mockGenerateRecipe).toHaveBeenCalledWith({
        prompt: 'healthy recipe',
        dietaryPreferences: ['vegetarian', 'high-protein'],
        allergens: ['nuts', 'dairy']
      })
    })
  })
}) 