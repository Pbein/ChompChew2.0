'use client'

import React, { useState, useEffect } from 'react'
import { CategoryScroller, RecipeCategory } from './CategoryScroller'
import { RecipeGrid } from './RecipeGrid'
import { RecipeCardData } from './RecipeCard'
import { fetchRecipes } from '@/lib/recipes'
import { useFinalSearchQuery } from '@/features/core/stores/searchStore'
import { useSavedRecipesStore } from '@/store/savedRecipesStore'
import { getSupabaseClient } from '@/lib/supabase'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

// Sample data for demonstration
const sampleCategories: RecipeCategory[] = [
  { id: 'all', name: 'All Recipes', emoji: '🍽️', count: 24 },
  { id: 'quick', name: 'Quick Meals', emoji: '⚡', count: 8 },
  { id: 'healthy', name: 'Healthy', emoji: '🥗', count: 12 },
  { id: 'comfort', name: 'Comfort Food', emoji: '🍲', count: 6 },
  { id: 'vegetarian', name: 'Vegetarian', emoji: '🌱', count: 10 },
  { id: 'gluten-free', name: 'Gluten-Free', emoji: '🌾', count: 7 },
  { id: 'high-protein', name: 'High Protein', emoji: '💪', count: 9 },
  { id: 'low-carb', name: 'Low Carb', emoji: '🥩', count: 5 },
  { id: 'desserts', name: 'Desserts', emoji: '🍰', count: 4 }
]

// Database-first mode with fallback recipes for reliability

interface RecipeSectionProps {
  className?: string
}

// Use the singleton Supabase client
const supabase = getSupabaseClient()

export function RecipeSection({ className }: RecipeSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [recipes, setRecipes] = useState<RecipeCardData[]>([])
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [userLoaded, setUserLoaded] = useState(false)

  const searchQuery = useFinalSearchQuery()
  const { toggleSave } = useSavedRecipesStore()

  // Get user session with proper singleton client
  useEffect(() => {
    let mounted = true
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (mounted) {
          setUser(user)
          setUserLoaded(true)
          console.log('RecipeSection - User loaded:', { 
            userId: user?.id || 'not authenticated',
            timestamp: new Date().toISOString()
          })
        }
      } catch (error) {
        console.error('RecipeSection - Error getting user:', error)
        if (mounted) {
          setUser(null)
          setUserLoaded(true)
        }
      }
    }
    
    getUser()

    // Listen for auth state changes using the singleton client
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      const newUser = session?.user ?? null
      if (mounted) {
        setUser(newUser)
        setUserLoaded(true)
        console.log('RecipeSection - Auth state changed:', { 
          event, 
          userId: newUser?.id || 'not authenticated',
          timestamp: new Date().toISOString()
        })
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Load recipes regardless of user state, but wait a moment for initial user check
    const load = async () => {
      setLoading(true)
      
      try {
        // For guest users (unauthenticated), show all recipes without filtering
        // For authenticated users, apply their profile filters only if they have active search
        const hasActiveSearch = searchQuery.ingredients.length > 0 || 
                               searchQuery.mealType.length > 0 || 
                               searchQuery.cuisine.length > 0 ||
                               searchQuery.dishes.length > 0
        
        const filters = (user && hasActiveSearch) ? searchQuery : {}
        
        console.log('RecipeSection loading recipes:', { 
          user: !!user, 
          userLoaded,
          hasActiveSearch, 
          searchQuery, 
          filters,
          timestamp: new Date().toISOString()
        })
        
        const data = await fetchRecipes(24, filters)
        
        // Set recipes from database (could be empty array)
        setRecipes(data || [])
        console.log(`RecipeSection - Loaded ${data?.length || 0} recipes`)
      } catch (error) {
        console.error('Error loading recipes:', error)
        // On error, show empty array (database-only mode)
        setRecipes([])
      } finally {
        setLoading(false)
      }
    }
    
    // Small delay to allow user auth to complete if available, but don't block recipe loading
    const timer = setTimeout(load, 100)
    
    return () => clearTimeout(timer)
  }, [user, searchQuery]) // Removed userLoaded dependency

  const baseRecipes = recipes

  const filteredRecipes = activeCategory === 'all' 
    ? baseRecipes 
    : baseRecipes.filter(recipe => {
        // Simple filtering logic - in real app this would be more sophisticated
        switch (activeCategory) {
          case 'quick':
            return recipe.prepTime <= 25
          case 'healthy':
            return recipe.calories && recipe.calories < 400
          case 'vegetarian':
            return recipe.dietaryCompliance?.some(tag => tag.toLowerCase().includes('vegan') || tag.toLowerCase().includes('vegetarian')) || false
          case 'gluten-free':
            return recipe.dietaryCompliance?.some(tag => tag.toLowerCase().includes('gluten-free')) || false
          case 'high-protein':
            return recipe.dietaryCompliance?.some(tag => tag.toLowerCase().includes('protein')) || false
          case 'low-carb':
            return recipe.dietaryCompliance?.some(tag => tag.toLowerCase().includes('low carb')) || false
          case 'comfort':
            return recipe.dietaryCompliance?.some(tag => tag.toLowerCase().includes('comfort')) || false
          case 'desserts':
            return recipe.dietaryCompliance?.some(tag => tag.toLowerCase().includes('dessert')) || false
          default:
            return true
        }
      })

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  const handleSaveRecipe = async (recipe: RecipeCardData) => {
    await toggleSave(recipe, user?.id)
  }

  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Discover Recipes You Can 
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              Actually Eat
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Browse our curated collection of safe, delicious recipes tailored to your dietary needs and preferences.
          </p>
        </div>

        {/* Category Scroller */}
        <div className="mb-16">
          <CategoryScroller
            categories={sampleCategories}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        {/* Recipe Grid */}
        <div className="max-w-8xl mx-auto">
          <RecipeGrid
            recipes={filteredRecipes}
            onSaveRecipe={handleSaveRecipe}
            onViewRecipe={() => {}}
            loading={loading}
            emptyMessage={`No ${activeCategory === 'all' ? '' : sampleCategories.find(c => c.id === activeCategory)?.name.toLowerCase() + ' '}recipes found`}
            cardSize="medium"
          />
        </div>
      </div>
    </section>
  )
} 