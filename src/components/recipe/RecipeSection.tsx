'use client'

import React, { useState } from 'react'
import { CategoryScroller, RecipeCategory } from './CategoryScroller'
import { RecipeGrid } from './RecipeGrid'
import { RecipeCardData } from './RecipeCard'

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

const sampleRecipes: RecipeCardData[] = [
  {
    id: '1',
    title: 'Mediterranean Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    prepTime: 25,
    difficulty: 'easy',
    servings: 2,
    dietaryCompliance: ['Vegetarian', 'Gluten-Free', 'High Protein'],
    safetyValidated: true,
    calories: 420,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Grilled Chicken with Herbs',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
    prepTime: 30,
    difficulty: 'medium',
    servings: 4,
    dietaryCompliance: ['High Protein', 'Low Carb', 'Paleo'],
    safetyValidated: true,
    calories: 350,
    rating: 4.6
  },
  {
    id: '3',
    title: 'Vegan Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    prepTime: 20,
    difficulty: 'easy',
    servings: 1,
    dietaryCompliance: ['Vegan', 'Gluten-Free', 'High Fiber'],
    safetyValidated: true,
    calories: 380,
    rating: 4.7
  },
  {
    id: '4',
    title: 'Creamy Mushroom Risotto',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
    prepTime: 45,
    difficulty: 'hard',
    servings: 3,
    dietaryCompliance: ['Vegetarian', 'Comfort Food'],
    safetyValidated: true,
    calories: 520,
    rating: 4.9
  },
  {
    id: '5',
    title: 'Salmon with Roasted Vegetables',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    prepTime: 35,
    difficulty: 'medium',
    servings: 2,
    dietaryCompliance: ['High Protein', 'Omega-3', 'Low Carb'],
    safetyValidated: true,
    calories: 450,
    rating: 4.5
  },
  {
    id: '6',
    title: 'Chocolate Avocado Mousse',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop',
    prepTime: 15,
    difficulty: 'easy',
    servings: 4,
    dietaryCompliance: ['Vegan', 'Gluten-Free', 'Healthy Dessert'],
    safetyValidated: true,
    calories: 180,
    rating: 4.4
  }
]

interface RecipeSectionProps {
  className?: string
}

export function RecipeSection({ className }: RecipeSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  // Filter recipes based on active category
  const filteredRecipes = activeCategory === 'all' 
    ? sampleRecipes 
    : sampleRecipes.filter(recipe => {
        // Simple filtering logic - in real app this would be more sophisticated
        switch (activeCategory) {
          case 'quick':
            return recipe.prepTime <= 25
          case 'healthy':
            return recipe.calories && recipe.calories < 400
          case 'vegetarian':
            return recipe.dietaryCompliance.some(tag => tag.toLowerCase().includes('vegan') || tag.toLowerCase().includes('vegetarian'))
          case 'gluten-free':
            return recipe.dietaryCompliance.some(tag => tag.toLowerCase().includes('gluten-free'))
          case 'high-protein':
            return recipe.dietaryCompliance.some(tag => tag.toLowerCase().includes('protein'))
          case 'low-carb':
            return recipe.dietaryCompliance.some(tag => tag.toLowerCase().includes('low carb'))
          case 'comfort':
            return recipe.dietaryCompliance.some(tag => tag.toLowerCase().includes('comfort'))
          case 'desserts':
            return recipe.dietaryCompliance.some(tag => tag.toLowerCase().includes('dessert'))
          default:
            return true
        }
      })

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId)
    setLoading(true)
    // Simulate loading
    setTimeout(() => setLoading(false), 500)
  }

  const handleSaveRecipe = (recipe: RecipeCardData) => {
    console.log('Saving recipe:', recipe.title)
    // TODO: Implement save functionality
  }

  const handleViewRecipe = (recipe: RecipeCardData) => {
    console.log('Viewing recipe:', recipe.title)
    // TODO: Implement view details functionality
  }

  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
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