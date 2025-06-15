'use client'

import React, { useState } from 'react'

// Placeholder Recipe interface
interface Recipe {
  id: string
  title: string
  image: string
  prepTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  dietaryCompliance: string[]
}

interface RecipeCardDeckProps {
  recipes: Recipe[]
  onSave: (recipe: Recipe) => void
  onSkip: (recipe: Recipe) => void
  onViewDetails: (recipe: Recipe) => void
  onLoadMore: () => void
  isLoading?: boolean
}

export function RecipeCardDeck({
  recipes,
  onSave,
  onSkip,
  onViewDetails,
  isLoading = false
}: RecipeCardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentRecipe = recipes[currentIndex]

  const handleSave = () => {
    if (currentRecipe) {
      onSave(currentRecipe)
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    if (currentRecipe) {
      onSkip(currentRecipe)
      setCurrentIndex(prev => prev + 1)
    }
  }

  // Empty state placeholder
  if (recipes.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Don&apos;t worry - we&apos;ve got you covered
        </h3>
        <button className="px-8 py-4 bg-primary text-white rounded-xl font-semibold">
          Make One for Me
        </button>
      </div>
    )
  }

  if (!currentRecipe) {
    return <div>No more recipes</div>
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border">
        <div className="w-full h-48 bg-gray-200 rounded-t-2xl"></div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{currentRecipe.title}</h3>
          <div className="flex justify-between mt-4">
            <button onClick={handleSkip} className="px-4 py-2 bg-gray-200 rounded">
              Skip
            </button>
            <button onClick={() => onViewDetails(currentRecipe)} className="px-4 py-2 bg-blue-200 rounded">
              Details
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-red-200 rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 