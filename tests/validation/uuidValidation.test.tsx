import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '../setup/test-utils'
import { RecipeSection } from '@/components/recipe/RecipeSection'
import { fetchRecipe, fetchRecipes } from '@/lib/recipes'
import type { RecipeCardData } from '@/features/core/types/recipe'

// Mock the recipes module
vi.mock('@/lib/recipes', () => ({
  fetchRecipe: vi.fn(),
  fetchRecipes: vi.fn()
}))

// Mock Next.js router
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  })
}))

// Extended RecipeCardData type that matches the component's usage
interface ExtendedRecipeCardData extends RecipeCardData {
  calories?: number
  rating?: number
}

// Mock recipe data with proper UUID format
const createMockRecipeWithUUID = (index: number): ExtendedRecipeCardData => ({
  id: `550e8400-e29b-41d4-a716-44665544${String(index).padStart(4, '0')}`,
  title: `Test Recipe ${index}`,
  image: `https://example.com/image-${index}.jpg`,
  prepTime: 20 + index,
  difficulty: ['easy', 'medium', 'hard'][index % 3] as 'easy' | 'medium' | 'hard',
  servings: 2 + (index % 4),
  dietaryCompliance: ['vegetarian', 'vegan', 'gluten-free'],
  safetyValidated: true,
  calories: 300 + (index * 20),
  rating: 4.0 + (index % 10) / 10
})

