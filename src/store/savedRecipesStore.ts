import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { RecipeCardData } from '@/components/recipe/RecipeCard'

interface SavedRecipesState {
  saved: RecipeCardData[]
  loading: boolean
  loadSaved: (userId?: string) => Promise<void>
  toggleSave: (recipe: RecipeCardData, userId?: string) => Promise<void>
  isSaved: (id: string) => boolean
}

export const useSavedRecipesStore = create<SavedRecipesState>((set, get) => ({
  saved: [],
  loading: false,

  loadSaved: async (userId?: string) => {
    set({ loading: true })
    if (userId) {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('recipe:recipes(*)')
        .eq('user_id', userId)
      if (!error && data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recipes = data.map((row) => (row as any).recipe as RecipeCardData)
        set({ saved: recipes, loading: false })
        return
      }
    }
    // Fallback to localStorage
    const ls = localStorage.getItem('guest_favorites')
    if (ls) {
      set({ saved: JSON.parse(ls), loading: false })
    } else {
      set({ saved: [], loading: false })
    }
  },

  toggleSave: async (recipe, userId) => {
    const state = get()
    const exists = state.saved.find((r) => r.id === recipe.id)
    let newSaved
    if (exists) {
      newSaved = state.saved.filter((r) => r.id !== recipe.id)
      if (userId) {
        await supabase.from('user_favorites').delete().eq('user_id', userId).eq('recipe_id', recipe.id)
      }
    } else {
      newSaved = [...state.saved, recipe]
      if (userId) {
        await supabase.from('user_favorites').insert({ user_id: userId, recipe_id: recipe.id })
      }
    }
    if (!userId) {
      localStorage.setItem('guest_favorites', JSON.stringify(newSaved))
    }
    set({ saved: newSaved })
  },

  isSaved: (id) => !!get().saved.find((r) => r.id === id)
})) 