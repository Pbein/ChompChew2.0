export const mockRecipe = {
  id: 'test-recipe-1',
  title: 'Test Chicken Salad',
  description: 'A healthy chicken salad perfect for testing',
  ingredients: [
    '2 cups cooked chicken breast, diced',
    '1 cup mixed greens',
    '1/2 cup cherry tomatoes',
    '1/4 cup olive oil',
    '2 tbsp lemon juice',
  ],
  instructions: [
    'Dice the cooked chicken breast',
    'Mix greens and tomatoes in a bowl',
    'Add chicken to the salad',
    'Whisk olive oil and lemon juice',
    'Dress the salad and serve',
  ],
  prepTime: 15,
  cookTime: 0,
  totalTime: 15,
  servings: 2,
  difficulty: 'Easy' as const,
  nutrition: {
    calories: 320,
    protein: 28,
    carbs: 8,
    fat: 18,
    fiber: 3,
    sugar: 4,
    sodium: 180,
  },
  tags: ['healthy', 'quick', 'protein', 'salad'],
  dietaryInfo: {
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isDairyFree: true,
    isKeto: true,
    isPaleo: true,
  },
  allergens: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockRecipeWithAllergens = {
  ...mockRecipe,
  id: 'test-recipe-2',
  title: 'Test Pasta with Cheese',
  ingredients: [
    '2 cups pasta',
    '1 cup milk',
    '1/2 cup parmesan cheese',
    '1/4 cup butter',
  ],
  allergens: ['dairy', 'gluten'],
  dietaryInfo: {
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isDairyFree: false,
    isKeto: false,
    isPaleo: false,
  },
}

export const mockRecipes = [mockRecipe, mockRecipeWithAllergens] 