import { describe, it, expect } from 'vitest'
import { aiRecipeSchema, ingredientSchema, type AIRecipe } from '@/lib/validators'

describe('Recipe Validation - Real Validators', () => {
  describe('Ingredient Schema Validation', () => {
    it('should validate valid ingredients', () => {
      const validIngredient = {
        name: 'All-purpose flour',
        quantity: '2',
        unit: 'cups'
      }

      const result = ingredientSchema.safeParse(validIngredient)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('All-purpose flour')
        expect(result.data.quantity).toBe('2')
        expect(result.data.unit).toBe('cups')
      }
    })

    it('should validate minimal ingredient with just name', () => {
      const minimalIngredient = {
        name: 'Salt'
      }

      const result = ingredientSchema.safeParse(minimalIngredient)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Salt')
        expect(result.data.quantity).toBeUndefined()
        expect(result.data.unit).toBeUndefined()
      }
    })

    it('should reject ingredients with empty name', () => {
      const invalidIngredient = {
        name: '',
        quantity: '1',
        unit: 'cup'
      }

      const result = ingredientSchema.safeParse(invalidIngredient)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Ingredient name cannot be empty')
      }
    })

    it('should reject ingredients without name', () => {
      const invalidIngredient = {
        quantity: '1',
        unit: 'cup'
      }

      const result = ingredientSchema.safeParse(invalidIngredient)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].code).toBe('invalid_type')
      }
    })
  })

  describe('AI Recipe Schema Validation', () => {
    it('should validate complete valid recipe', () => {
      const validRecipe: AIRecipe = {
        title: 'Chocolate Chip Cookies',
        description: 'Delicious homemade chocolate chip cookies',
        ingredients: [
          { name: 'All-purpose flour', quantity: '2', unit: 'cups' },
          { name: 'Butter', quantity: '1', unit: 'cup' },
          { name: 'Sugar', quantity: '3/4', unit: 'cup' },
          { name: 'Chocolate chips', quantity: '1', unit: 'cup' }
        ],
        instructions: [
          'Preheat oven to 375°F',
          'Mix dry ingredients in a bowl',
          'Cream butter and sugar',
          'Combine wet and dry ingredients',
          'Fold in chocolate chips',
          'Bake for 10-12 minutes'
        ],
        prep_time: 15,
        cook_time: 12,
        total_time: 27,
        servings: 24,
        difficulty: 'easy',
        cuisine_type: 'American',
        dietary_tags: ['vegetarian'],
        calories_per_serving: 180
      }

      const result = aiRecipeSchema.safeParse(validRecipe)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Chocolate Chip Cookies')
        expect(result.data.ingredients).toHaveLength(4)
        expect(result.data.instructions).toHaveLength(6)
        expect(result.data.difficulty).toBe('easy')
      }
    })

    it('should validate minimal valid recipe', () => {
      const minimalRecipe = {
        title: 'Simple Toast',
        ingredients: [
          { name: 'Bread' }
        ],
        instructions: [
          'Toast the bread'
        ]
      }

      const result = aiRecipeSchema.safeParse(minimalRecipe)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Simple Toast')
        expect(result.data.ingredients).toHaveLength(1)
        expect(result.data.instructions).toHaveLength(1)
      }
    })

    it('should reject recipe without title', () => {
      const invalidRecipe = {
        ingredients: [{ name: 'Flour' }],
        instructions: ['Mix flour']
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors.some(e => e.path.includes('title'))).toBe(true)
      }
    })

    it('should reject recipe without ingredients', () => {
      const invalidRecipe = {
        title: 'Empty Recipe',
        ingredients: [],
        instructions: ['Do nothing']
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Recipe must have at least one ingredient')
      }
    })

    it('should reject recipe without instructions', () => {
      const invalidRecipe = {
        title: 'No Instructions Recipe',
        ingredients: [{ name: 'Flour' }],
        instructions: []
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Recipe must have at least one instruction')
      }
    })

    it('should reject negative prep time', () => {
      const invalidRecipe = {
        title: 'Invalid Prep Time Recipe',
        ingredients: [{ name: 'Flour' }],
        instructions: ['Mix flour'],
        prep_time: -5
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Prep time cannot be negative')
      }
    })

    it('should reject negative cook time', () => {
      const invalidRecipe = {
        title: 'Invalid Cook Time Recipe',
        ingredients: [{ name: 'Flour' }],
        instructions: ['Mix flour'],
        cook_time: -10
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Cook time cannot be negative')
      }
    })

    it('should validate valid difficulty levels', () => {
      const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard']

      difficulties.forEach(difficulty => {
        const recipe = {
          title: `${difficulty} Recipe`,
          ingredients: [{ name: 'Ingredient' }],
          instructions: ['Do something'],
          difficulty
        }

        const result = aiRecipeSchema.safeParse(recipe)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid difficulty level', () => {
      const invalidRecipe = {
        title: 'Invalid Difficulty Recipe',
        ingredients: [{ name: 'Flour' }],
        instructions: ['Mix flour'],
        difficulty: 'impossible'
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].code).toBe('invalid_enum_value')
      }
    })

    it('should handle null total_time', () => {
      const recipeWithNullTotalTime = {
        title: 'Recipe with Null Total Time',
        ingredients: [{ name: 'Flour' }],
        instructions: ['Mix flour'],
        total_time: null
      }

      const result = aiRecipeSchema.safeParse(recipeWithNullTotalTime)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.total_time).toBeNull()
      }
    })

    it('should validate dietary tags array', () => {
      const recipeWithDietaryTags = {
        title: 'Healthy Recipe',
        ingredients: [{ name: 'Vegetables' }],
        instructions: ['Cook vegetables'],
        dietary_tags: ['vegetarian', 'gluten-free', 'low-carb']
      }

      const result = aiRecipeSchema.safeParse(recipeWithDietaryTags)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.dietary_tags).toEqual(['vegetarian', 'gluten-free', 'low-carb'])
      }
    })
  })

  describe('Complex Recipe Validation Scenarios', () => {
    it('should validate recipe with all optional fields', () => {
      const complexRecipe = {
        title: 'Gourmet Pasta Dish',
        description: 'An elaborate pasta dish with multiple components',
        ingredients: [
          { name: 'Pasta', quantity: '1', unit: 'lb' },
          { name: 'Tomatoes', quantity: '4', unit: 'large' },
          { name: 'Garlic', quantity: '3', unit: 'cloves' },
          { name: 'Olive oil', quantity: '2', unit: 'tbsp' }
        ],
        instructions: [
          'Boil water for pasta',
          'Dice tomatoes and mince garlic',
          'Heat olive oil in pan',
          'Sauté garlic until fragrant',
          'Add tomatoes and cook until soft',
          'Cook pasta according to package directions',
          'Combine pasta with sauce',
          'Serve immediately'
        ],
        prep_time: 20,
        cook_time: 25,
        total_time: 45,
        servings: 4,
        difficulty: 'medium',
        cuisine_type: 'Italian',
        dietary_tags: ['vegetarian', 'dairy-free'],
        calories_per_serving: 380
      }

      const result = aiRecipeSchema.safeParse(complexRecipe)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.ingredients).toHaveLength(4)
        expect(result.data.instructions).toHaveLength(8)
        expect(result.data.cuisine_type).toBe('Italian')
        expect(result.data.dietary_tags).toContain('vegetarian')
        expect(result.data.dietary_tags).toContain('dairy-free')
      }
    })

    it('should validate recipe with ingredients missing optional fields', () => {
      const recipeWithMixedIngredients = {
        title: 'Mixed Ingredients Recipe',
        ingredients: [
          { name: 'Salt' }, // No quantity or unit
          { name: 'Pepper', quantity: '1', unit: 'tsp' }, // Full details
          { name: 'Herbs', quantity: 'handful' } // Quantity but no unit
        ],
        instructions: ['Season to taste']
      }

      const result = aiRecipeSchema.safeParse(recipeWithMixedIngredients)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.ingredients[0].name).toBe('Salt')
        expect(result.data.ingredients[0].quantity).toBeUndefined()
        expect(result.data.ingredients[1].unit).toBe('tsp')
        expect(result.data.ingredients[2].quantity).toBe('handful')
        expect(result.data.ingredients[2].unit).toBeUndefined()
      }
    })
  })
}) 