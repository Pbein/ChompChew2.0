'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useSavedRecipesStore } from '@/store/savedRecipesStore'

// Recipe card data interface
export interface RecipeCardData {
  id: string
  title: string
  image?: string
  prepTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  dietaryCompliance?: string[]
  safetyValidated: boolean
  calories?: number
  rating?: number
}

interface RecipeCardProps {
  recipe: RecipeCardData
  onSave?: (recipe: RecipeCardData) => void
  onViewDetails?: (recipe: RecipeCardData) => void
  className?: string
  size?: 'small' | 'medium' | 'large'
}

export function RecipeCard({
  recipe,
  onSave,
  onViewDetails,
  className,
  size = 'medium'
}: RecipeCardProps) {
  const sizeClasses = {
    small: 'w-full max-w-64',
    medium: 'w-full max-w-80',
    large: 'w-full max-w-96'
  }

  const imageHeights = {
    small: 'h-32',
    medium: 'h-48',
    large: 'h-56'
  }

  const { toggleSave, isSaved } = useSavedRecipesStore()
  const saved = isSaved(recipe.id)

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      data-testid="recipe-card"
      className={cn(
        "block bg-card rounded-2xl shadow-lg border border-border overflow-hidden",
        "transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1",
        "cursor-pointer group",
        sizeClasses[size],
        className
      )}
      onClick={() => onViewDetails?.(recipe)}
    >
      {/* Recipe Image */}
      <div className={cn(
        "relative w-full bg-muted overflow-hidden",
        imageHeights[size]
      )}>
        {recipe.image ? (
          <Image
            data-testid="recipe-image"
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div 
            data-testid="recipe-image"
            className="w-full h-full bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center"
          >
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )}
        
        {/* Safety Badge */}
        {recipe.safetyValidated && (
          <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs font-bold bg-success text-white rounded-full shadow-md">
            ✓ SAFE
          </span>
          </div>
        )}

        {/* Save Button */}
        {(
          typeof onSave === 'function' || typeof toggleSave === 'function'
        ) && (
          <button
            onClick={(e) => {
              e.preventDefault() // Prevent navigation when clicking save button
              e.stopPropagation()
              if (onSave) {
                onSave(recipe)
              } else {
                toggleSave(recipe)
              }
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
            aria-label="Save recipe"
          >
            {saved ? (
              <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}

        {/* Rating */}
        {recipe.rating && (
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-black/70 text-white rounded-full text-xs font-medium">
              <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{recipe.rating}</span>
            </div>
          </div>
        )}
      </div>

      {/* Recipe Details */}
      <div className="p-4 space-y-3">
        <h3 
          data-testid="recipe-title"
          className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors"
        >
          {recipe.title}
        </h3>
        
        {/* Recipe Meta */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1" data-testid="recipe-prep-time">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{recipe.prepTime}m</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{recipe.servings}</span>
            </div>
            {recipe.calories && (
              <div className="flex items-center gap-1">
                <span className="text-accent font-medium">{recipe.calories} cal</span>
              </div>
            )}
          </div>
          
          <span 
            data-testid="recipe-difficulty"
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              recipe.difficulty === 'easy' && "bg-success/20 text-success",
              recipe.difficulty === 'medium' && "bg-warning/20 text-warning",
              recipe.difficulty === 'hard' && "bg-error/20 text-error"
            )}
          >
            {recipe.difficulty}
          </span>
        </div>

        {/* Dietary Compliance Tags */}
        {recipe.dietaryCompliance && recipe.dietaryCompliance.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.dietaryCompliance.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-dietary/20 text-dietary rounded-full"
              >
                {tag}
              </span>
            ))}
            {recipe.dietaryCompliance.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                +{recipe.dietaryCompliance.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
} 