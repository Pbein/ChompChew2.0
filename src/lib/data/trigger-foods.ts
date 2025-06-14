// Trigger food database from technical specifications

export interface TriggerFoodEntry {
  name: string
  category: string
  description?: string
  alternatives?: string[]
}

export interface TriggerFoodDatabase {
  [condition: string]: {
    common: TriggerFoodEntry[]
    moderate: TriggerFoodEntry[]
    severe: TriggerFoodEntry[]
  }
}

// Trigger food database with examples for each medical condition
export const TRIGGER_FOOD_DB: TriggerFoodDatabase = {
  UC: {
    common: [
      { 
        name: 'spicy foods', 
        category: 'seasonings', 
        description: 'Hot peppers, chili powder, cayenne',
        alternatives: ['mild herbs', 'turmeric', 'ginger'] 
      },
      { 
        name: 'high-fiber vegetables', 
        category: 'vegetables', 
        description: 'Raw broccoli, cauliflower, cabbage',
        alternatives: ['cooked vegetables', 'peeled vegetables', 'vegetable juices'] 
      }
    ],
    moderate: [
      { 
        name: 'nuts', 
        category: 'proteins', 
        description: 'Whole nuts, especially with skins',
        alternatives: ['nut butters', 'ground nuts', 'seeds'] 
      },
      { 
        name: 'seeds', 
        category: 'proteins', 
        description: 'Whole seeds, especially small ones',
        alternatives: ['ground seeds', 'seed butters'] 
      }
    ],
    severe: [
      { 
        name: 'alcohol', 
        category: 'beverages', 
        description: 'All alcoholic beverages',
        alternatives: ['herbal teas', 'sparkling water', 'fruit juices'] 
      },
      { 
        name: 'caffeine', 
        category: 'beverages', 
        description: 'Coffee, tea, energy drinks',
        alternatives: ['decaf coffee', 'herbal teas', 'caffeine-free sodas'] 
      }
    ]
  },
  Crohns: {
    common: [
      { 
        name: 'high-fiber foods', 
        category: 'grains', 
        description: 'Whole grains, bran, raw fruits with skin',
        alternatives: ['refined grains', 'white rice', 'peeled fruits'] 
      },
      { 
        name: 'fatty foods', 
        category: 'fats', 
        description: 'Fried foods, high-fat meats, butter',
        alternatives: ['lean proteins', 'olive oil in moderation', 'steamed foods'] 
      }
    ],
    moderate: [
      { 
        name: 'dairy', 
        category: 'dairy', 
        description: 'Milk, cheese, ice cream',
        alternatives: ['lactose-free dairy', 'plant-based milk', 'dairy-free alternatives'] 
      }
    ],
    severe: [
      { 
        name: 'alcohol', 
        category: 'beverages', 
        description: 'All alcoholic beverages',
        alternatives: ['herbal teas', 'sparkling water', 'fruit juices'] 
      }
    ]
  },
  IBS: {
    common: [
      { 
        name: 'high-FODMAP foods', 
        category: 'various', 
        description: 'Onions, garlic, beans, certain fruits',
        alternatives: ['low-FODMAP alternatives', 'garlic oil', 'green parts of scallions'] 
      },
      { 
        name: 'dairy', 
        category: 'dairy', 
        description: 'Milk, soft cheeses, ice cream',
        alternatives: ['lactose-free dairy', 'hard cheeses', 'plant-based alternatives'] 
      }
    ],
    moderate: [
      { 
        name: 'gluten', 
        category: 'grains', 
        description: 'Wheat, barley, rye products',
        alternatives: ['gluten-free grains', 'rice', 'quinoa'] 
      },
      { 
        name: 'artificial sweeteners', 
        category: 'sweeteners', 
        description: 'Sorbitol, mannitol, xylitol',
        alternatives: ['natural sugars', 'stevia', 'maple syrup'] 
      }
    ],
    severe: [
      { 
        name: 'caffeine', 
        category: 'beverages', 
        description: 'Coffee, tea, energy drinks',
        alternatives: ['herbal teas', 'decaf coffee', 'caffeine-free beverages'] 
      }
    ]
  },
  GERD: {
    common: [
      { 
        name: 'citrus', 
        category: 'fruits', 
        description: 'Oranges, lemons, grapefruits, tomatoes',
        alternatives: ['non-citrus fruits', 'melons', 'bananas'] 
      },
      { 
        name: 'spicy foods', 
        category: 'seasonings', 
        description: 'Hot peppers, chili, spicy sauces',
        alternatives: ['mild herbs', 'ginger', 'turmeric'] 
      }
    ],
    moderate: [
      { 
        name: 'chocolate', 
        category: 'sweets', 
        description: 'Dark chocolate, milk chocolate, cocoa',
        alternatives: ['carob', 'vanilla', 'fruit-based desserts'] 
      }
    ],
    severe: [
      { 
        name: 'caffeine', 
        category: 'beverages', 
        description: 'Coffee, tea, energy drinks',
        alternatives: ['herbal teas', 'decaf coffee', 'caffeine-free beverages'] 
      },
      { 
        name: 'alcohol', 
        category: 'beverages', 
        description: 'All alcoholic beverages',
        alternatives: ['sparkling water', 'herbal teas', 'fruit juices'] 
      }
    ]
  },
  Celiac: {
    common: [
      { 
        name: 'wheat', 
        category: 'grains', 
        description: 'All wheat products, flour, bread',
        alternatives: ['rice flour', 'almond flour', 'gluten-free bread'] 
      },
      { 
        name: 'barley', 
        category: 'grains', 
        description: 'Barley grain, malt, beer',
        alternatives: ['rice', 'quinoa', 'gluten-free beer'] 
      }
    ],
    moderate: [
      { 
        name: 'rye', 
        category: 'grains', 
        description: 'Rye bread, rye flour',
        alternatives: ['gluten-free bread', 'rice crackers'] 
      }
    ],
    severe: [
      { 
        name: 'malt', 
        category: 'additives', 
        description: 'Malt extract, malt flavoring, malted milk',
        alternatives: ['rice syrup', 'honey', 'pure vanilla extract'] 
      },
      { 
        name: 'brewer\'s yeast', 
        category: 'additives', 
        description: 'Used in beer and some supplements',
        alternatives: ['nutritional yeast (gluten-free)', 'other B-vitamin sources'] 
      }
    ]
  }
}

