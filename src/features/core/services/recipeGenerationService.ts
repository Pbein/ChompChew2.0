import { openai, OPENAI_CONFIG } from '@/lib/openai'
import { z } from 'zod'

// Input validation schemas
export const RecipeGenerationInputSchema = z.object({
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  dietaryRestrictions: z.array(z.string()).optional().default([]),
  allergies: z.array(z.string()).optional().default([]),
  cuisineType: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
  cookingTime: z.number().min(5).max(480).optional(), // 5 minutes to 8 hours
  servings: z.number().min(1).max(12).optional().default(4),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'dessert']).optional(),
  equipment: z.array(z.string()).optional().default([]),
  inspiration: z.string().optional(), // User's creative input
})

export type RecipeGenerationInput = z.infer<typeof RecipeGenerationInputSchema>

// Recipe output validation schema
export const GeneratedRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.string(),
    unit: z.string().optional(),
    notes: z.string().optional(),
  })),
  instructions: z.array(z.object({
    step: z.number(),
    instruction: z.string(),
    time: z.number().optional(), // Time in minutes for this step
    temperature: z.string().optional(), // e.g., "350°F" or "medium heat"
  })),
  nutrition: z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional(),
    fiber: z.number().optional(),
  }).optional(),
  metadata: z.object({
    prepTime: z.number(), // minutes
    cookTime: z.number(), // minutes
    totalTime: z.number(), // minutes
    servings: z.number(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    cuisineType: z.string().optional(),
    mealType: z.string().optional(),
  }),
  tags: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
})

export type GeneratedRecipe = z.infer<typeof GeneratedRecipeSchema>

// Prompt templates for different scenarios
export class RecipePromptBuilder {
  private static buildDietaryConstraints(restrictions: string[], allergies: string[]): string {
    const constraints: string[] = []
    
    if (restrictions.length > 0) {
      constraints.push(`Dietary restrictions: ${restrictions.join(', ')}`)
    }
    
    if (allergies.length > 0) {
      constraints.push(`Allergies to avoid: ${allergies.join(', ')}`)
    }
    
    return constraints.length > 0 ? `\n\nIMPORTANT CONSTRAINTS:\n${constraints.join('\n')}` : ''
  }

  private static buildEquipmentConstraints(equipment: string[]): string {
    if (equipment.length === 0) return ''
    return `\n\nAVAILABLE EQUIPMENT: ${equipment.join(', ')}`
  }

  static buildRecipeGenerationPrompt(input: RecipeGenerationInput): string {
    const {
      ingredients,
      dietaryRestrictions = [],
      allergies = [],
      cuisineType,
      difficulty,
      cookingTime,
      servings,
      mealType,
      equipment = [],
      inspiration
    } = input

    const basePrompt = `You are a professional chef and recipe developer. Create a delicious, practical recipe using the following ingredients as the main components: ${ingredients.join(', ')}.

REQUIREMENTS:
- Recipe difficulty: ${difficulty}
- Servings: ${servings}
${cookingTime ? `- Total cooking time: approximately ${cookingTime} minutes` : ''}
${cuisineType ? `- Cuisine style: ${cuisineType}` : ''}
${mealType ? `- Meal type: ${mealType}` : ''}
${inspiration ? `- Creative inspiration: ${inspiration}` : ''}

${this.buildDietaryConstraints(dietaryRestrictions, allergies)}
${this.buildEquipmentConstraints(equipment)}

Please respond with a JSON object in the following exact format:

{
  "title": "Recipe Name",
  "description": "Brief, appetizing description of the dish (2-3 sentences)",
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": "quantity",
      "unit": "measurement unit (optional)",
      "notes": "any special notes (optional)"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "instruction": "Detailed step instruction",
      "time": 5,
      "temperature": "350°F (optional)"
    }
  ],
  "nutrition": {
    "calories": 450,
    "protein": 25,
    "carbs": 35,
    "fat": 18,
    "fiber": 6
  },
  "metadata": {
    "prepTime": 15,
    "cookTime": 30,
    "totalTime": 45,
    "servings": ${servings},
    "difficulty": "${difficulty}",
    "cuisineType": "${cuisineType || 'international'}",
    "mealType": "${mealType || 'main'}"
  },
  "tags": ["tag1", "tag2"],
  "tips": ["helpful cooking tip 1", "helpful cooking tip 2"]
}

IMPORTANT GUIDELINES:
1. Ensure all dietary restrictions and allergies are strictly followed
2. Use realistic cooking times and temperatures
3. Include practical cooking tips
4. Make instructions clear and beginner-friendly for easy difficulty
5. Provide approximate nutritional information
6. Suggest ingredient substitutions in notes when helpful
7. Only use ingredients that are commonly available
8. Ensure the recipe is actually cookable and delicious

Respond ONLY with the JSON object, no additional text.`

    return basePrompt
  }

