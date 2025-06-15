// Safety validation service from technical specifications

import { DietPreferences } from '@/features/core/types/dietary-preferences'

// Placeholder Recipe interface - will be replaced with actual type
interface Recipe {
  id: string
  title: string
  ingredients: string[]
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export interface SafetyValidation {
  isSafe: boolean
  warnings: ValidationWarning[]
  blockers: ValidationBlocker[]
  suggestions: string[]
}

export interface ValidationWarning {
  ingredient: string
  reason: string
  severity: 'mild' | 'moderate'
  alternatives?: string[]
}

export interface ValidationBlocker {
  ingredient: string
  reason: string
  severity: 'severe'
  medicalCondition?: string
}

/**
 * Validates recipe safety against user's dietary preferences and medical conditions
 * This is a placeholder implementation - will be enhanced with full validation logic
 */
export async function validateRecipeSafety(
  recipe: Recipe,
  userPreferences: DietPreferences
): Promise<SafetyValidation> {
  const warnings: ValidationWarning[] = []
  const blockers: ValidationBlocker[] = []
  const suggestions: string[] = []

  // Check for allergens and avoid foods
  for (const ingredient of recipe.ingredients) {
    const lowerIngredient = ingredient.toLowerCase()
    
    // Check against avoid foods
    for (const avoidFood of userPreferences.avoidFoods) {
      if (lowerIngredient.includes(avoidFood.toLowerCase())) {
        const severity = userPreferences.severityLevels[avoidFood]
        
        if (severity === 'medical') {
          blockers.push({
            ingredient,
            reason: `Contains ${avoidFood} which is marked as a medical restriction`,
            severity: 'severe',
            medicalCondition: 'User-specified medical restriction'
          })
        } else {
          warnings.push({
            ingredient,
            reason: `Contains ${avoidFood} which you prefer to avoid`,
            severity: 'mild',
            alternatives: [`Try substituting with a ${avoidFood}-free alternative`]
          })
        }
      }
    }

    // Check against medical condition triggers
    for (const condition of userPreferences.medicalConditions) {
      const triggerFoods = userPreferences.triggerFoods
        .filter(tf => tf.condition === condition.name)
        .map(tf => tf.name)

      for (const triggerFood of triggerFoods) {
        if (lowerIngredient.includes(triggerFood.toLowerCase())) {
          if (condition.severity === 'severe') {
            blockers.push({
              ingredient,
              reason: `Contains ${triggerFood} which is a trigger for ${condition.name}`,
              severity: 'severe',
              medicalCondition: condition.name
            })
          } else {
            warnings.push({
              ingredient,
              reason: `May contain ${triggerFood} which can trigger ${condition.name}`,
              severity: condition.severity === 'moderate' ? 'moderate' : 'mild',
              alternatives: [`Consider ${triggerFood}-free alternatives`]
            })
          }
        }
      }
    }
  }

  // Generate suggestions based on validation results
  if (blockers.length > 0) {
    suggestions.push('This recipe contains ingredients that are unsafe for your medical conditions')
    suggestions.push('Try using our "Make One for Me" feature to generate a safe alternative')
  } else if (warnings.length > 0) {
    suggestions.push('This recipe may need some ingredient substitutions')
    suggestions.push('Check the ingredient list carefully before cooking')
  } else {
    suggestions.push('This recipe appears safe for your dietary needs')
  }

  const isSafe = blockers.length === 0

  return {
    isSafe,
    warnings,
    blockers,
    suggestions
  }
}

/**
 * Validates search constraints before recipe generation
 * Placeholder implementation
 */
export async function validateSearchConstraints(
  userPreferences: DietPreferences
): Promise<{ isValid: boolean; issues: string[] }> {
  const issues: string[] = []

  // Check for conflicting preferences
  const hasConflicts = userPreferences.embraceFoods.some((embraceFood: string) =>
    userPreferences.avoidFoods.some((avoidFood: string) =>
      embraceFood.toLowerCase().includes(avoidFood.toLowerCase())
    )
  )

  if (hasConflicts) {
    issues.push('Some foods in your "embrace" list conflict with your "avoid" list')
  }

  // Check for medical condition conflicts
  if (userPreferences.medicalConditions.length > 0 && userPreferences.embraceFoods.length > 0) {
    // Placeholder: would check if embrace foods conflict with medical conditions
    // This would be implemented with full trigger food database
  }

  return {
    isValid: issues.length === 0,
    issues
  }
}

/**
 * Gets safe ingredient alternatives for a given ingredient
 * Placeholder implementation
 */
export async function getSafeAlternatives(
  ingredient: string
): Promise<string[]> {
  // Placeholder implementation - would use comprehensive ingredient database
  const alternatives: string[] = []

  // Simple placeholder logic
  if (ingredient.toLowerCase().includes('dairy')) {
    alternatives.push('plant-based milk', 'coconut milk', 'almond milk')
  } else if (ingredient.toLowerCase().includes('gluten')) {
    alternatives.push('gluten-free flour', 'almond flour', 'rice flour')
  } else if (ingredient.toLowerCase().includes('nuts')) {
    alternatives.push('seeds', 'nut-free alternatives')
  }

  return alternatives
} 