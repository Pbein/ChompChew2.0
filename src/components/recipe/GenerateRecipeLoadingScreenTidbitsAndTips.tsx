'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  console.log('🏗️ [LOADING-SCREEN] ===== COMPONENT INSTANTIATED =====')
  console.log('🏗️ [LOADING-SCREEN] Initial props:', { isLoadingRecipe, className })
  
  const [currentTidbitIndex, setCurrentTidbitIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [fadeClass, setFadeClass] = useState('opacity-100')
  const [hasBeenVisible, setHasBeenVisible] = useState(false) // Track if we've ever been visible
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const previousIndexRef = useRef<number>(-1)
  const minDisplayTimeRef = useRef<NodeJS.Timeout | null>(null)

  // Combine all tidbits into one array for random selection
  const allTidbits = [...allFactTidbits, ...featuredRecipeTidbits]
  
  console.log('📚 [LOADING-SCREEN] Tidbits data loaded:', {
    factTidbitsCount: allFactTidbits.length,
    featuredRecipeTidbitsCount: featuredRecipeTidbits.length,
    totalTidbitsCount: allTidbits.length,
    firstFactSample: allFactTidbits[0]?.fact?.substring(0, 50) + '...',
    firstRecipeSample: featuredRecipeTidbits[0]?.title
  })

  // Track prop changes
  useEffect(() => {
    console.log('📬 [LOADING-SCREEN] ===== PROPS CHANGED =====')
    console.log('📬 [LOADING-SCREEN] isLoadingRecipe prop updated to:', isLoadingRecipe)
  }, [isLoadingRecipe])

  // JavaScript function to get random index that's different from previous
  const getRandomTidbitIndex = useCallback((): number => {
    console.log('🎲 [LOADING-SCREEN] Getting random tidbit index...')
    console.log('🎲 [LOADING-SCREEN] Available tidbits:', allTidbits.length)
    console.log('🎲 [LOADING-SCREEN] Previous index:', previousIndexRef.current)
    
    if (allTidbits.length <= 1) {
      console.log('🎲 [LOADING-SCREEN] Only 1 or 0 tidbits available, returning index 0')
      return 0
    }
    
    let randomIndex: number
    let attempts = 0
    do {
      randomIndex = Math.floor(Math.random() * allTidbits.length)
      attempts++
      console.log(`🎲 [LOADING-SCREEN] Attempt ${attempts}: Generated index ${randomIndex}`)
    } while (randomIndex === previousIndexRef.current && attempts < 10)
    
    console.log('🎯 [LOADING-SCREEN] Final selected index:', randomIndex)
    return randomIndex
  }, [allTidbits.length])

  // Handle tidbit transitions with fade effect
  const transitionToNextTidbit = useCallback(() => {
    console.log('🔄 [LOADING-SCREEN] ===== STARTING TIDBIT TRANSITION =====')
    console.log('🔄 [LOADING-SCREEN] Current tidbit index before transition:', currentTidbitIndex)
    console.log('🔄 [LOADING-SCREEN] Previous index ref:', previousIndexRef.current)
    
    // Start fade out
    console.log('🎭 [LOADING-SCREEN] Setting fade class to opacity-0 (fade out)')
    setFadeClass('opacity-0')
    
    setTimeout(() => {
      console.log('🎭 [LOADING-SCREEN] Fade out complete, selecting new tidbit...')
      
      // Get new random index
      const newIndex = getRandomTidbitIndex()
      console.log(`🎲 [LOADING-SCREEN] Transitioning from tidbit ${previousIndexRef.current} to ${newIndex}`)
      
      // Update references
      previousIndexRef.current = currentTidbitIndex
      setCurrentTidbitIndex(newIndex)
      
      console.log('🎭 [LOADING-SCREEN] Setting fade class to opacity-100 (fade in)')
      // Fade back in
      setFadeClass('opacity-100')
      
      console.log('🔄 [LOADING-SCREEN] ===== TIDBIT TRANSITION COMPLETE =====')
    }, 300) // 300ms fade out duration
  }, [currentTidbitIndex, getRandomTidbitIndex])

  // Effect to manage the loading state and tidbit rotation
  useEffect(() => {
    console.log('🔧 [LOADING-SCREEN] ===== useEffect TRIGGERED =====')
    console.log('🔧 [LOADING-SCREEN] isLoadingRecipe prop:', isLoadingRecipe)
    console.log('🔧 [LOADING-SCREEN] Current interval ref:', intervalRef.current ? 'EXISTS' : 'NULL')
    console.log('🔧 [LOADING-SCREEN] Current visibility state:', isVisible)
    
    if (!isLoadingRecipe) {
      console.log('❌ [LOADING-SCREEN] isLoadingRecipe is FALSE - enforcing 5-second minimum display time')
      
      minDisplayTimeRef.current = setTimeout(() => {
        console.log('⏱️ [LOADING-SCREEN] 5-second minimum display time elapsed, now hiding component')
        // Clear any existing interval when not loading
        if (intervalRef.current) {
          console.log('🛑 [LOADING-SCREEN] Clearing tidbit interval - recipe completed')
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setIsVisible(false)
      }, 5000) // 5 second minimum display time to guarantee user sees tidbits
      
      return
    }

    console.log('✅ [LOADING-SCREEN] isLoadingRecipe is TRUE - starting tidbits system')
    console.log('🎬 [LOADING-SCREEN] Starting recipe loading screen with tidbits...')
    setIsVisible(true)
    setHasBeenVisible(true) // Mark that we've been visible
    
    // Set initial random tidbit
    console.log('🎯 [LOADING-SCREEN] Setting initial random tidbit...')
    const initialIndex = getRandomTidbitIndex()
    console.log('🎯 [LOADING-SCREEN] Initial tidbit index selected:', initialIndex)
    setCurrentTidbitIndex(initialIndex)
    previousIndexRef.current = -1 // Reset previous index
    setFadeClass('opacity-100')

    // Start interval for 9-second transitions
    console.log('⏰ [LOADING-SCREEN] Starting 9-second interval timer...')
    intervalRef.current = setInterval(() => {
      console.log('⏰ [LOADING-SCREEN] ===== 9-SECOND TIMER FIRED =====')
      console.log('⏰ [LOADING-SCREEN] Current isLoadingRecipe in interval:', isLoadingRecipe)
      if (isLoadingRecipe) {
        console.log('⏰ [LOADING-SCREEN] 9 seconds elapsed, transitioning to next tidbit...')
        transitionToNextTidbit()
      } else {
        console.log('⏰ [LOADING-SCREEN] Recipe completed during interval, skipping transition')
      }
    }, 9000) // 9 seconds
    
    console.log('⏰ [LOADING-SCREEN] Interval created with ID:', intervalRef.current)

    // Cleanup function
    return () => {
      console.log('🧹 [LOADING-SCREEN] ===== CLEANUP FUNCTION CALLED =====')
      if (intervalRef.current) {
        console.log('🧹 [LOADING-SCREEN] Cleaning up tidbit interval on unmount/change')
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (minDisplayTimeRef.current) {
        console.log('🧹 [LOADING-SCREEN] Cleaning up minimum display timer')
        clearTimeout(minDisplayTimeRef.current)
        minDisplayTimeRef.current = null
      }
    }
  }, [isLoadingRecipe, hasBeenVisible, getRandomTidbitIndex, isVisible, transitionToNextTidbit])

  // Don't render if not visible
  console.log('👁️ [LOADING-SCREEN] ===== RENDER CHECK =====')
  console.log('👁️ [LOADING-SCREEN] isVisible:', isVisible)
  console.log('👁️ [LOADING-SCREEN] isLoadingRecipe:', isLoadingRecipe)
  
  if (!isVisible) {
    console.log('🚫 [LOADING-SCREEN] Component not visible, returning null')
    return null
  }

  // Determine if current item is a fact or featured recipe
  console.log('🎨 [LOADING-SCREEN] ===== PREPARING RENDER DATA =====')
  console.log('🎨 [LOADING-SCREEN] Current tidbit index:', currentTidbitIndex)
  console.log('🎨 [LOADING-SCREEN] Fade class:', fadeClass)
  
  const isFactTidbit = currentTidbitIndex < allFactTidbits.length
  const currentFactItem = isFactTidbit ? allFactTidbits[currentTidbitIndex] as BaseTidbit : null
  const currentRecipeItem = !isFactTidbit ? featuredRecipeTidbits[currentTidbitIndex - allFactTidbits.length] as FeaturedRecipeTidbit : null
  
  console.log('🎨 [LOADING-SCREEN] Render data:', {
    isFactTidbit,
    currentFactTitle: currentFactItem?.fact?.substring(0, 30) + '...',
    currentRecipeTitle: currentRecipeItem?.title,
    hasValidData: !!(currentFactItem || currentRecipeItem)
  })

  console.log('🎨 [LOADING-SCREEN] ===== RENDERING COMPONENT =====')
  console.log('🎨 [LOADING-SCREEN] About to render with className:', className)
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/20 p-8 border border-emerald-100 dark:border-gray-700 ${className}`}>
      {/* Loading Header */}
      <div className="text-center mb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Generating Your Recipe
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Our AI is crafting the perfect recipe for you...
        </p>
      </div>

      {/* Tidbit Content with Fade Transition */}
      <div className={`min-h-[200px] flex items-center justify-center transition-opacity duration-300 ${fadeClass}`}>
        {isFactTidbit && currentFactItem ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl">💡</span>
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                Did You Know?
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
              {currentFactItem.emoji} {currentFactItem.fact}
            </p>
            {currentFactItem.source && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Source: {currentFactItem.source}
              </p>
            )}
          </div>
        ) : currentRecipeItem ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl">⭐</span>
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                Featured Recipe Inspiration
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
        ) : (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">Loading amazing tips...</p>
          </div>
        )}
      </div>

      {/* Visual Progress Indicator */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Powered by ChompChew AI • Learning while you wait
        </p>
      </div>
    </div>
  )
} 