import { describe, it, expect } from 'vitest'
import { aiRecipeSchema, ingredientSchema } from '../../src/lib/validators'

describe('Real Input Validation - Testing Actual Application Schemas', () => {
  describe('Ingredient Schema Validation', () => {
    it('should validate ingredients with all fields', () => {
      const validIngredient = {
        name: 'chicken breast',
        quantity: '200',
        unit: 'g'
      }

      const result = ingredientSchema.safeParse(validIngredient)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validIngredient)
      }
    })

    it('should validate ingredients with only name (minimal valid)', () => {
      const minimalIngredient = {
        name: 'salt'
      }

      const result = ingredientSchema.safeParse(minimalIngredient)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('salt')
        expect(result.data.quantity).toBeUndefined()
        expect(result.data.unit).toBeUndefined()
      }
    })

    it('should reject ingredients without name', () => {
      const invalidIngredient = {
        quantity: '100',
        unit: 'g'
      }

      const result = ingredientSchema.safeParse(invalidIngredient)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required')
      }
    })

    it('should reject ingredients with empty name', () => {
      const invalidIngredient = {
        name: '',
        quantity: '100'
      }

      const result = ingredientSchema.safeParse(invalidIngredient)
      expect(result.success).toBe(false)
    })
  })

  describe('Recipe Schema Validation', () => {
    const validRecipe = {
      title: 'Chicken Burrito',
      description: 'A delicious chicken burrito',
      ingredients: [
        { name: 'chicken breast', quantity: '200', unit: 'g' },
        { name: 'tortilla', quantity: '2' }
      ],
      instructions: [
        'Cook the chicken',
        'Warm the tortillas', 
        'Assemble the burrito'
      ],
      prep_time: 15,
      cook_time: 20,
      total_time: 35,
      servings: 2,
      difficulty: 'easy' as const,
      cuisine_type: 'Mexican',
      dietary_tags: ['high-protein'],
      calories_per_serving: 450
    }

    it('should validate complete valid recipe', () => {
      const result = aiRecipeSchema.safeParse(validRecipe)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Chicken Burrito')
        expect(result.data.ingredients).toHaveLength(2)
        expect(result.data.instructions).toHaveLength(3)
      }
    })

    it('should validate minimal recipe with only required fields', () => {
      const minimalRecipe = {
        title: 'Simple Salad',
        ingredients: [{ name: 'lettuce' }],
        instructions: ['Wash lettuce', 'Serve']
      }

      const result = aiRecipeSchema.safeParse(minimalRecipe)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Simple Salad')
        expect(result.data.ingredients).toHaveLength(1)
        expect(result.data.instructions).toHaveLength(2)
      }
    })

    it('should reject recipe without title', () => {
      const invalidRecipe = {
        ingredients: [{ name: 'test' }],
        instructions: ['test']
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('title'))).toBe(true)
      }
    })

    it('should reject recipe without ingredients', () => {
      const invalidRecipe = {
        title: 'Test Recipe',
        instructions: ['test']
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('ingredients'))).toBe(true)
      }
    })

    it('should reject recipe without instructions', () => {
      const invalidRecipe = {
        title: 'Test Recipe',
        ingredients: [{ name: 'test' }]
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('instructions'))).toBe(true)
      }
    })

    it('should reject recipe with empty ingredients array', () => {
      const invalidRecipe = {
        title: 'Test Recipe',
        ingredients: [],
        instructions: ['test']
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Recipe must have at least one ingredient')
      }
    })

    it('should reject recipe with empty instructions array', () => {
      const invalidRecipe = {
        title: 'Test Recipe',
        ingredients: [{ name: 'test' }],
        instructions: []
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Recipe must have at least one instruction')
      }
    })

    it('should validate difficulty enum values', () => {
      const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard']
      
      difficulties.forEach(difficulty => {
        const recipe = {
          ...validRecipe,
          difficulty
        }
        
        const result = aiRecipeSchema.safeParse(recipe)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid difficulty value', () => {
      const invalidRecipe = {
        ...validRecipe,
        difficulty: 'impossible'
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)
      expect(result.success).toBe(false)
    })

    it('should validate positive integer times', () => {
      const recipe = {
        ...validRecipe,
        prep_time: 30,
        cook_time: 45,
        total_time: 75
      }

      const result = aiRecipeSchema.safeParse(recipe)
      expect(result.success).toBe(true)
    })

    it('should reject negative time values', () => {
      const invalidRecipe = {
        ...validRecipe,
        prep_time: -10
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Prep time cannot be negative')
      }
    })
  })

  describe('Real-World Validation Scenarios', () => {
    it('should handle complex ingredient validation', () => {
      const complexIngredients = [
        { name: 'chicken breast', quantity: '1', unit: 'lb' },
        { name: 'olive oil', quantity: '2', unit: 'tbsp' },
        { name: 'salt and pepper to taste' }, // No quantity/unit
        { name: 'garlic cloves', quantity: '3' } // No unit
      ]

      complexIngredients.forEach(ingredient => {
        const result = ingredientSchema.safeParse(ingredient)
        expect(result.success).toBe(true)
      })
    })

    it('should validate recipes with dietary restrictions', () => {
      const dietaryRecipe = {
        title: 'Vegan Gluten-Free Pasta',
        ingredients: [
          { name: 'gluten-free pasta', quantity: '200', unit: 'g' },
          { name: 'nutritional yeast', quantity: '2', unit: 'tbsp' }
        ],
        instructions: ['Cook pasta according to package', 'Add nutritional yeast'],
        dietary_tags: ['vegan', 'gluten-free', 'dairy-free'],
        difficulty: 'easy' as const
      }

      const result = aiRecipeSchema.safeParse(dietaryRecipe)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.dietary_tags).toContain('vegan')
        expect(result.data.dietary_tags).toContain('gluten-free')
      }
    })

    it('should validate high-protein recipe', () => {
      const proteinRecipe = {
        title: 'High-Protein Chicken Bowl',
        ingredients: [
          { name: 'chicken breast', quantity: '300', unit: 'g' },
          { name: 'quinoa', quantity: '100', unit: 'g' },
          { name: 'greek yogurt', quantity: '150', unit: 'g' }
        ],
        instructions: [
          'Grill chicken breast until fully cooked',
          'Cook quinoa according to package instructions',
          'Serve chicken over quinoa with greek yogurt'
        ],
        calories_per_serving: 520,
        difficulty: 'medium' as const,
        dietary_tags: ['high-protein', 'low-carb']
      }

      const result = aiRecipeSchema.safeParse(proteinRecipe)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.calories_per_serving).toBe(520)
        expect(result.data.dietary_tags).toContain('high-protein')
      }
    })
  })
}) 