  static buildRecipeVariationPrompt(originalRecipe: GeneratedRecipe, variation: string): string {
    return `You are a professional chef. Take this existing recipe and create a variation based on: "${variation}"

ORIGINAL RECIPE:
${JSON.stringify(originalRecipe, null, 2)}

Create a new recipe that maintains the core concept but incorporates the requested variation. Follow the same JSON format as the original recipe.

Respond ONLY with the JSON object, no additional text.`
  }

  static buildIngredientSubstitutionPrompt(recipe: GeneratedRecipe, substitutions: Record<string, string>): string {
    return `You are a professional chef. Modify this recipe by substituting ingredients as specified:

ORIGINAL RECIPE:
${JSON.stringify(recipe, null, 2)}

SUBSTITUTIONS:
${Object.entries(substitutions).map(([original, substitute]) => `- Replace "${original}" with "${substitute}"`).join('\n')}

Adjust the recipe accordingly, including cooking times, instructions, and nutritional information. Maintain the same JSON format.

Respond ONLY with the JSON object, no additional text.`
  }
}

// Main recipe generation service
export class RecipeGenerationService {
  private static async callOpenAI(prompt: string): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI client is not initialized. Please check OPENAI_SECRET_KEY environment variable.')
    }

    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef and recipe developer. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: OPENAI_CONFIG.maxTokens,
        temperature: OPENAI_CONFIG.temperature,
        top_p: OPENAI_CONFIG.topP,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response content from OpenAI')
      }

      return content.trim()
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error(`Recipe generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private static parseAndValidateRecipe(jsonString: string): GeneratedRecipe {
    try {
      // Clean the JSON string (remove any markdown formatting)
      const cleanJson = jsonString.replace(/```json\n?|\n?```/g, '').trim()
      const parsed = JSON.parse(cleanJson)
      
      // Validate against schema
      return GeneratedRecipeSchema.parse(parsed)
    } catch (error) {
      console.error('Recipe parsing error:', error)
      console.error('Raw response:', jsonString)
      throw new Error(`Invalid recipe format: ${error instanceof Error ? error.message : 'Unknown parsing error'}`)
    }
  }

  static async generateRecipe(input: RecipeGenerationInput): Promise<GeneratedRecipe> {
    // Validate input
    const validatedInput = RecipeGenerationInputSchema.parse(input)
    
    // Build prompt
    const prompt = RecipePromptBuilder.buildRecipeGenerationPrompt(validatedInput)
    
    // Call OpenAI
    const response = await this.callOpenAI(prompt)
    
    // Parse and validate response
    const recipe = this.parseAndValidateRecipe(response)
    
    return recipe
  }

  static async generateRecipeVariation(
    originalRecipe: GeneratedRecipe, 
    variation: string
  ): Promise<GeneratedRecipe> {
    const prompt = RecipePromptBuilder.buildRecipeVariationPrompt(originalRecipe, variation)
    const response = await this.callOpenAI(prompt)
    return this.parseAndValidateRecipe(response)
  }

  static async generateWithSubstitutions(
    recipe: GeneratedRecipe,
    substitutions: Record<string, string>
  ): Promise<GeneratedRecipe> {
    const prompt = RecipePromptBuilder.buildIngredientSubstitutionPrompt(recipe, substitutions)
    const response = await this.callOpenAI(prompt)
    return this.parseAndValidateRecipe(response)
  }

  // Utility method to estimate generation cost
  static estimateTokenCost(input: RecipeGenerationInput): number {
    const prompt = RecipePromptBuilder.buildRecipeGenerationPrompt(input)
    // Rough estimation: 1 token ≈ 4 characters
    const estimatedInputTokens = Math.ceil(prompt.length / 4)
    const estimatedOutputTokens = OPENAI_CONFIG.maxTokens
    
    return estimatedInputTokens + estimatedOutputTokens
  }
}

// Types and service are already exported above 