import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '../setup/test-utils'
import { RecipeSection } from '@/components/recipe/RecipeSection'
import { fetchRecipes } from '@/lib/recipes'
import type { RecipeCardData } from '@/features/core/types/recipe'

// Mock the recipes module
vi.mock('@/lib/recipes', () => ({
  fetchRecipes: vi.fn()
}))

// Extended RecipeCardData type that matches the component's usage
interface ExtendedRecipeCardData extends RecipeCardData {
  calories?: number
  rating?: number
}

// Mock recipe data for testing
const createMockRecipe = (index: number): ExtendedRecipeCardData => ({
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

describe('Recipe Display Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Homepage Recipe Count', () => {
    test('should display at least 12 recipes on homepage with fallback data', async () => {
      // Mock empty database response to trigger fallback
      vi.mocked(fetchRecipes).mockResolvedValue([])
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBeGreaterThanOrEqual(12)
      }, { timeout: 3000 })
    })

    test('should display database recipes when available', async () => {
      // Mock successful database response with 15 recipes
      const mockRecipes = Array.from({ length: 15 }, (_, i) => createMockRecipe(i))
      vi.mocked(fetchRecipes).mockResolvedValue(mockRecipes)
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBeGreaterThanOrEqual(12)
        expect(recipeCards.length).toBeLessThanOrEqual(24) // Respect display limit
      })
    })

    test('should gracefully handle database errors with fallback', async () => {
      // Mock database failure
      vi.mocked(fetchRecipes).mockRejectedValue(new Error('Database connection failed'))
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBeGreaterThanOrEqual(12) // Should show fallback recipes
      })
    })

    test('should validate fallback recipe data structure', async () => {
      // Mock empty database to trigger fallback
      vi.mocked(fetchRecipes).mockResolvedValue([])
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBeGreaterThanOrEqual(12)
        
        // Validate that each recipe card has required elements
        recipeCards.forEach((card) => {
          expect(card.querySelector('[data-testid="recipe-title"]')).toBeTruthy()
          expect(card.querySelector('[data-testid="recipe-image"]')).toBeTruthy()
          expect(card.querySelector('[data-testid="recipe-prep-time"]')).toBeTruthy()
          expect(card.querySelector('[data-testid="recipe-difficulty"]')).toBeTruthy()
        })
      })
    })

    test('should not show more than 24 recipes to prevent performance issues', async () => {
      // Mock large database response
      const mockRecipes = Array.from({ length: 50 }, (_, i) => createMockRecipe(i))
      vi.mocked(fetchRecipes).mockResolvedValue(mockRecipes)
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBeLessThanOrEqual(24)
      })
    })
  })

  describe('Recipe Data Consistency', () => {
    test('should have consistent recipe data structure between fallback and database', async () => {
      // Test with database recipes
      const dbRecipes = Array.from({ length: 5 }, (_, i) => createMockRecipe(i))
      vi.mocked(fetchRecipes).mockResolvedValue(dbRecipes)
      
      const { container: dbContainer } = render(<RecipeSection />)
      
      await waitFor(() => {
        const dbCards = dbContainer.querySelectorAll('[data-testid="recipe-card"]')
        expect(dbCards.length).toBe(5)
      })
      
      // Test with fallback recipes
      vi.mocked(fetchRecipes).mockResolvedValue([])
      
      const { container: fallbackContainer } = render(<RecipeSection />)
      
      await waitFor(() => {
        const fallbackCards = fallbackContainer.querySelectorAll('[data-testid="recipe-card"]')
        expect(fallbackCards.length).toBeGreaterThanOrEqual(12)
        
        // Both should have the same structure
        const dbFirstCard = dbContainer.querySelector('[data-testid="recipe-card"]')
        const fallbackFirstCard = fallbackContainer.querySelector('[data-testid="recipe-card"]')
        
        if (dbFirstCard && fallbackFirstCard) {
          expect(dbFirstCard.children.length).toBe(fallbackFirstCard.children.length)
        }
      })
    })

    test('should validate fallback recipes have proper UUID format', async () => {
      // Mock empty database to trigger fallback
      vi.mocked(fetchRecipes).mockResolvedValue([])
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBe(12)
        
        // Validate that fallback recipes use proper UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        
        // Check that recipe links have proper UUID format
        const recipeLinks = container.querySelectorAll('a[href*="/recipe/"]')
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
  })

  describe('Error Handling and Edge Cases', () => {
    test('should handle network timeout gracefully', async () => {
      // Mock network timeout
      vi.mocked(fetchRecipes).mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), 100)
        )
      )
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBeGreaterThanOrEqual(12) // Should show fallback
      }, { timeout: 5000 })
    })

    test('should handle malformed database response', async () => {
      // Mock malformed response
      vi.mocked(fetchRecipes).mockResolvedValue([
        { id: 'invalid', title: null } as unknown as ExtendedRecipeCardData, // Invalid recipe
        createMockRecipe(1) // Valid recipe
      ])
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        // Should filter out invalid recipes and show fallback if needed
        expect(recipeCards.length).toBeGreaterThanOrEqual(1)
      })
    })

    test('should maintain performance with large datasets', async () => {
      const startTime = Date.now()
      
      // Mock large dataset
      const mockRecipes = Array.from({ length: 100 }, (_, i) => createMockRecipe(i))
      vi.mocked(fetchRecipes).mockResolvedValue(mockRecipes)
      
      const { container } = render(<RecipeSection />)
      
      await waitFor(() => {
        const recipeCards = container.querySelectorAll('[data-testid="recipe-card"]')
        expect(recipeCards.length).toBeLessThanOrEqual(24) // Should limit display
      })
      
      const renderTime = Date.now() - startTime
      expect(renderTime).toBeLessThan(2000) // Should render within 2 seconds
    })
  })
}) 