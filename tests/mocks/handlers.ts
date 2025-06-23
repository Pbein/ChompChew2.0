import { http, HttpResponse } from 'msw'

export const handlers = [
  // Recipe endpoints
  http.get('/api/recipes', ({ request }) => {
    const url = new URL(request.url)
    const dietary = url.searchParams.get('dietary')
    const maxCalories = url.searchParams.get('maxCalories')
    
    let recipes = [
      {
        id: 'recipe-1',
        title: 'Vegetarian Pasta',
        ingredients: ['pasta', 'tomatoes', 'basil'],
        instructions: ['Cook pasta', 'Make sauce', 'Combine'],
        nutrition: { calories: 420, protein: 16, carbs: 65, fat: 12 },
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

    // Apply filters
    if (dietary) {
      recipes = recipes.filter(recipe => recipe.dietary.includes(dietary))
    }
    
    if (maxCalories) {
      recipes = recipes.filter(recipe => recipe.nutrition.calories <= parseInt(maxCalories))
    }

    return HttpResponse.json(recipes)
  }),

  http.get('/api/recipes/:id', ({ params }) => {
    const { id } = params
    
    const recipes = {
      'recipe-1': {
        id: 'recipe-1',
        title: 'Vegetarian Pasta',
        ingredients: ['pasta', 'tomatoes', 'basil'],
        instructions: ['Cook pasta', 'Make sauce', 'Combine'],
        nutrition: { calories: 420, protein: 16, carbs: 65, fat: 12 },
        dietary: ['vegetarian'],
        prepTime: 15,
        cookTime: 20
      },
      'recipe-2': {
        id: 'recipe-2',
        title: 'Chicken Stir Fry',
        ingredients: ['chicken', 'vegetables', 'soy sauce'],
        instructions: ['Cook chicken', 'Add vegetables', 'Stir fry'],
        nutrition: { calories: 380, protein: 28, carbs: 25, fat: 18 },
        dietary: ['high-protein'],
        prepTime: 10,
        cookTime: 15
      }
    }

    const recipe = recipes[id as keyof typeof recipes]
    if (!recipe) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(recipe)
  }),

  http.post('/api/recipes/generate', async ({ request }) => {
    const body = await request.json() as any
    const { prompt, options = {} } = body

    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 100))

    const recipe = {
      id: `ai-recipe-${Date.now()}`,
      title: `AI Generated: ${prompt}`,
      ingredients: ['ai-ingredient-1', 'ai-ingredient-2'],
      instructions: ['ai-step-1', 'ai-step-2'],
      nutrition: {
        calories: options.calorieGoal ? Math.round(options.calorieGoal / 3) : 400,
        protein: 20,
        carbs: 30,
        fat: 15
      },
      dietary: options.dietary || [],
      confidence: 0.85,
      generatedAt: new Date().toISOString()
    }

    return HttpResponse.json(recipe)
  }),

  // Enhanced AI recipes endpoint
  http.get('/api/recipes/ai-enhanced', () => {
    return HttpResponse.json([
      {
        id: 'ai-recipe-1',
        title: 'AI Enhanced Recipe',
        ingredients: ['enhanced-ingredient-1'],
        instructions: ['enhanced-step-1'],
        nutrition: { calories: 350, protein: 18, carbs: 28, fat: 12 },
        aiEnhanced: true
      }
    ])
  }),

  // User endpoints
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 'user-1', name: 'Test User', email: 'test@example.com' },
      { id: 'user-2', name: 'Another User', email: 'another@example.com' }
    ])
  }),

  http.get('/api/users/:id', ({ params }) => {
    const { id } = params
    const users = {
      'user-1': { id: 'user-1', name: 'Test User', email: 'test@example.com' },
      'user-2': { id: 'user-2', name: 'Another User', email: 'another@example.com' }
    }

    const user = users[id as keyof typeof users]
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(user)
  }),

  http.post('/api/users/:id/saved-recipes', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as any
    
    return HttpResponse.json({
      userId: id,
      recipeId: body.recipeId,
      savedAt: new Date().toISOString()
    })
  }),

  // Ratings endpoint
  http.get('/api/ratings', () => {
    return HttpResponse.json([
      { recipeId: 'recipe-1', rating: 4.5, count: 10 },
      { recipeId: 'recipe-2', rating: 4.2, count: 8 }
    ])
  }),

  // Health check endpoint
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        ai: 'available'
      }
    })
  }),

  // Error simulation endpoints for testing
  http.get('/api/test/timeout', () => {
    // Simulate timeout
    return new Promise(() => {}) // Never resolves
  }),

  http.get('/api/test/server-error', () => {
    return new HttpResponse('Internal Server Error', { status: 500 })
  }),

  http.get('/api/test/not-found', () => {
    return new HttpResponse('Not Found', { status: 404 })
  }),

  http.get('/api/test/rate-limit', () => {
    return new HttpResponse('Rate Limited', { 
      status: 429,
      headers: { 'Retry-After': '60' }
    })
  }),

  // Authentication endpoints
  http.post('/api/auth/signin', async ({ request }) => {
    const body = await request.json() as any
    const { email, password } = body

    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
        token: 'mock-jwt-token'
      })
    }

    return new HttpResponse('Invalid credentials', { status: 401 })
  }),

  http.post('/api/auth/signout', () => {
    return HttpResponse.json({ success: true })
  }),

  // Profile endpoints
  http.get('/api/profile/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      id,
      allergens: ['peanuts', 'shellfish'],
      diet: 'vegetarian',
      calorieGoal: 2000,
      embraceFoods: ['vegetables'],
      avoidFoods: ['processed foods']
    })
  }),

  http.put('/api/profile/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as any
    
    return HttpResponse.json({
      id,
      ...body,
      updatedAt: new Date().toISOString()
    })
  }),

  // Search endpoints
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    const filters = url.searchParams.get('filters')
    
    return HttpResponse.json({
      query: q,
      filters: filters ? JSON.parse(filters) : {},
      results: [
        {
          id: 'search-result-1',
          title: `Search result for: ${q}`,
          relevance: 0.95
        }
      ],
      total: 1
    })
  }),

  // Cache endpoints for testing
  http.get('/api/cache/stats', () => {
    return HttpResponse.json({
      hits: 150,
      misses: 25,
      ratio: 0.857,
      size: '2.5MB'
    })
  }),

  // Metrics endpoints
  http.get('/api/metrics', () => {
    return HttpResponse.json({
      requestCount: 1000,
      averageResponseTime: 250,
      errorRate: 0.02,
      uptime: '99.9%'
    })
  })
] 