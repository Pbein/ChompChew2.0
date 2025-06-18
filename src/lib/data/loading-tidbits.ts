// ============================================================================
// TIDBIT TYPES & INTERFACES
// ============================================================================

export interface BaseTidbit {
  id: string;
  fact: string;
  emoji: string;
  source?: string;
}

export interface FeaturedRecipeTidbit {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
}

export type TidbitCategory = 
  | 'nutrition-macro'
  | 'cooking-tips'
  | 'ingredient-origins'
  | 'food-history'
  | 'featured-recipes';

// ============================================================================
// NUTRITION & MACRO INSIGHTS
// ============================================================================

export const nutritionMacroTidbits: BaseTidbit[] = [
  {
    id: 'nm-1',
    fact: 'The protein "baseline" most adults need is about 0.8 g per kilogram of body-weight per day. That\'s the RDA, meant to cover basic repair—not necessarily athletic goals.',
    emoji: '💪',
    source: 'health.harvard.edu'
  },
  {
    id: 'nm-2',
    fact: 'A squeeze of vitamin-C-rich citrus can double or triple your body\'s absorption of the non-heme iron in plant foods.',
    emoji: '🍋',
    source: 'pubmed.ncbi.nlm.nih.gov'
  },
  {
    id: 'nm-3',
    fact: 'Quinoa is one of the few plant staples that supplies all nine essential amino acids—earning its "complete protein" label.',
    emoji: '🌾',
    source: 'healthline.com'
  },
  {
    id: 'nm-4',
    fact: 'One cooked cup of lentils delivers ~18 g of protein with almost no saturated fat.',
    emoji: '🫘',
    source: 'healthline.com'
  },
  {
    id: 'nm-5',
    fact: 'Avocados are loaded with oleic-acid-based mono-unsaturated fat, which studies link to lower LDL ("bad") cholesterol when it replaces saturated fats.',
    emoji: '🥑',
    source: 'nutritionsource.hsph.harvard.edu'
  },
  {
    id: 'nm-6',
    fact: 'Dietary fiber doesn\'t just keep you full—it feeds gut microbes that turn it into short-chain fatty acids tied to better metabolic health.',
    emoji: '🦠',
    source: 'pmc.ncbi.nlm.nih.gov'
  },
  {
    id: 'nm-7',
    fact: 'Swapping white rice for brown bumps magnesium intake; a half-cup serving of brown rice supplies ~11% of your daily need.',
    emoji: '🍚',
    source: 'healthline.com'
  },
  {
    id: 'nm-8',
    fact: 'Two servings of fatty fish (e.g., salmon, mackerel) a week meet the American Heart Association\'s omega-3 target for heart health.',
    emoji: '🐟',
    source: 'heart.org'
  }
];

// ============================================================================
// MICRO "HOW-TO" COOKING TIPS
// ============================================================================

export const cookingTipsTidbits: BaseTidbit[] = [
  {
    id: 'ct-1',
    fact: 'Rest steaks (≈5 min per inch of thickness) before slicing so juices redistribute instead of flooding the plate.',
    emoji: '🥩',
    source: 'seriouseats.com'
  },
  {
    id: 'ct-2',
    fact: 'Season pasta water to roughly 1% salt by weight—salty enough to flavor the noodles without tasting like seawater.',
    emoji: '🍝',
    source: 'seriouseats.com'
  },
  {
    id: 'ct-3',
    fact: 'Blanch, then "shock" greens in ice water to lock in vivid color and crisp texture.',
    emoji: '🥬',
    source: 'allrecipes.com'
  },
  {
    id: 'ct-4',
    fact: 'Chilling cookie dough for at least 30 minutes lets flour hydrate and butter solidify, yielding chewier cookies.',
    emoji: '🍪',
    source: 'seriouseats.com'
  },
  {
    id: 'ct-5',
    fact: 'Ultra-creamy scrambled eggs come from low heat and constant stirring, not dairy add-ins.',
    emoji: '🍳',
    source: 'seriouseats.com'
  },
  {
    id: 'ct-6',
    fact: 'Setting up a mise en place—measured, pre-chopped ingredients within arm\'s reach—cuts kitchen errors and stress.',
    emoji: '🔪',
    source: 'seriouseats.com'
  },
  {
    id: 'ct-7',
    fact: 'Use a razor-sharp knife for herbs; dull blades bruise leaves and sap their flavor.',
    emoji: '🌿',
    source: 'bonappetit.com'
  },
  {
    id: 'ct-8',
    fact: 'A pre-heated cast-iron or carbon-steel pan (water droplet "dances") gives you the high-energy surface needed for a true sear.',
    emoji: '🍳',
    source: 'seriouseats.com'
  }
];

