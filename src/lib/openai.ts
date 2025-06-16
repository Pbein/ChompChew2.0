import OpenAI from 'openai'
import type { DietPreferences } from '@/features/core/types/dietary-preferences'
import { buildRecipePrompt } from './promptBuilder'
import { aiRecipeSchema, AIRecipe } from './validators'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

// Initialize OpenAI client only if key provided
export const openai = process.env.OPENAI_SECRET_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY })
  : null

// Allow running in development without key; real calls will fail gracefully.
if (!process.env.OPENAI_SECRET_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('OPENAI_SECRET_KEY environment variable is required in production')
}

// OpenAI configuration constants
export const OPENAI_CONFIG = {
  model: 'gpt-4o-mini', // Cost-effective model for recipe generation
  maxTokens: 2000,
  temperature: 0.7, // Balanced creativity for recipe generation
  topP: 0.9,
} as const

// Rate limiting configuration
export const RATE_LIMITS = {
  requestsPerMinute: 20,
  requestsPerHour: 500,
  requestsPerDay: 2000,
} as const

/**
 * Wrapper for OpenAI requests. In development we use a mock so that we can
 * iterate quickly without incurring cost or requiring env keys. Replace
 * `generateRecipe` implementation with a real call when ready.
 */
export interface GenerateRecipeParams {
  prompt: string
  dietaryPreferences?: string[]
  allergens?: string[]
  additionalContext?: Partial<DietPreferences>
}

// Fallback stub recipe (used when no API key present or errors)
const getStubRecipe = (prompt: string): AIRecipe => ({
  title: prompt.charAt(0).toUpperCase() + prompt.slice(1),
  description: 'Stub recipe generated in development mode',
  ingredients: [{ name: '1 example ingredient' }],
  instructions: ['Example step'],
})

export const generateRecipe = async (params: GenerateRecipeParams): Promise<AIRecipe> => {
  console.log('🍳 generateRecipe called with params:', {
    prompt: params.prompt,
    dietaryPreferences: params.dietaryPreferences,
    allergens: params.allergens,
    hasOpenAIKey: !!openai
  })

  if (!openai) {
    console.log('⚠️ No OpenAI key found, returning stub recipe')
    return getStubRecipe(params.prompt)
  }

  const messages = buildRecipePrompt(params)
  console.log('📝 Built prompt messages:', messages)

  try {
    console.log('🤖 Calling OpenAI API...')
    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [...messages] as unknown as ChatCompletionMessageParam[],
      max_tokens: OPENAI_CONFIG.maxTokens,
      temperature: OPENAI_CONFIG.temperature,
      top_p: OPENAI_CONFIG.topP,
    })

    console.log('✅ OpenAI API response received:', {
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.choices?.[0]?.finish_reason
    })

    const content = completion.choices?.[0]?.message?.content || ''
    console.log('📄 Raw OpenAI content:', content)

    // Remove markdown fences if present
    const cleaned = content.trim().replace(/^```json\s*/i, '').replace(/```$/i, '')
    console.log('🧹 Cleaned content for JSON parsing:', cleaned)

    let parsed: unknown
    try {
      parsed = JSON.parse(cleaned)
      console.log('✅ Successfully parsed JSON from OpenAI')
    } catch {
      console.warn('❌ Failed to parse JSON from OpenAI, returning stub. Raw content was:', content)
      return getStubRecipe(params.prompt)
    }

    const recipe = aiRecipeSchema.safeParse(parsed)
    if (!recipe.success) {
      console.warn('❌ Validation failed for AI recipe, returning stub. Errors:', recipe.error.format())
      console.warn('Raw parsed object was:', parsed)
      return getStubRecipe(params.prompt)
    }

    console.log('🎉 Successfully generated and validated recipe from OpenAI:', recipe.data.title)
    return recipe.data
  } catch (error) {
    console.error('❌ OpenAI call failed:', error)
    return getStubRecipe(params.prompt)
  }
} 