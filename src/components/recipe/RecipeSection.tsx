'use client'

import React, { useState, useEffect } from 'react'
import { CategoryScroller, RecipeCategory } from './CategoryScroller'
import { RecipeGrid } from './RecipeGrid'
import { RecipeCardData } from './RecipeCard'
import { fetchRecipes } from '@/lib/recipes'
import { useFinalSearchQuery } from '@/features/core/stores/searchStore'
import { useSavedRecipesStore } from '@/store/savedRecipesStore'
import { createClientComponentClient } from '@/lib/supabase'

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
  { id: 'desserts', name: 'Desserts', emoji: '��', count: 4 }
]

// Database-only mode - no fallback recipes

interface RecipeSectionProps {
  className?: string
}

export function RecipeSection({ className }: RecipeSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [recipes, setRecipes] = useState<RecipeCardData[]>([])
  const [user, setUser] = useState<{ id: string } | null>(null)

  const searchQuery = useFinalSearchQuery()
  const { toggleSave } = useSavedRecipesStore()

  // Get user session
  useEffect(() => {
    const supabase = createClientComponentClient()
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
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
        
        console.log('RecipeSection loading:', { 
          user: !!user, 
          hasActiveSearch, 
          searchQuery, 
          filters 
        })
        
        const data = await fetchRecipes(24, filters)
        
        // Set recipes from database (could be empty array)
        setRecipes(data || [])
      } catch (error) {
        console.error('Error loading recipes:', error)
        // On error, show empty array (database-only mode)
        setRecipes([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, searchQuery])

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

  const handleViewRecipe = (recipe: RecipeCardData) => {
    window.location.href = `/recipe/${recipe.id}`
  }

  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Discover Recipes You Can Actually Eat
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
            onViewRecipe={handleViewRecipe}
            loading={loading}
            emptyMessage={`No ${activeCategory === 'all' ? '' : sampleCategories.find(c => c.id === activeCategory)?.name.toLowerCase() + ' '}recipes found`}
            cardSize="medium"
          />
        </div>
      </div>
    </section>
  )
} 