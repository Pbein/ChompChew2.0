'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface FeaturedRecipe {
  id: string
  title: string
  description: string
  image?: string
  prepTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  trustBadges: string[]
  matchScore?: number
  cuisine?: string
}

interface FeaturedRecipeSpotlightProps {
  recipe: FeaturedRecipe
  onViewRecipe?: (recipeId: string) => void
  className?: string
}

export function FeaturedRecipeSpotlight({ 
  recipe, 
  onViewRecipe,
  className 
}: FeaturedRecipeSpotlightProps) {
  const handleViewRecipe = () => {
    onViewRecipe?.(recipe.id)
  }

  return (
    <div className={cn(
      "bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6",
      "hover:bg-white/15 transition-all duration-300 hover:shadow-xl shadow-black/20",
      "group cursor-pointer",
      className
    )}>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Recipe Image */}
        <div className="relative w-full md:w-48 h-32 md:h-32 bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-xl overflow-hidden flex-shrink-0">
          {recipe.image ? (
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-60">🍽️</span>
            </div>
          )}
          
          {/* Match Score Badge */}
          {recipe.matchScore && (
            <div className="absolute top-2 right-2">
              <div className="px-2 py-1 text-xs font-bold bg-green-500/90 text-white rounded-full backdrop-blur-sm">
                {recipe.matchScore}% Match
              </div>
            </div>
          )}
        </div>

        {/* Recipe Details */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-3">
            <div className="text-sm text-white/80 font-medium mb-1">
              🌟 Featured Recipe of the Day
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
              {recipe.title}
            </h3>
            <p className="text-white/90 text-sm md:text-base leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Recipe Meta */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-white/80 mb-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {recipe.prepTime} min
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {recipe.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {recipe.servings} servings
            </span>
            {recipe.cuisine && (
              <span className="flex items-center gap-1">
                <span>🌍</span>
                {recipe.cuisine}
              </span>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
            {recipe.trustBadges.slice(0, 3).map((badge, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-green-100/20 text-green-200 rounded-full border border-green-200/30"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleViewRecipe}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            View Recipe →
          </Button>
        </div>
      </div>
    </div>
  )
} 