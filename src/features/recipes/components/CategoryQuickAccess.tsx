'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CategoryTile {
  id: string
  title: string
  icon: string
  recipeCount?: number
  backgroundColor: string
  textColor?: string
  onClick: () => void
}

interface CategoryQuickAccessProps {
  categories: CategoryTile[]
  className?: string
}

const DEFAULT_CATEGORIES: CategoryTile[] = [
  {
    id: 'trending',
    title: '🔥 Trending',
    icon: '🔥',
    recipeCount: 24,
    backgroundColor: 'bg-orange-500/20 hover:bg-orange-500/30',
    textColor: 'text-orange-100',
    onClick: () => console.log('Navigate to trending')
  },
  {
    id: 'quick',
    title: '⚡ Quick',
    icon: '⚡',
    recipeCount: 18,
    backgroundColor: 'bg-yellow-500/20 hover:bg-yellow-500/30',
    textColor: 'text-yellow-100',
    onClick: () => console.log('Navigate to quick meals')
  },
  {
    id: 'healthy',
    title: '🌱 Healthy',
    icon: '🌱',
    recipeCount: 32,
    backgroundColor: 'bg-green-500/20 hover:bg-green-500/30',
    textColor: 'text-green-100',
    onClick: () => console.log('Navigate to healthy')
  },
  {
    id: 'comfort',
    title: '🍝 Comfort',
    icon: '🍝',
    recipeCount: 15,
    backgroundColor: 'bg-purple-500/20 hover:bg-purple-500/30',
    textColor: 'text-purple-100',
    onClick: () => console.log('Navigate to comfort food')
  },
  {
    id: 'vegetarian',
    title: '🥬 Vegetarian',
    icon: '🥬',
    recipeCount: 28,
    backgroundColor: 'bg-green-600/20 hover:bg-green-600/30',
    textColor: 'text-green-100',
    onClick: () => console.log('Navigate to vegetarian')
  },
  {
    id: 'keto',
    title: '🥑 Keto',
    icon: '🥑',
    recipeCount: 21,
    backgroundColor: 'bg-emerald-600/20 hover:bg-emerald-600/30',
    textColor: 'text-emerald-100',
    onClick: () => console.log('Navigate to keto')
  }
]

export function CategoryQuickAccess({ 
  categories = DEFAULT_CATEGORIES, 
  className 
}: CategoryQuickAccessProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="text-center mb-6">
        <p className="text-lg text-white/90 font-semibold drop-shadow-md">
          Quick category access:
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={category.onClick}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300",
              "hover:scale-105 active:scale-95 transform hover:shadow-xl shadow-black/20",
              "min-h-[80px] p-4 flex flex-col items-center justify-center gap-2",
              "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent",
              category.backgroundColor
            )}
            aria-label={`Browse ${category.title} recipes`}
          >
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <div className={cn(
                "text-sm font-bold leading-tight",
                category.textColor || "text-white"
              )}>
                {category.title.replace(/^[^\s]+ /, '')} {/* Remove emoji from title for cleaner look */}
              </div>
              {category.recipeCount && (
                <div className="text-xs text-white/70 mt-1">
                  {category.recipeCount} recipes
                </div>
              )}
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/30 transition-colors duration-300" />
          </button>
        ))}
      </div>
      
      {/* Additional Actions */}
      <div className="text-center mt-6">
        <button className="text-white/80 hover:text-white text-sm font-medium hover:bg-white/10 rounded-full px-4 py-2 transition-all duration-200">
          View All Categories →
        </button>
      </div>
    </div>
  )
}

// Export the interface for use in other components
export type { CategoryTile } 