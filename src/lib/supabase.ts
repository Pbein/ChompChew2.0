import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Global singleton client to prevent multiple instances
let globalClientInstance: ReturnType<typeof createBrowserClient> | null = null

// Client-side Supabase client with improved singleton pattern
export const createClientComponentClient = () => {
  // Return existing instance if available
  if (globalClientInstance) {
    return globalClientInstance
  }

  // Create new instance with better configuration
  globalClientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    // Add configuration to prevent multiple auth clients
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  })

  return globalClientInstance
}

// Get the singleton instance (for use outside of React components)
export const getSupabaseClient = () => {
  if (!globalClientInstance) {
    return createClientComponentClient()
  }
  return globalClientInstance
}

// Legacy client for compatibility
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 