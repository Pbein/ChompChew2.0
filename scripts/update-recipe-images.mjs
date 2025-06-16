/**
 * Script to update existing recipes with images
 * Run with: node scripts/update-recipe-images.mjs
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Image mapping function (simplified version of our service)
function getRecipeImageUrl(title) {
  const titleLower = title.toLowerCase()
  
  // Curated mappings for common recipes
  const curatedImages = {
    // Mexican
    'burrito': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop&q=80',
    'tacos': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&q=80',
    'quesadilla': 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&h=300&fit=crop&q=80',
    
    // Italian
    'pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop&q=80',
    'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&q=80',
    'risotto': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop&q=80',
    
    // Asian
    'curry': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop&q=80',
    'stir-fry': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80',
    'ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&q=80',
    
    // American
    'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80',
    'sandwich': 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop&q=80',
    
    // Desserts
    'pie': 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop&q=80',
    'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&q=80',
    'cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&q=80',
    'blueberry': 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop&q=80',
    
    // Proteins
    'chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop&q=80',
    'salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&q=80',
    'beef': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&q=80',
    
    // Healthy
    'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80',
    'smoothie': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop&q=80',
    'bowl': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&q=80'
  }
  
  // Check for exact matches first
  for (const [keyword, imageUrl] of Object.entries(curatedImages)) {
    if (titleLower.includes(keyword)) {
      return imageUrl
    }
  }
  
  // Ultimate fallback - a generic food image
  return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80'
}

async function updateRecipeImages() {
  try {
    console.log('🔍 Fetching recipes without images...')
    
    // Get all recipes that don't have images or have null image_url
    const { data: recipes, error: fetchError } = await supabase
      .from('recipes')
      .select('id, title, cuisine_type, image_url')
      .or('image_url.is.null,image_url.eq.')
    
    if (fetchError) {
      console.error('❌ Error fetching recipes:', fetchError)
      return
    }
    
    if (!recipes || recipes.length === 0) {
      console.log('✅ No recipes found without images')
      return
    }
    
    console.log(`📋 Found ${recipes.length} recipes without images:`)
    recipes.forEach(recipe => {
      console.log(`  - ${recipe.title} (ID: ${recipe.id})`)
    })
    
    console.log('\n🖼️ Updating recipe images...')
    
    // Update each recipe with an appropriate image
    for (const recipe of recipes) {
      const imageUrl = getRecipeImageUrl(recipe.title)
      
      console.log(`📸 Updating "${recipe.title}" with image: ${imageUrl}`)
      
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ image_url: imageUrl })
        .eq('id', recipe.id)
      
      if (updateError) {
        console.error(`❌ Error updating recipe ${recipe.id}:`, updateError)
      } else {
        console.log(`✅ Updated "${recipe.title}"`)
      }
    }
    
    console.log('\n🎉 Recipe image update completed!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the update
updateRecipeImages() 