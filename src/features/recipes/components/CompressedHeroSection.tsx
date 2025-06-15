'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { SearchBar } from './SearchBar'
import { Button } from '@/components/ui/Button'
import { FeaturedRecipeSpotlight } from './FeaturedRecipeSpotlight'
import { CategoryQuickAccess, CategoryTile } from './CategoryQuickAccess'
import { EnhancedSearchQuery } from '@/types/dietary-preferences'

interface FeaturedRecipe {
  id: string
  title: string
  description: string
  image?: string
  prepTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  trustBadges: string[]
  matchScore?: number
  cuisine?: string
}

interface CompressedHeroSectionProps {
  onSearch?: (query: EnhancedSearchQuery) => void
  onDietQuickSet?: () => void
  onViewRecipe?: (recipeId: string) => void
  featuredRecipe?: FeaturedRecipe
  categories?: CategoryTile[]
  className?: string
}

const COMMON_INGREDIENTS = [
  'chicken breast', 'salmon', 'ground beef', 'tofu', 'eggs',
  'broccoli', 'spinach', 'tomatoes', 'onions', 'garlic',
  'rice', 'pasta', 'quinoa', 'potatoes', 'bread'
]

// Default featured recipe
const DEFAULT_FEATURED_RECIPE: FeaturedRecipe = {
  id: 'featured-1',
  title: 'Mediterranean Quinoa Power Bowl',
  description: 'A nutrient-packed bowl with quinoa, roasted vegetables, and tahini dressing. Perfect for meal prep and loaded with plant-based protein.',
  prepTime: 25,
  difficulty: 'easy',
  servings: 2,
  trustBadges: ['✅ Vegan', '✅ High-Protein', '✅ Gluten-Free'],
  matchScore: 96,
  cuisine: 'Mediterranean'
}

export function CompressedHeroSection({ 
  onSearch, 
  onDietQuickSet,
  onViewRecipe,
  featuredRecipe = DEFAULT_FEATURED_RECIPE,
  categories,
  className 
}: CompressedHeroSectionProps) {
  const [showDietQuickSet, setShowDietQuickSet] = useState(false)

  const handleDietQuickSetClick = () => {
    setShowDietQuickSet(true)
    onDietQuickSet?.()
  }

  const handleSearch = async (query: EnhancedSearchQuery) => {
    await onSearch?.(query)
  }

  const handleViewRecipe = (recipeId: string) => {
    onViewRecipe?.(recipeId)
  }

  return (
    <section className={cn(
      // Compressed hero section with 40vh height (down from 70vh)
      "relative min-h-[40vh] flex items-center justify-center overflow-hidden",
      "bg-gradient-to-br from-primary via-accent to-secondary",
      "text-white",
      className
    )}>
      {/* Background pattern overlay for texture */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }} />
      
      <div className="container mx-auto px-4 relative z-10 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Search & Categories */}
          <div className="text-center lg:text-left">
            {/* Compressed headline */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight drop-shadow-lg">
              Discover recipes made for you
            </h1>
            
            {/* Compressed subheadline */}
            <p className="text-lg md:text-xl mb-6 leading-relaxed text-white/95 font-light drop-shadow-md">
              AI-powered recipe discovery tailored to your needs
            </p>
            
            {/* Compact search container */}
            <div className="mb-6">
              <SearchBar
                onSearch={handleSearch}
                suggestions={COMMON_INGREDIENTS}
                onFocus={() => setShowDietQuickSet(true)}
                className="hero-search"
              />
              
              {/* Diet Quick-Set Button - More compact */}
              {showDietQuickSet && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Button
                    variant="secondary"
                    onClick={handleDietQuickSetClick}
                    className="bg-white/15 backdrop-blur-sm border-white/40 text-white hover:bg-white/25 transition-all duration-200 font-semibold shadow-lg text-sm px-4 py-2"
                  >
                    🎯 Customize Diet Preferences
                  </Button>
                </div>
              )}
            </div>
            
            {/* Category Quick Access - Replaces diet badges */}
            {categories && (
              <CategoryQuickAccess 
                categories={categories}
                className="lg:hidden" // Show on mobile/tablet, hide on desktop
              />
            )}
            
            {/* Trust indicators - More compact */}
            <div className="hidden lg:flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm text-white/80 font-medium mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg backdrop-blur-sm">
                <span className="text-base">🤖</span>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg backdrop-blur-sm">
                <span className="text-base">⚡</span>
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg backdrop-blur-sm">
                <span className="text-base">🔒</span>
                <span>Privacy First</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Recipe */}
          <div className="flex flex-col gap-6">
            <FeaturedRecipeSpotlight 
              recipe={featuredRecipe}
              onViewRecipe={handleViewRecipe}
            />
            
            {/* Category Quick Access for Desktop */}
            {categories && (
              <div className="hidden lg:block">
                <CategoryQuickAccess 
                  categories={categories}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </section>
  )
}

// Export types for use in other components
export type { FeaturedRecipe } 