import dotenv from 'dotenv'
import path from 'path'

// Explicitly load .env.local first
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function main() {
  // Dynamically import after env is loaded
  const { supabaseServiceRole } = await import('../../src/lib/supabase-server.ts')

  console.log('🗑️  Starting database cleanup...')
  console.log('🔴 CAUTION: This script is destructive and will delete all recipes.')
  console.log('Proceeding in 5 seconds...')
  await new Promise(resolve => setTimeout(resolve, 5000))


  // Supabase RLS may require a filter, so we delete all rows
  // by filtering for rows that exist (id is not null).
  const { error } = await supabaseServiceRole
    .from('recipes')
    .delete()
    .not('id', 'is', null)

  if (error) {
    console.error('❌ Error deleting recipes:', error)
    process.exit(1)
  }

  console.log('✅ All recipes have been successfully deleted from the database.')
}

main() 