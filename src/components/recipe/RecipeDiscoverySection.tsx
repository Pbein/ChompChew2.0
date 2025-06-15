'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface SimpleRecipe {
  id: string
  title: string
  description: string
  image: string
  prepTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  trustBadges: string[]
  matchScore?: number
  rating?: number
  reviews?: number
}

interface RecipeCollection {
  id: string
  title: string
  subtitle?: string
  icon: string
  recipes: SimpleRecipe[]
  viewAllLink?: string
}

interface RecipeDiscoverySectionProps {
  collections?: RecipeCollection[]
  className?: string
}

const SAMPLE_RECIPES: SimpleRecipe[] = [
  {
    id: '1',
    title: 'Honey Garlic Salmon Bowl',
    description: 'Flaky salmon with honey garlic glaze served over quinoa',
    image: '/api/placeholder/300/200',
    prepTime: 20,
    difficulty: 'easy',
    servings: 2,
    trustBadges: ['✅ High-Protein', '✅ Omega-3 Rich'],
    matchScore: 94,
    rating: 4.8,
    reviews: 247
  },
  {
    id: '2',
    title: 'Mediterranean Chickpea Salad',
    description: 'Fresh chickpea salad with cucumber, tomatoes, and feta',
    image: '/api/placeholder/300/200',
    prepTime: 15,
    difficulty: 'easy',
    servings: 4,
    trustBadges: ['✅ Vegetarian', '✅ High-Fiber'],
    matchScore: 91,
    rating: 4.6,
    reviews: 189
  },
  {
    id: '3',
    title: 'Thai Green Curry',
    description: 'Aromatic green curry with vegetables and jasmine rice',
    image: '/api/placeholder/300/200',
    prepTime: 25,
    difficulty: 'medium',
    servings: 3,
    trustBadges: ['✅ Dairy-Free', '✅ Gluten-Free'],
    matchScore: 88,
    rating: 4.7,
    reviews: 156
  },
  {
    id: '4',
    title: 'Avocado Toast Supreme',
    description: 'Sourdough toast topped with smashed avocado and everything seasoning',
    image: '/api/placeholder/300/200',
    prepTime: 8,
    difficulty: 'easy',
    servings: 1,
    trustBadges: ['✅ Vegan', '✅ Quick'],
    matchScore: 92,
    rating: 4.5,
    reviews: 324
  }
]

const DEFAULT_COLLECTIONS: RecipeCollection[] = [
  {
    id: 'trending',
    title: 'Trending This Week',
    subtitle: 'Popular recipes everyone is cooking',
    icon: '🔥',
    recipes: SAMPLE_RECIPES,
    viewAllLink: '/recipes/trending'
  },
  {
    id: 'quick',
    title: 'Ready in 20 Minutes',
    subtitle: 'Quick meals for busy weeknights',
    icon: '⚡',
    recipes: SAMPLE_RECIPES,
    viewAllLink: '/recipes/quick'
  },
  {
    id: 'gut-friendly',
    title: 'Gut-Friendly Favorites',
    subtitle: 'Recipes that support digestive health',
    icon: '🌿',
    recipes: SAMPLE_RECIPES,
    viewAllLink: '/recipes/gut-friendly'
  }
]

export function RecipeDiscoverySection({ 
  collections = DEFAULT_COLLECTIONS, 
  className 
}: RecipeDiscoverySectionProps) {
  return (
    <section className={cn("w-full bg-white", className)}>
      <div className="container mx-auto px-md max-w-[1200px]">
        {/* Section Header */}
        <div className="text-center mb-xl">
          <h2 className="font-display text-h1 font-bold mb-lg text-gray-900">
            Discover Your Perfect Recipe
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our curated collections of recipes designed to make cooking easier and more enjoyable.
          </p>
        </div>

        {/* Recipe Collections */}
        <div className="space-y-3xl">
          {collections.map((collection) => (
            <div key={collection.id} className="w-full">
              {/* Collection Header */}
              <div className="flex items-center justify-between mb-lg">
                <div className="flex items-center gap-md">
                  <span className="text-2xl">{collection.icon}</span>
                  <div>
                    <h3 className="text-h2 font-bold text-gray-900">
                      {collection.title}
                    </h3>
                    {collection.subtitle && (
                      <p className="text-base text-gray-600 mt-1">
                        {collection.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                
                {collection.viewAllLink && (
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary-dark font-semibold"
                  >
                    View All →
                  </Button>
                )}
              </div>

              {/* Recipe Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
                {collection.recipes.slice(0, 4).map((recipe) => (
                  <div key={recipe.id} className="w-full">
                    <div className="recipe-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                      {/* Recipe Image */}
                      <div className="relative h-48 bg-gray-200 rounded-t-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-4xl">
                            {recipe.id === '1' ? '🍣' : recipe.id === '2' ? '🥗' : recipe.id === '3' ? '🍛' : '🥑'}
                          </span>
                        </div>
                        {recipe.matchScore && (
                          <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                            {recipe.matchScore}% Match
                          </div>
                        )}
                      </div>

                      {/* Recipe Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                            {recipe.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {recipe.description}
                          </p>

                          {/* Trust Badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {recipe.trustBadges.slice(0, 2).map((badge, index) => (
                              <span key={index} className="text-xs bg-accent/20 text-accent-dark px-2 py-1 rounded-full">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Recipe Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                          <span className="flex items-center gap-1">
                            <span>⏱️</span>
                            {recipe.prepTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <span>👥</span>
                            {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
                          </span>
                          {recipe.rating && (
                            <span className="flex items-center gap-1">
                              <span>⭐</span>
                              {recipe.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Browse More CTA */}
        <div className="text-center mt-3xl">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-xl py-lg"
          >
            Browse All Recipes
          </Button>
        </div>
      </div>
    </section>
  )
}

export type { SimpleRecipe, RecipeCollection } 