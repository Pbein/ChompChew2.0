'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { User, canGenerateRecipes, getUserRoleDisplay } from '@/lib/auth-utils'
import { generateRecipeAction } from './actions'
import Image from 'next/image'
import { GenerateRecipeLoadingScreenTidbitsAndTips } from '@/components/recipe/GenerateRecipeLoadingScreenTidbitsAndTips'

export default function GenerateRecipePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [recipeInput, setRecipeInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [allergens, setAllergens] = useState<string[]>([])

  // 🎯 SIMPLE JAVASCRIPT APPROACH - just use isGenerating boolean!
  const showLoadingTips = isGenerating

  // Only log significant state changes (not every keystroke)
  useEffect(() => {
    if (isGenerating) {
      console.log('🎯 [MAIN-PAGE] Recipe generation started')
    }
  }, [isGenerating])

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
          // Save basic user meta
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

          // Save dietary data so we can pass it to the generator
          setDietaryPreferences(Array.isArray(profile.dietary_preferences) ? profile.dietary_preferences : [])
          setAllergens(Array.isArray(profile.allergens) ? profile.allergens : [])
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

  const handleGenerateRecipe = async () => {
    console.log('🎯 [MAIN-PAGE] Starting recipe generation')
    setIsGenerating(true) // This will show loading tips
    
    try {
      // Create form data
      const formData = new FormData()
      formData.set('prompt', recipeInput)
      formData.set('dietaryPreferences', JSON.stringify(dietaryPreferences))
      formData.set('allergens', JSON.stringify(allergens))
      
      await generateRecipeAction(formData)
      // Server action redirects to recipe page on success
      setIsGenerating(false)
      
    } catch (error) {
      console.error('❌ [MAIN-PAGE] Recipe generation failed:', error)
      setIsGenerating(false)
      // TODO: Show user-friendly error message in UI
    }
  }



  const handleReset = () => {
    setRecipeInput('')
    setGeneratedRecipe(null)
    setGeneratedImageUrl(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show authentication required page for non-authenticated users or users without access
  if (!user || !canGenerateRecipes(user)) {
    const isAuthenticated = !!user
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-accent-foreground text-2xl">✨</span>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                AI Recipe Generator
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                Generate personalized recipes with our AI-powered recipe creator. 
                This is a premium feature available to authenticated users.
              </p>
              
              {isAuthenticated ? (
                <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-8">
                  <h3 className="font-semibold text-info mb-2">👋 Welcome, {getUserRoleDisplay(user)}!</h3>
                  <p className="text-info/80 text-sm">
                    You need a premium subscription to access the AI recipe generator. 
                    Upgrade your account to start creating custom recipes.
                  </p>
                </div>
              ) : (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-8">
                  <h3 className="font-semibold text-warning mb-2">🔒 Paid Feature</h3>
                  <p className="text-warning/80 text-sm">
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
                        className="w-full sm:w-auto font-semibold bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        Upgrade to Premium
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full sm:w-auto font-semibold text-muted-foreground hover:text-accent hover:bg-muted/60"
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
                        className="w-full sm:w-auto font-semibold bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        Sign In to Premium Account
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full sm:w-auto font-semibold text-muted-foreground hover:text-accent hover:bg-muted/60"
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI Recipe Generator
            </h1>
            <p className="text-lg text-muted-foreground">
              Describe what you&apos;d like to cook and our AI will create a personalized recipe for you
            </p>
          </div>

          {/* 🎯 SIMPLE CONDITIONAL RENDERING */}
          {!generatedRecipe && (
            <>
              {showLoadingTips ? (
                <GenerateRecipeLoadingScreenTidbitsAndTips 
                  isLoadingRecipe={showLoadingTips}
                  className="mb-8"
                />
              ) : (
                <FormWrapper 
                  recipeInput={recipeInput}
                  setRecipeInput={setRecipeInput}
                  dietaryPreferences={dietaryPreferences}
                  allergens={allergens}
                  handleGenerateRecipe={handleGenerateRecipe}
                  isGenerating={isGenerating}
                />
              )}
            </>
          )}

          {/* Generated Recipe Display */}
          {generatedRecipe && (
            <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Your Generated Recipe</h2>
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  size="md"
                  className="font-semibold text-muted-foreground hover:text-accent"
                >
                  Generate Another
                </Button>
              </div>
              
              {/* Recipe Image */}
              {generatedImageUrl && (
                <div className="mb-6 relative h-64 w-full">
                  <Image
                    src={generatedImageUrl}
                    alt="Generated recipe"
                    fill
                    className="object-cover rounded-xl shadow-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    onError={(e) => {
                      // Fallback to default image if the generated image fails to load
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80'
                    }}
                  />
                </div>
              )}
              
              <div className="prose prose-emerald max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
                  {generatedRecipe}
                </pre>
              </div>
              
              {/* Future: Add save recipe button here */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
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

// Submit button component that uses isGenerating state
function SubmitButton({ 
  disabled, 
  hasInput, 
  isGenerating
}: { 
  disabled: boolean; 
  hasInput: boolean;
  isGenerating: boolean;
}) {
  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      disabled={disabled}
      className={`w-full font-semibold bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${hasInput ? '' : 'opacity-50 cursor-not-allowed'}`}
    >
      {isGenerating ? (
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Generating Recipe...
        </div>
      ) : hasInput ? (
        'Generate Recipe ✨'
      ) : (
        'Enter a recipe idea to get started'
      )}
    </Button>
  )
}

// Simplified Form wrapper component 
function FormWrapper({ 
  recipeInput, 
  setRecipeInput, 
  dietaryPreferences, 
  allergens, 
  handleGenerateRecipe,
  isGenerating
}: {
  recipeInput: string
  setRecipeInput: (value: string) => void
  dietaryPreferences: string[]
  allergens: string[]
  handleGenerateRecipe: () => Promise<void>
  isGenerating: boolean
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleGenerateRecipe()
  }

  return (
    <div className="bg-card rounded-2xl shadow-xl p-8 border border-border mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormContent 
          recipeInput={recipeInput}
          setRecipeInput={setRecipeInput}
          dietaryPreferences={dietaryPreferences}
          allergens={allergens}
          isGenerating={isGenerating}
        />
      </form>
    </div>
  )
}

// Simplified form content
function FormContent({ 
  recipeInput, 
  setRecipeInput, 
  dietaryPreferences, 
  allergens, 
  isGenerating
}: {
  recipeInput: string
  setRecipeInput: (value: string) => void
  dietaryPreferences: string[]
  allergens: string[]
  isGenerating: boolean
}) {

  return (
    <>
      <div>
        <label htmlFor="recipe-input" className="block text-sm font-semibold text-foreground mb-2">
          What would you like to cook?
        </label>
        <input
          id="recipe-input"
          name="prompt"
          type="text"
          value={recipeInput}
          onChange={(e) => setRecipeInput(e.target.value)}
          placeholder="e.g., chicken burrito, chocolate chip cookies, vegetarian pasta..."
          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors duration-200 bg-background text-foreground placeholder-muted-foreground"
          disabled={isGenerating}
          required
        />
      </div>
      
      {/* Show detected dietary preferences & allergens */}
      {(dietaryPreferences.length > 0 || allergens.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {dietaryPreferences.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Your Dietary Preferences</h3>
              <ul className="flex flex-wrap gap-2">
                {dietaryPreferences.map((pref) => (
                  <li key={pref} className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                    {pref}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {allergens.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Allergens to Avoid</h3>
              <ul className="flex flex-wrap gap-2">
                {allergens.map((allergy) => (
                  <li key={allergy} className="px-3 py-1 rounded-full bg-error/20 text-error text-xs font-medium">
                    {allergy}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <SubmitButton 
        disabled={!recipeInput.trim() || isGenerating} 
        hasInput={!!recipeInput.trim()}
        isGenerating={isGenerating}
      />
    </>
  )
}

 