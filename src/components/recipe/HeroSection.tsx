'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { SearchBar } from './SearchBar'
import { Button } from '@/components/ui/Button'
import { EnhancedSearchQuery } from '@/types/dietary-preferences'

interface HeroSectionProps {
  onSearch?: (query: EnhancedSearchQuery) => void
  onDietQuickSet?: () => void
  className?: string
}

const COMMON_INGREDIENTS = [
  'chicken breast', 'salmon', 'ground beef', 'tofu', 'eggs',
  'broccoli', 'spinach', 'tomatoes', 'onions', 'garlic',
  'rice', 'pasta', 'quinoa', 'potatoes', 'bread'
]

const DIET_BADGES = [
  { label: 'Vegetarian', value: 'vegetarian', emoji: '🥬', color: 'bg-green-600 text-white' },
  { label: 'Vegan', value: 'vegan', emoji: '🌱', color: 'bg-green-700 text-white' },
  { label: 'Keto', value: 'keto', emoji: '🥑', color: 'bg-orange-600 text-white' },
  { label: 'Gluten-Free', value: 'gluten-free', emoji: '🌾', color: 'bg-purple-600 text-white' },
  { label: 'Dairy-Free', value: 'dairy-free', emoji: '🥛', color: 'bg-cyan-600 text-white' },
  { label: 'Paleo', value: 'paleo', emoji: '🍖', color: 'bg-amber-600 text-white' }
]

export function HeroSection({ 
  onSearch, 
  onDietQuickSet,
  className 
}: HeroSectionProps) {
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [showDietQuickSet, setShowDietQuickSet] = useState(false)

  const handleDietToggle = (dietValue: string) => {
    setSelectedDiets(prev => 
      prev.includes(dietValue)
        ? prev.filter(d => d !== dietValue)
        : [...prev, dietValue]
    )
  }

  const handleDietQuickSetClick = () => {
    setShowDietQuickSet(true)
    onDietQuickSet?.()
  }

  const handleSearch = async (query: EnhancedSearchQuery) => {
    // Add selected diets to the dietary restrictions if any
    const enhancedQuery = {
      ...query,
      dietaryRestrictions: [...query.dietaryRestrictions, ...selectedDiets]
    }
    
    await onSearch?.(enhancedQuery)
  }

  return (
    <section className={cn(
      // Hero section with 70vh height and gradient background as per design brief
      "relative min-h-hero flex items-center justify-center overflow-hidden",
      "bg-gradient-to-br from-primary via-accent to-secondary",
      "text-white",
      className
    )}>
      {/* Background pattern overlay for texture */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }} />
      
      <div className="container mx-auto px-4 text-center relative z-10 py-16">
        {/* Main headline with display typography */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
          Discover recipes made for you
        </h1>
        
        {/* Subheadline with strategic color accent */}
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-white/95 font-light drop-shadow-md">
          AI-powered recipe discovery tailored to your dietary needs and preferences
        </p>
        
        {/* Search container with generous spacing */}
        <div className="max-w-3xl mx-auto mb-8">
          <SearchBar
            onSearch={handleSearch}
            suggestions={COMMON_INGREDIENTS}
            onFocus={() => setShowDietQuickSet(true)}
            className="hero-search"
          />
          
          {/* Diet Quick-Set Button */}
          {showDietQuickSet && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Button
                variant="secondary"
                onClick={handleDietQuickSetClick}
                className="bg-white/15 backdrop-blur-sm border-white/40 text-white hover:bg-white/25 transition-all duration-200 font-semibold shadow-lg"
              >
                🎯 Customize Diet Preferences
              </Button>
            </div>
          )}
        </div>
        
        {/* Quick diet badges with dark glass effect */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-12">
          <p className="w-full text-lg text-white/90 mb-6 font-semibold drop-shadow-md">
            Quick dietary preferences:
          </p>
          {DIET_BADGES.map((diet) => (
            <button
              key={diet.value}
              onClick={() => handleDietToggle(diet.value)}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200",
                "border backdrop-blur-md shadow-lg",
                "hover:scale-105 active:scale-95 transform",
                "min-h-touch min-w-touch", // Touch-optimized
                selectedDiets.includes(diet.value)
                  ? `${diet.color} border-white/30 shadow-xl shadow-black/40 ring-2 ring-white/20`
                  : "bg-black/30 text-white border-white/20 hover:bg-black/40 hover:border-white/30 hover:shadow-xl shadow-black/30"
              )}
              aria-pressed={selectedDiets.includes(diet.value)}
            >
              <span className="text-base">{diet.emoji}</span>
              <span>{diet.label}</span>
            </button>
          ))}
        </div>
        
        {/* Selected diets indicator */}
        {selectedDiets.length > 0 && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30 shadow-lg">
              <span className="text-sm text-white font-semibold">
                Selected: {selectedDiets.map(diet => 
                  DIET_BADGES.find(d => d.value === diet)?.label
                ).join(', ')}
              </span>
              <button
                onClick={() => setSelectedDiets([])}
                className="text-white/80 hover:text-white text-sm ml-2 hover:bg-white/20 rounded-full px-3 py-1 transition-colors font-medium"
              >
                Clear ✕
              </button>
            </div>
          </div>
        )}
        
        {/* Trust indicators - balanced prominence */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/80 font-medium">
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
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg backdrop-blur-sm">
            <span className="text-base">💚</span>
            <span>Dietary Safe</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </section>
  )
} 