// ============================================================================
// INGREDIENT ORIGIN / SEASONALITY FACTS
// ============================================================================

export const ingredientOriginsTidbits: BaseTidbit[] = [
  {
    id: 'io-1',
    fact: 'True vanilla (Vanilla planifolia) is an orchid first cultivated by Mesoamerican peoples in what\'s now Mexico.',
    emoji: '🌺',
    source: 'britannica.com'
  },
  {
    id: 'io-2',
    fact: 'Black peppercorns trace back to India\'s Malabar Coast, once nicknamed "Black Gold" for their trade value.',
    emoji: '⚫',
    source: 'britannica.com'
  },
  {
    id: 'io-3',
    fact: 'North-American asparagus hits peak flavor in April–June—short, sweet, and worth the wait.',
    emoji: '🌱',
    source: 'simplyrecipes.com'
  },
  {
    id: 'io-4',
    fact: 'Fresh tomatoes are at their sun-ripened best (and cheapest) between July and September.',
    emoji: '🍅',
    source: 'extension.oregonstate.edu'
  },
  {
    id: 'io-5',
    fact: 'The world\'s priciest spice, saffron, is hand-picked from Crocus sativus blooms—most of it grown in Iran.',
    emoji: '🌸',
    source: 'britannica.com'
  },
  {
    id: 'io-6',
    fact: 'Wild Alaskan salmon harvests crest from mid-July to mid-September, when runs are heaviest.',
    emoji: '🐟',
    source: 'adfg.alaska.gov'
  },
  {
    id: 'io-7',
    fact: 'Blood oranges depend on cool nights to develop their crimson flesh; U.S. peak season is December–February.',
    emoji: '🍊',
    source: 'allrecipes.com'
  },
  {
    id: 'io-8',
    fact: 'Tart, thick-skinned Granny Smith apples out-keep most varieties, staying crisp for months under refrigeration.',
    emoji: '🍏',
    source: 'southernliving.com'
  }
];

// ============================================================================
// FUN FOOD HISTORY / CULTURE NUGGETS
// ============================================================================

export const foodHistoryTidbits: BaseTidbit[] = [
  {
    id: 'fh-1',
    fact: 'The "sandwich" is named for John Montagu, 4th Earl of Sandwich, who reputedly ate beef between bread so he could keep playing cards (circa 1762).',
    emoji: '🥪',
    source: 'history.com'
  },
  {
    id: 'fh-2',
    fact: 'Pizza Margherita was christened in 1889 after Queen Margherita of Savoy tasted a tomato-mozzarella-basil pie mirroring Italy\'s flag.',
    emoji: '🍕',
    source: 'italymagazine.com'
  },
  {
    id: 'fh-3',
    fact: 'Fortune cookies aren\'t Chinese—they were popularized by Japanese-American bakers in California before World War I.',
    emoji: '🥠',
    source: 'history.com'
  },
  {
    id: 'fh-4',
    fact: 'The earliest sushi, narezushi, was salt-fermented fish; the rice was tossed, not eaten, until later innovations in Japan.',
    emoji: '🍣',
    source: 'en.wikipedia.org'
  },
  {
    id: 'fh-5',
    fact: '17th-century English coffeehouses earned the nickname "penny universities" because a single penny bought both a cup and stimulating debate.',
    emoji: '☕',
    source: 'history.com'
  },
  {
    id: 'fh-6',
    fact: 'Mesoamerican peoples enjoyed chocolate as a spiced, unsweetened drink long before sugar-laden bars took Europe by storm in the 16th century.',
    emoji: '🍫',
    source: 'history.com'
  },
  {
    id: 'fh-7',
    fact: 'Tea\'s rise to Britain\'s national beverage sprang from East India Company imports in the 18th–19th centuries, when it even undercut beer in price.',
    emoji: '🍵',
    source: 'en.wikipedia.org'
  },
  {
    id: 'fh-8',
    fact: 'Chili peppers, native to the Americas, circled the globe after the 1492 Columbian Exchange and quickly became staples in Asian and African cuisines.',
    emoji: '🌶️',
    source: 'britannica.com'
  }
];

// ============================================================================
// FEATURED RECIPE TIDBITS
// ============================================================================

