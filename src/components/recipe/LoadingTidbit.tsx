'use client'

import React, { useState, useEffect } from 'react'
import { 
  allFactTidbits, 
  featuredRecipeTidbits,
  type BaseTidbit,
  type FeaturedRecipeTidbit
} from '@/lib/data/loading-tidbits'

interface LoadingTidbitProps {
  className?: string
}

export function LoadingTidbit({ className = "" }: LoadingTidbitProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Combine all tidbits into one array for simpler cycling
  const allTidbits = [...allFactTidbits, ...featuredRecipeTidbits]

  useEffect(() => {
    console.log('🔌 LoadingTidbit mounted, starting interval...')
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const newIndex = (prev + 1) % allTidbits.length
        console.log(`⏰ Tidbit timer: switching from ${prev} to ${newIndex} (${newIndex < allFactTidbits.length ? 'fact' : 'recipe'})`)
        return newIndex
      })
    }, 8000) // Change every 8 seconds for better readability

    return () => {
      console.log('🔌 LoadingTidbit unmounted, clearing interval')
      clearInterval(interval)
    }
  }, [allTidbits.length]) // Only depend on length, not changing state

  console.log('🎭 LoadingTidbit render:', { currentIndex, isFactTidbit: currentIndex < allFactTidbits.length })

  // Determine if current item is a fact or featured recipe
  const isFactTidbit = currentIndex < allFactTidbits.length
  const currentFactItem = isFactTidbit ? allFactTidbits[currentIndex] as BaseTidbit : null
  const currentRecipeItem = !isFactTidbit ? featuredRecipeTidbits[currentIndex - allFactTidbits.length] as FeaturedRecipeTidbit : null

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/20 p-8 border border-emerald-100 dark:border-gray-700 ${className}`}>
      {/* Content area with smooth transitions */}
      <div className="min-h-[160px] flex items-center justify-center">
        {isFactTidbit && currentFactItem ? (
          <div key={currentIndex} className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl">💡</span>
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                Did You Know?
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
              {currentFactItem.emoji} {currentFactItem.fact}
            </p>
          </div>
        ) : currentRecipeItem ? (
          <div key={currentIndex} className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl">⭐</span>
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                Featured Recipe
              </h3>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 max-w-md mx-auto border border-emerald-200 dark:border-emerald-800">
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {currentRecipeItem.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {currentRecipeItem.description}
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                  <span>⏱️</span>
                  {currentRecipeItem.prepTime}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                  <span>📊</span>
                  {currentRecipeItem.difficulty}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 flex justify-center">
        <div className="flex gap-2">
          {allTidbits.slice(0, 8).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === currentIndex % 8
                  ? 'bg-emerald-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 