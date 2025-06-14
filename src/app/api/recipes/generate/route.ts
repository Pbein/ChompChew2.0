import { NextRequest, NextResponse } from 'next/server'
import { RecipeGenerationService, RecipeGenerationInputSchema } from '@/lib/services/recipeGenerationService'
import { createRouteHandlerClient } from '@/lib/supabase'
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rateLimiter'
import { getClientIP } from '@/lib/utils/ip'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request)
    
    // Apply rate limiting for AI generation (10 requests per hour)
    const rateLimitResult = await checkRateLimit(clientIP || 'anonymous', RATE_LIMIT_CONFIGS.AI_RECIPE_GENERATION)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          message: 'Too many recipe generation requests. Please try again later.',
          retryAfter: rateLimitResult.resetTime 
        },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    
    // Validate input using Zod schema
    const validationResult = RecipeGenerationInputSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          message: 'Please check your recipe generation parameters.',
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const input = validationResult.data

    // Optional: Check if user is authenticated for enhanced features
    const supabase = await createRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Generate recipe using OpenAI
    console.log('Generating recipe with input:', input)
    const generatedRecipe = await RecipeGenerationService.generateRecipe(input)

    // Optional: Save to database if user is authenticated
    if (user) {
      try {
        const { error: saveError } = await supabase
          .from('recipes')
          .insert({
            user_id: user.id,
            title: generatedRecipe.title,
            description: generatedRecipe.description,
            ingredients: generatedRecipe.ingredients,
            instructions: generatedRecipe.instructions,
            prep_time: generatedRecipe.metadata.prepTime,
            cook_time: generatedRecipe.metadata.cookTime,
            total_time: generatedRecipe.metadata.totalTime,
            servings: generatedRecipe.metadata.servings,
            difficulty: generatedRecipe.metadata.difficulty,
            cuisine_type: generatedRecipe.metadata.cuisineType,
            meal_type: generatedRecipe.metadata.mealType,
            nutrition_info: generatedRecipe.nutrition,
            tags: generatedRecipe.tags || [],
            is_ai_generated: true,
            created_at: new Date().toISOString(),
          })

        if (saveError) {
          console.error('Error saving recipe to database:', saveError)
          // Don't fail the request if saving fails, just log it
        }
      } catch (saveError) {
        console.error('Error saving recipe:', saveError)
        // Continue with response even if save fails
      }
    }

    // Return the generated recipe
    return NextResponse.json({
      success: true,
      recipe: generatedRecipe,
      metadata: {
        generatedAt: new Date().toISOString(),
        estimatedTokens: RecipeGenerationService.estimateTokenCost(input),
        userAuthenticated: !!user,
      }
    })

  } catch (error) {
    console.error('Recipe generation error:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { 
            error: 'Configuration error', 
            message: 'Recipe generation service is temporarily unavailable.' 
          },
          { status: 503 }
        )
      }
      
      if (error.message.includes('Rate limit')) {
        return NextResponse.json(
          { 
            error: 'Service overloaded', 
            message: 'Recipe generation service is busy. Please try again in a few minutes.' 
          },
          { status: 503 }
        )
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Generation failed', 
        message: 'Unable to generate recipe. Please try again with different ingredients.' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint for testing and health check
export async function GET() {
  return NextResponse.json({
    service: 'Recipe Generation API',
    status: 'operational',
    version: '1.0.0',
    endpoints: {
      POST: '/api/recipes/generate - Generate a new recipe',
    },
    rateLimit: {
      ai_generation: '10 requests per hour',
    }
  })
} 