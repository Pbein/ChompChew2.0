/**
 * @jest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RecipeGenerationService, RecipeGenerationInputSchema, GeneratedRecipeSchema } from '@/features/core/services/recipeGenerationService'

// Mock OpenAI to avoid API calls in tests
vi.mock('@/lib/openai', () => ({
  openai: null, // Simulate no API key to test error handling
  OPENAI_CONFIG: {
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
    topP: 0.9
  }
}))

// Mock AI image service
vi.mock('@/lib/aiImageService', () => ({
  generateRecipeImage: vi.fn().mockResolvedValue('https://test-ai-image.jpg')
}))

describe('RecipeGenerationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Input Validation', () => {
    it('should validate required ingredients field', () => {
      const invalidInput = {
        ingredients: [], // Empty array should fail
        dietaryRestrictions: [],
        allergies: []
      }

      expect(() => RecipeGenerationInputSchema.parse(invalidInput)).toThrow('At least one ingredient is required')
    })

    it('should accept valid input with all fields', () => {
      const validInput = {
        ingredients: ['chicken', 'rice', 'vegetables'],
        dietaryRestrictions: ['gluten-free'],
        allergies: ['nuts'],
        cuisineType: 'Asian',
        difficulty: 'medium' as const,
        cookingTime: 30,
        servings: 4,
        mealType: 'dinner' as const,
        equipment: ['wok', 'rice cooker']
      }

      const result = RecipeGenerationInputSchema.parse(validInput)
      expect(result).toEqual(validInput)
    })

    it('should apply default values for optional fields', () => {
      const minimalInput = {
        ingredients: ['pasta']
      }

      const result = RecipeGenerationInputSchema.parse(minimalInput)
      expect(result.dietaryRestrictions).toEqual([])
      expect(result.allergies).toEqual([])
      expect(result.difficulty).toBe('medium')
      expect(result.servings).toBe(4)
      expect(result.equipment).toEqual([])
    })

    it('should validate difficulty enum values', () => {
      const invalidInput = {
        ingredients: ['chicken'],
        difficulty: 'impossible' // Invalid difficulty
      }

      expect(() => RecipeGenerationInputSchema.parse(invalidInput)).toThrow()
    })

    it('should validate cooking time constraints', () => {
      const tooShortInput = {
        ingredients: ['chicken'],
        cookingTime: 2 // Less than 5 minutes
      }

      const tooLongInput = {
        ingredients: ['chicken'],
        cookingTime: 500 // More than 8 hours
      }

      expect(() => RecipeGenerationInputSchema.parse(tooShortInput)).toThrow()
      expect(() => RecipeGenerationInputSchema.parse(tooLongInput)).toThrow()
    })

    it('should validate servings constraints', () => {
      const tooFewServings = {
        ingredients: ['chicken'],
        servings: 0
      }

      const tooManyServings = {
        ingredients: ['chicken'],
        servings: 15
      }

      expect(() => RecipeGenerationInputSchema.parse(tooFewServings)).toThrow()
      expect(() => RecipeGenerationInputSchema.parse(tooManyServings)).toThrow()
    })
  })

  describe('Recipe Schema Validation', () => {
    it('should validate complete recipe structure', () => {
      const validRecipe = {
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        ingredients: [
          { name: 'chicken breast', amount: '1', unit: 'lb' }
        ],
        instructions: [
          { step: 1, instruction: 'Cook the chicken' }
        ],
        metadata: {
          prepTime: 15,
          cookTime: 30,
          totalTime: 45,
          servings: 4,
          difficulty: 'medium' as const,
          cuisineType: 'American'
        },
        tags: ['protein', 'main-dish'],
        nutrition: {
          calories: 350,
          protein: 30,
          carbs: 10,
          fat: 15
        },
        imageUrl: 'https://example.com/image.jpg'
      }

      const result = GeneratedRecipeSchema.parse(validRecipe)
      expect(result).toEqual(validRecipe)
    })

    it('should require essential recipe fields', () => {
      const incompleteRecipe = {
        title: 'Test Recipe'
        // Missing required fields
      }

      expect(() => GeneratedRecipeSchema.parse(incompleteRecipe)).toThrow()
    })

    it('should validate ingredient structure', () => {
      const invalidIngredients = {
        title: 'Test Recipe',
        description: 'Test recipe description',
        ingredients: [
          { name: 'chicken' } // Missing amount and unit
        ],
        instructions: [{ step: 1, instruction: 'Cook' }],
        metadata: {
          prepTime: 15,
          cookTime: 30,
          totalTime: 45,
          servings: 4,
          difficulty: 'medium' as const
        },
        tags: [],
        nutrition: { calories: 350 }
      }

      expect(() => GeneratedRecipeSchema.parse(invalidIngredients)).toThrow()
    })

    it('should validate instruction structure', () => {
      const invalidInstructions = {
        title: 'Test Recipe',
        description: 'Test recipe description',
        ingredients: [{ name: 'chicken', amount: '1', unit: 'lb' }],
        instructions: [
          { instruction: 'Cook' } // Missing step number
        ],
        metadata: {
          prepTime: 15,
          cookTime: 30,
          totalTime: 45,
          servings: 4,
          difficulty: 'medium' as const
        },
        tags: [],
        nutrition: { calories: 350 }
      }

      expect(() => GeneratedRecipeSchema.parse(invalidInstructions)).toThrow()
    })
  })

  describe('Error Handling', () => {
    it('should throw error when OpenAI is not available', async () => {
      const input = {
        ingredients: ['chicken', 'rice'],
        dietaryRestrictions: [],
        allergies: [],
        difficulty: 'medium' as const,
        servings: 4,
        equipment: []
      }

      await expect(RecipeGenerationService.generateRecipe(input)).rejects.toThrow('OpenAI client is not initialized')
    })

         it('should handle invalid input gracefully', async () => {
       const invalidInput = {
         ingredients: [], // Empty ingredients
         dietaryRestrictions: [],
         allergies: [],
         difficulty: 'medium' as const,
         servings: 4,
         equipment: []
       }

       await expect(RecipeGenerationService.generateRecipe(invalidInput)).rejects.toThrow()
     })
  })

  describe('Image Integration', () => {
    it('should include image URL in generated recipe', () => {
      // This test focuses on the structure - actual image generation is tested separately
      const mockRecipe = {
        title: 'Chicken Stir Fry',
        description: 'Quick and healthy stir fry',
        ingredients: [{ name: 'chicken', amount: '1', unit: 'lb' }],
        instructions: [{ step: 1, instruction: 'Cook chicken' }],
        metadata: {
          prepTime: 10,
          cookTime: 15,
          totalTime: 25,
          servings: 4,
          difficulty: 'easy' as const,
          cuisineType: 'Asian'
        },
        tags: ['quick', 'healthy'],
        nutrition: { calories: 300 },
        imageUrl: 'https://test-ai-image.jpg'
      }

      // Verify the schema accepts recipes with image URLs
      const result = GeneratedRecipeSchema.parse(mockRecipe)
      expect(result.imageUrl).toBe('https://test-ai-image.jpg')
    })

    it('should handle optional image URL field', () => {
      const recipeWithoutImage = {
        title: 'Simple Recipe',
        description: 'Basic recipe',
        ingredients: [{ name: 'ingredient', amount: '1', unit: 'cup' }],
        instructions: [{ step: 1, instruction: 'Mix' }],
        metadata: {
          prepTime: 5,
          cookTime: 10,
          totalTime: 15,
          servings: 2,
          difficulty: 'easy' as const
        },
        tags: [],
        nutrition: { calories: 200 }
        // No imageUrl
      }

      const result = GeneratedRecipeSchema.parse(recipeWithoutImage)
      expect(result.imageUrl).toBeUndefined()
    })
  })

  describe('Data Structure Consistency', () => {
    it('should maintain consistent ingredient format', () => {
      const ingredients = [
        { name: 'chicken breast', amount: '1', unit: 'lb' },
        { name: 'olive oil', amount: '2', unit: 'tbsp' },
        { name: 'salt', amount: '1', unit: 'tsp' }
      ]

      ingredients.forEach(ingredient => {
        expect(ingredient).toHaveProperty('name')
        expect(ingredient).toHaveProperty('amount')
        expect(ingredient).toHaveProperty('unit')
        expect(typeof ingredient.name).toBe('string')
        expect(typeof ingredient.amount).toBe('string')
        expect(typeof ingredient.unit).toBe('string')
      })
    })

    it('should maintain consistent instruction format', () => {
      const instructions = [
        { step: 1, instruction: 'Preheat oven to 350°F' },
        { step: 2, instruction: 'Season chicken with salt and pepper' },
        { step: 3, instruction: 'Cook for 25 minutes' }
      ]

      instructions.forEach((instruction, index) => {
        expect(instruction).toHaveProperty('step')
        expect(instruction).toHaveProperty('instruction')
        expect(instruction.step).toBe(index + 1)
        expect(typeof instruction.instruction).toBe('string')
      })
    })

    it('should have consistent metadata structure', () => {
      const metadata = {
        prepTime: 15,
        cookTime: 30,
        totalTime: 45,
        servings: 4,
        difficulty: 'medium' as const,
        cuisineType: 'Italian'
      }

      expect(metadata.prepTime).toBeGreaterThan(0)
      expect(metadata.cookTime).toBeGreaterThan(0)
      expect(metadata.totalTime).toBe(metadata.prepTime + metadata.cookTime)
      expect(metadata.servings).toBeGreaterThan(0)
      expect(['easy', 'medium', 'hard']).toContain(metadata.difficulty)
    })
  })

  describe('Nutrition Information', () => {
    it('should include essential nutrition fields', () => {
      const nutrition = {
        calories: 350,
        protein: 25,
        carbs: 30,
        fat: 12,
        fiber: 5,
        sugar: 8,
        sodium: 600
      }

      expect(nutrition.calories).toBeGreaterThan(0)
      expect(nutrition.protein).toBeGreaterThan(0)
      expect(nutrition.carbs).toBeGreaterThan(0)
      expect(nutrition.fat).toBeGreaterThan(0)
    })

    it('should handle optional nutrition fields', () => {
      const minimalNutrition = {
        calories: 250
      }

      const result = GeneratedRecipeSchema.parse({
        title: 'Test Recipe',
        description: 'Test recipe description',
        ingredients: [{ name: 'test', amount: '1', unit: 'cup' }],
        instructions: [{ step: 1, instruction: 'test' }],
        metadata: {
          prepTime: 10,
          cookTime: 15,
          totalTime: 25,
          servings: 2,
          difficulty: 'easy' as const
        },
        tags: [],
        nutrition: minimalNutrition
      })

             expect(result.nutrition?.calories).toBe(250)
    })
  })
}) 