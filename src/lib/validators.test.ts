import { aiRecipeSchema, ingredientSchema, type AIRecipe } from './validators'

describe('ingredientSchema', () => {
  it('should validate ingredient with all fields', () => {
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

  it('should validate ingredient with only name', () => {
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

  it('should reject ingredient without name', () => {
    const invalidIngredient = {
      quantity: '100',
      unit: 'g'
    }

    const result = ingredientSchema.safeParse(invalidIngredient)
    expect(result.success).toBe(false)
  })

  it('should reject ingredient with empty name', () => {
    const invalidIngredient = {
      name: '',
      quantity: '100'
    }

    const result = ingredientSchema.safeParse(invalidIngredient)
    expect(result.success).toBe(false)
  })
})

describe('aiRecipeSchema', () => {
  const validRecipe: AIRecipe = {
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
    difficulty: 'easy',
    cuisine_type: 'Mexican',
    dietary_tags: ['high-protein'],
    calories_per_serving: 450
  }

  it('should validate complete recipe', () => {
    const result = aiRecipeSchema.safeParse(validRecipe)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validRecipe)
    }
  })

  it('should validate minimal recipe with required fields only', () => {
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
  })

  it('should reject recipe without ingredients', () => {
    const invalidRecipe = {
      title: 'Test Recipe',
      instructions: ['test']
    }

    const result = aiRecipeSchema.safeParse(invalidRecipe)
    expect(result.success).toBe(false)
  })

  it('should reject recipe without instructions', () => {
    const invalidRecipe = {
      title: 'Test Recipe',
      ingredients: [{ name: 'test' }]
    }

    const result = aiRecipeSchema.safeParse(invalidRecipe)
    expect(result.success).toBe(false)
  })

  it('should reject recipe with empty ingredients array', () => {
    const invalidRecipe = {
      title: 'Test Recipe',
      ingredients: [],
      instructions: ['test']
    }

    const result = aiRecipeSchema.safeParse(invalidRecipe)
    expect(result.success).toBe(false)
  })

  it('should reject recipe with empty instructions array', () => {
    const invalidRecipe = {
      title: 'Test Recipe',
      ingredients: [{ name: 'test' }],
      instructions: []
    }

    const result = aiRecipeSchema.safeParse(invalidRecipe)
    expect(result.success).toBe(false)
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
  })

  it('should reject non-integer time values', () => {
    const invalidRecipe = {
      ...validRecipe,
      cook_time: 15.5
    }

    const result = aiRecipeSchema.safeParse(invalidRecipe)
    expect(result.success).toBe(false)
  })

  it('should allow null total_time', () => {
    const recipe = {
      ...validRecipe,
      total_time: null
    }

    const result = aiRecipeSchema.safeParse(recipe)
    expect(result.success).toBe(true)
  })

  it('should validate dietary_tags as string array', () => {
    const recipe = {
      ...validRecipe,
      dietary_tags: ['vegan', 'gluten-free', 'low-sodium']
    }

    const result = aiRecipeSchema.safeParse(recipe)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.dietary_tags).toHaveLength(3)
    }
  })

  it('should handle complex ingredient structures', () => {
    const recipe = {
      ...validRecipe,
      ingredients: [
        { name: 'flour', quantity: '2', unit: 'cups' },
        { name: 'salt' }, // no quantity/unit
        { name: 'water', quantity: '1', unit: 'cup' }
      ]
    }

    const result = aiRecipeSchema.safeParse(recipe)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.ingredients[1].quantity).toBeUndefined()
      expect(result.data.ingredients[1].unit).toBeUndefined()
    }
  })
}) 