import type { DietPreferences } from '@/features/core/types/dietary-preferences'

export interface BuildPromptParams {
  prompt: string
  dietaryPreferences?: string[]
  allergens?: string[]
  additionalContext?: Partial<DietPreferences>
}

// System instruction used for every request
const SYSTEM_MESSAGE = `You are ChompChew AI, a professional chef, nutritionist, and food scientist.
You create detailed, easy-to-follow recipes that respect the user's dietary restrictions and preferences.`

export const buildRecipePrompt = ({
  prompt,
  dietaryPreferences = [],
  allergens = [],
  additionalContext,
}: BuildPromptParams) => {
  const userContextParts: string[] = []

  if (dietaryPreferences.length) {
    userContextParts.push(`Dietary preferences to embrace: ${dietaryPreferences.join(', ')}`)
  }
  if (allergens.length) {
    userContextParts.push(`Foods to avoid (allergens): ${allergens.join(', ')}`)
  }
  if (additionalContext) {
    // Add any additional context key/values in a readable way
    Object.entries(additionalContext).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        userContextParts.push(`${key}: ${value.join(', ')}`)
      }
    })
  }

  const contextBlock = userContextParts.length ? `Here is additional context about the user:\n${userContextParts.join('\n')}` : ''

  /**
   * We instruct the model to return ONLY strict JSON (no markdown fence).
   * This keeps parsing simpler and safer.
   */
  const assistantInstructions = `Please generate a recipe that fulfils the request *${prompt}*.
${contextBlock}

Return ONLY valid JSON that matches this TypeScript interface (do not wrap in markdown):
interface Recipe {
  title: string;               // Recipe title
  description?: string;        // Short description
  ingredients: {
    name: string;
    quantity?: string;         // e.g. "200", "1/2"
    unit?: string;             // e.g. "g", "cup"
  }[];
  instructions: string[];      // Step-by-step list
  prep_time?: number;          // minutes
  cook_time?: number;          // minutes
  total_time?: number;         // minutes
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisine_type?: string;
  dietary_tags?: string[];
  calories_per_serving?: number;
}`

  return [
    { role: 'system', content: SYSTEM_MESSAGE },
    { role: 'user', content: assistantInstructions },
  ] as const
} 