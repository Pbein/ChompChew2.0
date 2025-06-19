'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  allFactTidbits, 
  featuredRecipeTidbits,
  type BaseTidbit,
  type FeaturedRecipeTidbit
} from '@/lib/data/loading-tidbits'

interface GenerateRecipeLoadingScreenTidbitsAndTipsProps {
  isLoadingRecipe: boolean
  className?: string
}

export function GenerateRecipeLoadingScreenTidbitsAndTips({ 
  isLoadingRecipe, 
  className = "" 
}: GenerateRecipeLoadingScreenTidbitsAndTipsProps) {
  const [currentTidbitIndex, setCurrentTidbitIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [fadeClass, setFadeClass] = useState('opacity-100')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const previousIndexRef = useRef<number>(-1)
  const minDisplayTimeRef = useRef<NodeJS.Timeout | null>(null)

  // Combine all tidbits into one array for random selection
  const allTidbits = [...allFactTidbits, ...featuredRecipeTidbits]

  // Get random index that's different from previous
  const getRandomTidbitIndex = (): number => {
    if (allTidbits.length <= 1) {
      return 0
    }
    
    let randomIndex: number
    let attempts = 0
    do {
      randomIndex = Math.floor(Math.random() * allTidbits.length)
      attempts++
    } while (randomIndex === previousIndexRef.current && attempts < 10)
    
    return randomIndex
  }

  // Handle tidbit transitions with fade effect
  const transitionToNextTidbit = () => {
    // Start fade out
    setFadeClass('opacity-0')
    
    setTimeout(() => {
      // Get new random index
      const newIndex = getRandomTidbitIndex()
      
      // Update references
      previousIndexRef.current = currentTidbitIndex
      setCurrentTidbitIndex(newIndex)
      
      // Fade back in
      setFadeClass('opacity-100')
    }, 300) // 300ms fade out duration
  }

  // Effect to manage the loading state and tidbit rotation
  useEffect(() => {
    if (!isLoadingRecipe) {
      // Clear any existing interval when not loading
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      // Enforce minimum display time
      minDisplayTimeRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 5000) // 5 second minimum display time

      return
    }

    // Loading recipe - show component and start tidbits
    setIsVisible(true)
    
    // Set initial random tidbit
    const initialIndex = getRandomTidbitIndex()
    setCurrentTidbitIndex(initialIndex)
    previousIndexRef.current = -1
    setFadeClass('opacity-100')

    // Start interval for 9-second transitions
    intervalRef.current = setInterval(() => {
      if (isLoadingRecipe) {
        transitionToNextTidbit()
      }
    }, 9000) // 9 seconds

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (minDisplayTimeRef.current) {
        clearTimeout(minDisplayTimeRef.current)
        minDisplayTimeRef.current = null
      }
    }
  }, [isLoadingRecipe, getRandomTidbitIndex, transitionToNextTidbit]) // Include all dependencies

  // Don't render if not visible
  if (!isVisible) {
    return null
  }

  // Determine if current item is a fact or featured recipe
  const isFactTidbit = currentTidbitIndex < allFactTidbits.length
  const currentFactItem = isFactTidbit ? allFactTidbits[currentTidbitIndex] as BaseTidbit : null
  const currentRecipeItem = !isFactTidbit ? featuredRecipeTidbits[currentTidbitIndex - allFactTidbits.length] as FeaturedRecipeTidbit : null
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/20 p-8 border border-emerald-100 dark:border-gray-700 ${className}`}>
      {/* Loading Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Creating Your Recipe...
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          While we craft your perfect recipe, here&apos;s something interesting to know!
        </p>
      </div>

      {/* Tidbit Content */}
      <div className={`transition-opacity duration-300 ${fadeClass} text-center`}>
        {isFactTidbit && currentFactItem ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-semibold text-lg text-emerald-800 dark:text-emerald-200 mb-2">
                Did You Know?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {currentFactItem.fact}
              </p>
            </div>
          </div>
        ) : currentRecipeItem ? (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl">👨‍🍳</span>
              </div>
              <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-200 mb-2">
                Featured Recipe Inspiration
              </h3>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {currentRecipeItem.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                {currentRecipeItem.description}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full text-xs font-medium">
                  {currentRecipeItem.difficulty}
                </span>
                <span className="bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full text-xs font-medium">
                  {currentRecipeItem.cuisine}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 text-center">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div className="bg-emerald-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Almost ready... hang tight!
        </p>
      </div>
    </div>
  )
}