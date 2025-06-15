#!/usr/bin/env node

/**
 * Admin Setup Script
 * 
 * This script promotes a user account to admin status.
 * Run this after signing up with your admin email.
 * 
 * Usage: node scripts/setup-admin.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nPlease check your .env.local file.')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const ADMIN_EMAIL = 'philipbein10697@gmail.com'

async function setupAdmin() {
  console.log('🔧 Setting up admin account...')
  console.log(`📧 Admin email: ${ADMIN_EMAIL}`)
  
  try {
    // First, check if user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message)
      return
    }
    
    const adminAuthUser = authUsers.users.find(user => user.email === ADMIN_EMAIL)
    
    if (!adminAuthUser) {
      console.error(`❌ User with email ${ADMIN_EMAIL} not found in auth.users`)
      console.error('   Please sign up with this email first through the app.')
      return
    }
    
    console.log(`✅ Found auth user: ${adminAuthUser.id}`)
    
    // Check if user profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .single()
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Error checking user profile:', profileError.message)
      return
    }
    
    if (!existingProfile) {
      // Create user profile if it doesn't exist
      console.log('📝 Creating user profile...')
      
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: adminAuthUser.id,
          email: ADMIN_EMAIL,
          full_name: 'Admin User',
          role: 'admin',
          subscription_status: 'active',
          subscription_tier: 'premium'
        })
      
      if (insertError) {
        console.error('❌ Error creating user profile:', insertError.message)
        return
      }
      
      console.log('✅ User profile created with admin role')
    } else {
      // Update existing profile to admin
      console.log('📝 Updating existing profile to admin...')
      
      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'admin',
          subscription_status: 'active',
          subscription_tier: 'premium',
          full_name: existingProfile.full_name || 'Admin User'
        })
        .eq('id', adminAuthUser.id)
      
      if (updateError) {
        console.error('❌ Error updating user profile:', updateError.message)
        return
      }
      
      console.log('✅ User profile updated to admin role')
    }
    
    // Verify the setup
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .single()
    
    if (verifyError) {
      console.error('❌ Error verifying setup:', verifyError.message)
      return
    }
    
    console.log('\n🎉 Admin setup complete!')
    console.log('📊 Admin profile details:')
    console.log(`   - ID: ${verifyProfile.id}`)
    console.log(`   - Email: ${verifyProfile.email}`)
    console.log(`   - Name: ${verifyProfile.full_name}`)
    console.log(`   - Role: ${verifyProfile.role}`)
    console.log(`   - Subscription: ${verifyProfile.subscription_status}`)
    console.log(`   - Tier: ${verifyProfile.subscription_tier}`)
    
    console.log('\n✨ You now have admin access to all paid features!')
    console.log('🚀 You can now test the AI recipe generation feature.')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Run the setup
setupAdmin() 