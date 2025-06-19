/**
 * @jest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateRecipeAction } from './actions'
import { RecipeGenerationService, GeneratedRecipe } from '@/features/core/services/recipeGenerationService'
import { canGenerateRecipes } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- Module-Level Mocks ---

const mockGetUser = vi.fn()
const mockInsert = vi.fn().mockReturnThis()
const mockSelect = vi.fn().mockReturnThis()
const mockEq = vi.fn().mockReturnThis()
const mockSingle = vi.fn()

vi.mock('@/lib/supabase-server', () => ({
  createServerComponentClient: () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      insert: mockInsert,
      select: mockSelect.mockReturnValue({
        eq: mockEq.mockReturnValue({
          single: mockSingle,
        }),
        single: mockSingle,
      }),
    }),
  }),
}))

vi.mock('@/features/core/services/recipeGenerationService')
vi.mock('@/lib/auth-utils')
vi.mock('next/cache')
vi.mock('next/navigation')

describe('generateRecipeAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'test-user-id', email: 'test@example.com' } } })
    vi.mocked(canGenerateRecipes).mockResolvedValue(true)
    mockSingle.mockResolvedValue({ data: { role: 'free' } })
  })

  it('should call generateRecipe, save to DB, and redirect on success', async () => {
    const mockGeneratedRecipe: GeneratedRecipe = { 
      title: 'AI Recipe', 
      imageUrl: 'http://a.com/img.png',
      description: 'A test recipe',
      ingredients: [],
      instructions: [],
      metadata: {
        prepTime: 10,
        cookTime: 20,
        totalTime: 30,
        servings: 2,
        difficulty: 'easy',
      },
    }
    const mockDbRecipe = { id: 'new-recipe-123', image_url: 'http://a.com/img.png' }
    vi.mocked(RecipeGenerationService.generateRecipe).mockResolvedValue(mockGeneratedRecipe)
    mockSingle.mockResolvedValue({ data: mockDbRecipe })

    const formData = new FormData()
    formData.append('prompt', 'test prompt')
    formData.append('dietaryPreferences', '["vegan"]')
    formData.append('allergens', '["nuts"]')

    await generateRecipeAction(formData)

    expect(RecipeGenerationService.generateRecipe).toHaveBeenCalledWith(expect.objectContaining({
      ingredients: ['test prompt'],
      dietaryRestrictions: ['vegan'],
      allergies: ['nuts'],
    }))
    
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      title: 'AI Recipe',
      created_by: 'test-user-id'
    }))
    expect(revalidatePath).toHaveBeenCalledWith('/saved-recipes')
    expect(redirect).toHaveBeenCalledWith(`/recipe/${mockDbRecipe.id}`)
  })

  it('should throw an error if user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    await expect(generateRecipeAction(new FormData())).rejects.toThrow('You must be logged in to generate recipes.')
  })

  it('should throw an error if user is not authorized', async () => {
    vi.mocked(canGenerateRecipes).mockReturnValue(false)
    const formData = new FormData()
    formData.append('prompt', 'test prompt')
    await expect(generateRecipeAction(formData)).rejects.toThrow('You do not have permission to generate recipes.')
  })
  
  it('should throw an error if recipe generation service fails', async () => {
    vi.mocked(RecipeGenerationService.generateRecipe).mockRejectedValue(new Error('AI failed'))
    const formData = new FormData()
    formData.append('prompt', 'test prompt')
    await expect(generateRecipeAction(formData)).rejects.toThrow('AI failed')
  })

  it('should throw an error if database insert fails', async () => {
    const mockGeneratedRecipe: GeneratedRecipe = { 
      title: 'AI Recipe', 
      imageUrl: 'http://a.com/img.png',
      description: 'A test recipe',
      ingredients: [],
      instructions: [],
      metadata: {
        prepTime: 10,
        cookTime: 20,
        totalTime: 30,
        servings: 2,
        difficulty: 'easy',
        cuisineType: 'Italian',
      },
    }
    vi.mocked(RecipeGenerationService.generateRecipe).mockResolvedValue(mockGeneratedRecipe)
    mockSingle.mockResolvedValue({ error: new Error('DB Error') })
    const formData = new FormData()
    formData.append('prompt', 'test prompt')
    await expect(generateRecipeAction(formData)).rejects.toThrow('DB Error')
  })
}) 