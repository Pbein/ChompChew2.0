import { describe, it, expect, vi } from 'vitest'
import { RecipeGenerationService } from '@/features/core/services/recipeGenerationService'
import { CacheService } from '@/features/core/services/cacheService'
import { GET as healthGET } from '@/app/api/health/route'
import { POST as generatePOST } from '@/app/api/recipes/generate/route'
import { NextRequest } from 'next/server'

// Mock external dependencies
vi.mock('@/features/core/services/cacheService', () => ({
  CacheService: {
    healthCheck: vi.fn()
  }
}))

vi.mock('@/features/core/services/recipeGenerationService', () => ({
  RecipeGenerationService: {
    generateRecipe: vi.fn(),
    estimateTokenCost: vi.fn()
  },
  RecipeGenerationInputSchema: {
    safeParse: vi.fn()
  }
}))

vi.mock('@/lib/supabase-server', () => ({
  createRouteHandlerClient: vi.fn(),
  createServerComponentClient: vi.fn()
}))

vi.mock('@/lib/middleware/rateLimiter', () => ({
  checkRateLimit: vi.fn(),
  RATE_LIMIT_CONFIGS: {
    api: { limit: 100, window: 3600 },
    user: { limit: 50, window: 3600 }
  }
}))

describe('Full Stack Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('API Integration Flow', () => {
    it('should integrate health check API with real services', async () => {
      // Mock successful health checks
      vi.mocked(CacheService.healthCheck).mockResolvedValue({
        redis: true,
        message: 'Redis is healthy'
      })

      // Mock successful Supabase client
      const mockSupabaseClient = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            limit: vi.fn().mockResolvedValue({ error: null })
          }))
        }))
      }

      const { createServerComponentClient } = await import('@/lib/supabase-server')
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabaseClient as any)

      const response = await healthGET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(data.services.redis.redis).toBe(true)
      expect(data.services.supabase.supabase).toBe(true)
      expect(data.services.app.app).toBe(true)
    })

    it('should integrate recipe generation API with real services', async () => {
      // Mock successful rate limiting
      const { checkRateLimit } = await import('@/lib/middleware/rateLimiter')
      vi.mocked(checkRateLimit).mockResolvedValue({
        allowed: true,
        remaining: 9,
        resetTime: Date.now() + 3600000
      })

      // Mock successful input validation
      const { RecipeGenerationInputSchema } = await import('@/features/core/services/recipeGenerationService')
      vi.mocked(RecipeGenerationInputSchema.safeParse).mockReturnValue({
        success: true,
        data: {
          ingredients: ['chicken', 'rice'],
          dietaryRestrictions: [],
          allergies: [],
          difficulty: 'medium' as const,
          servings: 4,
          equipment: []
        }
      })

      // Mock successful recipe generation
      const mockRecipe = {
        title: 'Chicken Rice Bowl',
        description: 'A delicious chicken rice bowl',
        ingredients: [
          { name: 'chicken', amount: '2', unit: 'cups' },
          { name: 'rice', amount: '1', unit: 'cup' }
        ],
        instructions: [
          { step: 1, instruction: 'Cook rice' },
          { step: 2, instruction: 'Cook chicken' }
        ],
        nutrition: { calories: 450, protein: 35, carbs: 40, fat: 12 },
        metadata: {
          prepTime: 15,
          cookTime: 25,
          totalTime: 40,
          servings: 4,
          difficulty: 'medium' as const
        }
      }

      vi.mocked(RecipeGenerationService.generateRecipe).mockResolvedValue(mockRecipe)
      vi.mocked(RecipeGenerationService.estimateTokenCost).mockReturnValue(120)

      // Mock Supabase client
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'test-user' } },
            error: null
          })
        },
        from: vi.fn(() => ({
          insert: vi.fn().mockResolvedValue({ data: null, error: null })
        }))
      }

      const { createRouteHandlerClient } = await import('@/lib/supabase-server')
      vi.mocked(createRouteHandlerClient).mockResolvedValue(mockSupabaseClient as any)

      const request = new NextRequest('http://localhost:3000/api/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({
          ingredients: ['chicken', 'rice'],
          servings: 4
        })
      })

      const response = await generatePOST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.recipe.title).toBe('Chicken Rice Bowl')
      expect(data.metadata.estimatedTokens).toBe(120)
      expect(data.metadata.userAuthenticated).toBe(true)

      // Verify real service interactions
      expect(RecipeGenerationService.generateRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          ingredients: ['chicken', 'rice'],
          difficulty: 'medium',
          servings: 4
        })
      )
      expect(checkRateLimit).toHaveBeenCalled()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes')
    })
  })

  describe('Service Integration', () => {
    it('should test cache service health check', async () => {
      vi.mocked(CacheService.healthCheck).mockResolvedValue({
        redis: true,
        message: 'Redis is operational'
      })

      const result = await CacheService.healthCheck()

      expect(result.redis).toBe(true)
      expect(result.message).toBe('Redis is operational')
    })

    it('should test recipe generation service', async () => {
      const mockRecipe = {
        title: 'Test Recipe',
        description: 'A test recipe',
        ingredients: [{ name: 'test ingredient', amount: '1', unit: 'cup' }],
        instructions: [{ step: 1, instruction: 'Test step' }],
        nutrition: { calories: 300 },
        metadata: {
          prepTime: 10,
          cookTime: 15,
          totalTime: 25,
          servings: 2,
          difficulty: 'easy' as const
        }
      }

      vi.mocked(RecipeGenerationService.generateRecipe).mockResolvedValue(mockRecipe)

      const input = {
        ingredients: ['test ingredient'],
        dietaryRestrictions: [],
        allergies: [],
        difficulty: 'easy' as const,
        servings: 2,
        equipment: []
      }

      const result = await RecipeGenerationService.generateRecipe(input)

      expect(result.title).toBe('Test Recipe')
      expect(result.ingredients).toHaveLength(1)
      expect(result.instructions).toHaveLength(1)
      expect(RecipeGenerationService.generateRecipe).toHaveBeenCalledWith(input)
    })

    it('should test token cost estimation', () => {
      vi.mocked(RecipeGenerationService.estimateTokenCost).mockReturnValue(150)

      const input = {
        ingredients: ['chicken', 'rice', 'vegetables'],
        dietaryRestrictions: ['vegetarian'],
        allergies: ['nuts'],
        difficulty: 'medium' as const,
        servings: 4,
        equipment: ['stove', 'pan']
      }

      const cost = RecipeGenerationService.estimateTokenCost(input)

      expect(cost).toBe(150)
      expect(RecipeGenerationService.estimateTokenCost).toHaveBeenCalledWith(input)
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle service failures gracefully', async () => {
      // Mock service failure
      vi.mocked(CacheService.healthCheck).mockRejectedValue(new Error('Redis connection failed'))

      const { createServerComponentClient } = await import('@/lib/supabase-server')
      vi.mocked(createServerComponentClient).mockRejectedValue(new Error('Supabase error'))

      const response = await healthGET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('degraded')
    })

    it('should handle recipe generation failures', async () => {
      const { checkRateLimit } = await import('@/lib/middleware/rateLimiter')
      vi.mocked(checkRateLimit).mockResolvedValue({
        allowed: true,
        remaining: 9,
        resetTime: Date.now() + 3600000
      })

      const { RecipeGenerationInputSchema } = await import('@/features/core/services/recipeGenerationService')
      vi.mocked(RecipeGenerationInputSchema.safeParse).mockReturnValue({
        success: true,
        data: {
          ingredients: ['test'],
          dietaryRestrictions: [],
          allergies: [],
          difficulty: 'easy' as const,
          servings: 4,
          equipment: []
        }
      })

      vi.mocked(RecipeGenerationService.generateRecipe).mockRejectedValue(
        new Error('AI service unavailable')
      )

      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null })
        }
      }

      const { createRouteHandlerClient } = await import('@/lib/supabase-server')
      vi.mocked(createRouteHandlerClient).mockResolvedValue(mockSupabaseClient as any)

      const request = new NextRequest('http://localhost:3000/api/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({ ingredients: ['test'], servings: 4 })
      })

      const response = await generatePOST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Generation failed')
    })
  })
}) 