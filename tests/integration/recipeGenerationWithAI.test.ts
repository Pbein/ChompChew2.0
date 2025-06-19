/**
 * @jest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateRecipeAction } from '@/app/generate-recipe/actions'
import { RecipeGenerationService } from '@/features/core/services/recipeGenerationService'

// Mock external dependencies
vi.mock('@/lib/supabase-server', () => ({
  createServerComponentClient: vi.fn(() => ({
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
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'test-user-id',
              role: 'premium',
              subscription_status: 'active',
              subscription_tier: 'premium'
            },
            error: null
          })
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: { id: 'recipe-123' },
            error: null
          })
        }))
      }))
    }))
  }))
}))

vi.mock('@/lib/auth-utils', () => ({
  canGenerateRecipes: vi.fn().mockReturnValue(true)
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

// Mock RecipeGenerationService to avoid actual OpenAI calls
vi.mock('@/features/core/services/recipeGenerationService', () => ({
  RecipeGenerationService: {
    generateRecipe: vi.fn()
  }
}))

const mockGenerateRecipe = vi.mocked(RecipeGenerationService.generateRecipe)

describe('Recipe Generation with AI Images - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete Recipe Generation Flow', () => {
    it('should generate recipe with AI image successfully', async () => {
      // Mock successful recipe generation with AI image
      const mockGeneratedRecipe = {
        title: 'Chicken Teriyaki Bowl',
        description: 'A delicious Japanese-inspired chicken bowl with teriyaki sauce and vegetables',
        ingredients: [
          { name: 'chicken thighs', amount: '1.5', unit: 'lbs' },
          { name: 'soy sauce', amount: '1/4', unit: 'cup' },
          { name: 'mirin', amount: '2', unit: 'tbsp' },
          { name: 'brown sugar', amount: '2', unit: 'tbsp' },
          { name: 'jasmine rice', amount: '2', unit: 'cups' },
          { name: 'broccoli', amount: '1', unit: 'head' },
          { name: 'carrots', amount: '2', unit: 'medium' }
        ],
        instructions: [
          { step: 1, instruction: 'Cook jasmine rice according to package directions.' },
          { step: 2, instruction: 'Mix soy sauce, mirin, and brown sugar to make teriyaki sauce.' },
          { step: 3, instruction: 'Season chicken thighs and cook in a large skillet over medium-high heat.' },
          { step: 4, instruction: 'Steam broccoli and carrots until tender-crisp.' },
          { step: 5, instruction: 'Brush chicken with teriyaki sauce in the last 2 minutes of cooking.' },
          { step: 6, instruction: 'Serve chicken over rice with steamed vegetables.' }
        ],
        metadata: {
          prepTime: 15,
          cookTime: 25,
          totalTime: 40,
          servings: 4,
          difficulty: 'medium' as const,
          cuisineType: 'Japanese'
        },
        tags: ['asian', 'chicken', 'rice-bowl', 'family-friendly'],
        nutrition: {
          calories: 520,
          protein: 35,
          carbs: 55,
          fat: 12,
          fiber: 4,
          sodium: 980
        },
        imageUrl: 'https://oaidalleapiprodscus.blob.core.windows.net/private/chicken-teriyaki-bowl.png'
      }

      mockGenerateRecipe.mockResolvedValue(mockGeneratedRecipe)

      // Create form data
      const formData = new FormData()
      formData.append('prompt', 'chicken teriyaki bowl with vegetables')
      formData.append('dietaryPreferences', JSON.stringify(['asian']))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      // Verify successful generation
      expect(result.success).toBe(true)
      expect(result.recipeId).toBe('recipe-123')
      expect(result.imageUrl).toBe('https://oaidalleapiprodscus.blob.core.windows.net/private/chicken-teriyaki-bowl.png')
      
      // Verify recipe markdown contains essential information
      expect(result.recipeMarkdown).toContain('# Chicken Teriyaki Bowl')
      expect(result.recipeMarkdown).toContain('chicken thighs')
      expect(result.recipeMarkdown).toContain('Cook jasmine rice')
      expect(result.recipeMarkdown).toContain('**Prep Time:** 15 minutes')
      expect(result.recipeMarkdown).toContain('**Servings:** 4')

      // Verify structured recipe data
      expect(result.recipeData).toBeDefined()
      expect(result.recipeData?.title).toBe('Chicken Teriyaki Bowl')
      expect(result.recipeData?.ingredients).toHaveLength(7)
      expect(result.recipeData?.instructions).toHaveLength(6)
      expect(result.recipeData?.metadata.prepTime).toBe(15)
      expect(result.recipeData?.metadata.cookTime).toBe(25)
    })

    it('should handle recipe generation with dietary restrictions', async () => {
      const mockVeganRecipe = {
        title: 'Mediterranean Quinoa Salad',
        description: 'A fresh and healthy vegan quinoa salad with Mediterranean flavors',
        ingredients: [
          { name: 'quinoa', amount: '1.5', unit: 'cups' },
          { name: 'cherry tomatoes', amount: '2', unit: 'cups' },
          { name: 'cucumber', amount: '1', unit: 'large' },
          { name: 'red onion', amount: '1/2', unit: 'medium' },
          { name: 'kalamata olives', amount: '1/2', unit: 'cup' },
          { name: 'olive oil', amount: '3', unit: 'tbsp' },
          { name: 'lemon juice', amount: '2', unit: 'tbsp' }
        ],
        instructions: [
          { step: 1, instruction: 'Cook quinoa according to package directions and let cool.' },
          { step: 2, instruction: 'Dice cucumber and red onion, halve cherry tomatoes.' },
          { step: 3, instruction: 'Whisk together olive oil and lemon juice for dressing.' },
          { step: 4, instruction: 'Combine quinoa, vegetables, and olives in a large bowl.' },
          { step: 5, instruction: 'Toss with dressing and season with salt and pepper.' }
        ],
        metadata: {
          prepTime: 20,
          cookTime: 15,
          totalTime: 35,
          servings: 6,
          difficulty: 'easy' as const,
          cuisineType: 'Mediterranean'
        },
        tags: ['vegan', 'gluten-free', 'mediterranean', 'salad'],
        nutrition: {
          calories: 280,
          protein: 8,
          carbs: 35,
          fat: 12,
          fiber: 6,
          sodium: 320
        },
        imageUrl: 'https://oaidalleapiprodscus.blob.core.windows.net/private/quinoa-salad.png'
      }

      mockGenerateRecipe.mockResolvedValue(mockVeganRecipe)

      const formData = new FormData()
      formData.append('prompt', 'quinoa salad')
      formData.append('dietaryPreferences', JSON.stringify(['vegan', 'gluten-free']))
      formData.append('allergens', JSON.stringify(['nuts']))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(true)
      expect(result.recipeMarkdown).toContain('Mediterranean Quinoa Salad')
             expect(result.recipeMarkdown).toContain('vegan')
       expect(result.recipeMarkdown).toContain('gluten-free')
      expect(result.imageUrl).toContain('quinoa-salad.png')
    })

    it('should handle recipe generation with allergen restrictions', async () => {
      const mockNutFreeRecipe = {
        title: 'Herb-Crusted Salmon',
        description: 'Pan-seared salmon with fresh herbs, nut-free and delicious',
        ingredients: [
          { name: 'salmon fillets', amount: '4', unit: 'pieces' },
          { name: 'fresh dill', amount: '2', unit: 'tbsp' },
          { name: 'fresh parsley', amount: '2', unit: 'tbsp' },
          { name: 'garlic', amount: '2', unit: 'cloves' },
          { name: 'olive oil', amount: '2', unit: 'tbsp' },
          { name: 'lemon', amount: '1', unit: 'medium' }
        ],
        instructions: [
          { step: 1, instruction: 'Preheat oven to 400°F.' },
          { step: 2, instruction: 'Mix chopped herbs with minced garlic and olive oil.' },
          { step: 3, instruction: 'Season salmon fillets with salt and pepper.' },
          { step: 4, instruction: 'Spread herb mixture on top of salmon.' },
          { step: 5, instruction: 'Bake for 12-15 minutes until fish flakes easily.' }
        ],
        metadata: {
          prepTime: 10,
          cookTime: 15,
          totalTime: 25,
          servings: 4,
          difficulty: 'easy' as const,
          cuisineType: 'American'
        },
        tags: ['seafood', 'nut-free', 'gluten-free', 'low-carb'],
        nutrition: {
          calories: 320,
          protein: 28,
          carbs: 2,
          fat: 22,
          fiber: 0,
          sodium: 180
        },
        imageUrl: 'https://oaidalleapiprodscus.blob.core.windows.net/private/herb-salmon.png'
      }

      mockGenerateRecipe.mockResolvedValue(mockNutFreeRecipe)

      const formData = new FormData()
      formData.append('prompt', 'salmon with herbs')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify(['nuts', 'shellfish']))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(true)
             expect(result.recipeMarkdown).toContain('nut-free')
      expect(result.recipeData?.ingredients.every(ing => 
        !ing.name.toLowerCase().includes('nut') && 
        !ing.name.toLowerCase().includes('almond') &&
        !ing.name.toLowerCase().includes('walnut')
      )).toBe(true)
    })
  })

  describe('Recipe Data Structure Validation', () => {
    it('should generate recipes with consistent ingredient structure', async () => {
      const mockRecipe = {
        title: 'Test Recipe',
        description: 'Test description',
        ingredients: [
          { name: 'ingredient1', amount: '1', unit: 'cup' },
          { name: 'ingredient2', amount: '2', unit: 'tbsp' }
        ],
        instructions: [
          { step: 1, instruction: 'Step 1' },
          { step: 2, instruction: 'Step 2' }
        ],
        metadata: {
          prepTime: 10,
          cookTime: 20,
          totalTime: 30,
          servings: 4,
          difficulty: 'medium' as const,
          cuisineType: 'American'
        },
        tags: ['test'],
        nutrition: { calories: 300 },
        imageUrl: 'https://test-image.jpg'
      }

      mockGenerateRecipe.mockResolvedValue(mockRecipe)

      const formData = new FormData()
      formData.append('prompt', 'test recipe')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(true)
      
      // Validate ingredient structure
      result.recipeData?.ingredients.forEach(ingredient => {
        expect(ingredient).toHaveProperty('name')
        expect(ingredient).toHaveProperty('amount')
        expect(ingredient).toHaveProperty('unit')
        expect(typeof ingredient.name).toBe('string')
        expect(typeof ingredient.amount).toBe('string')
        expect(typeof ingredient.unit).toBe('string')
      })

      // Validate instruction structure
      result.recipeData?.instructions.forEach((instruction, index) => {
        expect(instruction).toHaveProperty('step')
        expect(instruction).toHaveProperty('instruction')
        expect(instruction.step).toBe(index + 1)
        expect(typeof instruction.instruction).toBe('string')
      })
    })

    it('should generate recipes with proper metadata structure', async () => {
      const mockRecipe = {
        title: 'Metadata Test Recipe',
        description: 'Testing metadata structure',
        ingredients: [{ name: 'test', amount: '1', unit: 'cup' }],
        instructions: [{ step: 1, instruction: 'Test step' }],
        metadata: {
          prepTime: 15,
          cookTime: 30,
          totalTime: 45,
          servings: 6,
          difficulty: 'hard' as const,
          cuisineType: 'Italian'
        },
        tags: ['test'],
        nutrition: { calories: 400 },
        imageUrl: 'https://test-image.jpg'
      }

      mockGenerateRecipe.mockResolvedValue(mockRecipe)

      const formData = new FormData()
      formData.append('prompt', 'metadata test')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(true)
      
      const metadata = result.recipeData?.metadata
             expect(metadata?.prepTime).toBeGreaterThan(0)
       expect(metadata?.cookTime).toBeGreaterThan(0)
       expect(metadata?.totalTime).toBe((metadata?.prepTime || 0) + (metadata?.cookTime || 0))
      expect(metadata?.servings).toBeGreaterThan(0)
      expect(['easy', 'medium', 'hard']).toContain(metadata?.difficulty)
      expect(typeof metadata?.cuisineType).toBe('string')
    })
  })

  describe('AI Image Integration', () => {
    it('should include AI-generated image URL in response', async () => {
      const mockRecipe = {
        title: 'Image Test Recipe',
        description: 'Testing AI image integration',
        ingredients: [{ name: 'test', amount: '1', unit: 'cup' }],
        instructions: [{ step: 1, instruction: 'Test' }],
        metadata: {
          prepTime: 10,
          cookTime: 15,
          totalTime: 25,
          servings: 2,
          difficulty: 'easy' as const
        },
        tags: ['test'],
        nutrition: { calories: 250 },
        imageUrl: 'https://oaidalleapiprodscus.blob.core.windows.net/private/ai-generated-image.png'
      }

      mockGenerateRecipe.mockResolvedValue(mockRecipe)

      const formData = new FormData()
      formData.append('prompt', 'image test recipe')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(true)
      expect(result.imageUrl).toBe('https://oaidalleapiprodscus.blob.core.windows.net/private/ai-generated-image.png')
      expect(result.imageUrl).toContain('oaidalleapiprodscus.blob.core.windows.net')
    })

    it('should handle missing image URL gracefully', async () => {
      const mockRecipeWithoutImage = {
        title: 'No Image Recipe',
        description: 'Recipe without AI image',
        ingredients: [{ name: 'test', amount: '1', unit: 'cup' }],
        instructions: [{ step: 1, instruction: 'Test' }],
        metadata: {
          prepTime: 5,
          cookTime: 10,
          totalTime: 15,
          servings: 1,
          difficulty: 'easy' as const
        },
        tags: ['test'],
        nutrition: { calories: 200 }
        // No imageUrl property
      }

      mockGenerateRecipe.mockResolvedValue(mockRecipeWithoutImage)

      const formData = new FormData()
      formData.append('prompt', 'no image recipe')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const result = await generateRecipeAction(formData)

      expect(result.success).toBe(true)
      // Should fall back to Unsplash image
      expect(result.imageUrl).toBeDefined()
      expect(result.imageUrl).toContain('images.unsplash.com')
    })
  })

  describe('Performance and Parallel Execution', () => {
    it('should handle recipe generation within reasonable time limits', async () => {
      const mockRecipe = {
        title: 'Performance Test Recipe',
        description: 'Testing performance',
        ingredients: [{ name: 'test', amount: '1', unit: 'cup' }],
        instructions: [{ step: 1, instruction: 'Test' }],
        metadata: {
          prepTime: 10,
          cookTime: 15,
          totalTime: 25,
          servings: 4,
          difficulty: 'medium' as const
        },
        tags: ['test'],
        nutrition: { calories: 300 },
        imageUrl: 'https://test-image.jpg'
      }

      // Simulate realistic timing
      mockGenerateRecipe.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100)) // 100ms simulation
        return mockRecipe
      })

      const formData = new FormData()
      formData.append('prompt', 'performance test')
      formData.append('dietaryPreferences', JSON.stringify([]))
      formData.append('allergens', JSON.stringify([]))

      const startTime = Date.now()
      const result = await generateRecipeAction(formData)
      const endTime = Date.now()

      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(5000) // Should complete within 5 seconds
    })
  })
}) 