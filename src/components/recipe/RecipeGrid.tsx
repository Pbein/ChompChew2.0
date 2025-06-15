'use client'

import React from 'react'
import { RecipeCard, RecipeCardData } from './RecipeCard'

interface RecipeGridProps {
  recipes: RecipeCardData[]
  onSaveRecipe: (recipe: RecipeCardData) => void
  onViewRecipe: (recipe: RecipeCardData) => void
  loading?: boolean
  emptyMessage?: string
  cardSize?: 'small' | 'medium' | 'large'
  className?: string
}

export function RecipeGrid({
  recipes,
  onSaveRecipe,
  onViewRecipe,
  loading = false,
  emptyMessage = 'No recipes found',
  cardSize = 'medium',
  className
}: RecipeGridProps) {
  // Loading skeleton
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl aspect-[4/5] mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (!recipes || recipes.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {emptyMessage}
          </h3>
                     <p className="text-gray-600 max-w-md mx-auto">
             Try adjusting your search criteria or browse different categories to find recipes you&apos;ll love.
           </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 auto-rows-fr">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="flex">
            <a href={`/recipe/${recipe.id}`} className="w-full h-full">
              <RecipeCard
                recipe={recipe}
                onSave={() => onSaveRecipe(recipe)}
                onViewDetails={() => onViewRecipe(recipe)}
                size={cardSize}
                className="w-full h-full"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Results Summary */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Showing {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
} 