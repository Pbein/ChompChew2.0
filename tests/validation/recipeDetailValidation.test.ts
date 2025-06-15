import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase first before importing anything else
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }
}))

// Import after mocking
const { fetchRecipe } = await import('@/lib/recipes')
const { supabase } = await import('@/lib/supabase')

describe('Recipe Detail Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Database Success Cases', () => {
    it('should return database recipe when found', async () => {
      const mockDbRecipe = {
        id: 'db-recipe-1',
        title: 'Database Recipe',
        image_url: 'https://example.com/image.jpg',
        prep_time: 30,
        servings: 4,
        difficulty: 'medium',
        dietary_tags: ['vegetarian'],
        calories_per_serving: 350,
        safety_validated: true
      }

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockDbRecipe,
        error: null
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: mockSingle
          })
        })
      } as any)

      const result = await fetchRecipe('db-recipe-1')
      
      expect(result).toEqual(mockDbRecipe)
      expect(supabase.from).toHaveBeenCalledWith('recipes')
    })
  })

  describe('Database Error Fallback Cases', () => {
    it('should return fallback recipe when database fails', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Recipe not found' }
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: mockSingle
          })
        })
      } as any)

      // Test with known fallback recipe ID
      const result = await fetchRecipe('550e8400-e29b-41d4-a716-446655440001')
      
      expect(result).toBeDefined()
      expect(result?.id).toBe('550e8400-e29b-41d4-a716-446655440001')
      expect(result?.title).toBe('Mediterranean Quinoa Bowl')
      expect(result?.ingredients).toBeDefined()
      expect(result?.instructions).toBeDefined()
    })

    it('should return null for unknown recipe ID when database fails', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Recipe not found' }
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: mockSingle
          })
        })
      } as any)

      const result = await fetchRecipe('unknown-recipe-id')
      
      expect(result).toBeNull()
    })

    it('should handle connection errors gracefully', async () => {
      const mockSingle = vi.fn().mockRejectedValue(new Error('Connection failed'))

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: mockSingle
          })
        })
      } as any)

      // Should return fallback recipe for known ID
      const result = await fetchRecipe('550e8400-e29b-41d4-a716-446655440002')
      
      expect(result).toBeDefined()
      expect(result?.id).toBe('550e8400-e29b-41d4-a716-446655440002')
      expect(result?.title).toBe('Honey Garlic Salmon')
    })
  })

  describe('Fallback Recipe Validation', () => {
    beforeEach(() => {
      // Mock database to always fail so we test fallback recipes
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database unavailable' }
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: mockSingle
          })
        })
      } as any)
    })

    it('should have proper UUID format for all fallback recipes', async () => {
      const fallbackIds = [
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440003',
        '550e8400-e29b-41d4-a716-446655440004',
        '550e8400-e29b-41d4-a716-446655440005'
      ]

      for (const id of fallbackIds) {
        const result = await fetchRecipe(id)
        expect(result).toBeDefined()
        expect(result?.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        expect(result?.id).not.toMatch(/^sample-\d+$/) // Should not be old "sample-X" format
      }
    })

    it('should have complete recipe data structure', async () => {
      const result = await fetchRecipe('550e8400-e29b-41d4-a716-446655440001')
      
      expect(result).toBeDefined()
      
      // Required fields
      expect(result?.id).toBeDefined()
      expect(result?.title).toBeDefined()
      expect(typeof result?.title).toBe('string')
      
      // Optional but expected fields for detail view
      expect(result?.description).toBeDefined()
      expect(result?.image_url).toBeDefined()
      expect(result?.prep_time).toBeDefined()
      expect(result?.servings).toBeDefined()
      expect(result?.difficulty).toBeDefined()
      expect(result?.dietary_tags).toBeDefined()
      expect(result?.calories_per_serving).toBeDefined()
      expect(result?.nutrition_info).toBeDefined()
      expect(result?.ingredients).toBeDefined()
      expect(result?.instructions).toBeDefined()
    })

    it('should have proper ingredients structure', async () => {
      const result = await fetchRecipe('550e8400-e29b-41d4-a716-446655440001')
      
      expect(result?.ingredients).toBeDefined()
      expect(Array.isArray(result?.ingredients)).toBe(true)
      
      if (result?.ingredients && result.ingredients.length > 0) {
        const ingredient = result.ingredients[0]
        expect(ingredient).toHaveProperty('name')
        expect(ingredient).toHaveProperty('amount')
        expect(typeof ingredient.name).toBe('string')
        expect(typeof ingredient.amount).toBe('string')
      }
    })

    it('should have proper instructions structure', async () => {
      const result = await fetchRecipe('550e8400-e29b-41d4-a716-446655440001')
      
      expect(result?.instructions).toBeDefined()
      expect(Array.isArray(result?.instructions)).toBe(true)
      
      if (result?.instructions && result.instructions.length > 0) {
        const instruction = result.instructions[0]
        expect(instruction).toHaveProperty('step')
        expect(instruction).toHaveProperty('text')
        expect(typeof instruction.step).toBe('number')
        expect(typeof instruction.text).toBe('string')
      }
    })

    it('should have valid nutrition info', async () => {
      const result = await fetchRecipe('550e8400-e29b-41d4-a716-446655440001')
      
      expect(result?.nutrition_info).toBeDefined()
      expect(typeof result?.nutrition_info).toBe('object')
      
      if (result?.nutrition_info) {
        // Should have numeric values
        Object.values(result.nutrition_info).forEach(value => {
          expect(typeof value).toBe('number')
        })
      }
    })
  })

  describe('Type Compatibility', () => {
    it('should return data compatible with recipe detail page', async () => {
      // Force fallback by making database fail
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database unavailable' }
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: mockSingle
          })
        })
      } as any)

      const result = await fetchRecipe('550e8400-e29b-41d4-a716-446655440001')
      
      // Should be able to cast to expected types without errors
      expect(() => {
        const nutrition = result?.nutrition_info as Record<string, number> | null
        const instructions = result?.instructions as { step: number; text: string }[] | undefined
        const ingredients = result?.ingredients as { name: string; amount: string }[] | undefined
        
        // These should all work without throwing
        expect(nutrition).toBeDefined()
        expect(instructions).toBeDefined()
        expect(ingredients).toBeDefined()
      }).not.toThrow()
    })
  })

  describe('Error Logging', () => {
    it('should log appropriate messages for fallback usage', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      // Mock database error
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database unavailable' }
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: mockSingle
          })
        })
      } as any)

      await fetchRecipe('550e8400-e29b-41d4-a716-446655440001')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Using fallback recipe for ID: 550e8400-e29b-41d4-a716-446655440001')
      )
      
      consoleSpy.mockRestore()
    })
  })
}) 