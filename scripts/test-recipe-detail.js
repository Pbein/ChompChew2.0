const { fetchRecipe } = require('../src/lib/recipes.ts')

async function testRecipeDetail() {
  console.log('🧪 Testing Recipe Detail Functionality...\n')

  // Test cases
  const testCases = [
    '550e8400-e29b-41d4-a716-446655440001', // Mediterranean Quinoa Bowl
    '550e8400-e29b-41d4-a716-446655440002', // Honey Garlic Salmon
    '550e8400-e29b-41d4-a716-446655440003', // Vegan Buddha Bowl
    'unknown-recipe-id' // Should return null
  ]

  for (const recipeId of testCases) {
    console.log(`Testing recipe ID: ${recipeId}`)
    
    try {
      const recipe = await fetchRecipe(recipeId)
      
      if (recipe) {
        console.log(`✅ SUCCESS: Found recipe "${recipe.title}"`)
        console.log(`   - ID: ${recipe.id}`)
        console.log(`   - Has ingredients: ${recipe.ingredients ? 'Yes' : 'No'}`)
        console.log(`   - Has instructions: ${recipe.instructions ? 'Yes' : 'No'}`)
        console.log(`   - Has nutrition: ${recipe.nutrition_info ? 'Yes' : 'No'}`)
      } else {
        console.log(`❌ RESULT: Recipe not found (expected for unknown IDs)`)
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`)
    }
    
    console.log('')
  }

  console.log('🏁 Recipe Detail Test Complete')
}

// Run the test
testRecipeDetail().catch(console.error) 