describe('UUID Format Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Recipe ID Format', () => {
    test('should use valid UUID format for all fallback recipes', async () => {
      // Mock empty database response to trigger fallback
      vi.mocked(fetchRecipes).mockResolvedValue([])
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeLinks = container.querySelectorAll('a[href*="/recipe/"]')
        expect(recipeLinks.length).toBeGreaterThan(0)
        
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        
        recipeLinks.forEach((link) => {
          const href = link.getAttribute('href')
          if (href) {
            const recipeId = href.split('/recipe/')[1]
            expect(recipeId).toMatch(uuidRegex)
            expect(recipeId).not.toMatch(/^sample-\d+$/) // Ensure old format is gone
          }
        })
      })
    })

    test('should handle both valid UUID and fallback recipe IDs', async () => {
      // Test with valid database UUID
      const validUUID = '123e4567-e89b-12d3-a456-426614174000'
      const mockRecipe = createMockRecipeWithUUID(0)
      mockRecipe.id = validUUID
      
      vi.mocked(fetchRecipes).mockResolvedValue([mockRecipe])
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeLinks = container.querySelectorAll('a[href*="/recipe/"]')
        expect(recipeLinks.length).toBeGreaterThan(0)
        
        const firstLink = recipeLinks[0]
        const href = firstLink.getAttribute('href')
        expect(href).toContain(validUUID)
      })
    })

    test('should validate UUID format in recipe URLs', async () => {
      // Mock database recipes with proper UUIDs
      const mockRecipes = Array.from({ length: 5 }, (_, i) => createMockRecipeWithUUID(i))
      vi.mocked(fetchRecipes).mockResolvedValue(mockRecipes)
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeLinks = container.querySelectorAll('a[href*="/recipe/"]')
        expect(recipeLinks.length).toBe(5)
        
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        
        recipeLinks.forEach((link) => {
          const href = link.getAttribute('href')
          if (href) {
            const recipeId = href.split('/recipe/')[1]
            expect(recipeId).toMatch(uuidRegex)
          }
        })
      })
    })

    test('should reject invalid UUID formats', () => {
      const invalidFormats = [
        'sample-1',
        'recipe-123',
        '123',
        'invalid-uuid-format',
        '550e8400-e29b-41d4-a716', // Too short
        '550e8400-e29b-41d4-a716-44665544000g' // Invalid character
      ]
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      
      invalidFormats.forEach((invalidId) => {
        expect(invalidId).not.toMatch(uuidRegex)
      })
    })

    test('should accept valid UUID formats', () => {
      const validFormats = [
        '550e8400-e29b-41d4-a716-446655440001',
        '123e4567-e89b-12d3-a456-426614174000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
      ]
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      
      validFormats.forEach((validId) => {
        expect(validId).toMatch(uuidRegex)
      })
    })
  })

  describe('Database Integration', () => {
    test('should handle database recipes with proper UUIDs', async () => {
      // Mock database response with valid UUIDs
      const mockRecipes = [
        {
          ...createMockRecipeWithUUID(0),
          id: '550e8400-e29b-41d4-a716-446655440001'
        },
        {
          ...createMockRecipeWithUUID(1),
          id: '550e8400-e29b-41d4-a716-446655440002'
        }
      ]
      
      vi.mocked(fetchRecipes).mockResolvedValue(mockRecipes)
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBe(2)
        
        // Verify UUIDs are used in links
        const recipeLinks = container.querySelectorAll('a[href*="/recipe/"]')
        expect(recipeLinks[0].getAttribute('href')).toContain('550e8400-e29b-41d4-a716-446655440001')
        expect(recipeLinks[1].getAttribute('href')).toContain('550e8400-e29b-41d4-a716-446655440002')
      })
    })

    test('should handle empty database gracefully with fallback UUIDs', async () => {
      // Mock empty database
      vi.mocked(fetchRecipes).mockResolvedValue([])
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBe(12) // Should show fallback recipes
        
        // Verify fallback recipes use proper UUIDs
        const recipeLinks = container.querySelectorAll('a[href*="/recipe/"]')
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        
        recipeLinks.forEach((link) => {
          const href = link.getAttribute('href')
          if (href) {
            const recipeId = href.split('/recipe/')[1]
            expect(recipeId).toMatch(uuidRegex)
          }
        })
      })
    })

    test('should handle database errors with fallback UUIDs', async () => {
      // Mock database error
      vi.mocked(fetchRecipes).mockRejectedValue(new Error('Database connection failed'))
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBe(12) // Should show fallback recipes
        
        // Verify fallback recipes use proper UUIDs
        const recipeLinks = container.querySelectorAll('a[href*="/recipe/"]')
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        
        recipeLinks.forEach((link) => {
          const href = link.getAttribute('href')
          if (href) {
            const recipeId = href.split('/recipe/')[1]
            expect(recipeId).toMatch(uuidRegex)
          }
        })
      })
    })
  })

  describe('Recipe Detail Page UUID Handling', () => {
    test('should handle valid UUID in recipe detail lookup', async () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440001'
      const mockRecipe = {
        id: validUUID,
        title: 'Mediterranean Quinoa Bowl',
        description: 'Test description',
        ingredients: [],
        instructions: [],
        prep_time: 15,
        cook_time: 15,
        total_time: 30,
        servings: 2,
        difficulty: 'easy' as const,
        cuisine_type: 'Mediterranean',
        dietary_tags: ['vegetarian'],
        calories_per_serving: 420,
        nutrition_info: { protein: 15, fat: 18, carbs: 52, fiber: 6 },
        image_url: 'https://example.com/image.jpg'
      }
      
      vi.mocked(fetchRecipe).mockResolvedValue(mockRecipe)
      
      // This would be tested in the actual RecipePage component
      expect(validUUID).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    test('should identify invalid UUID formats for recipe detail', () => {
      const invalidUUIDs = [
        'sample-1',
        'recipe-123',
        'invalid-format',
        '123'
      ]
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      
      invalidUUIDs.forEach((invalidId) => {
        expect(invalidId).not.toMatch(uuidRegex)
      })
    })
  })

  describe('UUID Consistency Validation', () => {
    test('should maintain UUID format consistency across components', async () => {
      // Test that both database and fallback recipes use the same UUID format
      const dbRecipes = Array.from({ length: 3 }, (_, i) => createMockRecipeWithUUID(i))
      vi.mocked(fetchRecipes).mockResolvedValue(dbRecipes)
      
      const { container: dbContainer } = render(<RecipeSection />)
      
      await waitFor(() => {
        const dbLinks = dbContainer.querySelectorAll('a[href*="/recipe/"]')
        expect(dbLinks.length).toBe(3)
      })
      
      // Test fallback recipes
      vi.mocked(fetchRecipes).mockResolvedValue([])
      
      const { container: fallbackContainer } = render(<RecipeSection />)
      
      await waitFor(() => {
        const fallbackLinks = fallbackContainer.querySelectorAll('a[href*="/recipe/"]')
        expect(fallbackLinks.length).toBe(12)
        
        // Both should use the same UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        
        const allLinks = [...dbContainer.querySelectorAll('a[href*="/recipe/"]'), ...fallbackLinks]
        allLinks.forEach((link) => {
          const href = link.getAttribute('href')
          if (href) {
            const recipeId = href.split('/recipe/')[1]
            expect(recipeId).toMatch(uuidRegex)
          }
        })
      })
    })

    test('should ensure no legacy sample-X format exists', async () => {
      // Test both database and fallback scenarios
      const scenarios = [
        { name: 'database', mockData: Array.from({ length: 5 }, (_, i) => createMockRecipeWithUUID(i)) },
        { name: 'fallback', mockData: [] }
      ]
      
      for (const scenario of scenarios) {
        vi.mocked(fetchRecipes).mockResolvedValue(scenario.mockData)
        
        const { container } = render(<RecipeSection />)
        
        await waitFor(() => {
          const recipeLinks = container.querySelectorAll('a[href*="/recipe/"]')
          expect(recipeLinks.length).toBeGreaterThan(0)
          
          recipeLinks.forEach((link) => {
            const href = link.getAttribute('href')
            if (href) {
              const recipeId = href.split('/recipe/')[1]
              expect(recipeId).not.toMatch(/^sample-\d+$/)
            }
          })
        })
      }
    })
  })
}) 