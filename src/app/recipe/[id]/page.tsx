"use client"

import { useEffect, useState } from 'react'
import { fetchRecipe } from '@/lib/recipes'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Link from 'next/link'

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
  description?: string
  cook_time?: number | null
  total_time?: number | null
  cuisine_type?: string
  nutrition_info?: Record<string, number> | null
  ingredients?: Array<{ name: string; amount: string }> | null
  instructions?: Array<{ step: number; text: string }> | null
}

export default function RecipePage() {
  const params = useParams()
  const id = params.id as string
  const [recipe, setRecipe] = useState<DBRecipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecipe() {
      try {
        setLoading(true)
        setError(null)
        const recipeData = await fetchRecipe(id)
        if (!recipeData) {
          setError('Recipe not found')
          return
        }
        setRecipe(recipeData)
      } catch (err) {
        console.error('Error loading recipe:', err)
        setError('Failed to load recipe')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadRecipe()
    }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            
            {/* Right sidebar */}
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {error || 'Recipe Not Found'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error === 'Recipe not found' 
            ? 'The recipe you\'re looking for doesn\'t exist or has been removed.'
            : 'There was an error loading this recipe. Please try again later.'
          }
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    )
  }

  // Access properties with proper fallbacks and data normalization
  const nutrition = recipe.nutrition_info as Record<string, number> | null
  
  // Handle different instruction formats from database
  let instructions: { step: number; text: string }[] | undefined
  if (recipe.instructions) {
    if (Array.isArray(recipe.instructions)) {
      // Check if it's already in the correct format
      if (recipe.instructions.length > 0 && typeof recipe.instructions[0] === 'object' && 'text' in recipe.instructions[0]) {
        instructions = recipe.instructions as { step: number; text: string }[]
      } else if (recipe.instructions.length > 0 && typeof recipe.instructions[0] === 'string') {
        // Convert string array to object format
        instructions = (recipe.instructions as unknown as string[]).map((text, index) => ({
          step: index + 1,
          text: text
        }))
      }
    }
  }
  
  // Handle ingredients - might be string array or object array
  let ingredients: { name: string; amount: string }[] | undefined
  if (recipe.ingredients) {
    if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
      if (typeof recipe.ingredients[0] === 'object' && 'name' in recipe.ingredients[0]) {
        ingredients = recipe.ingredients as { name: string; amount: string }[]
      } else if (typeof recipe.ingredients[0] === 'string') {
        // Convert string array to object format
        ingredients = (recipe.ingredients as unknown as string[]).map((item) => {
          // Try to split amount and name (e.g., "1 cup flour" -> {amount: "1 cup", name: "flour"})
          const parts = item.split(' ')
          if (parts.length >= 3) {
            const amount = parts.slice(0, 2).join(' ')
            const name = parts.slice(2).join(' ')
            return { amount, name }
          } else {
            return { amount: '', name: item }
          }
        })
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Recipe Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>/</span>
          <span>Recipe</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {recipe.title}
        </h1>
        
        {recipe.description && (
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
            {recipe.description}
          </p>
        )}

        {/* Rating and validation badges */}
        <div className="flex items-center gap-4 mt-4">
          {recipe.rating_average && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {recipe.rating_average}/5
              </span>
            </div>
          )}
          {recipe.safety_validated && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm">
              <span>✅</span>
              <span>Safety Validated</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image and Instructions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recipe Image */}
          {recipe.image_url && (
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg bg-gray-100 order-1">
              <Image 
                src={recipe.image_url} 
                alt={recipe.title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px" 
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80'
                }}
              />
            </div>
          )}

          {/* Instructions - Hidden on mobile, shown on desktop */}
          {instructions && instructions.length > 0 && (
            <section className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 order-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Instructions
              </h2>
              <div className="space-y-4">
                {instructions.map((step, index) => (
                  <div key={`step-${step.step || index}`} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step || index + 1}
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed pt-1">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Dietary Tags */}
          {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 order-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Dietary Information
              </h3>
              <div className="flex flex-wrap gap-2">
                {recipe.dietary_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recipe Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 order-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Recipe Info
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Prep Time</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {recipe.prep_time || 0} min
                </span>
              </div>
              {recipe.cook_time && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cook Time</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {recipe.cook_time} min
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Servings</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {recipe.servings || 1}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Difficulty</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {recipe.difficulty || 'Easy'}
                </span>
              </div>
              {recipe.calories_per_serving && (
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-4">
                  <span className="text-gray-600 dark:text-gray-400">Calories</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {recipe.calories_per_serving}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients */}
          {ingredients && ingredients.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 order-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Ingredients
              </h3>
              <ul className="space-y-3">
                {ingredients.map((ing, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1.5 rounded border-gray-300" />
                    <span className="text-gray-800 dark:text-gray-200">
                      <span className="font-medium">{ing.amount}</span> {ing.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nutrition */}
          {nutrition && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 order-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Nutrition (per serving)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(nutrition).map(([k, v]) => (
                  <div key={k} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {k}
                    </div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">
                      {v}g
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions - Mobile Only */}
          {instructions && instructions.length > 0 && (
            <section className="lg:hidden bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 order-7">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Instructions
              </h2>
              <div className="space-y-4">
                {instructions.map((step, index) => (
                  <div key={`step-${step.step || index}`} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step || index + 1}
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed pt-1">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
} 