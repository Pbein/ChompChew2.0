import { createServerComponentClient } from '@/lib/supabase'
import { Database, UserProfile } from '@/types/database'

export class UserService {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const supabase = await createServerComponentClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error)
      return null
    }
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<Database['public']['Tables']['users']['Update']>
  ): Promise<boolean> {
    try {
      const supabase = await createServerComponentClient()
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user profile:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Unexpected error updating user profile:', error)
      return false
    }
  }

  async createUserProfile(user: Database['public']['Tables']['users']['Insert']): Promise<boolean> {
    try {
      const supabase = await createServerComponentClient()
      const { error } = await supabase
        .from('users')
        .insert(user)

      if (error) {
        console.error('Error creating user profile:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Unexpected error creating user profile:', error)
      return false
    }
  }

  async deleteUserProfile(userId: string): Promise<boolean> {
    try {
      const supabase = await createServerComponentClient()
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        console.error('Error deleting user profile:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Unexpected error deleting user profile:', error)
      return false
    }
  }

  async getUserFavorites(userId: string) {
    try {
      const supabase = await createServerComponentClient()
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          recipe_id,
          created_at,
          recipes (
            id,
            title,
            description,
            image_url,
            difficulty,
            prep_time,
            cook_time,
            rating_average,
            rating_count
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user favorites:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Unexpected error fetching user favorites:', error)
      return []
    }
  }

  async addToFavorites(userId: string, recipeId: string): Promise<boolean> {
    try {
      const supabase = await createServerComponentClient()
      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: userId, recipe_id: recipeId })

      if (error) {
        console.error('Error adding to favorites:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Unexpected error adding to favorites:', error)
      return false
    }
  }

  async removeFromFavorites(userId: string, recipeId: string): Promise<boolean> {
    try {
      const supabase = await createServerComponentClient()
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)

      if (error) {
        console.error('Error removing from favorites:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Unexpected error removing from favorites:', error)
      return false
    }
  }
}

export const userService = new UserService() 