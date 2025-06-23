import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as healthGET } from '@/app/api/health/route'
import { POST as generatePOST, GET as generateGET } from '@/app/api/recipes/generate/route'
import { RecipeGenerationService } from '@/features/core/services/recipeGenerationService'
import { CacheService } from '@/features/core/services/cacheService'

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
  createServerComponentClient: vi.fn(),
  createRouteHandlerClient: vi.fn()
}))

vi.mock('@/lib/middleware/rateLimiter', () => ({
  checkRateLimit: vi.fn(),
  RATE_LIMIT_CONFIGS: {
    AI_RECIPE_GENERATION: { requests: 10, windowSeconds: 3600 }
  }
}))

vi.mock('@/lib/utils/ip', () => ({
  getClientIP: vi.fn(() => '192.168.1.1')
}))

describe('API Endpoints - Real Route Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock process methods for health checks
    vi.spyOn(process, 'uptime').mockReturnValue(12345)
    vi.spyOn(process, 'memoryUsage').mockReturnValue({
      rss: 100 * 1024 * 1024,
      heapTotal: 50 * 1024 * 1024,
      heapUsed: 30 * 1024 * 1024,
      external: 5 * 1024 * 1024,
      arrayBuffers: 2 * 1024 * 1024
    })
  })

  describe('/api/health', () => {
    it('should return healthy status when all services are up', async () => {
      // Mock successful health checks
      const mockCacheService = vi.mocked(CacheService.healthCheck)
      mockCacheService.mockResolvedValue({ redis: true, message: 'Redis is healthy' })

             // Mock successful Supabase client
       const mockSupabaseClient = {
         from: vi.fn(() => ({
           select: vi.fn(() => ({
             limit: vi.fn(() => ({
               then: vi.fn((callback) => callback({ error: null }))
             }))
           }))
         }))
       }

       const { createServerComponentClient } = await import('@/lib/supabase-server')
       vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabaseClient as unknown as any)

      const response = await healthGET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(data.services.redis.redis).toBe(true)
      expect(data.services.supabase.supabase).toBe(true)
      expect(data.services.app.app).toBe(true)
      expect(data.timestamp).toBeDefined()
    })

    it('should return degraded status when services fail', async () => {
      // Mock failed Redis health check
      const mockCacheService = vi.mocked(CacheService.healthCheck)
      mockCacheService.mockRejectedValue(new Error('Redis connection failed'))

      // Mock failed Supabase client
      const mockSupabaseClient = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            limit: vi.fn(() => ({
              then: vi.fn((callback) => callback({ error: { message: 'Connection failed' } }))
            }))
          }))
        }))
      }

      const { createServerComponentClient } = await import('@/lib/supabase-server')
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabaseClient as any)

      const response = await healthGET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('degraded')
      expect(data.services.redis.redis).toBe(false)
      expect(data.services.supabase.supabase).toBe(false)
    })

    it('should handle unexpected errors gracefully', async () => {
      // Mock CacheService to throw an error
      const mockCacheService = vi.mocked(CacheService.healthCheck)
      mockCacheService.mockRejectedValue(new Error('Unexpected error'))

      // Mock createServerComponentClient to throw
      const { createServerComponentClient } = await import('@/lib/supabase-server')
      vi.mocked(createServerComponentClient).mockRejectedValue(new Error('Supabase error'))

      const response = await healthGET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('degraded')
    })
  })

  describe('/api/recipes/generate', () => {
    it('should return service info on GET request', async () => {
      const response = await generateGET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.service).toBe('Recipe Generation API')
      expect(data.status).toBe('operational')
      expect(data.endpoints.POST).toContain('Generate a new recipe')
      expect(data.rateLimit.ai_generation).toBe('10 requests per hour')
    })

    it('should generate recipe with valid input', async () => {
      // Mock rate limiting check
      const { checkRateLimit } = await import('@/lib/middleware/rateLimiter')
      vi.mocked(checkRateLimit).mockResolvedValue({
        allowed: true,
        remaining: 9,
        resetTime: Date.now() + 3600000
      })

      // Mock input validation
      const { RecipeGenerationInputSchema } = await import('@/features/core/services/recipeGenerationService')
      vi.mocked(RecipeGenerationInputSchema.safeParse).mockReturnValue({
        success: true,
        data: {
          dietaryRestrictions: ['vegetarian'],
          allergies: ['nuts'],
          ingredients: ['flour', 'sugar'],
          difficulty: 'easy' as const,
          servings: 4,
          equipment: []
        }
      })

             // Mock recipe generation
       const mockRecipe = {
         title: 'Vegetarian Cookies',
         description: 'Delicious vegetarian cookies',
          ingredients: [
           { name: 'flour', amount: '2', unit: 'cups' },
           { name: 'sugar', amount: '1', unit: 'cup' }
          ],
          instructions: [
           { step: 1, instruction: 'Mix dry ingredients' },
           { step: 2, instruction: 'Add wet ingredients' }
         ],
         nutrition: { calories: 450, protein: 8, carbs: 60, fat: 18 },
         metadata: {
          prepTime: 15,
          cookTime: 25,
           totalTime: 40,
           servings: 4,
           difficulty: 'easy' as const,
           cuisineType: 'American',
           mealType: 'dessert'
         },
         tags: ['vegetarian', 'dessert']
       }

      const mockRecipeService = vi.mocked(RecipeGenerationService.generateRecipe)
      mockRecipeService.mockResolvedValue(mockRecipe)

      const mockEstimateTokens = vi.mocked(RecipeGenerationService.estimateTokenCost)
      mockEstimateTokens.mockReturnValue(150)

      // Mock Supabase auth (no user)
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null })
        }
      }

      const { createRouteHandlerClient } = await import('@/lib/supabase-server')
      vi.mocked(createRouteHandlerClient).mockResolvedValue(mockSupabaseClient as any)

      // Create mock request
      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({
          dietary: ['vegetarian'],
          allergens: ['nuts'],
          ingredients: ['flour', 'sugar'],
          calorieGoal: 1800,
          servings: 4
        })
      })

      const response = await generatePOST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.recipe.title).toBe('Vegetarian Cookies')
      expect(data.recipe.nutrition.calories).toBe(450)
      expect(data.metadata.estimatedTokens).toBe(150)
      expect(data.metadata.userAuthenticated).toBe(false)
    })

    it('should handle rate limiting', async () => {
      // Mock rate limit exceeded
      const { checkRateLimit } = await import('@/lib/middleware/rateLimiter')
      vi.mocked(checkRateLimit).mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 3600000
      })

      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({ ingredients: ['flour'] })
      })

      const response = await generatePOST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe('Rate limit exceeded')
      expect(data.message).toContain('Too many recipe generation requests')
      expect(data.retryAfter).toBeDefined()
    })

    it('should handle validation errors', async () => {
      // Mock rate limiting check (allowed)
      const { checkRateLimit } = await import('@/lib/middleware/rateLimiter')
      vi.mocked(checkRateLimit).mockResolvedValue({
        allowed: true,
        remaining: 9,
        resetTime: Date.now() + 3600000
      })

      // Mock input validation failure
      const { RecipeGenerationInputSchema } = await import('@/features/core/services/recipeGenerationService')
      vi.mocked(RecipeGenerationInputSchema.safeParse).mockReturnValue({
        success: false,
        error: {
          errors: [
            { message: 'ingredients is required', path: ['ingredients'] },
            { message: 'servings must be a positive number', path: ['servings'] }
          ]
        }
      })

      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({}) // Invalid empty body
      })

      const response = await generatePOST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid input')
      expect(data.message).toContain('check your recipe generation parameters')
      expect(data.details).toHaveLength(2)
    })

    it('should handle recipe generation service errors', async () => {
      // Mock rate limiting check (allowed)
      const { checkRateLimit } = await import('@/lib/middleware/rateLimiter')
      vi.mocked(checkRateLimit).mockResolvedValue({
        allowed: true,
        remaining: 9,
        resetTime: Date.now() + 3600000
      })

      // Mock input validation success
      const { RecipeGenerationInputSchema } = await import('@/features/core/services/recipeGenerationService')
      vi.mocked(RecipeGenerationInputSchema.safeParse).mockReturnValue({
        success: true,
        data: { ingredients: ['flour'], servings: 4 }
      })

      // Mock recipe generation failure
      const mockRecipeService = vi.mocked(RecipeGenerationService.generateRecipe)
      mockRecipeService.mockRejectedValue(new Error('API key not configured'))

      // Mock Supabase auth
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null })
        }
      }

      const { createRouteHandlerClient } = await import('@/lib/supabase-server')
      vi.mocked(createRouteHandlerClient).mockResolvedValue(mockSupabaseClient as any)

      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({ ingredients: ['flour'], servings: 4 })
      })

      const response = await generatePOST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.error).toBe('Configuration error')
      expect(data.message).toContain('temporarily unavailable')
    })

    it('should save recipe for authenticated users', async () => {
      // Mock rate limiting check
      const { checkRateLimit } = await import('@/lib/middleware/rateLimiter')
      vi.mocked(checkRateLimit).mockResolvedValue({
        allowed: true,
        remaining: 9,
        resetTime: Date.now() + 3600000
      })

      // Mock input validation
      const { RecipeGenerationInputSchema } = await import('@/features/core/services/recipeGenerationService')
      vi.mocked(RecipeGenerationInputSchema.safeParse).mockReturnValue({
        success: true,
        data: { ingredients: ['flour'], servings: 4 }
      })

      // Mock recipe generation
      const mockRecipe = {
        title: 'Test Recipe',
        description: 'A test recipe',
        ingredients: [{ name: 'flour', amount: 2, unit: 'cups' }],
        instructions: [{ step: 1, instruction: 'Mix ingredients' }],
        nutrition: { calories: 300, protein: 10, carbs: 40, fat: 12 },
        metadata: {
          prepTime: 10,
          cookTime: 20,
          totalTime: 30,
          servings: 4,
          difficulty: 'easy',
          cuisineType: 'American',
          mealType: 'lunch'
        },
        tags: ['easy']
      }

      const mockRecipeService = vi.mocked(RecipeGenerationService.generateRecipe)
      mockRecipeService.mockResolvedValue(mockRecipe)

      const mockEstimateTokens = vi.mocked(RecipeGenerationService.estimateTokenCost)
      mockEstimateTokens.mockReturnValue(100)

      // Mock authenticated user
      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123', email: 'test@example.com' } },
            error: null
          })
        },
        from: vi.fn(() => ({
          insert: vi.fn().mockResolvedValue({ error: null })
        }))
      }

      const { createRouteHandlerClient } = await import('@/lib/supabase-server')
      vi.mocked(createRouteHandlerClient).mockResolvedValue(mockSupabaseClient as any)

      const mockRequest = new NextRequest('http://localhost:3000/api/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({ ingredients: ['flour'], servings: 4 })
      })

      const response = await generatePOST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.metadata.userAuthenticated).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes')
    })
  })
}) 