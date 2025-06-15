'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { User, canGenerateRecipes, getUserRoleDisplay } from '@/lib/auth-utils'

export default function GenerateRecipePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [recipeInput, setRecipeInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  // Check authentication status with role information
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          setUser(null)
          setLoading(false)
          return
        }

        // Get user profile with role information
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: profile.role || 'free',
            subscription_status: profile.subscription_status,
            subscription_tier: profile.subscription_tier,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          })
        } else {
          // Fallback for users without profile yet
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            role: 'free',
            created_at: authUser.created_at,
            updated_at: authUser.updated_at || authUser.created_at
          })
        }
      } catch (error) {
        console.error('Error getting user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Reload user with role information
        getUser()
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleGenerateRecipe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recipeInput.trim()) return

    setIsGenerating(true)
    
    try {
      // TODO: Replace with actual API call to generate recipe
      // For now, we'll simulate the generation with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock response for testing
      const mockRecipe = `# ${recipeInput.charAt(0).toUpperCase() + recipeInput.slice(1)}

## Ingredients:
- 2 large flour tortillas
- 1 lb chicken breast, diced
- 1 cup cooked rice
- 1/2 cup black beans
- 1/2 cup shredded cheese
- 1/4 cup diced onions
- 2 tbsp olive oil
- Salt and pepper to taste

## Instructions:
1. Heat olive oil in a large skillet over medium-high heat
2. Season chicken with salt and pepper, then cook until golden brown
3. Add onions and cook until softened
4. Warm tortillas in microwave for 30 seconds
5. Fill tortillas with rice, chicken, beans, and cheese
6. Roll tightly and serve immediately

## Cooking Time: 25 minutes
## Servings: 2`

      setGeneratedRecipe(mockRecipe)
    } catch (error) {
      console.error('Error generating recipe:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setRecipeInput('')
    setGeneratedRecipe(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show authentication required page for non-authenticated users or users without access
  if (!user || !canGenerateRecipes(user)) {
    const isAuthenticated = !!user
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/20 p-8 border border-emerald-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">✨</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                AI Recipe Generator
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Generate personalized recipes with our AI-powered recipe creator. 
                This is a premium feature available to authenticated users.
              </p>
              
              {isAuthenticated ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                  <h3 className="font-semibold text-blue-800 mb-2">👋 Welcome, {getUserRoleDisplay(user)}!</h3>
                  <p className="text-blue-700 text-sm">
                    You need a premium subscription to access the AI recipe generator. 
                    Upgrade your account to start creating custom recipes.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                  <h3 className="font-semibold text-amber-800 mb-2">🔒 Paid Feature</h3>
                  <p className="text-amber-700 text-sm">
                    This AI recipe generator is available exclusively to our premium subscribers. 
                    Sign in to your paid account to access this feature.
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <>
                    <Link href="/pricing">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto font-semibold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-200 hover:scale-105"
                      >
                        Upgrade to Premium
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full sm:w-auto font-semibold text-gray-700 hover:text-emerald-700 hover:bg-white/60"
                      >
                        Manage Account
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto font-semibold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-200 hover:scale-105"
                      >
                        Sign In to Premium Account
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full sm:w-auto font-semibold text-gray-700 hover:text-emerald-700 hover:bg-white/60"
                      >
                        View Pricing Plans
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main authenticated user interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              AI Recipe Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Describe what you&apos;d like to cook and our AI will create a personalized recipe for you
            </p>
          </div>

          {/* Input Form */}
          {!generatedRecipe && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/20 p-8 border border-emerald-100 dark:border-gray-700 mb-8">
              <form onSubmit={handleGenerateRecipe} className="space-y-6">
                <div>
                  <label htmlFor="recipe-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    What would you like to cook?
                  </label>
                  <input
                    id="recipe-input"
                    type="text"
                    value={recipeInput}
                    onChange={(e) => setRecipeInput(e.target.value)}
                    placeholder="e.g., chicken burrito, chocolate chip cookies, vegetarian pasta..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isGenerating}
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!recipeInput.trim() || isGenerating}
                  className="w-full font-semibold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating Recipe...
                    </div>
                  ) : (
                    'Generate Recipe ✨'
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Generated Recipe Display */}
          {generatedRecipe && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/20 p-8 border border-emerald-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Generated Recipe</h2>
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  size="md"
                  className="font-semibold text-gray-600 dark:text-gray-300 hover:text-emerald-700"
                >
                  Generate Another
                </Button>
              </div>
              
              <div className="prose prose-emerald max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
                  {generatedRecipe}
                </pre>
              </div>
              
              {/* Future: Add save recipe button here */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Recipe generated by ChompChew AI • Save feature coming soon
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 