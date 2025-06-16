'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Placeholder Recipe interface - will be replaced with actual type
interface Recipe {
  id: string
  title: string
  image: string
  prepTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  dietaryCompliance: string[]
  calorieMatch?: number
  macroMatch?: number
}

interface RecipeCardProps {
  recipe: Recipe
  isActive?: boolean
  onSave: () => void
  onSkip: () => void
  onViewDetails: () => void
  className?: string
  showActions?: boolean
}

export function RecipeCard({
  recipe,
  isActive = false,
  onSave,
  onSkip,
  onViewDetails,
  className,
  showActions = true
}: RecipeCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-xl border border-gray-200",
        "transition-all duration-300 ease-out",
        isActive && "scale-105 shadow-2xl",
        className
      )}
    >
      {/* Recipe Image */}
      <div className="relative w-full h-48 bg-gray-200 rounded-t-2xl overflow-hidden">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Safety Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {recipe.dietaryCompliance.map((badge) => (
            <span
              key={badge}
              className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full backdrop-blur-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Multi-modal Match Indicators */}
        <div className="absolute top-3 right-3 space-y-1">
          {recipe.calorieMatch && (
            <div className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full backdrop-blur-sm">
              {recipe.calorieMatch}% cal match
            </div>
          )}
          {recipe.macroMatch && (
            <div className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full backdrop-blur-sm">
              {recipe.macroMatch}% macro match
            </div>
          )}
        </div>

        {/* Safety Validation Header */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-green-100/90 backdrop-blur-sm text-green-800 px-3 py-1 rounded-full text-xs font-medium text-center">
            ✓ Safe for your dietary needs
          </div>
        </div>
      </div>

      {/* Recipe Details */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {recipe.title}
        </h3>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{recipe.prepTime} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={cn(
              "px-2 py-0.5 rounded text-xs font-medium",
              recipe.difficulty === 'easy' && "bg-green-100 text-green-800",
              recipe.difficulty === 'medium' && "bg-yellow-100 text-yellow-800",
              recipe.difficulty === 'hard' && "bg-red-100 text-red-800"
            )}>
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={onSkip}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors group"
              aria-label="Skip recipe"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={onViewDetails}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-colors"
            >
              View Details
            </button>

            <button
              onClick={onSave}
              className="w-12 h-12 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors group"
              aria-label="Save recipe"
            >
              <svg className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 