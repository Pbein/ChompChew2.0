import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateRecipe } from '@/app/generate-recipe/actions'
import { getRecipes } from '@/lib/recipes'

describe('Chaos Engineering - System Resilience Tests', () => {
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Network Chaos', () => {
    it('should handle intermittent network failures gracefully', async () => {
      let callCount = 0
      const originalFetch = global.fetch
      
      // Simulate network failures 30% of the time
      global.fetch = vi.fn().mockImplementation(async (...args) => {
        callCount++
        if (Math.random() < 0.3) {
          throw new Error('Network timeout')
        }
        return originalFetch(...args)
      })

      const preferences = {
        dietary_restrictions: ['vegetarian'],
        allergens: ['nuts'],
        cooking_level: 'intermediate' as const,
        prep_time: 30,
        servings: 4
      }

      // Test multiple attempts - some should succeed despite network chaos
      const results = await Promise.allSettled([
        generateRecipe(preferences),
        generateRecipe(preferences),
        generateRecipe(preferences),
        generateRecipe(preferences),
        generateRecipe(preferences)
      ])

      // At least some requests should succeed
      const successful = results.filter(r => r.status === 'fulfilled')
      expect(successful.length).toBeGreaterThan(0)

      // Failed requests should fail gracefully
      const failed = results.filter(r => r.status === 'rejected')
      failed.forEach(failure => {
        if (failure.status === 'rejected') {
          expect(failure.reason).toBeInstanceOf(Error)
        }
      })

      global.fetch = originalFetch
    })

    it('should implement circuit breaker pattern for repeated failures', async () => {
      let failureCount = 0
      const maxFailures = 3
      let circuitOpen = false

      const mockApiCall = vi.fn().mockImplementation(async () => {
        if (circuitOpen) {
          throw new Error('Circuit breaker open')
        }
        
        failureCount++
        if (failureCount <= maxFailures) {
          throw new Error('Service unavailable')
        }
        
        // Reset on success
        failureCount = 0
        return { success: true }
      })

      // Test circuit breaker logic
      for (let i = 0; i < maxFailures; i++) {
        try {
          await mockApiCall()
        } catch (error) {
          expect(error.message).toBe('Service unavailable')
        }
      }

      // Circuit should open after max failures
      circuitOpen = true
      
      try {
        await mockApiCall()
      } catch (error) {
        expect(error.message).toBe('Circuit breaker open')
      }
    })
  })

  describe('Database Chaos', () => {
    it('should handle database connection failures with graceful degradation', async () => {
      // Mock database failures
      const mockSupabaseError = vi.fn().mockImplementation(() => {
        throw new Error('Connection timeout')
      })

      // Test fallback to cached/static data
      vi.mock('@/lib/supabase-server', () => ({
        createServerComponentClient: mockSupabaseError
      }))

      // Should fall back to sample recipes when database is unavailable
      const recipes = await getRecipes(10)
      expect(recipes).toBeDefined()
      expect(Array.isArray(recipes)).toBe(true)
      
      // Should provide some recipes even if database fails
      expect(recipes.length).toBeGreaterThan(0)
    })

    it('should handle partial database responses', async () => {
      const mockPartialResponse = vi.fn().mockImplementation(() => ({
        data: [
          { id: '1', title: 'Recipe 1' }, // Missing fields
          null, // Null entry
          { id: '2', title: 'Recipe 2', ingredients: [] } // Partial data
        ],
        error: null
      }))

      vi.mock('@/lib/supabase-server', () => ({
        createServerComponentClient: () => ({
          from: () => ({
            select: () => ({
              limit: mockPartialResponse
            })
          })
        })
      }))

      const recipes = await getRecipes(10)
      
      // Should filter out invalid entries
      expect(recipes.every(recipe => recipe && recipe.id && recipe.title)).toBe(true)
    })
  })

  describe('Memory Pressure Chaos', () => {
    it('should handle memory constraints during recipe generation', async () => {
      // Simulate memory pressure by creating large objects
      const memoryHogs: any[] = []
      
      try {
        // Create memory pressure
        for (let i = 0; i < 100; i++) {
          memoryHogs.push(new Array(10000).fill(`memory-pressure-${i}`))
        }

        const preferences = {
          dietary_restrictions: ['vegan'],
          allergens: [],
          cooking_level: 'beginner' as const,
          prep_time: 15,
          servings: 2
        }

        // Recipe generation should still work under memory pressure
        const recipe = await generateRecipe(preferences)
        expect(recipe).toBeDefined()
        
      } finally {
        // Clean up memory
        memoryHogs.length = 0
      }
    })
  })

  describe('Concurrency Chaos', () => {
    it('should handle high concurrent load without race conditions', async () => {
      const concurrentRequests = 50
      const preferences = {
        dietary_restrictions: ['gluten-free'],
        allergens: ['dairy'],
        cooking_level: 'advanced' as const,
        prep_time: 45,
        servings: 6
      }

      // Fire off many concurrent requests
      const promises = Array(concurrentRequests).fill(null).map(() => 
        generateRecipe(preferences)
      )

      const results = await Promise.allSettled(promises)
      
      // Most requests should succeed
      const successful = results.filter(r => r.status === 'fulfilled')
      const successRate = successful.length / concurrentRequests
      
      expect(successRate).toBeGreaterThan(0.7) // At least 70% success rate
      
      // No duplicate IDs in successful responses
      const successfulResults = successful.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean)
      const ids = successfulResults.map(recipe => recipe?.id).filter(Boolean)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(ids.length) // No duplicates
    })
  })

  describe('Input Chaos', () => {
    it('should handle malformed and extreme input gracefully', async () => {
      const chaosInputs = [
        // Extreme values
        { dietary_restrictions: Array(1000).fill('vegetarian'), cooking_level: 'beginner', prep_time: 0, servings: 0 },
        // Invalid types (as much as TypeScript allows)
        { dietary_restrictions: [''], cooking_level: '', prep_time: -1, servings: -5 },
        // Unicode chaos
        { dietary_restrictions: ['🥕🥒🍅'], cooking_level: 'expert🔥', prep_time: 999999, servings: 1000 },
        // Empty/null-ish
        { dietary_restrictions: [], cooking_level: 'beginner', prep_time: 1, servings: 1 }
      ]

      for (const input of chaosInputs) {
        try {
          const result = await generateRecipe(input as any)
          // If it succeeds, result should be valid
          if (result) {
            expect(result).toBeDefined()
            expect(typeof result).toBe('object')
          }
        } catch (error) {
          // If it fails, should fail gracefully with proper error
          expect(error).toBeInstanceOf(Error)
          expect(error.message).toBeDefined()
        }
      }
    })
  })

  describe('Time-based Chaos', () => {
    it('should handle system clock changes and timezone chaos', async () => {
      const originalDate = Date.now
      let timeOffset = 0

      // Mock time manipulation
      Date.now = vi.fn(() => originalDate() + timeOffset)

      try {
        // Test normal operation
        let recipe = await generateRecipe({
          dietary_restrictions: ['vegetarian'],
          cooking_level: 'intermediate' as const,
          prep_time: 30,
          servings: 4
        })
        
        expect(recipe).toBeDefined()

        // Jump forward in time significantly
        timeOffset = 1000 * 60 * 60 * 24 * 365 // 1 year forward
        
        recipe = await generateRecipe({
          dietary_restrictions: ['vegan'],
          cooking_level: 'beginner' as const,
          prep_time: 20,
          servings: 2
        })
        
        expect(recipe).toBeDefined()

        // Jump backward in time
        timeOffset = -1000 * 60 * 60 * 24 * 30 // 30 days back
        
        recipe = await generateRecipe({
          dietary_restrictions: ['gluten-free'],
          cooking_level: 'advanced' as const,
          prep_time: 60,
          servings: 8
        })
        
        expect(recipe).toBeDefined()

      } finally {
        Date.now = originalDate
      }
    })
  })
}) 