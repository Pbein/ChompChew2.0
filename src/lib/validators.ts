import { z } from 'zod'

export const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name cannot be empty'),
  quantity: z.string().optional(),
  unit: z.string().optional(),
})

export const aiRecipeSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'Recipe must have at least one ingredient'),
  instructions: z.array(z.string()).min(1, 'Recipe must have at least one instruction'),
  prep_time: z.number().int().min(0, 'Prep time cannot be negative').optional(),
  cook_time: z.number().int().min(0, 'Cook time cannot be negative').optional(),
  total_time: z.number().int().optional().nullable(),
  servings: z.number().int().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  cuisine_type: z.string().optional(),
  dietary_tags: z.array(z.string()).optional(),
  calories_per_serving: z.number().int().optional(),
})

export type AIRecipe = z.infer<typeof aiRecipeSchema> 