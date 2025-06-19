'use client'

import React, { useState } from 'react'
import { useSavedRecipesStore } from '@/store/savedRecipesStore'
import { createClientComponentClient } from '@/lib/supabase'
import { RecipeCardData } from '@/components/recipe/RecipeCard'

interface SaveRecipeButtonProps {
  recipe: RecipeCardData
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function SaveRecipeButton({ 
  recipe, 
  className = "",
  size = 'md'
}: SaveRecipeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toggleSave, isSaved } = useSavedRecipesStore()
  const saved = isSaved(recipe.id)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10'
  }

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      const supabase = createClientComponentClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        // User not authenticated, redirect to sign in
        window.location.href = '/auth/signin'
        return
      }
      
      await toggleSave(recipe, user.id)
    } catch (error) {
      console.error('Error saving recipe:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`
        bg-white/90 hover:bg-white rounded-full flex items-center justify-center 
        shadow-md transition-all duration-200 hover:scale-110 disabled:opacity-50
        ${sizeClasses[size]} ${className}
      `}
      aria-label={saved ? "Remove from favorites" : "Add to favorites"}
    >
      {isLoading ? (
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-red-500 ${iconSize[size]}`} />
      ) : saved ? (
        <svg className={`text-red-500 fill-current ${iconSize[size]}`} viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg className={`text-red-500 ${iconSize[size]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
    </button>
  )
} 