import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Use service role key if available, otherwise anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey
)

const sampleRecipes = [
  {
    title: 'Mediterranean Quinoa Bowl',
    description: 'Fresh quinoa bowl with vegetables, feta, and olive oil dressing.',
    instructions: [
      {"step": 1, "text": "Cook quinoa according to package directions."},
      {"step": 2, "text": "Chop vegetables and prepare dressing."},
      {"step": 3, "text": "Combine all ingredients and serve."}
    ],
    ingredients: [
      {"name": "quinoa", "amount": "1 cup"},
      {"name": "cucumber", "amount": "1 medium"},
      {"name": "cherry tomatoes", "amount": "1 cup"},
      {"name": "feta cheese", "amount": "1/2 cup"},
      {"name": "olive oil", "amount": "3 tbsp"},
      {"name": "lemon juice", "amount": "2 tbsp"}
    ],
    prep_time: 15,
    cook_time: 15,
    total_time: 30,
    servings: 2,
    difficulty: 'easy',
    cuisine_type: 'Mediterranean',
    dietary_tags: ['vegetarian', 'gluten-free', 'high-protein'],
    calories_per_serving: 420,
    nutrition_info: {"protein": 15, "fat": 18, "carbs": 52, "fiber": 6},
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Honey Garlic Salmon',
    description: 'Pan-seared salmon with a sweet and savory glaze.',
    instructions: [
      {"step": 1, "text": "Season salmon fillets with salt and pepper."},
      {"step": 2, "text": "Sear salmon in hot pan for 4-5 minutes per side."},
      {"step": 3, "text": "Add honey garlic sauce and cook 2 more minutes."}
    ],
    ingredients: [
      {"name": "salmon fillets", "amount": "4 pieces"},
      {"name": "honey", "amount": "3 tbsp"},
      {"name": "garlic", "amount": "3 cloves"},
      {"name": "soy sauce", "amount": "2 tbsp"},
      {"name": "olive oil", "amount": "1 tbsp"}
    ],
    prep_time: 10,
    cook_time: 15,
    total_time: 25,
    servings: 4,
    difficulty: 'easy',
    cuisine_type: 'Asian-fusion',
    dietary_tags: ['high-protein', 'omega-3', 'gluten-free'],
    calories_per_serving: 350,
    nutrition_info: {"protein": 35, "fat": 15, "carbs": 12, "fiber": 0},
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Vegan Buddha Bowl',
    description: 'Colorful bowl with roasted vegetables, quinoa, and tahini dressing.',
    instructions: [
      {"step": 1, "text": "Roast sweet potato and broccoli at 400°F for 25 minutes."},
      {"step": 2, "text": "Cook quinoa and prepare tahini dressing."},
      {"step": 3, "text": "Assemble bowl with all ingredients and drizzle with dressing."}
    ],
    ingredients: [
      {"name": "quinoa", "amount": "1/2 cup"},
      {"name": "sweet potato", "amount": "1 medium"},
      {"name": "broccoli", "amount": "1 cup"},
      {"name": "chickpeas", "amount": "1/2 cup"},
      {"name": "tahini", "amount": "2 tbsp"},
      {"name": "lemon juice", "amount": "1 tbsp"}
    ],
    prep_time: 15,
    cook_time: 25,
    total_time: 40,
    servings: 2,
    difficulty: 'medium',
    cuisine_type: 'Mediterranean',
    dietary_tags: ['vegan', 'dairy-free', 'high-fiber'],
    calories_per_serving: 380,
    nutrition_info: {"protein": 12, "fat": 14, "carbs": 58, "fiber": 12},
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Classic Chicken Soup',
    description: 'A comforting, low-fiber soup suitable for UC flare-ups.',
    instructions: [
      {"step": 1, "text": "Sauté carrots, celery, and chicken."},
      {"step": 2, "text": "Add broth and rice; simmer 20 min."},
      {"step": 3, "text": "Season and serve."}
    ],
    ingredients: [
      {"name": "chicken breast", "amount": "200 g"},
      {"name": "white rice", "amount": "1/2 cup"},
      {"name": "carrots", "amount": "1/2 cup"},
      {"name": "celery", "amount": "1/4 cup"},
      {"name": "chicken broth", "amount": "4 cups"}
    ],
    prep_time: 10,
    cook_time: 20,
    total_time: 30,
    servings: 2,
    difficulty: 'easy',
    cuisine_type: 'American',
    dietary_tags: ['low-fiber', 'uc-safe', 'comfort-food'],
    calories_per_serving: 280,
    nutrition_info: {"protein": 25, "fat": 6, "carbs": 40, "fiber": 1},
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Avocado Toast with Poached Egg',
    description: 'Simple, nutritious breakfast with healthy fats and protein.',
    instructions: [
      {"step": 1, "text": "Toast bread until golden brown."},
      {"step": 2, "text": "Mash avocado with lemon juice and salt."},
      {"step": 3, "text": "Poach egg and place on top of avocado toast."}
    ],
    ingredients: [
      {"name": "whole grain bread", "amount": "2 slices"},
      {"name": "avocado", "amount": "1 large"},
      {"name": "eggs", "amount": "2"},
      {"name": "lemon juice", "amount": "1 tsp"},
      {"name": "salt", "amount": "to taste"}
    ],
    prep_time: 5,
    cook_time: 10,
    total_time: 15,
    servings: 2,
    difficulty: 'easy',
    cuisine_type: 'American',
    dietary_tags: ['vegetarian', 'high-protein', 'healthy-fats'],
    calories_per_serving: 320,
    nutrition_info: {"protein": 14, "fat": 22, "carbs": 24, "fiber": 8},
    image_url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Thai Green Curry',
    description: 'Aromatic coconut curry with vegetables and jasmine rice.',
    instructions: [
      {"step": 1, "text": "Sauté green curry paste in coconut oil."},
      {"step": 2, "text": "Add coconut milk and vegetables; simmer 15 minutes."},
      {"step": 3, "text": "Serve over jasmine rice with fresh herbs."}
    ],
    ingredients: [
      {"name": "green curry paste", "amount": "2 tbsp"},
      {"name": "coconut milk", "amount": "1 can"},
      {"name": "bell peppers", "amount": "2"},
      {"name": "eggplant", "amount": "1 cup"},
      {"name": "jasmine rice", "amount": "1 cup"},
      {"name": "thai basil", "amount": "1/4 cup"}
    ],
    prep_time: 15,
    cook_time: 20,
    total_time: 35,
    servings: 4,
    difficulty: 'medium',
    cuisine_type: 'Thai',
    dietary_tags: ['vegan', 'dairy-free', 'spicy'],
    calories_per_serving: 450,
    nutrition_info: {"protein": 8, "fat": 28, "carbs": 48, "fiber": 4},
    image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Grilled Chicken Caesar Salad',
    description: 'Classic Caesar salad with grilled chicken and homemade dressing.',
    instructions: [
      {"step": 1, "text": "Grill chicken breast until cooked through."},
      {"step": 2, "text": "Prepare Caesar dressing with anchovies and parmesan."},
      {"step": 3, "text": "Toss romaine with dressing and top with chicken and croutons."}
    ],
    ingredients: [
      {"name": "chicken breast", "amount": "2 pieces"},
      {"name": "romaine lettuce", "amount": "1 head"},
      {"name": "parmesan cheese", "amount": "1/2 cup"},
      {"name": "croutons", "amount": "1 cup"},
      {"name": "caesar dressing", "amount": "1/4 cup"}
    ],
    prep_time: 15,
    cook_time: 12,
    total_time: 27,
    servings: 2,
    difficulty: 'easy',
    cuisine_type: 'American',
    dietary_tags: ['high-protein', 'low-carb'],
    calories_per_serving: 380,
    nutrition_info: {"protein": 32, "fat": 18, "carbs": 12, "fiber": 3},
    image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Mushroom Risotto',
    description: 'Creamy arborio rice with mixed mushrooms and parmesan.',
    instructions: [
      {"step": 1, "text": "Sauté mushrooms until golden brown."},
      {"step": 2, "text": "Toast arborio rice, then gradually add warm broth."},
      {"step": 3, "text": "Stir in mushrooms and parmesan; serve immediately."}
    ],
    ingredients: [
      {"name": "arborio rice", "amount": "1 cup"},
      {"name": "mixed mushrooms", "amount": "2 cups"},
      {"name": "vegetable broth", "amount": "4 cups"},
      {"name": "parmesan cheese", "amount": "1/2 cup"},
      {"name": "white wine", "amount": "1/2 cup"}
    ],
    prep_time: 10,
    cook_time: 25,
    total_time: 35,
    servings: 4,
    difficulty: 'medium',
    cuisine_type: 'Italian',
    dietary_tags: ['vegetarian', 'comfort-food'],
    calories_per_serving: 340,
    nutrition_info: {"protein": 12, "fat": 8, "carbs": 58, "fiber": 2},
    image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Black Bean Tacos',
    description: 'Flavorful vegetarian tacos with seasoned black beans and fresh toppings.',
    instructions: [
      {"step": 1, "text": "Season and heat black beans with cumin and chili powder."},
      {"step": 2, "text": "Warm tortillas and prepare fresh toppings."},
      {"step": 3, "text": "Assemble tacos with beans, avocado, and salsa."}
    ],
    ingredients: [
      {"name": "black beans", "amount": "1 can"},
      {"name": "corn tortillas", "amount": "8"},
      {"name": "avocado", "amount": "1"},
      {"name": "salsa", "amount": "1/2 cup"},
      {"name": "lime", "amount": "2 wedges"},
      {"name": "cilantro", "amount": "1/4 cup"}
    ],
    prep_time: 10,
    cook_time: 8,
    total_time: 18,
    servings: 4,
    difficulty: 'easy',
    cuisine_type: 'Mexican',
    dietary_tags: ['vegetarian', 'dairy-free', 'high-fiber'],
    calories_per_serving: 290,
    nutrition_info: {"protein": 12, "fat": 8, "carbs": 45, "fiber": 12},
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Beef Stir Fry',
    description: 'Quick and healthy stir fry with tender beef and crisp vegetables.',
    instructions: [
      {"step": 1, "text": "Slice beef thinly and marinate in soy sauce."},
      {"step": 2, "text": "Stir fry beef in hot wok until browned."},
      {"step": 3, "text": "Add vegetables and sauce; cook until crisp-tender."}
    ],
    ingredients: [
      {"name": "beef sirloin", "amount": "300g"},
      {"name": "broccoli", "amount": "2 cups"},
      {"name": "bell peppers", "amount": "2"},
      {"name": "soy sauce", "amount": "3 tbsp"},
      {"name": "garlic", "amount": "3 cloves"},
      {"name": "ginger", "amount": "1 tbsp"}
    ],
    prep_time: 15,
    cook_time: 10,
    total_time: 25,
    servings: 3,
    difficulty: 'medium',
    cuisine_type: 'Asian',
    dietary_tags: ['high-protein', 'low-carb', 'dairy-free'],
    calories_per_serving: 320,
    nutrition_info: {"protein": 28, "fat": 12, "carbs": 18, "fiber": 4},
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Chocolate Chip Cookies',
    description: 'Classic soft-baked cookies with plenty of chocolate chips.',
    instructions: [
      {"step": 1, "text": "Cream butter and sugars until light and fluffy."},
      {"step": 2, "text": "Mix in eggs and vanilla, then fold in flour and chocolate chips."},
      {"step": 3, "text": "Bake at 375°F for 9-11 minutes until golden."}
    ],
    ingredients: [
      {"name": "all-purpose flour", "amount": "2 1/4 cups"},
      {"name": "butter", "amount": "1 cup"},
      {"name": "brown sugar", "amount": "3/4 cup"},
      {"name": "white sugar", "amount": "3/4 cup"},
      {"name": "eggs", "amount": "2"},
      {"name": "chocolate chips", "amount": "2 cups"}
    ],
    prep_time: 15,
    cook_time: 11,
    total_time: 26,
    servings: 36,
    difficulty: 'easy',
    cuisine_type: 'American',
    dietary_tags: ['dessert', 'comfort-food'],
    calories_per_serving: 140,
    nutrition_info: {"protein": 2, "fat": 6, "carbs": 22, "fiber": 1},
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    is_public: true
  },
  {
    title: 'Greek Yogurt Parfait',
    description: 'Healthy breakfast parfait with yogurt, berries, and granola.',
    instructions: [
      {"step": 1, "text": "Layer Greek yogurt in glasses or bowls."},
      {"step": 2, "text": "Add fresh berries and a drizzle of honey."},
      {"step": 3, "text": "Top with granola and serve immediately."}
    ],
    ingredients: [
      {"name": "Greek yogurt", "amount": "2 cups"},
      {"name": "mixed berries", "amount": "1 cup"},
      {"name": "granola", "amount": "1/2 cup"},
      {"name": "honey", "amount": "2 tbsp"},
      {"name": "mint leaves", "amount": "for garnish"}
    ],
    prep_time: 5,
    cook_time: 0,
    total_time: 5,
    servings: 2,
    difficulty: 'easy',
    cuisine_type: 'Mediterranean',
    dietary_tags: ['vegetarian', 'high-protein', 'probiotic'],
    calories_per_serving: 280,
    nutrition_info: {"protein": 20, "fat": 8, "carbs": 35, "fiber": 5},
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    is_public: true
  }
]

