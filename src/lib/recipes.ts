import { supabase } from './supabase'
import { RecipeCardData } from '@/components/recipe/RecipeCard'
import { SearchQuery } from '@/features/core/stores/searchStore'

interface DBRecipe {
  id: string
  title: string
  image_url?: string
  prep_time: number | null
  servings: number | null
  difficulty: 'easy' | 'medium' | 'hard' | null
  dietary_tags: string[] | null
  calories_per_serving: number | null
  safety_validated?: boolean | null
  rating_average?: number | null
  // Additional fields for detail view
  description?: string
  cook_time?: number | null
  total_time?: number | null
  cuisine_type?: string
  nutrition_info?: Record<string, number> | null
  ingredients?: Array<{ name: string; amount: string }> | null
  instructions?: Array<{ step: number; text: string }> | null
}

// Fallback recipes with full detail data (matching the structure expected by detail page)
const fallbackDetailRecipes: Record<string, DBRecipe> = {
  '550e8400-e29b-41d4-a716-446655440001': {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Mediterranean Quinoa Bowl',
    description: 'Fresh quinoa bowl with vegetables, feta, and olive oil dressing.',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    prep_time: 15,
    cook_time: 15,
    total_time: 30,
    servings: 2,
    difficulty: 'easy',
    cuisine_type: 'Mediterranean',
    dietary_tags: ['vegetarian', 'gluten-free', 'high-protein'],
    calories_per_serving: 420,
    safety_validated: true,
    rating_average: 4.8,
    nutrition_info: {"protein": 15, "fat": 18, "carbs": 52, "fiber": 6},
    ingredients: [
      {"name": "quinoa", "amount": "1 cup"},
      {"name": "cucumber", "amount": "1 medium"},
      {"name": "cherry tomatoes", "amount": "1 cup"},
      {"name": "feta cheese", "amount": "1/2 cup"},
      {"name": "olive oil", "amount": "3 tbsp"},
      {"name": "lemon juice", "amount": "2 tbsp"}
    ],
    instructions: [
      {"step": 1, "text": "Cook quinoa according to package directions."},
      {"step": 2, "text": "Chop vegetables and prepare dressing."},
      {"step": 3, "text": "Combine all ingredients and serve."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440002': {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Honey Garlic Salmon',
    description: 'Pan-seared salmon with a sweet and savory glaze.',
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    prep_time: 10,
    cook_time: 15,
    total_time: 25,
    servings: 4,
    difficulty: 'easy',
    cuisine_type: 'Asian-fusion',
    dietary_tags: ['high-protein', 'omega-3', 'gluten-free'],
    calories_per_serving: 350,
    safety_validated: true,
    rating_average: 4.6,
    nutrition_info: {"protein": 35, "fat": 15, "carbs": 12, "fiber": 0},
    ingredients: [
      {"name": "salmon fillets", "amount": "4 pieces"},
      {"name": "honey", "amount": "3 tbsp"},
      {"name": "garlic", "amount": "3 cloves"},
      {"name": "soy sauce", "amount": "2 tbsp"},
      {"name": "olive oil", "amount": "1 tbsp"}
    ],
    instructions: [
      {"step": 1, "text": "Season salmon fillets with salt and pepper."},
      {"step": 2, "text": "Sear salmon in hot pan for 4-5 minutes per side."},
      {"step": 3, "text": "Add honey garlic sauce and cook 2 more minutes."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440003': {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Vegan Buddha Bowl',
    description: 'Colorful bowl with roasted vegetables, quinoa, and tahini dressing.',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    prep_time: 15,
    cook_time: 25,
    total_time: 40,
    servings: 2,
    difficulty: 'medium',
    cuisine_type: 'Mediterranean',
    dietary_tags: ['vegan', 'dairy-free', 'high-fiber'],
    calories_per_serving: 380,
    safety_validated: true,
    rating_average: 4.7,
    nutrition_info: {"protein": 12, "fat": 14, "carbs": 58, "fiber": 12},
    ingredients: [
      {"name": "quinoa", "amount": "1/2 cup"},
      {"name": "sweet potato", "amount": "1 medium"},
      {"name": "broccoli", "amount": "1 cup"},
      {"name": "chickpeas", "amount": "1/2 cup"},
      {"name": "tahini", "amount": "2 tbsp"},
      {"name": "lemon juice", "amount": "1 tbsp"}
    ],
    instructions: [
      {"step": 1, "text": "Roast sweet potato and broccoli at 400°F for 25 minutes."},
      {"step": 2, "text": "Cook quinoa and prepare tahini dressing."},
      {"step": 3, "text": "Assemble bowl with all ingredients and drizzle with dressing."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440004': {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Classic Chicken Soup',
    description: 'A comforting, low-fiber soup suitable for UC flare-ups.',
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
    prep_time: 10,
    cook_time: 20,
    total_time: 30,
    servings: 2,
    difficulty: 'easy',
    cuisine_type: 'American',
    dietary_tags: ['low-fiber', 'uc-safe', 'comfort-food'],
    calories_per_serving: 280,
    safety_validated: true,
    rating_average: 4.9,
    nutrition_info: {"protein": 25, "fat": 6, "carbs": 40, "fiber": 1},
    ingredients: [
      {"name": "chicken breast", "amount": "200 g"},
      {"name": "white rice", "amount": "1/2 cup"},
      {"name": "carrots", "amount": "1/2 cup"},
      {"name": "celery", "amount": "1/4 cup"},
      {"name": "chicken broth", "amount": "4 cups"}
    ],
    instructions: [
      {"step": 1, "text": "Sauté carrots, celery, and chicken."},
      {"step": 2, "text": "Add broth and rice; simmer 20 min."},
      {"step": 3, "text": "Season and serve."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440005': {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Avocado Toast with Poached Egg',
    description: 'Creamy avocado on toasted bread topped with a perfectly poached egg.',
    image_url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    prep_time: 15,
    cook_time: 0,
    total_time: 15,
    servings: 2,
    difficulty: 'easy',
    cuisine_type: 'Modern',
    dietary_tags: ['vegetarian', 'high-protein', 'healthy-fats'],
    calories_per_serving: 320,
    safety_validated: true,
    rating_average: 4.5,
    nutrition_info: {"protein": 16, "fat": 22, "carbs": 24, "fiber": 8},
    ingredients: [
      {"name": "avocado", "amount": "1 large"},
      {"name": "bread", "amount": "2 slices"},
      {"name": "eggs", "amount": "2"},
      {"name": "lemon juice", "amount": "1 tbsp"},
      {"name": "salt", "amount": "to taste"}
    ],
    instructions: [
      {"step": 1, "text": "Toast bread until golden brown."},
      {"step": 2, "text": "Mash avocado with lemon juice and salt."},
      {"step": 3, "text": "Poach eggs and assemble on toast."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440006': {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Thai Green Curry',
    description: 'Aromatic and creamy Thai curry with vegetables and coconut milk.',
    image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
    prep_time: 20,
    cook_time: 15,
    total_time: 35,
    servings: 4,
    difficulty: 'medium',
    cuisine_type: 'Thai',
    dietary_tags: ['vegan', 'dairy-free', 'spicy'],
    calories_per_serving: 450,
    safety_validated: true,
    rating_average: 4.6,
    nutrition_info: {"protein": 8, "fat": 35, "carbs": 28, "fiber": 6},
    ingredients: [
      {"name": "green curry paste", "amount": "3 tbsp"},
      {"name": "coconut milk", "amount": "1 can"},
      {"name": "vegetables", "amount": "2 cups mixed"},
      {"name": "tofu", "amount": "200g"},
      {"name": "thai basil", "amount": "1/4 cup"}
    ],
    instructions: [
      {"step": 1, "text": "Heat curry paste in pan until fragrant."},
      {"step": 2, "text": "Add coconut milk and bring to simmer."},
      {"step": 3, "text": "Add vegetables and tofu, cook 10 minutes."},
      {"step": 4, "text": "Garnish with basil and serve with rice."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440007': {
    id: '550e8400-e29b-41d4-a716-446655440007',
    title: 'Grilled Chicken Caesar Salad',
    description: 'Classic Caesar salad with perfectly grilled chicken breast.',
    image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    prep_time: 15,
    cook_time: 12,
    total_time: 27,
    servings: 2,
    difficulty: 'easy',
    cuisine_type: 'American',
    dietary_tags: ['high-protein', 'low-carb'],
    calories_per_serving: 380,
    safety_validated: true,
    rating_average: 4.4,
    nutrition_info: {"protein": 35, "fat": 18, "carbs": 8, "fiber": 3},
    ingredients: [
      {"name": "chicken breast", "amount": "2 pieces"},
      {"name": "romaine lettuce", "amount": "1 head"},
      {"name": "caesar dressing", "amount": "1/4 cup"},
      {"name": "parmesan cheese", "amount": "1/4 cup"},
      {"name": "croutons", "amount": "1/2 cup"}
    ],
    instructions: [
      {"step": 1, "text": "Season and grill chicken until cooked through."},
      {"step": 2, "text": "Chop romaine and toss with dressing."},
      {"step": 3, "text": "Slice chicken and serve over salad."},
      {"step": 4, "text": "Top with parmesan and croutons."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440008': {
    id: '550e8400-e29b-41d4-a716-446655440008',
    title: 'Mushroom Risotto',
    description: 'Creamy Italian risotto with mixed mushrooms and parmesan.',
    image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
    prep_time: 10,
    cook_time: 25,
    total_time: 35,
    servings: 4,
    difficulty: 'medium',
    cuisine_type: 'Italian',
    dietary_tags: ['vegetarian', 'comfort-food'],
    calories_per_serving: 340,
    safety_validated: true,
    rating_average: 4.7,
    nutrition_info: {"protein": 12, "fat": 8, "carbs": 58, "fiber": 2},
    ingredients: [
      {"name": "arborio rice", "amount": "1 cup"},
      {"name": "mixed mushrooms", "amount": "300g"},
      {"name": "vegetable broth", "amount": "4 cups"},
      {"name": "white wine", "amount": "1/2 cup"},
      {"name": "parmesan cheese", "amount": "1/2 cup"}
    ],
    instructions: [
      {"step": 1, "text": "Sauté mushrooms until golden brown."},
      {"step": 2, "text": "Add rice and toast for 2 minutes."},
      {"step": 3, "text": "Add wine and stir until absorbed."},
      {"step": 4, "text": "Gradually add warm broth, stirring constantly."},
      {"step": 5, "text": "Stir in parmesan and serve immediately."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440009': {
    id: '550e8400-e29b-41d4-a716-446655440009',
    title: 'Black Bean Tacos',
    description: 'Flavorful vegetarian tacos with seasoned black beans and fresh toppings.',
    image_url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop',
    prep_time: 10,
    cook_time: 8,
    total_time: 18,
    servings: 4,
    difficulty: 'easy',
    cuisine_type: 'Mexican',
    dietary_tags: ['vegetarian', 'dairy-free', 'high-fiber'],
    calories_per_serving: 290,
    safety_validated: true,
    rating_average: 4.3,
    nutrition_info: {"protein": 12, "fat": 6, "carbs": 52, "fiber": 15},
    ingredients: [
      {"name": "black beans", "amount": "1 can"},
      {"name": "corn tortillas", "amount": "8"},
      {"name": "avocado", "amount": "1"},
      {"name": "tomato", "amount": "1"},
      {"name": "cilantro", "amount": "1/4 cup"}
    ],
    instructions: [
      {"step": 1, "text": "Heat black beans with cumin and chili powder."},
      {"step": 2, "text": "Warm tortillas in dry pan."},
      {"step": 3, "text": "Dice avocado and tomato."},
      {"step": 4, "text": "Assemble tacos with beans and toppings."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440010': {
    id: '550e8400-e29b-41d4-a716-446655440010',
    title: 'Beef Stir Fry',
    description: 'Quick and healthy beef stir fry with colorful vegetables.',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    prep_time: 15,
    cook_time: 10,
    total_time: 25,
    servings: 3,
    difficulty: 'medium',
    cuisine_type: 'Asian',
    dietary_tags: ['high-protein', 'low-carb', 'dairy-free'],
    calories_per_serving: 320,
    safety_validated: true,
    rating_average: 4.5,
    nutrition_info: {"protein": 28, "fat": 12, "carbs": 18, "fiber": 4},
    ingredients: [
      {"name": "beef strips", "amount": "400g"},
      {"name": "mixed vegetables", "amount": "2 cups"},
      {"name": "soy sauce", "amount": "3 tbsp"},
      {"name": "garlic", "amount": "3 cloves"},
      {"name": "ginger", "amount": "1 inch"}
    ],
    instructions: [
      {"step": 1, "text": "Marinate beef in soy sauce for 10 minutes."},
      {"step": 2, "text": "Heat wok over high heat."},
      {"step": 3, "text": "Stir fry beef until browned, remove."},
      {"step": 4, "text": "Stir fry vegetables, add beef back."},
      {"step": 5, "text": "Serve immediately over rice."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440011': {
    id: '550e8400-e29b-41d4-a716-446655440011',
    title: 'Chocolate Chip Cookies',
    description: 'Classic homemade chocolate chip cookies that are crispy outside, soft inside.',
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    prep_time: 15,
    cook_time: 11,
    total_time: 26,
    servings: 36,
    difficulty: 'easy',
    cuisine_type: 'American',
    dietary_tags: ['dessert', 'comfort-food'],
    calories_per_serving: 140,
    safety_validated: true,
    rating_average: 4.8,
    nutrition_info: {"protein": 2, "fat": 6, "carbs": 22, "fiber": 1},
    ingredients: [
      {"name": "flour", "amount": "2 1/4 cups"},
      {"name": "butter", "amount": "1 cup"},
      {"name": "brown sugar", "amount": "3/4 cup"},
      {"name": "chocolate chips", "amount": "2 cups"},
      {"name": "eggs", "amount": "2"}
    ],
    instructions: [
      {"step": 1, "text": "Preheat oven to 375°F."},
      {"step": 2, "text": "Cream butter and sugars together."},
      {"step": 3, "text": "Beat in eggs and vanilla."},
      {"step": 4, "text": "Mix in flour and chocolate chips."},
      {"step": 5, "text": "Bake for 9-11 minutes until golden."}
    ]
  },
  '550e8400-e29b-41d4-a716-446655440012': {
    id: '550e8400-e29b-41d4-a716-446655440012',
    title: 'Greek Yogurt Parfait',
    description: 'Healthy and delicious parfait with Greek yogurt, berries, and granola.',
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    prep_time: 5,
    cook_time: 0,
    total_time: 5,
    servings: 2,
    difficulty: 'easy',
    cuisine_type: 'Modern',
    dietary_tags: ['vegetarian', 'high-protein', 'probiotic'],
    calories_per_serving: 280,
    safety_validated: true,
    rating_average: 4.6,
    nutrition_info: {"protein": 20, "fat": 8, "carbs": 35, "fiber": 6},
    ingredients: [
      {"name": "Greek yogurt", "amount": "1 cup"},
      {"name": "mixed berries", "amount": "1 cup"},
      {"name": "granola", "amount": "1/2 cup"},
      {"name": "honey", "amount": "2 tbsp"},
      {"name": "almonds", "amount": "1/4 cup"}
    ],
    instructions: [
      {"step": 1, "text": "Layer yogurt in glass or bowl."},
      {"step": 2, "text": "Add layer of berries."},
      {"step": 3, "text": "Sprinkle granola on top."},
      {"step": 4, "text": "Drizzle with honey and add almonds."}
    ]
  }
}

const mapDbRecipe = (r: DBRecipe): RecipeCardData => ({
  id: r.id,
  title: r.title,
  image: r.image_url || undefined,
  prepTime: r.prep_time ?? 0,
  difficulty: (r.difficulty ?? 'easy') as 'easy' | 'medium' | 'hard',
  servings: r.servings ?? 1,
  dietaryCompliance: r.dietary_tags ?? [],
  safetyValidated: r.safety_validated ?? true,
  calories: r.calories_per_serving ?? undefined,
  rating: r.rating_average ?? undefined
})

export async function fetchRecipes(limit = 12, filters?: Partial<SearchQuery>): Promise<RecipeCardData[]> {
  try {
    let query = supabase.from('recipes').select('*').limit(limit)

    if (filters) {
      if (filters.dietaryPreferences && filters.dietaryPreferences.length) {
        query = query.contains('dietary_tags', filters.dietaryPreferences)
      }
      if (filters.excludedIngredients && filters.excludedIngredients.length) {
        query = query.not('ingredients', 'cs', filters.excludedIngredients)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('fetchRecipes database error:', error)
      console.log('Database error occurred, returning empty array')
      return []
    }

    if (!data || data.length === 0) {
      console.log('No recipes found in database, returning empty array')
      return []
    }

    console.log(`Found ${data.length} recipes in database`)
    return (data as DBRecipe[]).map(mapDbRecipe)
  } catch (error) {
    console.error('fetchRecipes error:', error)
    console.log('Connection error occurred, returning empty array')
    return []
  }
}

export async function fetchRecipe(id: string): Promise<DBRecipe | null> {
  try {
    // First check if it's a fallback recipe ID
    if (fallbackDetailRecipes[id]) {
      console.log(`Using fallback recipe for ID: ${id}`)
      return fallbackDetailRecipes[id]
    }

    // Try to fetch from database
    const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single()
    
    if (error) {
      console.error('fetchRecipe database error:', error)
      console.log(`Database fetch failed for ID: ${id}, checking fallback recipes`)
      
      // Check if we have a fallback recipe for this ID
      if (fallbackDetailRecipes[id]) {
        return fallbackDetailRecipes[id]
      }
      
      console.error(`No fallback recipe found for ID: ${id}`)
      return null
    }

    if (!data) {
      console.log(`No recipe found in database for ID: ${id}, checking fallback`)
      return fallbackDetailRecipes[id] || null
    }

    return data as DBRecipe
  } catch (error) {
    console.error('fetchRecipe connection error:', error)
    console.log(`Connection error for ID: ${id}, using fallback if available`)
    
    // Return fallback recipe if available
    return fallbackDetailRecipes[id] || null
  }
} 