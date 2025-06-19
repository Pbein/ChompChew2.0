'use server'

import { createServerComponentClient } from '@/lib/supabase-server'
import { canGenerateRecipes } from '@/lib/auth-utils'
import { RecipeGenerationService, type RecipeGenerationInput } from '@/features/core/services/recipeGenerationService'
import { getRecipeImageUrl } from '@/lib/imageService'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function generateRecipeAction(formData: FormData) {
  console.log('🚀 generateRecipeAction called')

  const supabase = await createServerComponentClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    throw new Error('You must be logged in to generate recipes.')
  }
  console.log('👤 Authenticated user:', authUser.id)

  const { data: profile } = await supabase.from('users').select('*').eq('id', authUser.id).single()

  const user = {
    id: authUser.id,
    email: authUser.email || '',
    role: (profile?.role as 'free' | 'premium' | 'admin') ?? 'free',
    created_at: authUser.created_at,
    updated_at: authUser.updated_at || authUser.created_at,
  }

  if (!canGenerateRecipes(user)) {
    throw new Error('You do not have permission to generate recipes.')
  }

  // Extract and validate form data
  const prompt = formData.get('prompt') as string
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Recipe prompt is required.')
  }

  const dietaryPreferencesStr = (formData.get('dietaryPreferences') as string) || '[]'
  const allergensStr = (formData.get('allergens') as string) || '[]'
  const dietaryPreferences = JSON.parse(dietaryPreferencesStr)
  const allergens = JSON.parse(allergensStr)

  console.log('📥 Server action params:', { prompt, dietaryPreferences, allergens })

  try {
    const generationInput: RecipeGenerationInput = {
      ingredients: [prompt],
      dietaryRestrictions: dietaryPreferences,
      allergies: allergens,
      difficulty: 'medium',
      servings: 4,
      equipment: [],
    }

    const generatedRecipe = await RecipeGenerationService.generateRecipe(generationInput)
    console.log('🍳 Recipe generated:', { title: generatedRecipe.title })

    const imageUrl = generatedRecipe.imageUrl || getRecipeImageUrl(generatedRecipe.title, generatedRecipe.metadata.cuisineType)
    console.log('✅ Image URL:', imageUrl)

    const { data: insertData, error: insertError } = await supabase
      .from('recipes')
      .insert({
        created_by: authUser.id,
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        instructions: generatedRecipe.instructions.map(inst => inst.instruction),
        ingredients: generatedRecipe.ingredients,
        prep_time: generatedRecipe.metadata.prepTime,
        cook_time: generatedRecipe.metadata.cookTime,
        total_time: generatedRecipe.metadata.totalTime,
        servings: generatedRecipe.metadata.servings,
        difficulty: generatedRecipe.metadata.difficulty,
        cuisine_type: generatedRecipe.metadata.cuisineType,
        dietary_tags: generatedRecipe.tags,
        calories_per_serving: generatedRecipe.nutrition?.calories,
        image_url: imageUrl,
        is_ai_generated: true,
      })
      .select('id')
      .single()

    if (insertError) {
      throw insertError
    }

    console.log('✅ Recipe saved with ID:', insertData?.id)
    revalidatePath('/saved-recipes')
    redirect(`/recipe/${insertData.id}`)
  } catch (error) {
    console.error('❌ Server action error:', error)
    // Re-throw the error to be caught by the test or Next.js error boundary
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred during recipe generation.')
  }
} 