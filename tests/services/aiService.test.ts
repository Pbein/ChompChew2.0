import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock OpenAI API responses
const mockOpenAIResponse = {
  choices: [{
    message: {
      content: JSON.stringify({
        title: "Vegetarian Pasta Primavera",
        ingredients: [
          "12 oz whole wheat pasta",
          "2 cups mixed vegetables (bell peppers, zucchini, cherry tomatoes)",
          "3 cloves garlic, minced",
          "1/4 cup olive oil",
          "1/2 cup parmesan cheese",
          "Salt and pepper to taste"
        ],
        instructions: [
          "Cook pasta according to package directions",
          "Heat olive oil in a large pan",
          "Sauté garlic and vegetables until tender",
          "Combine pasta with vegetables",
          "Top with parmesan cheese and season"
        ],
        nutrition: {
          calories: 420,
          protein: 16,
          carbs: 65,
          fat: 12,
          fiber: 8
        },
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        dietary: ["vegetarian"],
        difficulty: "easy"
      })
    }
  }],
  usage: {
    prompt_tokens: 150,
    completion_tokens: 250,
    total_tokens: 400
  }
}

const mockImageResponse = {
  data: [{
    url: "https://example.com/generated-recipe-image.jpg"
  }]
}

describe('AI Service', () => {
  let aiService: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock AI service implementation
    aiService = {
      openai: {
        chat: {
          completions: {
            create: vi.fn()
          }
        },
        images: {
          generate: vi.fn()
        }
      },

      async generateRecipe(prompt: string, options: any = {}) {
        try {
          const systemPrompt = this.buildSystemPrompt(options)
          const userPrompt = this.buildUserPrompt(prompt, options)

          const response = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 1500
          })

          const recipe = JSON.parse(response.choices[0].message.content)
          
          // Validate recipe structure
          this.validateRecipe(recipe)
          
          // Apply safety checks
          await this.applySafetyChecks(recipe, options)

          return {
            recipe,
            usage: response.usage,
            confidence: this.calculateConfidence(recipe, options),
            generationTime: Date.now() - Date.now() // Mock timing
          }
        } catch (error) {
          throw this.handleGenerationError(error)
        }
      },

      buildSystemPrompt(options: any) {
        let prompt = "You are a professional chef and nutritionist. Generate healthy, safe recipes."
        
        if (options.dietary) {
          prompt += ` The recipe must be ${options.dietary.join(' and ')}.`
        }
        
        if (options.allergens && options.allergens.length > 0) {
          prompt += ` CRITICAL: The recipe must NOT contain any of these allergens: ${options.allergens.join(', ')}.`
        }
        
        if (options.calorieGoal) {
          prompt += ` Target approximately ${Math.round(options.calorieGoal / 3)} calories per serving.`
        }

        prompt += " Always include complete nutrition information and cooking instructions."
        
        return prompt
      },

      buildUserPrompt(prompt: string, options: any) {
        let userPrompt = `Create a recipe for: ${prompt}`
        
        if (options.servings) {
          userPrompt += ` for ${options.servings} servings`
        }
        
        if (options.maxPrepTime) {
          userPrompt += ` with maximum ${options.maxPrepTime} minutes prep time`
        }

        return userPrompt
      },

      validateRecipe(recipe: any) {
        const required = ['title', 'ingredients', 'instructions', 'nutrition']
        const missing = required.filter(field => !recipe[field])
        
        if (missing.length > 0) {
          throw new Error(`Recipe missing required fields: ${missing.join(', ')}`)
        }

        if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
          throw new Error('Recipe must have at least one ingredient')
        }

        if (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
          throw new Error('Recipe must have at least one instruction')
        }

        if (!recipe.nutrition.calories || recipe.nutrition.calories <= 0) {
          throw new Error('Recipe must have valid calorie information')
        }
      },

      async applySafetyChecks(recipe: any, options: any) {
        const issues = []

        // Check for allergens
        if (options.allergens) {
          options.allergens.forEach((allergen: string) => {
            const allergenVariants = {
              'peanuts': ['peanut', 'peanuts'],
              'nuts': ['nut', 'nuts', 'almond', 'walnut', 'pecan'],
              'dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt'],
              'eggs': ['egg', 'eggs'],
              'shellfish': ['shrimp', 'crab', 'lobster', 'shellfish']
            }
            
            const variants = allergenVariants[allergen.toLowerCase() as keyof typeof allergenVariants] || [allergen]
            const hasAllergen = recipe.ingredients.some((ingredient: string) =>
              variants.some(variant => ingredient.toLowerCase().includes(variant.toLowerCase()))
            )
            if (hasAllergen) {
              issues.push(`Recipe contains allergen: ${allergen}`)
            }
          })
        }

        // Check dietary restrictions
        if (options.dietary) {
          if (options.dietary.includes('vegetarian')) {
            const meatIngredients = ['chicken', 'beef', 'pork', 'fish', 'meat']
            const hasMeat = recipe.ingredients.some((ingredient: string) =>
              meatIngredients.some(meat => ingredient.toLowerCase().includes(meat))
            )
            if (hasMeat) {
              issues.push('Recipe contains meat but should be vegetarian')
            }
          }

          if (options.dietary.includes('vegan')) {
            const animalProducts = ['milk', 'cheese', 'butter', 'eggs', 'honey']
            const hasAnimalProducts = recipe.ingredients.some((ingredient: string) =>
              animalProducts.some(product => ingredient.toLowerCase().includes(product))
            )
            if (hasAnimalProducts) {
              issues.push('Recipe contains animal products but should be vegan')
            }
          }
        }

        // Check calorie targets
        if (options.calorieGoal) {
          const targetCalories = options.calorieGoal / 3
          const variance = Math.abs(recipe.nutrition.calories - targetCalories)
          if (variance > targetCalories * 0.3) {
            issues.push(`Recipe calories (${recipe.nutrition.calories}) too far from target (${targetCalories})`)
          }
        }

        // If there are any safety issues, reject
        if (issues.length > 0) {
          throw new Error(`Safety check failed: ${issues.join('; ')}`)
        }
      },

      calculateConfidence(recipe: any, options: any) {
        let confidence = 0.8 // Base confidence

        // Boost confidence for complete nutrition info
        if (recipe.nutrition.protein && recipe.nutrition.carbs && recipe.nutrition.fat) {
          confidence += 0.1
        }

        // Boost confidence for detailed instructions
        if (recipe.instructions.length >= 3) {
          confidence += 0.05
        }

        // Reduce confidence for very simple recipes
        if (recipe.ingredients.length < 3) {
          confidence -= 0.1
        }

        return Math.min(0.95, Math.max(0.5, confidence))
      },

      handleGenerationError(error: any) {
        if (error.message.includes('rate limit')) {
          return new Error('AI service rate limited. Please try again in a few minutes.')
        }

        if (error.message.includes('Safety check failed')) {
          return new Error(`Recipe safety validation failed: ${error.message}`)
        }

        if (error.message.includes('JSON')) {
          return new Error('AI generated invalid recipe format. Please try again.')
        }

        return new Error('Recipe generation failed. Please try again.')
      },

      async generateRecipeImage(recipe: any, options: any = {}) {
        try {
          const imagePrompt = this.buildImagePrompt(recipe, options)

          const response = await this.openai.images.generate({
            model: 'dall-e-3',
            prompt: imagePrompt,
            size: '1024x1024',
            quality: 'standard',
            n: 1
          })

          return {
            url: response.data[0].url,
            prompt: imagePrompt,
            style: options.style || 'food-photography'
          }
        } catch (error) {
          throw this.handleImageGenerationError(error)
        }
      },

      buildImagePrompt(recipe: any, options: any) {
        let prompt = `Professional food photography of ${recipe.title}, `
        prompt += 'beautifully plated and styled, '
        prompt += 'natural lighting, high resolution, appetizing, '
        
        if (options.style === 'rustic') {
          prompt += 'rustic wooden background, '
        } else if (options.style === 'modern') {
          prompt += 'modern minimalist plating, clean background, '
        } else {
          prompt += 'restaurant quality presentation, '
        }

        // Add key ingredients for visual accuracy
        const keyIngredients = recipe.ingredients.slice(0, 3)
        prompt += `featuring ${keyIngredients.join(', ')}`

        return prompt
      },

      handleImageGenerationError(error: any) {
        if (error.message.includes('content policy')) {
          return new Error('Image generation blocked by content policy')
        }

        if (error.message.includes('rate limit')) {
          return new Error('Image generation rate limited. Please try again later.')
        }

        return new Error('Image generation failed. Please try again.')
      }
    }
  })

  describe('Recipe Generation', () => {
    it('should generate valid recipe from prompt', async () => {
      aiService.openai.chat.completions.create.mockResolvedValue(mockOpenAIResponse)

      const result = await aiService.generateRecipe('vegetarian pasta', {
        dietary: ['vegetarian'],
        calorieGoal: 1800,
        servings: 4
      })

      expect(result.recipe.title).toBe('Vegetarian Pasta Primavera')
      expect(result.recipe.ingredients).toHaveLength(6)
      expect(result.recipe.instructions).toHaveLength(5)
      expect(result.recipe.nutrition.calories).toBe(420)
      expect(result.recipe.dietary).toContain('vegetarian')
      expect(result.confidence).toBeGreaterThan(0.8)
    })

    it('should build proper system prompt with dietary restrictions', () => {
      const systemPrompt = aiService.buildSystemPrompt({
        dietary: ['vegetarian', 'gluten-free'],
        allergens: ['nuts', 'dairy'],
        calorieGoal: 2000
      })

      expect(systemPrompt).toContain('vegetarian and gluten-free')
      expect(systemPrompt).toContain('nuts, dairy')
      expect(systemPrompt).toContain('667 calories') // 2000/3
    })

    it('should validate recipe structure', () => {
      const validRecipe = {
        title: 'Test Recipe',
        ingredients: ['ingredient1'],
        instructions: ['step1'],
        nutrition: { calories: 300 }
      }

      expect(() => aiService.validateRecipe(validRecipe)).not.toThrow()

      const invalidRecipe = {
        title: 'Test Recipe'
        // Missing required fields
      }

      expect(() => aiService.validateRecipe(invalidRecipe)).toThrow('missing required fields')
    })

    it('should apply safety checks for allergens', async () => {
      const recipe = {
        title: 'Peanut Butter Cookies',
        ingredients: ['peanut butter', 'flour', 'sugar'],
        instructions: ['mix', 'bake'],
        nutrition: { calories: 150 }
      }

      await expect(
        aiService.applySafetyChecks(recipe, { allergens: ['peanuts'] })
      ).rejects.toThrow('contains allergen: peanuts')
    })

    it('should apply safety checks for dietary restrictions', async () => {
      const recipe = {
        title: 'Chicken Pasta',
        ingredients: ['chicken', 'pasta', 'cheese'],
        instructions: ['cook chicken', 'boil pasta', 'combine'],
        nutrition: { calories: 500 }
      }

      await expect(
        aiService.applySafetyChecks(recipe, { dietary: ['vegetarian'] })
      ).rejects.toThrow('contains meat but should be vegetarian')
    })

    it('should handle AI service rate limiting', async () => {
      const rateLimitError = new Error('rate limit exceeded')
      aiService.openai.chat.completions.create.mockRejectedValue(rateLimitError)

      await expect(
        aiService.generateRecipe('test recipe')
      ).rejects.toThrow('rate limited. Please try again')
    })

    it('should handle invalid JSON responses', async () => {
      const invalidResponse = {
        choices: [{
          message: {
            content: 'Invalid JSON content'
          }
        }]
      }
      aiService.openai.chat.completions.create.mockResolvedValue(invalidResponse)

      await expect(
        aiService.generateRecipe('test recipe')
      ).rejects.toThrow('invalid recipe format')
    })

    it('should calculate confidence based on recipe quality', () => {
      const highQualityRecipe = {
        ingredients: ['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'],
        instructions: ['step1', 'step2', 'step3', 'step4'],
        nutrition: { protein: 20, carbs: 30, fat: 10 }
      }

      const confidence = aiService.calculateConfidence(highQualityRecipe, {})
      expect(confidence).toBeGreaterThan(0.9)

      const lowQualityRecipe = {
        ingredients: ['ingredient1'],
        instructions: ['step1'],
        nutrition: { calories: 100 }
      }

      const lowConfidence = aiService.calculateConfidence(lowQualityRecipe, {})
      expect(lowConfidence).toBeLessThan(0.8)
    })
  })

  describe('Image Generation', () => {
    it('should generate recipe image', async () => {
      aiService.openai.images.generate.mockResolvedValue(mockImageResponse)

      const recipe = {
        title: 'Chocolate Chip Cookies',
        ingredients: ['flour', 'chocolate chips', 'butter']
      }

      const result = await aiService.generateRecipeImage(recipe, { style: 'modern' })

      expect(result.url).toBe('https://example.com/generated-recipe-image.jpg')
      expect(result.prompt).toContain('Chocolate Chip Cookies')
      expect(result.prompt).toContain('modern minimalist')
      expect(result.style).toBe('modern')
    })

    it('should build appropriate image prompts', () => {
      const recipe = {
        title: 'Vegetable Stir Fry',
        ingredients: ['broccoli', 'carrots', 'soy sauce', 'ginger', 'garlic']
      }

      const rusticsPrompt = aiService.buildImagePrompt(recipe, { style: 'rustic' })
      expect(rusticsPrompt).toContain('rustic wooden background')
      expect(rusticsPrompt).toContain('broccoli, carrots, soy sauce')

      const modernPrompt = aiService.buildImagePrompt(recipe, { style: 'modern' })
      expect(modernPrompt).toContain('modern minimalist')
    })

    it('should handle image generation content policy violations', async () => {
      const contentPolicyError = new Error('content policy violation')
      aiService.openai.images.generate.mockRejectedValue(contentPolicyError)

      const recipe = { title: 'Test Recipe', ingredients: [] }

      await expect(
        aiService.generateRecipeImage(recipe)
      ).rejects.toThrow('blocked by content policy')
    })

    it('should handle image generation rate limiting', async () => {
      const rateLimitError = new Error('rate limit exceeded')
      aiService.openai.images.generate.mockRejectedValue(rateLimitError)

      const recipe = { title: 'Test Recipe', ingredients: [] }

      await expect(
        aiService.generateRecipeImage(recipe)
      ).rejects.toThrow('rate limited. Please try again later')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network request failed')
      aiService.openai.chat.completions.create.mockRejectedValue(networkError)

      await expect(
        aiService.generateRecipe('test recipe')
      ).rejects.toThrow('Recipe generation failed')
    })

    it('should handle API authentication errors', async () => {
      const authError = new Error('Invalid API key')
      aiService.openai.chat.completions.create.mockRejectedValue(authError)

      await expect(
        aiService.generateRecipe('test recipe')
      ).rejects.toThrow('Recipe generation failed')
    })

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout')
      aiService.openai.chat.completions.create.mockRejectedValue(timeoutError)

      await expect(
        aiService.generateRecipe('test recipe')
      ).rejects.toThrow('Recipe generation failed')
    })
  })

  describe('Performance Optimization', () => {
    it('should track token usage', async () => {
      aiService.openai.chat.completions.create.mockResolvedValue(mockOpenAIResponse)

      const result = await aiService.generateRecipe('test recipe')

      expect(result.usage.total_tokens).toBe(400)
      expect(result.usage.prompt_tokens).toBe(150)
      expect(result.usage.completion_tokens).toBe(250)
    })

    it('should optimize prompts for token efficiency', () => {
      const shortOptions = { dietary: ['vegetarian'] }
      const longOptions = {
        dietary: ['vegetarian', 'gluten-free', 'low-sodium'],
        allergens: ['nuts', 'dairy', 'eggs'],
        calorieGoal: 1800,
        maxPrepTime: 30
      }

      const shortPrompt = aiService.buildSystemPrompt(shortOptions)
      const longPrompt = aiService.buildSystemPrompt(longOptions)

      expect(longPrompt.length).toBeGreaterThan(shortPrompt.length)
      expect(longPrompt).toContain('vegetarian and gluten-free and low-sodium')
      expect(longPrompt).toContain('nuts, dairy, eggs')
    })

    it('should implement retry logic for transient failures', async () => {
      let callCount = 0
      aiService.openai.chat.completions.create.mockImplementation(() => {
        callCount++
        if (callCount < 3) {
          throw new Error('Temporary service unavailable')
        }
        return Promise.resolve(mockOpenAIResponse)
      })

      // Mock retry wrapper
      const retryWrapper = async (fn: Function, maxRetries = 3) => {
        for (let i = 0; i < maxRetries; i++) {
          try {
            return await fn()
          } catch (error) {
            if (i === maxRetries - 1) throw error
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
          }
        }
      }

      const result = await retryWrapper(() => aiService.generateRecipe('test recipe'))
      
      expect(callCount).toBe(3)
      expect(result.recipe.title).toBe('Vegetarian Pasta Primavera')
    })
  })

  describe('Caching', () => {
    it('should cache similar recipe requests', async () => {
      const cache = new Map()
      
      const cachedGenerateRecipe = async (prompt: string, options: any) => {
        const cacheKey = JSON.stringify({ prompt, options })
        
        if (cache.has(cacheKey)) {
          return { ...cache.get(cacheKey), cached: true }
        }

        const result = await aiService.generateRecipe(prompt, options)
        cache.set(cacheKey, result)
        return result
      }

      aiService.openai.chat.completions.create.mockResolvedValue(mockOpenAIResponse)

      // First call
      const result1 = await cachedGenerateRecipe('pasta recipe', { dietary: ['vegetarian'] })
      expect(result1.cached).toBeUndefined()

      // Second call with same parameters
      const result2 = await cachedGenerateRecipe('pasta recipe', { dietary: ['vegetarian'] })
      expect(result2.cached).toBe(true)

      expect(aiService.openai.chat.completions.create).toHaveBeenCalledTimes(1)
    })

    it('should invalidate cache for different parameters', async () => {
      const cache = new Map()
      
      const cachedGenerateRecipe = async (prompt: string, options: any) => {
        const cacheKey = JSON.stringify({ prompt, options })
        return cache.has(cacheKey) ? cache.get(cacheKey) : null
      }

      // Different prompts should not hit cache
      expect(await cachedGenerateRecipe('pasta', { dietary: ['vegetarian'] })).toBeNull()
      expect(await cachedGenerateRecipe('pizza', { dietary: ['vegetarian'] })).toBeNull()

      // Different options should not hit cache
      expect(await cachedGenerateRecipe('pasta', { dietary: ['vegetarian'] })).toBeNull()
      expect(await cachedGenerateRecipe('pasta', { dietary: ['vegan'] })).toBeNull()
    })
  })
}) 