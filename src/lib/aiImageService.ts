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
 * Generate an AI image for a recipe using OpenAI gpt-image-1 via Responses API
 * Uses research-backed prompts for professional food photography
 */
export async function generateRecipeImage(params: RecipeImageParams): Promise<string> {
  console.log('🚀 [AI-IMAGE] ===== STARTING AI IMAGE GENERATION =====')
  console.log('🍳 [AI-IMAGE] Recipe params:', {
    title: params.title,
    ingredientCount: params.ingredients?.length || 0,
    cuisineType: params.cuisineType,
    hasDescription: !!params.description
  })

  // Fallback to Unsplash if no OpenAI key
  if (!openai) {
    console.log('⚠️ [AI-IMAGE] No OpenAI key found, falling back to Unsplash image')
    console.log('🔄 [AI-IMAGE] Using fallback image service...')
    const fallbackUrl = getRecipeImageUrl(params.title, params.cuisineType)
    console.log('📸 [AI-IMAGE] Fallback image URL:', fallbackUrl)
    return fallbackUrl
  }

  console.log('✅ [AI-IMAGE] OpenAI client available, proceeding with AI generation')

  try {
    console.log('🎨 [AI-IMAGE] Building image prompt for recipe:', params.title)
    
    const prompt = buildImagePrompt(params)
    console.log('📝 [AI-IMAGE] Generated prompt length:', prompt.length)
    console.log('📝 [AI-IMAGE] Full prompt:', prompt)
    
    console.log('🔧 [AI-IMAGE] Configuring Responses API call...')
    const apiConfig = {
      model: 'gpt-4.1-mini', // Model that supports image generation tools
      input: prompt,
      tools: [{
        type: 'image_generation' as const,
        size: '1024x1024' as const, // Recommended for web recipe cards
        quality: 'medium' as const, // Medium = best balance of speed & fidelity
        output_format: 'png' as const, // High quality format
      }],
    }
    console.log('⚙️ [AI-IMAGE] API configuration:', apiConfig)
    
    console.log('🌐 [AI-IMAGE] Calling OpenAI Responses API...')
    const startTime = Date.now()
    
    // Use the new Responses API with gpt-image-1 model
    const response = await openai.responses.create(apiConfig)
    
    const duration = Date.now() - startTime
    console.log('⏱️ [AI-IMAGE] API call completed in:', duration + 'ms')
    
    console.log('📨 [AI-IMAGE] Response received:', {
      id: response.id,
      outputCount: response.output?.length || 0,
      outputTypes: response.output?.map(o => o.type) || [],
      hasOutput: !!response.output
    })

    if (!response.output || response.output.length === 0) {
      throw new Error('No output received from OpenAI Responses API')
    }

    console.log('🔍 [AI-IMAGE] Analyzing response output...')
    response.output.forEach((output, index) => {
      console.log(`📋 [AI-IMAGE] Output ${index}:`, {
        type: output.type,
        hasResult: 'result' in output && !!output.result,
        status: 'status' in output ? output.status : 'N/A'
      })
    })

    // Extract image data from the response
    const imageGenerationCalls = response.output?.filter(
      (output) => output.type === 'image_generation_call'
    )
    
    console.log('🖼️ [AI-IMAGE] Found image generation calls:', imageGenerationCalls?.length || 0)
    
    if (!imageGenerationCalls || imageGenerationCalls.length === 0) {
      console.error('❌ [AI-IMAGE] No image generation calls found in response')
      console.error('🔍 [AI-IMAGE] Available output types:', response.output?.map(o => o.type))
      throw new Error('No image generation calls found in response')
    }

    const imageCall = imageGenerationCalls[0]
    console.log('🎯 [AI-IMAGE] Processing first image generation call:', {
      type: imageCall.type,
      status: imageCall.status,
      hasResult: !!imageCall.result,
      resultLength: imageCall.result?.length || 0
    })

    if (imageCall.status !== 'completed') {
      console.error('❌ [AI-IMAGE] Image generation not completed, status:', imageCall.status)
      throw new Error(`Image generation failed with status: ${imageCall.status}`)
    }

    if (!imageCall.result) {
      console.error('❌ [AI-IMAGE] No result data in completed image generation call')
      throw new Error('No image data returned from completed generation')
    }

    console.log('🔧 [AI-IMAGE] Converting base64 to data URL...')
    // Convert base64 image data to data URL for immediate use
    const imageDataUrl = `data:image/png;base64,${imageCall.result}`
    
    console.log('✅ [AI-IMAGE] AI image generated successfully with gpt-image-1 model!')
    console.log('📊 [AI-IMAGE] Image statistics:', {
      base64Length: imageCall.result.length,
      dataUrlLength: imageDataUrl.length,
      estimatedSizeKB: Math.round(imageCall.result.length * 0.75 / 1024), // Base64 is ~75% efficient
      format: 'PNG',
      dimensions: '1024x1024'
    })
    console.log('🏁 [AI-IMAGE] ===== AI IMAGE GENERATION COMPLETED =====')
    
    return imageDataUrl
    
  } catch (error) {
    console.error('💥 [AI-IMAGE] ===== AI IMAGE GENERATION FAILED =====')
    console.error('❌ [AI-IMAGE] Error type:', error instanceof Error ? error.constructor.name : 'Unknown')
    console.error('❌ [AI-IMAGE] Error message:', error instanceof Error ? error.message : String(error))
    console.error('❌ [AI-IMAGE] Full error details:', error)
    
    // Log additional context for debugging
    if (error && typeof error === 'object' && 'response' in error) {
      const errorWithResponse = error as { response?: { status?: unknown; data?: unknown } }
      console.error('🌐 [AI-IMAGE] HTTP Response Status:', errorWithResponse.response?.status)
      console.error('🌐 [AI-IMAGE] HTTP Response Data:', errorWithResponse.response?.data)
    }
    
    if (error && typeof error === 'object' && 'code' in error) {
      const errorWithCode = error as { code?: unknown }
      console.error('🔢 [AI-IMAGE] Error Code:', errorWithCode.code)
    }
    
    // Fallback to Unsplash on any error
    console.log('🔄 [AI-IMAGE] Initiating fallback to Unsplash image...')
    try {
      const fallbackUrl = getRecipeImageUrl(params.title, params.cuisineType)
      console.log('📸 [AI-IMAGE] Fallback image URL generated:', fallbackUrl)
      console.log('✅ [AI-IMAGE] Fallback completed successfully')
      return fallbackUrl
    } catch (fallbackError) {
      console.error('💥 [AI-IMAGE] Fallback also failed:', fallbackError)
      // Return a default image URL as last resort
      const defaultUrl = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80'
      console.log('🆘 [AI-IMAGE] Using default image URL:', defaultUrl)
      return defaultUrl
    }
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