async function loadSeedData() {
  console.log('Loading seed data into Supabase...')
  
  try {
    // First, check if we have any recipes
    const { data: existingRecipes, error: checkError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.error('Error checking existing recipes:', checkError)
      return
    }
    
    if (existingRecipes && existingRecipes.length > 0) {
      console.log('Recipes already exist in database. Skipping seed data.')
      return
    }
    
    // Create a dummy user first (needed for foreign key)
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: 'demo@chompchew.com',
      password: 'demo123456'
    })
    
    let userId = userData?.user?.id
    
    if (userError && userError.message.includes('already registered')) {
      // User already exists, get their ID
      const { data: existingUser } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', 'demo@chompchew.com')
        .single()
      
      userId = existingUser?.id
    }
    
    if (!userId) {
      console.error('Could not create or find demo user')
      return
    }
    
    // Insert recipes (Supabase will auto-generate UUIDs)
    const recipesWithUser = sampleRecipes.map(recipe => ({
      ...recipe,
      created_by: userId
    }))
    
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipesWithUser)
      .select()
    
    if (error) {
      console.error('Error inserting recipes:', error)
      return
    }
    
    console.log(`Successfully loaded ${data?.length || 0} recipes!`)
    console.log('Recipes:')
    data?.forEach(recipe => {
      console.log(`- ${recipe.title} (ID: ${recipe.id})`)
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

loadSeedData() 