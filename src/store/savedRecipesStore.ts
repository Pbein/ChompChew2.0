import { create } from 'zustand'
import { getSupabaseClient } from '@/lib/supabase'
import { RecipeCardData } from '@/components/recipe/RecipeCard'

interface SavedRecipesState {
  saved: RecipeCardData[]
  loading: boolean
  loadSaved: (userId?: string) => Promise<void>
  toggleSave: (recipe: RecipeCardData, userId?: string) => Promise<void>
  isSaved: (id: string) => boolean
  migrateLocalStorageToDatabase: (userId: string) => Promise<void>
  clearLocalStorage: () => void
  handleUserAuthentication: (userId: string) => Promise<void>
}

// Use the singleton Supabase client instance for the entire store
const supabase = getSupabaseClient()

export const useSavedRecipesStore = create<SavedRecipesState>((set, get) => ({
  saved: [],
  loading: false,

  loadSaved: async (userId?: string) => {
    set({ loading: true })
    try {
      if (userId) {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('recipe:recipes(*)')
          .eq('user_id', userId)
        
        if (!error && data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const recipes = data.map((row: any) => {
            const recipe = row.recipe;
            
            // Map database fields to RecipeCardData interface
            const mappedRecipe = {
              id: recipe.id,
              title: recipe.title,
              image: recipe.image_url, // Map image_url to image
              prepTime: recipe.prep_time || recipe.total_time || 30,
              difficulty: recipe.difficulty || 'medium',
              servings: recipe.servings || 4,
              dietaryCompliance: recipe.dietary_tags || [],
              safetyValidated: true, // Default for database recipes
              calories: recipe.calories_per_serving,
              rating: recipe.rating_average
            } as RecipeCardData;
            
            return mappedRecipe;
          });
          
          console.log(`Loaded ${recipes.length} saved recipes for user`);
          set({ saved: recipes, loading: false })
          return
        }
        
        if (error) {
          console.error('Failed to load user favorites:', {
            error,
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
        }
      }
      // Fallback to localStorage
      const ls = localStorage.getItem('guest_favorites')
      if (ls) {
        try {
          const parsedData = JSON.parse(ls)
          set({ saved: parsedData, loading: false })
        } catch (parseError) {
          console.error('Failed to parse localStorage favorites:', parseError)
          set({ saved: [], loading: false })
        }
      } else {
        set({ saved: [], loading: false })
      }
    } catch (error) {
      console.error('Error loading saved recipes:', error)
      set({ saved: [], loading: false })
    }
  },

  toggleSave: async (recipe, userId) => {
    const state = get()
    
    try {
      if (userId) {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          console.error('User not authenticated when trying to toggle recipe save:', { authError, userId })
          return
        }
        
        if (userId !== user.id) {
          console.error('User ID mismatch:', { passedUserId: userId, authUserId: user.id })
          return
        }
        
        const { data: existingFavorite, error: checkError } = await supabase
          .from('user_favorites')
          .select('id')
          .eq('user_id', userId)
          .eq('recipe_id', recipe.id)
          .maybeSingle()
        
        if (checkError) {
          console.error('Error checking existing favorite:', {
            checkError,
            code: checkError.code,
            message: checkError.message,
            details: checkError.details,
            hint: checkError.hint
          })
          
          if (checkError.code === 'PGRST406' || checkError.code === '42501') {
            console.log('Treating as recipe not saved due to query error, proceeding with save operation')
          } else {
            return
          }
        }
        
        const existsInDatabase = !!existingFavorite
        console.log('Toggle save - recipe exists in database:', existsInDatabase)
        
        if (existsInDatabase) {
          const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', userId)
            .eq('recipe_id', recipe.id)
          
          if (error) {
            console.error('Failed to remove recipe from user favorites:', {
              error,
              userId,
              recipeId: recipe.id,
              userAuthId: user.id,
              errorCode: error.code,
              errorMessage: error.message
            })
            return
          }
          
          const newSaved = state.saved.filter((r) => r.id !== recipe.id)
          set({ saved: newSaved })
          
        } else {
          const { error: profileError } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single()
          
          if (profileError && profileError.code === 'PGRST116') {
            console.log('Creating user profile for:', user.id)
            const { error: createError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
            
            if (createError) {
              console.error('Failed to create user profile:', createError)
              return
            }
          }
          
          const { error } = await supabase
            .from('user_favorites')
            .insert({ user_id: userId, recipe_id: recipe.id })
          
          if (error) {
            console.error('Failed to add recipe to user favorites:', {
              error,
              userId,
              recipeId: recipe.id,
              userAuthId: user.id,
              errorCode: error.code,
              errorMessage: error.message,
              errorDetails: error.details,
              errorHint: error.hint
            })
            return
          }
          
          const existsInLocal = state.saved.find((r) => r.id === recipe.id)
          if (!existsInLocal) {
            const newSaved = [...state.saved, recipe]
            set({ saved: newSaved })
          }
        }
        
      } else {
        const exists = state.saved.find((r) => r.id === recipe.id)
        let newSaved
        
        if (exists) {
          newSaved = state.saved.filter((r) => r.id !== recipe.id)
        } else {
          newSaved = [...state.saved, recipe]
        }
        
        try {
          localStorage.setItem('guest_favorites', JSON.stringify(newSaved))
        } catch (error) {
          console.error('Failed to save to localStorage:', error)
        }
        
        set({ saved: newSaved })
      }
      
    } catch (error) {
      console.error('Error toggling recipe save:', error)
    }
  },

  isSaved: (id) => !!get().saved.find((r) => r.id === id),

  migrateLocalStorageToDatabase: async (userId: string) => {
    try {
      // Get recipes from localStorage
      const ls = localStorage.getItem('guest_favorites')
      if (!ls) {
        console.log('No localStorage recipes to migrate')
        return
      }

      const localRecipes: RecipeCardData[] = JSON.parse(ls)
      if (localRecipes.length === 0) {
        console.log('No localStorage recipes to migrate')
        return
      }

      console.log(`Migrating ${localRecipes.length} recipes from localStorage to database`)

      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user || user.id !== userId) {
        console.error('User not authenticated during migration:', { authError, userId })
        return
      }

      // Create user profile if it doesn't exist
      const { error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        console.log('Creating user profile during migration for:', user.id)
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (createError) {
          console.error('Failed to create user profile during migration:', createError)
          return
        }
      }

      // Migrate each recipe to database
      let migratedCount = 0
      for (const recipe of localRecipes) {
        try {
          const { error } = await supabase
            .from('user_favorites')
            .insert({ user_id: userId, recipe_id: recipe.id })

          if (error) {
            if (error.code === '23505') {
              // Recipe already saved, skip
              console.log(`Recipe ${recipe.title} already saved, skipping`)
            } else {
              console.error(`Failed to migrate recipe ${recipe.title}:`, error)
            }
          } else {
            migratedCount++
          }
        } catch (error) {
          console.error(`Error migrating recipe ${recipe.title}:`, error)
        }
      }

      console.log(`Successfully migrated ${migratedCount} recipes to database`)

      // Clear localStorage after successful migration
      localStorage.removeItem('guest_favorites')
      console.log('Cleared localStorage after migration')

    } catch (error) {
      console.error('Error during recipe migration:', error)
    }
  },

  clearLocalStorage: () => {
    try {
      const ls = localStorage.getItem('guest_favorites')
      if (ls) {
        const localRecipes: RecipeCardData[] = JSON.parse(ls)
        console.log(`Clearing ${localRecipes.length} localStorage recipes to prevent confusion when logging out`)
        localStorage.removeItem('guest_favorites')
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },

  handleUserAuthentication: async (userId: string) => {
    try {
      const ls = localStorage.getItem('guest_favorites')
      if (!ls || JSON.parse(ls).length === 0) {
        return // No guest recipes to handle
      }

      // Check if the user has any existing saved recipes
      const { count, error: countError } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (countError) {
        console.error('Error checking for existing user favorites:', countError)
        return
      }

      const hasExistingFavorites = count !== null && count > 0

      // If the user already has favorites, clear local storage to avoid confusion
      if (hasExistingFavorites) {
        console.log('Existing user detected. Clearing localStorage recipes.')
        get().clearLocalStorage()
      } else {
        // If the user is new (no favorites), migrate local storage recipes
        console.log('New user detected. Migrating localStorage recipes.')
        await get().migrateLocalStorageToDatabase(userId)
      }
    } catch (error) {
      console.error('Error handling user authentication:', error)
    }
  }
})) 