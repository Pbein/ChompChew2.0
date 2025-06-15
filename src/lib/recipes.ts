import { supabase } from './supabase'
import { RecipeCardData } from '@/components/recipe/RecipeCard'
import { SearchQuery } from '@/features/core/stores/searchStore'

interface DBRecipe {
  id: string
  title: string
  image_url?: string
  prep_time: number | null
  servings: number | null
  difficulty: 'easy' | 'medium' | 'hard' | null
  dietary_tags: string[] | null
  calories_per_serving: number | null
  safety_validated?: boolean | null
  rating_average?: number | null
}

const mapDbRecipe = (r: DBRecipe): RecipeCardData => ({
  id: r.id,
  title: r.title,
  image: r.image_url || undefined,
  prepTime: r.prep_time ?? 0,
  difficulty: (r.difficulty ?? 'easy') as 'easy' | 'medium' | 'hard',
  servings: r.servings ?? 1,
  dietaryCompliance: r.dietary_tags ?? [],
  safetyValidated: r.safety_validated ?? true,
  calories: r.calories_per_serving ?? undefined,
  rating: r.rating_average ?? undefined
})

export async function fetchRecipes(limit = 12, filters?: Partial<SearchQuery>): Promise<RecipeCardData[]> {
  let query = supabase.from('recipes').select('*').limit(limit)

  if (filters) {
    if (filters.dietaryPreferences && filters.dietaryPreferences.length) {
      query = query.contains('dietary_tags', filters.dietaryPreferences)
    }
    if (filters.excludedIngredients && filters.excludedIngredients.length) {
      query = query.not('ingredients', 'cs', filters.excludedIngredients)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('fetchRecipes error', error)
    return []
  }

  return (data as DBRecipe[]).map(mapDbRecipe)
}

export async function fetchRecipe(id: string): Promise<DBRecipe | null> {
  const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single()
  if (error) {
    console.error('fetchRecipe error', error)
    return null
  }
  return data as DBRecipe
} 