/**
 * Gets trigger foods for a specific medical condition and severity level
 */
export function getTriggerFoods(
  condition: keyof typeof TRIGGER_FOOD_DB,
  severity?: 'common' | 'moderate' | 'severe'
): TriggerFoodEntry[] {
  const conditionData = TRIGGER_FOOD_DB[condition]
  if (!conditionData) return []

  if (severity) {
    return conditionData[severity] || []
  }

  // Return all trigger foods for the condition
  return [
    ...conditionData.common,
    ...conditionData.moderate,
    ...conditionData.severe
  ]
}

/**
 * Gets all trigger food names for a condition (flattened list)
 */
export function getTriggerFoodNames(
  condition: keyof typeof TRIGGER_FOOD_DB,
  severity?: 'common' | 'moderate' | 'severe'
): string[] {
  return getTriggerFoods(condition, severity).map(food => food.name)
}

/**
 * Gets safe alternatives for a trigger food
 */
export function getAlternatives(
  condition: keyof typeof TRIGGER_FOOD_DB,
  triggerFoodName: string
): string[] {
  const allFoods = getTriggerFoods(condition)
  const food = allFoods.find(f => f.name.toLowerCase() === triggerFoodName.toLowerCase())
  return food?.alternatives || []
}

/**
 * Checks if a food item is a trigger for any medical condition
 */
export function isTriggerFood(
  foodName: string,
  conditions: (keyof typeof TRIGGER_FOOD_DB)[]
): { isTrigger: boolean; condition?: string; severity?: string } {
  const lowerFoodName = foodName.toLowerCase()

  for (const condition of conditions) {
    const conditionData = TRIGGER_FOOD_DB[condition]
    if (!conditionData) continue

    for (const [severity, foods] of Object.entries(conditionData)) {
      for (const food of foods) {
        if (lowerFoodName.includes(food.name.toLowerCase())) {
          return {
            isTrigger: true,
            condition,
            severity
          }
        }
      }
    }
  }

  return { isTrigger: false }
} 