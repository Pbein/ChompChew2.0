// Dietary preferences types from technical specifications

export interface DietPreferences {
  embraceFoods: string[]      // List Y - foods to include/prefer
  avoidFoods: string[]        // List Z - foods to avoid
  medicalConditions: MedicalCondition[]
  triggerFoods: TriggerFood[]
  severityLevels: SeverityMap
}

export interface MedicalCondition {
  id: string
  name: 'UC' | 'Crohns' | 'IBS' | 'GERD' | 'Celiac' | 'Custom'
  severity: 'mild' | 'moderate' | 'severe'
  customName?: string
}

export interface TriggerFood {
  name: string
  condition: string
  severity: 'mild' | 'moderate' | 'severe'
  userAdded: boolean
  notes?: string
}

export interface SeverityMap {
  [foodName: string]: 'preference' | 'medical'
}

// Enhanced search query interface with multi-modal support
export interface EnhancedSearchQuery {
  ingredients: string[]
  calorieGoal?: number
  macroTargets?: MacroTargets
  dietaryRestrictions: string[]
  avoidFoods: string[]
}

export interface MacroTargets {
  protein: number    // percentage (20-40%)
  carbs: number     // percentage (20-60%)
  fat: number       // percentage (15-40%)
}

// Common allergens for quick selection
export const COMMON_ALLERGENS = [
  'nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 
  'fish', 'sesame', 'sulfites', 'corn'
] as const

// Medical condition trigger foods from technical specifications
export const CONDITION_TRIGGERS = {
  UC: ['spicy foods', 'high-fiber vegetables', 'nuts', 'seeds', 'alcohol', 'caffeine'],
  Crohns: ['high-fiber foods', 'fatty foods', 'dairy', 'spicy foods', 'alcohol'],
  IBS: ['high-FODMAP foods', 'dairy', 'gluten', 'artificial sweeteners', 'caffeine'],
  GERD: ['citrus', 'tomatoes', 'spicy foods', 'chocolate', 'caffeine', 'alcohol'],
  Celiac: ['wheat', 'barley', 'rye', 'malt', 'brewer\'s yeast', 'wheat starch']
} as const

// Pre-populated diet templates
export const DIET_TEMPLATES = {
  mediterranean: {
    name: 'Mediterranean Diet',
    foods: ['olive oil', 'fish', 'vegetables', 'whole grains', 'legumes'],
    description: 'Heart-healthy with emphasis on whole foods'
  },
  keto: {
    name: 'Ketogenic Diet',
    foods: ['avocado', 'nuts', 'fatty fish', 'low-carb vegetables', 'cheese'],
    description: 'High fat, very low carb for ketosis'
  },
  paleo: {
    name: 'Paleo Diet',
    foods: ['lean meats', 'fish', 'vegetables', 'fruits', 'nuts'],
    description: 'Whole foods, no processed ingredients'
  },
  vegan: {
    name: 'Vegan Diet',
    foods: ['vegetables', 'fruits', 'legumes', 'nuts', 'seeds', 'whole grains'],
    description: 'Plant-based foods only'
  },
  vegetarian: {
    name: 'Vegetarian Diet',
    foods: ['vegetables', 'fruits', 'legumes', 'nuts', 'dairy', 'eggs'],
    description: 'Plant-based with dairy and eggs'
  }
} as const

export type DietTemplateName = keyof typeof DIET_TEMPLATES
export type MedicalConditionName = keyof typeof CONDITION_TRIGGERS
export type CommonAllergen = typeof COMMON_ALLERGENS[number] 