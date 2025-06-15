// Common Recipe types for the application
import { GeneratedRecipe } from '@/features/core/services/recipeGenerationService'

export interface Recipe {
  id: string
  title: string
  description: string
  image?: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: RecipeIngredient[]
  instructions: RecipeInstruction[]
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber?: number
  }
  dietaryTags: string[]
  dietaryCompliance?: string[]
  safetyValidated: boolean
  metadata?: {
    cuisineType?: string
    mealType?: string
    totalTime?: number
  }
  tags?: string[]
  tips?: string[]
}

export interface RecipeIngredient {
  name: string
  amount: string
  unit?: string
  notes?: string
}

export interface RecipeInstruction {
  step: number
  instruction: string
  time?: number
  temperature?: string
}

// Recipe card display type (simplified for cards)
export interface RecipeCardData {
  id: string
  title: string
  image?: string
  prepTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  dietaryCompliance: string[]
  safetyValidated: boolean
}

// Convert full Recipe to card data
export function toRecipeCardData(recipe: Recipe): RecipeCardData {
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    dietaryCompliance: recipe.dietaryCompliance || recipe.dietaryTags,
    safetyValidated: recipe.safetyValidated
  }
}

// Convert GeneratedRecipe to Recipe
export function fromGeneratedRecipe(generated: GeneratedRecipe, id: string): Recipe {
  return {
    id,
    title: generated.title,
    description: generated.description,
    prepTime: generated.metadata.prepTime,
    cookTime: generated.metadata.cookTime,
    servings: generated.metadata.servings,
    difficulty: generated.metadata.difficulty,
    ingredients: generated.ingredients,
    instructions: generated.instructions,
    nutrition: generated.nutrition && 
      generated.nutrition.calories !== undefined &&
      generated.nutrition.protein !== undefined &&
      generated.nutrition.carbs !== undefined &&
      generated.nutrition.fat !== undefined
      ? {
          calories: generated.nutrition.calories,
          protein: generated.nutrition.protein,
          carbs: generated.nutrition.carbs,
          fat: generated.nutrition.fat,
          fiber: generated.nutrition.fiber
        }
      : undefined,
    dietaryTags: generated.tags || [],
    safetyValidated: true, // Assume generated recipes are safe
    metadata: {
      cuisineType: generated.metadata.cuisineType,
      mealType: generated.metadata.mealType,
      totalTime: generated.metadata.totalTime
    },
    tags: generated.tags,
    tips: generated.tips
  }
} 