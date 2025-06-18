'use server'

import { createServerComponentClient } from '@/lib/supabase-server'
import { canGenerateRecipes } from '@/lib/auth-utils'
import { RecipeGenerationService, type RecipeGenerationInput } from '@/features/core/services/recipeGenerationService'
import { getRecipeImageUrl } from '@/lib/imageService'
import { revalidatePath } from 'next/cache'

// Rate limiting: Track generation attempts per user
const userGenerationAttempts = new Map<string, { count: number; resetTime: number }>()
const MAX_GENERATIONS_PER_HOUR = 10
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

interface GenerateRecipeResult {
  success: boolean
  error?: string
  recipeId?: string
  recipeMarkdown?: string
  imageUrl?: string
  recipeData?: {
    title: string
    description: string
    ingredients: Array<{ name: string; amount?: string; unit?: string }>
    instructions: Array<{ step: number; instruction: string }>
    metadata: {
      prepTime: number
      cookTime: number
      totalTime: number
      servings: number
      difficulty: string
      cuisineType?: string
    }
  }
}

export async function generateRecipeAction(formData: FormData): Promise<GenerateRecipeResult> {
  console.log('🚀 generateRecipeAction called')
  
  try {
    const supabase = await createServerComponentClient()

    // Extract form data
    const prompt = formData.get('prompt') as string
    const dietaryPreferencesStr = formData.get('dietaryPreferences') as string
    const allergensStr = formData.get('allergens') as string
    
    const dietaryPreferences = dietaryPreferencesStr ? JSON.parse(dietaryPreferencesStr) : []
    const allergens = allergensStr ? JSON.parse(allergensStr) : []

    console.log('📥 Server action params:', { prompt, dietaryPreferences, allergens })

    if (!prompt || prompt.trim().length === 0) {
      console.log('❌ Empty prompt provided')
      return { success: false, error: 'Recipe description is required' }
    }

    // Authentication check
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      console.log('❌ Unauthenticated request')
      return { success: false, error: 'You must be logged in to generate recipes' }
    }

    console.log('👤 Authenticated user:', authUser.id)

    // Get user profile for permissions
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    const user = {
      id: authUser.id,
      email: authUser.email || '',
      role: (profile?.role as 'free' | 'premium' | 'admin') ?? 'free',
      subscription_status: profile?.subscription_status,
      subscription_tier: profile?.subscription_tier,
      created_at: profile?.created_at || authUser.created_at,
      updated_at: profile?.updated_at || authUser.updated_at || authUser.created_at,
    }

    if (!canGenerateRecipes(user)) {
      console.log('❌ User does not have permission:', user.role)
      return { success: false, error: 'Premium subscription required to generate recipes' }
    }

    // Rate limiting check
    const now = Date.now()
    const userAttempts = userGenerationAttempts.get(authUser.id)
    
    if (userAttempts) {
      // Reset counter if window has passed
      if (now > userAttempts.resetTime) {
        userGenerationAttempts.set(authUser.id, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
      } else if (userAttempts.count >= MAX_GENERATIONS_PER_HOUR) {
        console.log('❌ Rate limit exceeded for user:', authUser.id)
        return { 
          success: false, 
          error: `Rate limit exceeded. You can generate ${MAX_GENERATIONS_PER_HOUR} recipes per hour. Try again later.` 
        }
      } else {
        // Increment counter
        userAttempts.count++
      }
    } else {
      // First attempt for this user
      userGenerationAttempts.set(authUser.id, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    }

    console.log('✅ Rate limit check passed')

    // Generate recipe with AI image
    console.log('🤖 Calling RecipeGenerationService...')
    const generationInput: RecipeGenerationInput = {
      ingredients: [prompt], // For now, treat the prompt as ingredients
      dietaryRestrictions: dietaryPreferences,
      allergies: allergens,
      difficulty: 'medium' as const,
      servings: 4,
      equipment: [], // Required field
    }
    
    const generatedRecipe = await RecipeGenerationService.generateRecipe(generationInput)
    console.log('🍳 Recipe generated:', { title: generatedRecipe.title })

    // Use AI-generated image URL or fallback to Unsplash
    const imageUrl = generatedRecipe.imageUrl || getRecipeImageUrl(generatedRecipe.title, generatedRecipe.metadata.cuisineType)
    console.log('✅ Image URL:', imageUrl)

    // Insert into database
    console.log('💾 Inserting recipe into database...')
    const { data: insertData, error: insertError } = await supabase
      .from('recipes')
      .insert({
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        instructions: generatedRecipe.instructions.map(inst => inst.instruction),
        ingredients: generatedRecipe.ingredients.map(ing => ({ 
          name: ing.name, 
          amount: ing.amount,
          unit: ing.unit 
        })),
        prep_time: generatedRecipe.metadata.prepTime,
        cook_time: generatedRecipe.metadata.cookTime,
        total_time: generatedRecipe.metadata.totalTime,
        servings: generatedRecipe.metadata.servings,
        difficulty: generatedRecipe.metadata.difficulty,
        cuisine_type: generatedRecipe.metadata.cuisineType,
        dietary_tags: generatedRecipe.tags || [],
        calories_per_serving: generatedRecipe.nutrition?.calories,
        image_url: imageUrl,
        is_ai_generated: true,
        created_by: authUser.id,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('❌ Failed to insert recipe:', insertError)
      return { success: false, error: 'Failed to save recipe to database' }
    }

    console.log('✅ Recipe saved with ID:', insertData?.id)

    // Generate markdown for display
    const ingredientMd = generatedRecipe.ingredients
      .map((ing) => `- ${ing.amount ? ing.amount + ' ' : ''}${ing.unit ? ing.unit + ' ' : ''}${ing.name}`)
      .join('\n')

    const instructionsMd = generatedRecipe.instructions.map((inst, idx) => `${idx + 1}. ${inst.instruction}`).join('\n')
    
    // Add metadata section
    const metadataMd = [
      `**Prep Time:** ${generatedRecipe.metadata.prepTime} minutes`,
      `**Cook Time:** ${generatedRecipe.metadata.cookTime} minutes`,
      `**Total Time:** ${generatedRecipe.metadata.totalTime} minutes`,
      `**Servings:** ${generatedRecipe.metadata.servings}`,
      `**Difficulty:** ${generatedRecipe.metadata.difficulty}`,
      generatedRecipe.metadata.cuisineType ? `**Cuisine:** ${generatedRecipe.metadata.cuisineType}` : null
    ].filter(Boolean).join('\n')
    
    // Add tags section if tags exist
    const tagsMd = generatedRecipe.tags && generatedRecipe.tags.length > 0 
      ? `\n\n## Tags\n${generatedRecipe.tags.join(', ')}`
      : ''
    
    const recipeMarkdown = `# ${generatedRecipe.title}\n\n${generatedRecipe.description ?? ''}\n\n## Details\n${metadataMd}\n\n## Ingredients\n${ingredientMd}\n\n## Instructions\n${instructionsMd}${tagsMd}`

    console.log('🎉 Recipe generation completed successfully')

    // Revalidate any cached recipe pages
    revalidatePath('/recipes')
    
    return {
      success: true,
      recipeId: insertData?.id,
      recipeMarkdown,
      imageUrl,
      recipeData: {
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        ingredients: generatedRecipe.ingredients,
        instructions: generatedRecipe.instructions,
        metadata: generatedRecipe.metadata
      }
    }

  } catch (error) {
    console.error('❌ Server action error:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
} 