'use server'

import { createServerComponentClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { UserProfile } from '@/types/profile'

/**
 * Server action to update user profile data
 * Provides better security and validation than client-side updates
 */
export async function updateUserProfileAction(profileData: Partial<UserProfile>) {
  const supabase = await createServerComponentClient()
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Authentication required')
  }

  try {
    // Validate and sanitize input data
    const allowedFields = [
      'dietary_preferences',
      'allergens', 
      'medical_conditions',
      'macro_targets',
      'fiber_sensitivity',
      'full_name'
    ]
    
    const sanitizedData: Partial<UserProfile> = {}
    
    allowedFields.forEach(field => {
      const key = field as keyof UserProfile
      if (key in profileData && profileData[key] !== undefined) {
        // @ts-expect-error - We're ensuring type safety manually
        sanitizedData[key] = profileData[key]
      }
    })

    // Add timestamp
    sanitizedData.updated_at = new Date().toISOString()

    // Update profile in database
    const { data, error } = await supabase
      .from('users')
      .update(sanitizedData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      throw new Error('Failed to update profile')
    }

    // Revalidate relevant pages
    revalidatePath('/profile')
    revalidatePath('/generate-recipe')
    
    return { success: true, data }
  } catch (error) {
    console.error('Server action error:', error)
    throw error
  }
}

/**
 * Server action to delete user account
 * Handles cascade deletion of user data
 */
export async function deleteAccountAction() {
  const supabase = await createServerComponentClient()
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Authentication required')
  }

  try {
    // Delete user profile and related data
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id)

    if (deleteError) {
      throw new Error('Failed to delete account')
    }

    // Sign out user
    await supabase.auth.signOut()
    
    // Redirect to home page
    redirect('/')
  } catch (error) {
    console.error('Account deletion error:', error)
    throw error
  }
}

/**
 * Server action to export user data (GDPR compliance)
 */
export async function exportUserDataAction() {
  const supabase = await createServerComponentClient()
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Authentication required')
  }

  try {
    // Get all user data
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // Get user's saved recipes (if implemented)
    const { data: savedRecipes } = await supabase
      .from('saved_recipes')
      .select('*')
      .eq('user_id', user.id)

    const exportData = {
      profile,
      savedRecipes,
      exportedAt: new Date().toISOString()
    }

    return { success: true, data: exportData }
  } catch (error) {
    console.error('Data export error:', error)
    throw error
  }
} 