export const featuredRecipeTidbits: FeaturedRecipeTidbit[] = [
  {
    id: 'fr-1',
    title: 'Mediterranean Quinoa Bowl',
    description: 'A colorful bowl packed with fresh vegetables, olives, and feta cheese.',
    prepTime: '15 min',
    difficulty: 'Easy',
    cuisine: 'Mediterranean'
  },
  {
    id: 'fr-2',
    title: 'Thai Coconut Curry',
    description: 'Aromatic curry with coconut milk, fresh herbs, and your choice of protein.',
    prepTime: '25 min',
    difficulty: 'Medium',
    cuisine: 'Thai'
  },
  {
    id: 'fr-3',
    title: 'Overnight Chia Pudding',
    description: 'Creamy, nutritious pudding that prepares itself while you sleep.',
    prepTime: '5 min',
    difficulty: 'Easy',
    cuisine: 'Healthy'
  },
  {
    id: 'fr-4',
    title: 'Moroccan Tagine',
    description: 'Slow-cooked stew with warm spices, dried fruits, and tender vegetables.',
    prepTime: '45 min',
    difficulty: 'Medium',
    cuisine: 'Moroccan'
  },
  {
    id: 'fr-5',
    title: 'Korean Bibimbap',
    description: 'Colorful rice bowl with seasoned vegetables and protein of your choice.',
    prepTime: '30 min',
    difficulty: 'Medium',
    cuisine: 'Korean'
  }
];

// ============================================================================
// CONSOLIDATED COLLECTIONS
// ============================================================================

// All fact-based tidbits combined for easy access
export const allFactTidbits: BaseTidbit[] = [
  ...nutritionMacroTidbits,
  ...cookingTipsTidbits,
  ...ingredientOriginsTidbits,
  ...foodHistoryTidbits
];

// Legacy exports for backward compatibility
export const nutritionTidbits = nutritionMacroTidbits;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Get random tidbit from a specific category
export const getRandomTidbitByCategory = (category: TidbitCategory): BaseTidbit | FeaturedRecipeTidbit => {
  switch (category) {
    case 'nutrition-macro':
      return nutritionMacroTidbits[Math.floor(Math.random() * nutritionMacroTidbits.length)];
    case 'cooking-tips':
      return cookingTipsTidbits[Math.floor(Math.random() * cookingTipsTidbits.length)];
    case 'ingredient-origins':
      return ingredientOriginsTidbits[Math.floor(Math.random() * ingredientOriginsTidbits.length)];
    case 'food-history':
      return foodHistoryTidbits[Math.floor(Math.random() * foodHistoryTidbits.length)];
    case 'featured-recipes':
      return featuredRecipeTidbits[Math.floor(Math.random() * featuredRecipeTidbits.length)];
    default:
      return allFactTidbits[Math.floor(Math.random() * allFactTidbits.length)];
  }
};

// Get random fact tidbit from any category
export const getRandomFactTidbit = (): BaseTidbit => {
  return allFactTidbits[Math.floor(Math.random() * allFactTidbits.length)];
};

// Get random featured recipe tidbit
export const getRandomFeaturedRecipe = (): FeaturedRecipeTidbit => {
  return featuredRecipeTidbits[Math.floor(Math.random() * featuredRecipeTidbits.length)];
};

// Get shuffled tidbits for cycling (enhanced version)
export const getShuffledTidbits = () => {
  const shuffledFacts = [...allFactTidbits].sort(() => Math.random() - 0.5);
  const shuffledRecipes = [...featuredRecipeTidbits].sort(() => Math.random() - 0.5);
  
  return {
    facts: shuffledFacts,
    recipes: shuffledRecipes,
    // Legacy compatibility
    nutrition: shuffledFacts, 
  };
};

// Get tidbits by category for organized display
export const getTidbitsByCategory = () => {
  return {
    nutritionMacro: nutritionMacroTidbits,
    cookingTips: cookingTipsTidbits,
    ingredientOrigins: ingredientOriginsTidbits,
    foodHistory: foodHistoryTidbits,
    featuredRecipes: featuredRecipeTidbits
  };
};

// Get category statistics
export const getCategoryStats = () => {
  return {
    'nutrition-macro': nutritionMacroTidbits.length,
    'cooking-tips': cookingTipsTidbits.length,
    'ingredient-origins': ingredientOriginsTidbits.length,
    'food-history': foodHistoryTidbits.length,
    'featured-recipes': featuredRecipeTidbits.length,
    total: allFactTidbits.length + featuredRecipeTidbits.length
  };
}; 