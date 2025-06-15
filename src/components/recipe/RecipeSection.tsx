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

// Fallback sample recipes in case database is empty (using placeholder UUIDs)
const sampleRecipes: RecipeCardData[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Mediterranean Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    prepTime: 25,
    difficulty: 'easy',
    servings: 2,
    dietaryCompliance: ['vegetarian', 'gluten-free', 'high-protein'],
    safetyValidated: true,
    calories: 420,
    rating: 4.8
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Honey Garlic Salmon',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    prepTime: 20,
    difficulty: 'easy',
    servings: 4,
    dietaryCompliance: ['high-protein', 'omega-3'],
    safetyValidated: true,
    calories: 350,
    rating: 4.6
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Vegan Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    prepTime: 30,
    difficulty: 'medium',
    servings: 2,
    dietaryCompliance: ['vegan', 'dairy-free', 'high-fiber'],
    safetyValidated: true,
    calories: 380,
    rating: 4.7
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Classic Chicken Soup',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
    prepTime: 15,
    difficulty: 'easy',
    servings: 4,
    dietaryCompliance: ['low-fiber', 'uc-safe', 'comfort-food'],
    safetyValidated: true,
    calories: 280,
    rating: 4.9
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Avocado Toast with Poached Egg',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    prepTime: 15,
    difficulty: 'easy',
    servings: 2,
    dietaryCompliance: ['vegetarian', 'high-protein', 'healthy-fats'],
    safetyValidated: true,
    calories: 320,
    rating: 4.5
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Thai Green Curry',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
    prepTime: 35,
    difficulty: 'medium',
    servings: 4,
    dietaryCompliance: ['vegan', 'dairy-free', 'spicy'],
    safetyValidated: true,
    calories: 450,
    rating: 4.6
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    title: 'Grilled Chicken Caesar Salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    prepTime: 27,
    difficulty: 'easy',
    servings: 2,
    dietaryCompliance: ['high-protein', 'low-carb'],
    safetyValidated: true,
    calories: 380,
    rating: 4.4
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    title: 'Mushroom Risotto',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
    prepTime: 35,
    difficulty: 'medium',
    servings: 4,
    dietaryCompliance: ['vegetarian', 'comfort-food'],
    safetyValidated: true,
    calories: 340,
    rating: 4.7
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    title: 'Black Bean Tacos',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    prepTime: 18,
    difficulty: 'easy',
    servings: 4,
    dietaryCompliance: ['vegetarian', 'dairy-free', 'high-fiber'],
    safetyValidated: true,
    calories: 290,
    rating: 4.3
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    title: 'Beef Stir Fry',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    prepTime: 25,
    difficulty: 'medium',
    servings: 3,
    dietaryCompliance: ['high-protein', 'low-carb', 'dairy-free'],
    safetyValidated: true,
    calories: 320,
    rating: 4.5
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    title: 'Chocolate Chip Cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    prepTime: 26,
    difficulty: 'easy',
    servings: 36,
    dietaryCompliance: ['dessert', 'comfort-food'],
    safetyValidated: true,
    calories: 140,
    rating: 4.8
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    title: 'Greek Yogurt Parfait',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    prepTime: 5,
    difficulty: 'easy',
    servings: 2,
    dietaryCompliance: ['vegetarian', 'high-protein', 'probiotic'],
    safetyValidated: true,
    calories: 280,
    rating: 4.6
  }
]

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

  // Extract searchQuery serialization to avoid complex expression in dependency array
  const searchQueryString = JSON.stringify(searchQuery)

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
        
        // If no recipes from database, use sample recipes for demo
        if (data && data.length === 0 && Object.keys(filters).length === 0) {
          setRecipes(sampleRecipes)
        } else if (data) {
          setRecipes(data)
        } else {
          // Fallback to sample recipes if data is null/undefined
          setRecipes(sampleRecipes)
        }
      } catch (error) {
        console.error('Error loading recipes:', error)
        // On error, always fall back to sample recipes
        setRecipes(sampleRecipes)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, searchQuery, searchQueryString])

  const baseRecipes = recipes.length ? recipes : sampleRecipes

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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Discover Recipes You Can Actually Eat
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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