/**
 * Image Service for fetching recipe images from Unsplash
 * Uses Unsplash Source API (no API key required)
 */

export interface ImageSearchParams {
  title: string
  cuisineType?: string
  fallbackTerms?: string[]
}

/**
 * Generate an Unsplash image URL based on recipe details
 * Uses Unsplash Source API for free, no-auth image access
 */
export function generateRecipeImageUrl(params: ImageSearchParams): string {
  const { title, cuisineType, fallbackTerms = [] } = params
  
  // Extract key food terms from the title
  const foodTerms = extractFoodTerms(title)
  
  // Build search terms priority: food terms > cuisine > fallback
  const searchTerms = [
    ...foodTerms,
    ...(cuisineType ? [cuisineType] : []),
    ...fallbackTerms,
    'food' // Ultimate fallback
  ]
  
  // Use the first available search term
  const searchTerm = searchTerms[0] || 'food'
  
  // Return Unsplash Source URL with consistent sizing
  return `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80&auto=format&fm=webp&s=${encodeURIComponent(searchTerm)}`
}

/**
 * Extract food-related terms from recipe title
 */
function extractFoodTerms(title: string): string[] {
  const foodKeywords = [
    // Proteins
    'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'turkey', 'lamb',
    'tofu', 'tempeh', 'eggs', 'cheese',
    
    // Dishes
    'pasta', 'pizza', 'burger', 'sandwich', 'salad', 'soup', 'stew', 'curry', 'stir-fry',
    'tacos', 'burrito', 'quesadilla', 'sushi', 'ramen', 'noodles', 'rice', 'risotto',
    'pancakes', 'waffles', 'bread', 'muffins', 'cookies', 'cake', 'pie', 'tart',
    
    // Vegetables
    'broccoli', 'spinach', 'kale', 'carrots', 'potatoes', 'tomatoes', 'peppers',
    'mushrooms', 'onions', 'garlic', 'avocado', 'cucumber', 'lettuce',
    
    // Fruits
    'apple', 'banana', 'berries', 'strawberry', 'blueberry', 'orange', 'lemon',
    'mango', 'pineapple', 'grapes', 'peach', 'cherry',
    
    // Grains & Legumes
    'quinoa', 'beans', 'lentils', 'chickpeas', 'oats', 'barley', 'wheat',
    
    // Cooking methods
    'grilled', 'roasted', 'baked', 'fried', 'steamed', 'sautéed', 'braised'
  ]
  
  const titleLower = title.toLowerCase()
  const foundTerms: string[] = []
  
  // Find matching food keywords in the title
  for (const keyword of foodKeywords) {
    if (titleLower.includes(keyword)) {
      foundTerms.push(keyword)
    }
  }
  
  // If no specific terms found, try to extract the main dish name
  if (foundTerms.length === 0) {
    const words = titleLower.split(' ').filter(word => word.length > 3)
    if (words.length > 0) {
      foundTerms.push(words[0]) // Use first substantial word
    }
  }
  
  return foundTerms
}

/**
 * Get a curated image URL for specific recipe types
 * Provides high-quality, consistent images for common recipes
 */
export function getCuratedRecipeImage(title: string, cuisineType?: string): string {
  const titleLower = title.toLowerCase()
  
  // Curated mappings for common recipes
  const curatedImages: Record<string, string> = {
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
  
  // Fallback to generated URL
  return generateRecipeImageUrl({ title, cuisineType })
}

/**
 * Main function to get recipe image URL
 * Tries curated images first, then falls back to generated URLs
 */
export function getRecipeImageUrl(title: string, cuisineType?: string): string {
  try {
    return getCuratedRecipeImage(title, cuisineType)
  } catch (error) {
    console.warn('Error getting recipe image:', error)
    // Ultimate fallback - a generic food image
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80'
  }
} 