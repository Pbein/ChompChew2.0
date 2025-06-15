import { createClientComponentClient } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  full_name?: string
  role?: 'free' | 'premium' | 'admin'
  subscription_status?: 'active' | 'inactive' | 'trial'
  subscription_tier?: 'basic' | 'premium'
  created_at: string
  updated_at: string
}

/**
 * Check if user has a specific role
 */
export const checkUserRole = (user: User | null, requiredRole: string): boolean => {
  if (!user) return false
  return user.role === requiredRole
}

/**
 * Check if user is an admin
 */
export const isAdmin = (user: User | null): boolean => {
  return checkUserRole(user, 'admin')
}

/**
 * Check if user has premium access
 */
export const isPremium = (user: User | null): boolean => {
  if (!user) return false
  return user.role === 'premium' || user.role === 'admin' || user.subscription_status === 'active'
}

/**
 * Check if user can generate recipes (paid feature)
 * Admin users always have access regardless of subscription
 */
export const canGenerateRecipes = (user: User | null): boolean => {
  if (!user) return false
  
  // Admin users always have access (development bypass)
  if (user.role === 'admin') return true
  
  // Premium users have access
  if (user.role === 'premium') return true
  
  // Users with active subscription have access
  if (user.subscription_status === 'active') return true
  
  return false
}

/**
 * Check if user can access paid features
 */
export const canAccessPaidFeatures = (user: User | null): boolean => {
  if (!user) return false
  
  return user.role === 'admin' || 
         user.role === 'premium' || 
         user.subscription_status === 'active'
}

/**
 * Get user role display name
 */
export const getUserRoleDisplay = (user: User | null): string => {
  if (!user) return 'Guest'
  
  switch (user.role) {
    case 'admin':
      return 'Administrator'
    case 'premium':
      return 'Premium User'
    case 'free':
    default:
      return 'Free User'
  }
}

/**
 * Get user with role information from Supabase
 */
export const getUserWithRole = async (): Promise<User | null> => {
  try {
    const supabase = createClientComponentClient()
    
    // Get authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authUser) {
      return null
    }
    
    // Get user profile with role information
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()
    
    if (profileError || !profile) {
      // Return basic user info if profile doesn't exist yet
      return {
        id: authUser.id,
        email: authUser.email || '',
        role: 'free',
        created_at: authUser.created_at,
        updated_at: authUser.updated_at || authUser.created_at
      }
    }
    
    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role || 'free',
      subscription_status: profile.subscription_status,
      subscription_tier: profile.subscription_tier,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    }
  } catch (error) {
    console.error('Error getting user with role:', error)
    return null
  }
} 