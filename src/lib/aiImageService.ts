/**
 * AI Image Generation Service for Recipe Images
 * Uses OpenAI DALL-E API to generate custom food photography
 * Based on research-backed food photography principles for maximum appeal
 */

import { openai } from './openai'
import { getRecipeImageUrl } from './imageService'

export interface RecipeImageParams {
  title: string
  ingredients?: string[]
  cuisineType?: string
  description?: string
}

// Photography variance options for natural variety
interface PhotoStyle {
  angle: string
  lighting: string
  plating: string
  props: string
  background: string
}

/**
 * Research-backed photo style variations that maintain consistency
 * while providing natural variety for different dishes
 */
const PHOTO_STYLES: PhotoStyle[] = [
  {
    angle: '45-degree camera angle',
    lighting: 'soft natural side-light from a nearby window',
    plating: 'elegantly plated on a simple matte ceramic plate',
    props: 'minimal rustic props (a linen napkin, a few fresh herb leaves)',
    background: 'neutral wooden tabletop'
  },
  {
    angle: '45-degree camera angle',
    lighting: 'bright editorial back-light creating an airy mood',
    plating: 'beautifully arranged on a clean white ceramic bowl',
    props: 'subtle styling with a vintage wooden spoon and scattered ingredients',
    background: 'light marble countertop'
  },
  {
    angle: 'overhead flat-lay, 90-degree camera angle',
    lighting: 'soft natural side-light from a nearby window',
    plating: 'artfully arranged on a rustic ceramic plate',
    props: 'thoughtfully placed with a cloth napkin and garnish',
    background: 'weathered wooden table'
  },
  {
    angle: '45-degree camera angle',
    lighting: 'warm golden hour side-lighting',
    plating: 'presented on a handcrafted stoneware plate',
    props: 'minimalist styling with a simple linen cloth',
    background: 'natural wood surface with subtle grain'
  },
  {
    angle: 'overhead flat-lay, 90-degree camera angle',
    lighting: 'bright editorial back-light for clean presentation',
    plating: 'composed on a modern white plate',
    props: 'clean styling with fresh ingredients as accents',
    background: 'pristine white marble surface'
  }
]

/**
 * Generate a research-backed professional food photography prompt for DALL-E
 * Incorporates proven principles while maintaining natural variety
 */
function buildImagePrompt(params: RecipeImageParams): string {
  const { title, ingredients = [], cuisineType } = params
  
  // Select a photo style based on dish characteristics for natural variety
  const styleIndex = Math.abs(title.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % PHOTO_STYLES.length
  const style = PHOTO_STYLES[styleIndex]
  
  // Extract key ingredients for context (max 3 for prompt efficiency)
  const keyIngredients = ingredients
    .filter(ingredient => ingredient.length > 2) // Filter out basics like "salt"
    .slice(0, 3)
    .join(', ')
  
  // Build the research-backed prompt template
  let prompt = `Ultra-realistic food photograph of ${title} ${style.plating}. `
  prompt += `${style.lighting} creates gentle highlights and shadow depth. `
  prompt += `${style.angle}, 50mm lens look, shallow depth-of-field (f/2.8) that keeps the food in crisp focus while the background softly blurs. `
  prompt += `${style.background}, ${style.props} chosen to complement—not overpower—the colors of the dish. `
  
  // Add ingredient context if available
  if (keyIngredients) {
    prompt += `Featuring ${keyIngredients}. `
  }
  
  // Add cuisine context for authentic presentation
  if (cuisineType && cuisineType !== 'international') {
    prompt += `Authentic ${cuisineType} cuisine presentation. `
  }
  
  // Research-backed quality specifications
  prompt += `True-to-life color balance, no oversaturation. High resolution, 4:3 aspect ratio. `
  prompt += `Professional food photography, appetizing, restaurant-quality presentation.`
  
  return prompt
}

// Note: DALL-E 3 doesn't support negative prompts, so we build quality requirements
// directly into the main prompt to avoid common artifacts

/**
 * Generate an AI image for a recipe using OpenAI DALL-E
 * Uses research-backed prompts for professional food photography
 */
export async function generateRecipeImage(params: RecipeImageParams): Promise<string> {
  // Fallback to Unsplash if no OpenAI key
  if (!openai) {
    console.log('⚠️ No OpenAI key found, falling back to Unsplash image')
    return getRecipeImageUrl(params.title, params.cuisineType)
  }

  try {
    console.log('🎨 Generating AI image for recipe:', params.title)
    
    const prompt = buildImagePrompt(params)
    console.log('📝 Image prompt:', prompt)
    
    const response = await openai.images.generate({
      model: 'gpt-image-1', // Superior instruction following & world knowledge
      prompt,
      size: '1024x1024', // Recommended for web recipe cards
      quality: 'medium', // Medium = best balance of speed & fidelity (per docs)
      response_format: 'url', // Direct URL for easy CDN caching
      n: 1,
    })

    const imageUrl = response.data?.[0]?.url
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI')
    }

    console.log('✅ AI image generated successfully with research-backed styling')
    return imageUrl
    
  } catch (error) {
    console.error('❌ AI image generation failed:', error)
    
    // Fallback to Unsplash on any error
    console.log('🔄 Falling back to Unsplash image')
    return getRecipeImageUrl(params.title, params.cuisineType)
  }
}

/**
 * Generate recipe image with caching support (future enhancement)
 * For now, just calls generateRecipeImage directly
 */
export async function getOrGenerateRecipeImage(params: RecipeImageParams): Promise<string> {
  // TODO: Add caching logic here
  // 1. Check if image exists in Supabase storage by recipe title hash
  // 2. If exists, return cached URL
  // 3. If not, generate new image and cache it
  
  return generateRecipeImage(params)
}

/**
 * Utility to extract ingredients from a recipe object for image generation
 */
export function extractIngredientsForImage(recipe: { ingredients?: unknown }): string[] {
  if (!recipe.ingredients) return []
  
  // Handle different ingredient formats
  if (Array.isArray(recipe.ingredients)) {
    return recipe.ingredients.map((ing: unknown) => {
      if (typeof ing === 'string') return ing
      if (typeof ing === 'object' && ing !== null && 'name' in ing) {
        return String((ing as { name: unknown }).name)
      }
      return String(ing)
    }).filter(Boolean)
  }
  
  return []
} 