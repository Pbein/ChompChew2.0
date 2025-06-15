'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { RecipeCardDeck } from '@/components/recipe/RecipeCardDeck'
import { Button } from '@/components/ui/Button'
import { EnhancedSearchQuery, MacroTargets } from '@/types/dietary-preferences'

// Use the Recipe interface expected by RecipeCardDeck
interface Recipe {
  id: string
  title: string
  image: string
  prepTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  dietaryCompliance: string[]
}

function GeneratePageContent() {
  const searchParams = useSearchParams()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<EnhancedSearchQuery | null>(null)

  // Parse search parameters into EnhancedSearchQuery
  useEffect(() => {
    const ingredients = searchParams.get('ingredients')?.split(',').filter(Boolean) || []
    const calories = searchParams.get('calories')
    const macros = searchParams.get('macros')
    const dietary = searchParams.get('dietary')?.split(',').filter(Boolean) || []
    const avoid = searchParams.get('avoid')?.split(',').filter(Boolean) || []

    let macroTargets: MacroTargets | undefined
    if (macros) {
      try {
        macroTargets = JSON.parse(macros)
      } catch (e) {
        console.error('Failed to parse macro targets:', e)
      }
    }

    const query: EnhancedSearchQuery = {
      ingredients,
      calorieGoal: calories ? parseInt(calories) : undefined,
      macroTargets,
      dietaryRestrictions: dietary,
      avoidFoods: avoid
    }

    setSearchQuery(query)
  }, [searchParams])

  // Generate recipes when search query is ready
  useEffect(() => {
    if (!searchQuery) return

    const generateRecipes = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/recipes/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchQuery),
        })

        if (!response.ok) {
          throw new Error(`Failed to generate recipes: ${response.statusText}`)
        }

        const data = await response.json()
        
        // Convert API response to Recipe format expected by RecipeCardDeck
        if (data.recipe) {
          const recipe: Recipe = {
            id: Date.now().toString(), // Generate a temporary ID
            title: data.recipe.title,
            image: '', // No image for now
            prepTime: data.recipe.metadata?.prepTime || 30,
            difficulty: data.recipe.metadata?.difficulty || 'medium',
            servings: data.recipe.metadata?.servings || 4,
            dietaryCompliance: data.recipe.tags || []
          }
          setRecipes([recipe])
        } else {
          setRecipes([])
        }
      } catch (err) {
        console.error('Recipe generation failed:', err)
        setError(err instanceof Error ? err.message : 'Failed to generate recipes')
      } finally {
        setIsLoading(false)
      }
    }

    generateRecipes()
  }, [searchQuery])

  const handleSaveRecipe = (recipe: Recipe) => {
    // TODO: Implement recipe saving functionality
    console.log('Saving recipe:', recipe.title)
  }

  const handleSkipRecipe = (recipe: Recipe) => {
    console.log('Skipping recipe:', recipe.title)
  }

  const handleViewDetails = (recipe: Recipe) => {
    console.log('Viewing details for recipe:', recipe.title)
    // TODO: Navigate to recipe detail page
  }

  const handleGenerateMore = async () => {
    if (!searchQuery) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...searchQuery,
          excludeRecipes: recipes.map(r => r.id) // Avoid duplicates
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Convert API response and add to existing recipes
        if (data.recipe) {
          const newRecipe: Recipe = {
            id: Date.now().toString(),
            title: data.recipe.title,
            image: '',
            prepTime: data.recipe.metadata?.prepTime || 30,
            difficulty: data.recipe.metadata?.difficulty || 'medium',
            servings: data.recipe.metadata?.servings || 4,
            dietaryCompliance: data.recipe.tags || []
          }
          setRecipes(prev => [...prev, newRecipe])
        }
      }
    } catch (err) {
      console.error('Failed to generate more recipes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Query Summary */}
        {searchQuery && (
          <div className="mb-8 p-6 bg-card rounded-2xl border border-border/30 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Recipe Search Results
            </h2>
            <div className="flex flex-wrap gap-3 text-sm">
              {searchQuery.ingredients.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full">
                  <span className="font-medium">Ingredients:</span>
                  <span>{searchQuery.ingredients.join(', ')}</span>
                </div>
              )}
              {searchQuery.calorieGoal && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full">
                  <span className="font-medium">Calories:</span>
                  <span>{searchQuery.calorieGoal}</span>
                </div>
              )}
              {searchQuery.macroTargets && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary rounded-full">
                  <span className="font-medium">Macros:</span>
                  <span>P:{searchQuery.macroTargets.protein}% C:{searchQuery.macroTargets.carbs}% F:{searchQuery.macroTargets.fat}%</span>
                </div>
              )}
              {searchQuery.dietaryRestrictions.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full">
                  <span className="font-medium">Diet:</span>
                  <span>{searchQuery.dietaryRestrictions.join(', ')}</span>
                </div>
              )}
              {searchQuery.avoidFoods.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-800 rounded-full">
                  <span className="font-medium">Avoiding:</span>
                  <span>{searchQuery.avoidFoods.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && recipes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">
              Creating your perfect recipes...
            </h2>
            <p className="text-muted-foreground">
              Our AI chef is crafting personalized recipes just for you
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😕</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Recipe Results */}
        {!isLoading && !error && recipes.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2 text-foreground">
                Your Personalized Recipes
              </h2>
              <p className="text-muted-foreground">
                Swipe through recipes tailored to your preferences
              </p>
            </div>

            <RecipeCardDeck
              recipes={recipes}
              onSave={handleSaveRecipe}
              onSkip={handleSkipRecipe}
              onViewDetails={handleViewDetails}
              onLoadMore={handleGenerateMore}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && recipes.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤔</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">
              No recipes found
            </h2>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t find any recipes matching your criteria. Try adjusting your search or dietary preferences.
            </p>
            <div className="space-y-3">
              <Button onClick={handleGenerateMore} variant="secondary">
                Generate Custom Recipe
              </Button>
              <p className="text-sm text-muted-foreground">
                Our AI will create a unique recipe just for you
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">
              Loading...
            </h2>
            <p className="text-muted-foreground">
              Preparing your recipe generation
            </p>
          </div>
        </main>
      </div>
    }>
      <GeneratePageContent />
    </Suspense>
  )
} 