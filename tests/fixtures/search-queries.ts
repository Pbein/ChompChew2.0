export const mockSearchQueries = {
  simple: 'chicken salad',
  complex: 'chicken paleo no dairy dinner',
  withExclusions: 'pasta no gluten no dairy',
  withMealType: 'breakfast smoothie healthy',
  withCuisine: 'italian pasta vegetarian',
  withNutrition: 'high protein low carb chicken',
  withCookingMethod: 'grilled salmon lemon',
  withPrepTime: 'quick 15 minute dinner',
}

export const mockParsedQuery = {
  originalQuery: 'chicken paleo no dairy dinner',
  tokens: [
    { text: 'chicken', category: 'ingredients', confidence: 0.95 },
    { text: 'paleo', category: 'dietaryPreferences', confidence: 0.9 },
    { text: 'no dairy', category: 'excludedIngredients', confidence: 0.95 },
    { text: 'dinner', category: 'mealType', confidence: 0.85 },
  ],
  structuredQuery: {
    ingredients: ['chicken'],
    excludedIngredients: ['dairy'],
    dietaryPreferences: ['paleo'],
    mealType: ['dinner'],
    cuisine: [],
    cookingMethod: [],
    nutritionGoals: [],
    prepConstraints: [],
    dishes: [],
  },
}

export const mockSearchHistory = [
  {
    id: '1',
    query: 'chicken paleo no dairy',
    timestamp: new Date('2024-01-01T10:00:00Z'),
    resultsCount: 5,
  },
  {
    id: '2',
    query: 'vegetarian pasta quick',
    timestamp: new Date('2024-01-01T11:00:00Z'),
    resultsCount: 8,
  },
] 