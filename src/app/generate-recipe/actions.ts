'use server'

import { createServerComponentClient } from '@/lib/supabase-server'
import { canGenerateRecipes } from '@/lib/auth-utils'
import { generateRecipe } from '@/lib/openai'
import type { AIRecipe } from '@/lib/validators'
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

    // Generate recipe
    console.log('🤖 Calling generateRecipe function...')
    const aiRecipe: AIRecipe = await generateRecipe({
      prompt,
      dietaryPreferences,
      allergens,
    })

    console.log('🍳 Recipe generated:', { title: aiRecipe.title })

    // Insert into database
    console.log('💾 Inserting recipe into database...')
    const { data: insertData, error: insertError } = await supabase
      .from('recipes')
      .insert({
        title: aiRecipe.title,
        description: aiRecipe.description,
        instructions: aiRecipe.instructions,
        ingredients: aiRecipe.ingredients,
        prep_time: aiRecipe.prep_time,
        cook_time: aiRecipe.cook_time,
        total_time: aiRecipe.total_time ?? (aiRecipe.prep_time ?? 0) + (aiRecipe.cook_time ?? 0),
        servings: aiRecipe.servings,
        difficulty: aiRecipe.difficulty,
        cuisine_type: aiRecipe.cuisine_type,
        dietary_tags: aiRecipe.dietary_tags,
        calories_per_serving: aiRecipe.calories_per_serving,
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
    const ingredientMd = aiRecipe.ingredients
      .map((ing) => `- ${ing.quantity ? ing.quantity + ' ' : ''}${ing.unit ? ing.unit + ' ' : ''}${ing.name}`)
      .join('\n')

    const instructionsMd = aiRecipe.instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')
    const recipeMarkdown = `# ${aiRecipe.title}\n\n${aiRecipe.description ?? ''}\n\n## Ingredients\n${ingredientMd}\n\n## Instructions\n${instructionsMd}`

    console.log('🎉 Recipe generation completed successfully')

    // Revalidate any cached recipe pages
    revalidatePath('/recipes')
    
    return {
      success: true,
      recipeId: insertData?.id,
      recipeMarkdown
    }

  } catch (error) {
    console.error('❌ Server action error:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
} 