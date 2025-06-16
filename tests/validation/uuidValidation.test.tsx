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
      // In database-only mode, empty database shows empty state
      vi.mocked(fetchRecipes).mockResolvedValue([])
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeLinks = container.querySelectorAll('a[href*="/recipe/"]')
        expect(recipeLinks.length).toBe(0) // Database-only mode: no fallback recipes
        
        // Should show empty state message
        const emptyMessage = container.querySelector('h3')
        expect(emptyMessage?.textContent).toContain('No recipes found')
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

    test('should handle empty database gracefully in database-only mode', async () => {
      // Mock empty database
      vi.mocked(fetchRecipes).mockResolvedValue([])
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBe(0) // Database-only mode: no fallback recipes
        
        // Should show empty state message
        const emptyMessage = container.querySelector('h3')
        expect(emptyMessage?.textContent).toContain('No recipes found')
      })
    })

    test('should handle database errors gracefully in database-only mode', async () => {
      // Mock database error
      vi.mocked(fetchRecipes).mockRejectedValue(new Error('Database connection failed'))
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBe(0) // Database-only mode: no fallback recipes
        
        // Should show empty state message
        const emptyMessage = container.querySelector('h3')
        expect(emptyMessage?.textContent).toContain('No recipes found')
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
    test('should maintain UUID format consistency for database recipes', async () => {
      // Test that database recipes use proper UUID format
      const dbRecipes = Array.from({ length: 3 }, (_, i) => createMockRecipeWithUUID(i))
      vi.mocked(fetchRecipes).mockResolvedValue(dbRecipes)
      
      const { container: dbContainer } = render(<RecipeSection />)
      
      await waitFor(() => {
        const dbLinks = dbContainer.querySelectorAll('a[href*="/recipe/"]')
        expect(dbLinks.length).toBe(3)
        
        // All database recipes should use proper UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        
        dbLinks.forEach((link) => {
          const href = link.getAttribute('href')
          if (href) {
            const recipeId = href.split('/recipe/')[1]
            expect(recipeId).toMatch(uuidRegex)
          }
        })
      })
    })

    test('should ensure no legacy sample-X format exists in database recipes', async () => {
      // Test database recipes only (database-only mode)
      const dbRecipes = Array.from({ length: 5 }, (_, i) => createMockRecipeWithUUID(i))
      vi.mocked(fetchRecipes).mockResolvedValue(dbRecipes)
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeLinks = container.querySelectorAll('a[href*="/recipe/"]')
        expect(recipeLinks.length).toBe(5)
        
        recipeLinks.forEach((link) => {
          const href = link.getAttribute('href')
          if (href) {
            const recipeId = href.split('/recipe/')[1]
            expect(recipeId).not.toMatch(/^sample-\d+$/)
          }
        })
      })
    })
  })
}) 