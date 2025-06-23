import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock user and recipe data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  profile: {
    allergens: ['peanuts', 'shellfish'],
    diet: 'vegetarian',
    calorieGoal: 2000,
    embraceFoods: ['vegetables', 'grains'],
    avoidFoods: ['processed foods']
  }
}

const mockRecipes = [
  {
    id: 'recipe-1',
    title: 'Vegetarian Pasta',
    ingredients: ['pasta', 'tomatoes', 'basil', 'olive oil'],
    instructions: ['Cook pasta', 'Make sauce', 'Combine'],
    nutrition: { calories: 450, protein: 12, carbs: 65, fat: 15 },
    dietary: ['vegetarian'],
    prepTime: 15,
    cookTime: 20
  },
  {
    id: 'recipe-2',
    title: 'Chicken Stir Fry',
    ingredients: ['chicken', 'vegetables', 'soy sauce'],
    instructions: ['Cook chicken', 'Add vegetables', 'Stir fry'],
    nutrition: { calories: 380, protein: 28, carbs: 25, fat: 18 },
    dietary: ['high-protein'],
    prepTime: 10,
    cookTime: 15
  }
]

describe('User Journey Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('New User Onboarding Journey', () => {
    it('should guide new user through complete onboarding flow', async () => {
      const onboardingFlow = {
        steps: [
          'welcome',
          'dietary-preferences',
          'allergen-selection',
          'calorie-goals',
          'food-preferences',
          'completion'
        ],
        currentStep: 0,
        userData: {} as any,

        async nextStep(data: any) {
          this.userData = { ...this.userData, ...data }
          this.currentStep++
          return this.getCurrentStep()
        },

        getCurrentStep() {
          return {
            step: this.steps[this.currentStep],
            progress: ((this.currentStep + 1) / this.steps.length) * 100,
            isComplete: this.currentStep >= this.steps.length - 1
          }
        },

        async completeOnboarding() {
          const profile = {
            allergens: this.userData.allergens || [],
            diet: this.userData.diet || 'omnivore',
            calorieGoal: this.userData.calorieGoal || 2000,
            embraceFoods: this.userData.embraceFoods || [],
            avoidFoods: this.userData.avoidFoods || []
          }

          return {
            success: true,
            profile,
            recommendations: await this.generateInitialRecommendations(profile)
          }
        },

        async generateInitialRecommendations(profile: any) {
          // Simulate AI recommendation generation
          return mockRecipes.filter(recipe => {
            if (profile.diet === 'vegetarian') {
              return recipe.dietary.includes('vegetarian')
            }
            return true
          })
        }
      }

      // Step 1: Welcome
      expect(onboardingFlow.getCurrentStep()).toEqual({
        step: 'welcome',
        progress: 16.666666666666664,
        isComplete: false
      })

      // Step 2: Dietary preferences
      await onboardingFlow.nextStep({ diet: 'vegetarian' })
      expect(onboardingFlow.getCurrentStep().step).toBe('dietary-preferences')

      // Step 3: Allergen selection
      await onboardingFlow.nextStep({ allergens: ['peanuts'] })
      expect(onboardingFlow.getCurrentStep().step).toBe('allergen-selection')

      // Step 4: Calorie goals
      await onboardingFlow.nextStep({ calorieGoal: 1800 })
      expect(onboardingFlow.getCurrentStep().step).toBe('calorie-goals')

      // Step 5: Food preferences
      await onboardingFlow.nextStep({ 
        embraceFoods: ['vegetables'], 
        avoidFoods: ['processed foods'] 
      })
      expect(onboardingFlow.getCurrentStep().step).toBe('food-preferences')

      // Step 6: Completion
      await onboardingFlow.nextStep({})
      const result = await onboardingFlow.completeOnboarding()

      expect(result.success).toBe(true)
      expect(result.profile.diet).toBe('vegetarian')
      expect(result.recommendations).toHaveLength(1)
      expect(result.recommendations[0].title).toBe('Vegetarian Pasta')
    })

    it('should handle incomplete onboarding gracefully', async () => {
      const incompleteOnboarding = {
        validateStep(step: string, data: any) {
          const validations: Record<string, (data: any) => string[]> = {
            'dietary-preferences': (data) => {
              const errors = []
              if (!data.diet) errors.push('Diet selection is required')
              return errors
            },
            'allergen-selection': (data) => {
              const errors = []
              if (data.allergens && data.allergens.length > 10) {
                errors.push('Too many allergens selected')
              }
              return errors
            },
            'calorie-goals': (data) => {
              const errors = []
              if (data.calorieGoal && (data.calorieGoal < 800 || data.calorieGoal > 5000)) {
                errors.push('Calorie goal must be between 800 and 5000')
              }
              return errors
            }
          }

          return validations[step]?.(data) || []
        }
      }

      // Test validation failures
      expect(incompleteOnboarding.validateStep('dietary-preferences', {}))
        .toContain('Diet selection is required')

      expect(incompleteOnboarding.validateStep('calorie-goals', { calorieGoal: 10000 }))
        .toContain('Calorie goal must be between 800 and 5000')

      expect(incompleteOnboarding.validateStep('allergen-selection', { 
        allergens: new Array(15).fill('allergen') 
      })).toContain('Too many allergens selected')
    })
  })

  describe('Recipe Discovery Journey', () => {
    it('should provide personalized recipe recommendations', async () => {
      const discoveryEngine = {
        async getPersonalizedRecommendations(userProfile: any) {
          const recommendations = mockRecipes.filter(recipe => {
            // Filter by dietary restrictions
            if (userProfile.diet === 'vegetarian' && !recipe.dietary.includes('vegetarian')) {
              return false
            }

            // Filter by allergens
            const hasAllergens = userProfile.allergens.some((allergen: string) =>
              recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(allergen.toLowerCase())
              )
            )
            if (hasAllergens) return false

            // Filter by calorie goals (within 300 calories per meal)
            const targetCaloriesPerMeal = userProfile.calorieGoal / 3
            const calorieDiff = Math.abs(recipe.nutrition.calories - targetCaloriesPerMeal)
            if (calorieDiff > 300) return false

            return true
          })

          return {
            recommendations,
            reasoning: this.generateRecommendationReasons(recommendations, userProfile)
          }
        },

        generateRecommendationReasons(recipes: any[], profile: any) {
          return recipes.map(recipe => ({
            recipeId: recipe.id,
            reasons: [
              `Matches your ${profile.diet} diet`,
              `Avoids your allergens: ${profile.allergens.join(', ')}`,
              `Fits your calorie goal of ${profile.calorieGoal} calories`
            ]
          }))
        }
      }

      const result = await discoveryEngine.getPersonalizedRecommendations(mockUser.profile)
      
      expect(result.recommendations).toHaveLength(1)
      expect(result.recommendations[0].title).toBe('Vegetarian Pasta')
      expect(result.reasoning[0].reasons).toContain('Matches your vegetarian diet')
    })

    it('should handle search with filters', async () => {
      const searchEngine = {
        async search(query: string, filters: any = {}) {
          let results = mockRecipes.filter(recipe =>
            recipe.title.toLowerCase().includes(query.toLowerCase()) ||
            recipe.ingredients.some(ingredient => 
              ingredient.toLowerCase().includes(query.toLowerCase())
            )
          )

          // Apply filters
          if (filters.maxPrepTime) {
            results = results.filter(recipe => recipe.prepTime <= filters.maxPrepTime)
          }

          if (filters.dietary) {
            results = results.filter(recipe => 
              filters.dietary.every((diet: string) => recipe.dietary.includes(diet))
            )
          }

          if (filters.maxCalories) {
            results = results.filter(recipe => recipe.nutrition.calories <= filters.maxCalories)
          }

          return {
            results,
            total: results.length,
            query,
            filters
          }
        }
      }

      // Basic search
      const basicSearch = await searchEngine.search('pasta')
      expect(basicSearch.results).toHaveLength(1)
      expect(basicSearch.results[0].title).toBe('Vegetarian Pasta')

      // Search with filters
      const filteredSearch = await searchEngine.search('', {
        maxPrepTime: 20,
        dietary: ['vegetarian'],
        maxCalories: 500
      })
      expect(filteredSearch.results).toHaveLength(1)

      // Search with restrictive filters
      const restrictiveSearch = await searchEngine.search('', {
        maxPrepTime: 5,
        dietary: ['vegan']
      })
      expect(restrictiveSearch.results).toHaveLength(0)
    })
  })

  describe('Recipe Generation Journey', () => {
    it('should generate AI recipes based on user preferences', async () => {
      const aiRecipeGenerator = {
        async generateRecipe(prompt: string, userProfile: any) {
          // Simulate AI recipe generation
          const baseRecipe = {
            title: 'AI Generated Vegetarian Bowl',
            ingredients: [
              '1 cup quinoa',
              '2 cups mixed vegetables',
              '1/4 cup olive oil',
              '1 tbsp lemon juice',
              'Salt and pepper to taste'
            ],
            instructions: [
              'Cook quinoa according to package instructions',
              'Sauté vegetables in olive oil',
              'Combine quinoa and vegetables',
              'Season with lemon juice, salt, and pepper'
            ],
            nutrition: {
              calories: Math.round(userProfile.calorieGoal / 3),
              protein: 15,
              carbs: 45,
              fat: 12
            },
            prepTime: 15,
            cookTime: 20,
            dietary: [userProfile.diet]
          }

          // Validate against user restrictions
          const validation = await this.validateAgainstProfile(baseRecipe, userProfile)
          
          return {
            recipe: baseRecipe,
            validation,
            aiConfidence: 0.92,
            generationTime: 3.2
          }
        },

        async validateAgainstProfile(recipe: any, profile: any) {
          const issues = []
          const warnings = []

          // Check allergens
          profile.allergens.forEach((allergen: string) => {
            const hasAllergen = recipe.ingredients.some((ingredient: string) =>
              ingredient.toLowerCase().includes(allergen.toLowerCase())
            )
            if (hasAllergen) {
              issues.push(`Recipe contains allergen: ${allergen}`)
            }
          })

          // Check dietary restrictions
          if (profile.diet === 'vegetarian') {
            const meatIngredients = ['chicken', 'beef', 'pork', 'fish']
            const hasMeat = recipe.ingredients.some((ingredient: string) =>
              meatIngredients.some(meat => ingredient.toLowerCase().includes(meat))
            )
            if (hasMeat) {
              issues.push('Recipe contains meat but user is vegetarian')
            }
          }

          // Check calorie goals
          const targetCalories = profile.calorieGoal / 3 // Per meal
          const calorieDiff = Math.abs(recipe.nutrition.calories - targetCalories)
          if (calorieDiff > 150) {
            warnings.push(`Calories (${recipe.nutrition.calories}) differ from target (${targetCalories})`)
          }

          return {
            isValid: issues.length === 0,
            issues,
            warnings,
            score: issues.length === 0 ? (warnings.length === 0 ? 100 : 85) : 50
          }
        }
      }

      const result = await aiRecipeGenerator.generateRecipe(
        'healthy vegetarian bowl with quinoa',
        mockUser.profile
      )

      expect(result.recipe.title).toContain('Vegetarian')
      expect(result.recipe.dietary).toContain('vegetarian')
      expect(result.validation.isValid).toBe(true)
      expect(result.validation.score).toBeGreaterThan(80)
      expect(result.aiConfidence).toBeGreaterThan(0.8)
    })

    it('should handle AI generation failures gracefully', async () => {
      const failureHandler = {
        async generateWithFallback(prompt: string, userProfile: any) {
          try {
            // Simulate AI service failure
            throw new Error('AI service temporarily unavailable')
          } catch (error) {
            // Fallback to template-based generation
            return this.generateFromTemplate(prompt, userProfile)
          }
        },

        async generateFromTemplate(prompt: string, userProfile: any) {
          const templates = {
            vegetarian: {
              title: 'Simple Vegetarian Meal',
              ingredients: ['vegetables', 'grains', 'legumes'],
              baseCalories: 400
            },
            omnivore: {
              title: 'Balanced Meal',
              ingredients: ['protein', 'vegetables', 'grains'],
              baseCalories: 450
            }
          }

          const template = templates[userProfile.diet as keyof typeof templates] || templates.omnivore

          return {
            recipe: {
              ...template,
              nutrition: { calories: template.baseCalories }
            },
            source: 'template',
            fallback: true,
            message: 'Generated from template due to AI service unavailability'
          }
        }
      }

      const result = await failureHandler.generateWithFallback('healthy meal', mockUser.profile)
      
      expect(result.fallback).toBe(true)
      expect(result.source).toBe('template')
      expect(result.recipe.title).toContain('Vegetarian')
      expect(result.message).toContain('template')
    })
  })

  describe('Recipe Saving and Management Journey', () => {
    it('should manage user recipe collection', async () => {
      const recipeManager = {
        savedRecipes: new Map<string, any>(),

        async saveRecipe(userId: string, recipe: any) {
          const userRecipes = this.savedRecipes.get(userId) || []
          
          // Check if already saved
          const alreadySaved = userRecipes.some((r: any) => r.id === recipe.id)
          if (alreadySaved) {
            throw new Error('Recipe already saved')
          }

          userRecipes.push({
            ...recipe,
            savedAt: new Date().toISOString(),
            tags: [],
            notes: ''
          })

          this.savedRecipes.set(userId, userRecipes)
          
          return {
            success: true,
            totalSaved: userRecipes.length,
            recipe
          }
        },

        async getUserRecipes(userId: string, filters: any = {}) {
          const userRecipes = this.savedRecipes.get(userId) || []
          let filtered = [...userRecipes]

          if (filters.dietary) {
            filtered = filtered.filter(recipe => 
              recipe.dietary.includes(filters.dietary)
            )
          }

          if (filters.maxCalories) {
            filtered = filtered.filter(recipe => 
              recipe.nutrition.calories <= filters.maxCalories
            )
          }

          if (filters.tags) {
            filtered = filtered.filter(recipe =>
              filters.tags.every((tag: string) => recipe.tags.includes(tag))
            )
          }

          return {
            recipes: filtered,
            total: filtered.length,
            filters
          }
        },

        async addRecipeNote(userId: string, recipeId: string, note: string) {
          const userRecipes = this.savedRecipes.get(userId) || []
          const recipe = userRecipes.find(r => r.id === recipeId)
          
          if (!recipe) {
            throw new Error('Recipe not found in user collection')
          }

          recipe.notes = note
          recipe.updatedAt = new Date().toISOString()

          return { success: true, recipe }
        }
      }

      // Save a recipe
      const saveResult = await recipeManager.saveRecipe(mockUser.id, mockRecipes[0])
      expect(saveResult.success).toBe(true)
      expect(saveResult.totalSaved).toBe(1)

      // Try to save the same recipe again
      await expect(
        recipeManager.saveRecipe(mockUser.id, mockRecipes[0])
      ).rejects.toThrow('Recipe already saved')

      // Get user recipes
      const userRecipes = await recipeManager.getUserRecipes(mockUser.id)
      expect(userRecipes.total).toBe(1)
      expect(userRecipes.recipes[0].savedAt).toBeDefined()

      // Add a note to the recipe
      const noteResult = await recipeManager.addRecipeNote(
        mockUser.id, 
        mockRecipes[0].id, 
        'Loved this recipe! Added extra basil.'
      )
      expect(noteResult.success).toBe(true)
      expect(noteResult.recipe.notes).toContain('extra basil')
    })

    it('should organize recipes with tags and categories', async () => {
      const organizationSystem = {
        async categorizeRecipe(recipe: any) {
          const categories = []
          
          // Auto-categorize by meal type
          if (recipe.nutrition.calories < 300) categories.push('light-meal')
          else if (recipe.nutrition.calories > 600) categories.push('hearty-meal')
          else categories.push('regular-meal')

          // Auto-categorize by prep time
          if (recipe.prepTime <= 15) categories.push('quick')
          else if (recipe.prepTime > 45) categories.push('slow-cooking')

          // Auto-categorize by dietary restrictions
          categories.push(...recipe.dietary)

          // Auto-categorize by main ingredients
          if (recipe.ingredients.some((i: string) => i.includes('pasta'))) {
            categories.push('pasta')
          }
          if (recipe.ingredients.some((i: string) => i.includes('chicken'))) {
            categories.push('poultry')
          }

          return {
            recipe: {
              ...recipe,
              autoCategories: categories
            },
            suggestions: this.generateTagSuggestions(recipe)
          }
        },

        generateTagSuggestions(recipe: any) {
          const suggestions = []
          
          // Cooking method suggestions
          if (recipe.instructions.some((i: string) => i.toLowerCase().includes('bake'))) {
            suggestions.push('baked')
          }
          if (recipe.instructions.some((i: string) => i.toLowerCase().includes('fry'))) {
            suggestions.push('fried')
          }

          // Occasion suggestions
          if (recipe.prepTime <= 20) suggestions.push('weeknight')
          if (recipe.nutrition.calories > 500) suggestions.push('comfort-food')

          return suggestions
        }
      }

      const result = await organizationSystem.categorizeRecipe(mockRecipes[0])
      
      expect(result.recipe.autoCategories).toContain('regular-meal')
      expect(result.recipe.autoCategories).toContain('quick')
      expect(result.recipe.autoCategories).toContain('vegetarian')
      expect(result.recipe.autoCategories).toContain('pasta')
      expect(result.suggestions).toBeInstanceOf(Array)
    })
  })

  describe('Complete User Session Journey', () => {
    it('should track complete user session from login to logout', async () => {
      const sessionTracker = {
        session: {
          startTime: Date.now(),
          actions: [] as any[],
          recipesViewed: [] as string[],
          recipesGenerated: 0,
          recipesSaved: 0,
          searchQueries: [] as string[]
        },

        trackAction(action: string, data: any = {}) {
          this.session.actions.push({
            action,
            timestamp: Date.now(),
            data
          })
        },

        trackRecipeView(recipeId: string) {
          this.session.recipesViewed.push(recipeId)
          this.trackAction('recipe_viewed', { recipeId })
        },

        trackRecipeGeneration() {
          this.session.recipesGenerated++
          this.trackAction('recipe_generated')
        },

        trackRecipeSave(recipeId: string) {
          this.session.recipesSaved++
          this.trackAction('recipe_saved', { recipeId })
        },

        trackSearch(query: string) {
          this.session.searchQueries.push(query)
          this.trackAction('search', { query })
        },

        getSessionSummary() {
          const duration = Date.now() - this.session.startTime
          return {
            duration,
            totalActions: this.session.actions.length,
            recipesViewed: this.session.recipesViewed.length,
            uniqueRecipesViewed: new Set(this.session.recipesViewed).size,
            recipesGenerated: this.session.recipesGenerated,
            recipesSaved: this.session.recipesSaved,
            searchQueries: this.session.searchQueries.length,
            engagement: this.calculateEngagement()
          }
        },

        calculateEngagement() {
          const actions = this.session.actions.length
          const duration = (Date.now() - this.session.startTime) / 1000 / 60 // minutes
          
          if (duration < 1) return 'high' // Very active in short time
          
          const actionsPerMinute = actions / duration
          if (actionsPerMinute > 3) return 'high'
          if (actionsPerMinute > 1) return 'medium'
          return 'low'
        }
      }

      // Simulate user session
      sessionTracker.trackAction('login')
      sessionTracker.trackSearch('pasta recipes')
      sessionTracker.trackRecipeView('recipe-1')
      sessionTracker.trackRecipeSave('recipe-1')
      sessionTracker.trackRecipeGeneration()
      sessionTracker.trackRecipeView('recipe-2')
      sessionTracker.trackAction('logout')

      const summary = sessionTracker.getSessionSummary()
      
      expect(summary.totalActions).toBe(7)
      expect(summary.recipesViewed).toBe(2)
      expect(summary.uniqueRecipesViewed).toBe(2)
      expect(summary.recipesGenerated).toBe(1)
      expect(summary.recipesSaved).toBe(1)
      expect(summary.searchQueries).toBe(1)
      expect(['high', 'medium', 'low']).toContain(summary.engagement)
    })
  })
}) 