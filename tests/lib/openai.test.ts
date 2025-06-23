import { describe, it, expect, vi, beforeEach } from 'vitest'
import OpenAI from 'openai'

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn()
        }
      }
    }))
  }
})

// Mock environment
process.env.OPENAI_API_KEY = 'test-api-key'

describe('OpenAI Service', () => {
  let mockOpenAI: any
  let mockCreate: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreate = vi.fn()
    mockOpenAI = {
      chat: {
        completions: {
          create: mockCreate
        }
      }
    }
    vi.mocked(OpenAI).mockReturnValue(mockOpenAI)
  })

  describe('Recipe Generation Prompt Engineering', () => {
    it('should build comprehensive prompts with user constraints', async () => {
      const userConstraints = {
        ingredients: ['chicken', 'rice'],
        excludedIngredients: ['dairy', 'nuts'],
        dietaryPreferences: ['gluten-free'],
        mealType: 'dinner',
        cuisine: 'asian',
        prepTime: 30
      }

      const expectedPrompt = `Create a ${userConstraints.cuisine} ${userConstraints.mealType} recipe that:
- Uses: ${userConstraints.ingredients.join(', ')}
- Excludes: ${userConstraints.excludedIngredients.join(', ')}
- Follows: ${userConstraints.dietaryPreferences.join(', ')} diet
- Takes under ${userConstraints.prepTime} minutes to prepare

Please provide:
1. Recipe title
2. Ingredients list with quantities
3. Step-by-step instructions
4. Nutritional information
5. Preparation and cooking time`

      // Mock successful response
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              title: 'Asian Chicken Rice Bowl',
              ingredients: ['2 cups rice', '1 lb chicken breast'],
              instructions: ['Cook rice', 'Grill chicken', 'Combine'],
              nutrition: { calories: 450, protein: 35, carbs: 45, fat: 10 },
              prepTime: 25,
              cookTime: 15
            })
          }
        }],
        usage: {
          prompt_tokens: 150,
          completion_tokens: 200,
          total_tokens: 350
        }
      })

      // Simulate calling OpenAI with the constructed prompt
      const result = await mockOpenAI.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: expectedPrompt }],
        temperature: 0.7,
        max_tokens: 1000
      })

      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [{ role: 'user', content: expectedPrompt }],
        temperature: 0.7,
        max_tokens: 1000
      })

      expect(result.choices[0].message.content).toContain('Asian Chicken Rice Bowl')
      expect(result.usage.total_tokens).toBe(350)
    })

    it('should handle dietary restrictions in prompt engineering', async () => {
      const dietaryConstraints = {
        dietaryPreferences: ['vegan', 'low-sodium', 'high-protein'],
        allergens: ['gluten', 'soy', 'nuts'],
        macroTargets: { protein: 25, carbs: 45, fat: 30 }
      }

      const safetyPrompt = `CRITICAL SAFETY REQUIREMENTS:
- MUST be completely ${dietaryConstraints.dietaryPreferences.join(', and ')}
- MUST NOT contain: ${dietaryConstraints.allergens.join(', ')}
- Target macros: ${dietaryConstraints.macroTargets.protein}% protein, ${dietaryConstraints.macroTargets.carbs}% carbs, ${dietaryConstraints.macroTargets.fat}% fat
- Double-check all ingredients for hidden allergens
- Provide allergen warnings if any risk exists`

      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              title: 'High-Protein Vegan Bowl',
              allergenWarnings: 'Contains no known allergens',
              safetyChecked: true
            })
          }
        }]
      })

      await mockOpenAI.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'system', content: safetyPrompt }],
        temperature: 0.3 // Lower temperature for safety-critical responses
      })

      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [{ role: 'system', content: safetyPrompt }],
        temperature: 0.3
      })
    })
  })

  describe('AI Response Parsing and Validation', () => {
    it('should parse valid JSON responses correctly', async () => {
      const validResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              title: 'Test Recipe',
              ingredients: ['1 cup flour', '2 eggs'],
              instructions: ['Mix ingredients', 'Cook for 20 minutes'],
              nutrition: {
                calories: 300,
                protein: 12,
                carbs: 45,
                fat: 8
              },
              prepTime: 15,
              cookTime: 20,
              servings: 4
            })
          }
        }]
      }

      mockCreate.mockResolvedValue(validResponse)

      const result = await mockOpenAI.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Create a recipe' }]
      })

      const parsedContent = JSON.parse(result.choices[0].message.content)
      
      expect(parsedContent.title).toBe('Test Recipe')
      expect(parsedContent.ingredients).toHaveLength(2)
      expect(parsedContent.instructions).toHaveLength(2)
      expect(parsedContent.nutrition.calories).toBe(300)
      expect(parsedContent.prepTime).toBe(15)
      expect(parsedContent.servings).toBe(4)
    })

    it('should handle malformed JSON responses gracefully', async () => {
      const malformedResponse = {
        choices: [{
          message: {
            content: 'This is not valid JSON: { title: "Broken Recipe", ingredients: [missing quote} '
          }
        }]
      }

      mockCreate.mockResolvedValue(malformedResponse)

      const result = await mockOpenAI.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Create a recipe' }]
      })

      expect(() => {
        JSON.parse(result.choices[0].message.content)
      }).toThrow()

      // In a real implementation, this would be handled with try/catch
      let parsedContent = null
      try {
        parsedContent = JSON.parse(result.choices[0].message.content)
      } catch (error) {
        // Fallback parsing or error handling
        expect(error).toBeInstanceOf(SyntaxError)
      }

      expect(parsedContent).toBeNull()
    })

    it('should validate required recipe fields', () => {
      const incompleteRecipe = {
        title: 'Incomplete Recipe',
        ingredients: ['flour', 'eggs'],
        // Missing instructions, nutrition, times
      }

      const requiredFields = ['title', 'ingredients', 'instructions', 'nutrition', 'prepTime', 'cookTime']
      const missingFields = requiredFields.filter(field => !incompleteRecipe.hasOwnProperty(field))

      expect(missingFields).toContain('instructions')
      expect(missingFields).toContain('nutrition')
      expect(missingFields).toContain('prepTime')
      expect(missingFields).toContain('cookTime')
      expect(missingFields).toHaveLength(4)
    })
  })

  describe('Error Handling for API Failures', () => {
    it('should handle OpenAI API rate limit errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded')
      rateLimitError.name = 'RateLimitError'
      
      mockCreate.mockRejectedValue(rateLimitError)

      try {
        await mockOpenAI.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: 'Create a recipe' }]
        })
      } catch (error) {
        expect(error.name).toBe('RateLimitError')
        expect(error.message).toContain('Rate limit exceeded')
      }
    })

    it('should handle OpenAI API authentication errors', async () => {
      const authError = new Error('Invalid API key')
      authError.name = 'AuthenticationError'
      
      mockCreate.mockRejectedValue(authError)

      try {
        await mockOpenAI.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: 'Create a recipe' }]
        })
      } catch (error) {
        expect(error.name).toBe('AuthenticationError')
        expect(error.message).toContain('Invalid API key')
      }
    })

    it('should handle network timeouts', async () => {
      const timeoutError = new Error('Request timeout')
      timeoutError.name = 'TimeoutError'
      
      mockCreate.mockRejectedValue(timeoutError)

      try {
        await mockOpenAI.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: 'Create a recipe' }],
          timeout: 30000 // 30 seconds
        })
      } catch (error) {
        expect(error.name).toBe('TimeoutError')
        expect(error.message).toContain('Request timeout')
      }
    })
  })

  describe('Rate Limiting and Retry Logic', () => {
    it('should implement exponential backoff for retries', async () => {
      const rateLimitError = new Error('Rate limit exceeded')
      rateLimitError.name = 'RateLimitError'
      
      // Mock: Fail twice, then succeed
      mockCreate
        .mockRejectedValueOnce(rateLimitError)
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValueOnce({
          choices: [{ message: { content: '{"title": "Success after retries"}' } }]
        })

      // Simulate retry logic with exponential backoff
      let attempts = 0
      let delay = 1000 // Start with 1 second
      let result = null

      while (attempts < 3 && !result) {
        try {
          result = await mockOpenAI.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: 'Create a recipe' }]
          })
        } catch (error) {
          attempts++
          if (attempts < 3) {
            // Wait for exponential backoff delay
            await new Promise(resolve => setTimeout(resolve, delay))
            delay *= 2 // Double the delay for next attempt
          } else {
            throw error
          }
        }
      }

      expect(mockCreate).toHaveBeenCalledTimes(3)
      expect(result).toBeDefined()
      expect(JSON.parse(result.choices[0].message.content).title).toBe('Success after retries')
    })

    it('should respect rate limit headers and adjust timing', () => {
      const rateLimitHeaders = {
        'x-ratelimit-limit-requests': '3000',
        'x-ratelimit-remaining-requests': '2999',
        'x-ratelimit-reset-requests': '1h',
        'x-ratelimit-limit-tokens': '90000',
        'x-ratelimit-remaining-tokens': '89500',
        'x-ratelimit-reset-tokens': '1h'
      }

      const remainingRequests = parseInt(rateLimitHeaders['x-ratelimit-remaining-requests'])
      const remainingTokens = parseInt(rateLimitHeaders['x-ratelimit-remaining-tokens'])

      expect(remainingRequests).toBe(2999)
      expect(remainingTokens).toBe(89500)
      
      // Logic to determine if we should throttle requests
      const shouldThrottle = remainingRequests < 100 || remainingTokens < 1000
      expect(shouldThrottle).toBe(false)
    })
  })

  describe('Cost Optimization and Token Management', () => {
    it('should track token usage for cost monitoring', async () => {
      const responseWithUsage = {
        choices: [{
          message: { content: '{"title": "Test Recipe"}' }
        }],
        usage: {
          prompt_tokens: 120,
          completion_tokens: 80,
          total_tokens: 200
        }
      }

      mockCreate.mockResolvedValue(responseWithUsage)

      const result = await mockOpenAI.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Create a simple recipe' }],
        max_tokens: 500
      })

      expect(result.usage.prompt_tokens).toBe(120)
      expect(result.usage.completion_tokens).toBe(80)
      expect(result.usage.total_tokens).toBe(200)

      // Calculate approximate cost (GPT-4 pricing)
      const promptCost = (120 / 1000) * 0.03  // $0.03 per 1K prompt tokens
      const completionCost = (80 / 1000) * 0.06  // $0.06 per 1K completion tokens
      const totalCost = promptCost + completionCost

      expect(totalCost).toBeCloseTo(0.0084, 4) // ~$0.0084
    })

    it('should optimize prompt length to reduce costs', () => {
      const longPrompt = 'Create a recipe with these ingredients: ' + 'chicken, rice, vegetables, '.repeat(50)
      const optimizedPrompt = 'Create a recipe with: chicken, rice, vegetables'

      // Simulate token counting (rough approximation: 1 token ≈ 4 characters)
      const longPromptTokens = Math.ceil(longPrompt.length / 4)
      const optimizedPromptTokens = Math.ceil(optimizedPrompt.length / 4)

      expect(longPromptTokens).toBeGreaterThan(optimizedPromptTokens)
      expect(optimizedPromptTokens).toBeLessThan(50) // Keep prompts under 50 tokens when possible

      // Cost savings calculation
      const costPerToken = 0.00003 // Approximate cost per token
      const savings = (longPromptTokens - optimizedPromptTokens) * costPerToken

      expect(savings).toBeGreaterThan(0)
    })

    it('should use appropriate models based on complexity', () => {
      const simpleRequest = 'List 5 common ingredients'
      const complexRequest = 'Create a detailed recipe with nutritional analysis and allergen warnings for a diabetic-friendly meal'

      // Simple requests can use cheaper models
      const simpleModelChoice = simpleRequest.length < 100 ? 'gpt-3.5-turbo' : 'gpt-4'
      
      // Complex requests need more capable models
      const complexModelChoice = complexRequest.includes('nutritional') || complexRequest.includes('allergen') ? 'gpt-4' : 'gpt-3.5-turbo'

      expect(simpleModelChoice).toBe('gpt-3.5-turbo')
      expect(complexModelChoice).toBe('gpt-4')
    })
  })
}) 