import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RecipePage from '@/app/recipe/[id]/page'
import { fetchRecipe } from '@/lib/recipes'
import { notFound } from 'next/navigation'

// Mock dependencies
vi.mock('@/lib/recipes')
vi.mock('next/navigation')
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => (
    <img src={src} alt={alt} {...props} />
  )
}))

const mockFetchRecipe = vi.mocked(fetchRecipe)
const mockNotFound = vi.mocked(notFound)

// Sample recipe data that matches the database structure
const sampleRecipe = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  title: 'Mediterranean Chicken Bowl',
  description: 'A healthy and delicious Mediterranean-inspired chicken bowl with fresh vegetables and herbs.',
  image_url: 'https://images.unsplash.com/photo-chicken-bowl.jpg',
  prep_time: 20,
  cook_time: 25,
  servings: 4,
  difficulty: 'medium' as const,
  dietary_tags: ['gluten-free', 'high-protein', 'mediterranean'],
  nutrition_info: {
    calories: 450,
    protein: 35,
    carbs: 25,
    fat: 18,
    fiber: 8,
    sodium: 680
  },
  ingredients: [
    { name: 'chicken breast', amount: '1.5 lbs' },
    { name: 'olive oil', amount: '3 tbsp' },
    { name: 'lemon juice', amount: '2 tbsp' },
    { name: 'garlic cloves', amount: '3' },
    { name: 'cherry tomatoes', amount: '1 cup' },
    { name: 'cucumber', amount: '1 large' },
    { name: 'red onion', amount: '1/2 medium' },
    { name: 'feta cheese', amount: '1/2 cup' },
    { name: 'fresh parsley', amount: '1/4 cup' }
  ],
  instructions: [
    { step: 1, text: 'Marinate chicken breast in olive oil, lemon juice, and minced garlic for 30 minutes.' },
    { step: 2, text: 'Preheat grill or grill pan to medium-high heat.' },
    { step: 3, text: 'Season chicken with salt and pepper, then grill for 6-7 minutes per side until cooked through.' },
    { step: 4, text: 'While chicken cooks, dice cucumber and red onion, halve cherry tomatoes.' },
    { step: 5, text: 'Let chicken rest for 5 minutes, then slice into strips.' },
    { step: 6, text: 'Arrange chicken and vegetables in bowls, top with feta cheese and fresh parsley.' }
  ],
  calories_per_serving: 450,
  rating_average: 4.7,
  safety_validated: true,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z'
}

describe('Recipe Detail Page - Information Display', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNotFound.mockImplementation(() => {
      throw new Error('Not found')
    })
  })

  describe('Essential Recipe Information', () => {
    it('should display recipe title prominently', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mediterranean Chicken Bowl')
    })

    it('should display recipe description when available', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText(/healthy and delicious Mediterranean-inspired/)).toBeInTheDocument()
    })

    it('should display recipe image with proper alt text', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      const image = screen.getByAltText('Mediterranean Chicken Bowl')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://images.unsplash.com/photo-chicken-bowl.jpg')
    })

    it('should handle missing recipe image gracefully', async () => {
      const recipeWithoutImage = { ...sampleRecipe, image_url: undefined }
      mockFetchRecipe.mockResolvedValue(recipeWithoutImage)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      // Should not display image when not available
      expect(screen.queryByAltText('Mediterranean Chicken Bowl')).not.toBeInTheDocument()
    })

    it('should handle missing description gracefully', async () => {
      const recipeWithoutDescription = { ...sampleRecipe, description: undefined }
      mockFetchRecipe.mockResolvedValue(recipeWithoutDescription)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      // Title should still be displayed
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })
  })

  describe('Recipe Metadata Display', () => {
    it('should display prep time', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText('Prep Time')).toBeInTheDocument()
      expect(screen.getByText('20 min')).toBeInTheDocument()
    })

    it('should display cook time when available', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText('Cook Time')).toBeInTheDocument()
      expect(screen.getByText('25 min')).toBeInTheDocument()
    })

    it('should display servings information', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText('Servings')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
    })

    it('should display difficulty level', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText('Difficulty')).toBeInTheDocument()
      expect(screen.getByText('medium')).toBeInTheDocument()
    })

    it('should handle missing cook time gracefully', async () => {
      const recipeWithoutCookTime = { ...sampleRecipe, cook_time: null }
      mockFetchRecipe.mockResolvedValue(recipeWithoutCookTime)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      // Should still show other timing info
      expect(screen.getByText('Prep Time')).toBeInTheDocument()
      expect(screen.queryByText('Cook Time')).not.toBeInTheDocument()
    })

    it('should provide fallback values for missing metadata', async () => {
      const recipeWithMissingData = {
        ...sampleRecipe,
        prep_time: null,
        servings: null,
        difficulty: null
      }
      mockFetchRecipe.mockResolvedValue(recipeWithMissingData)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      // Should show fallback values
      expect(screen.getByText('0 min')).toBeInTheDocument() // prep_time fallback
      expect(screen.getByText('1')).toBeInTheDocument() // servings fallback
      expect(screen.getByText('Easy')).toBeInTheDocument() // difficulty fallback
    })
  })

  describe('Dietary Information Display', () => {
    it('should display dietary tags when available', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText('Dietary Information')).toBeInTheDocument()
      expect(screen.getByText('gluten-free')).toBeInTheDocument()
      expect(screen.getByText('high-protein')).toBeInTheDocument()
      expect(screen.getByText('mediterranean')).toBeInTheDocument()
    })

    it('should not display dietary section when no tags available', async () => {
      const recipeWithoutTags = { ...sampleRecipe, dietary_tags: [] }
      mockFetchRecipe.mockResolvedValue(recipeWithoutTags)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.queryByText('Dietary Information')).not.toBeInTheDocument()
    })

    it('should handle null dietary tags gracefully', async () => {
      const recipeWithNullTags = { ...sampleRecipe, dietary_tags: null }
      mockFetchRecipe.mockResolvedValue(recipeWithNullTags)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.queryByText('Dietary Information')).not.toBeInTheDocument()
    })
  })

  describe('Nutrition Information Display', () => {
    it('should display nutrition information when available', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText('Nutrition (per serving)')).toBeInTheDocument()
      expect(screen.getByText('calories')).toBeInTheDocument()
      expect(screen.getByText('450g')).toBeInTheDocument()
      expect(screen.getByText('protein')).toBeInTheDocument()
      expect(screen.getByText('35g')).toBeInTheDocument()
    })

    it('should display all nutrition fields present in data', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      // Check for all nutrition fields
      expect(screen.getByText('carbs')).toBeInTheDocument()
      expect(screen.getByText('25g')).toBeInTheDocument()
      expect(screen.getByText('fat')).toBeInTheDocument()
      expect(screen.getByText('18g')).toBeInTheDocument()
      expect(screen.getByText('fiber')).toBeInTheDocument()
      expect(screen.getByText('8g')).toBeInTheDocument()
      expect(screen.getByText('sodium')).toBeInTheDocument()
      expect(screen.getByText('680g')).toBeInTheDocument()
    })

    it('should not display nutrition section when no data available', async () => {
      const recipeWithoutNutrition = { ...sampleRecipe, nutrition_info: null }
      mockFetchRecipe.mockResolvedValue(recipeWithoutNutrition)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.queryByText('Nutrition (per serving)')).not.toBeInTheDocument()
    })
  })

  describe('Ingredients Display', () => {
    it('should display all ingredients with amounts', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText('Ingredients')).toBeInTheDocument()
      
      // Check for specific ingredients
      expect(screen.getByText('1.5 lbs')).toBeInTheDocument()
      expect(screen.getByText('chicken breast')).toBeInTheDocument()
      expect(screen.getByText('3 tbsp')).toBeInTheDocument()
      expect(screen.getByText('olive oil')).toBeInTheDocument()
      expect(screen.getByText('1/2 cup')).toBeInTheDocument()
      expect(screen.getByText('feta cheese')).toBeInTheDocument()
    })

    it('should display ingredients in a list format', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      // Should be in a list structure
      const ingredientsList = screen.getByText('Ingredients').closest('section')
      expect(ingredientsList?.querySelector('ul')).toBeInTheDocument()
    })

    it('should handle missing ingredients gracefully', async () => {
      const recipeWithoutIngredients = { ...sampleRecipe, ingredients: null }
      mockFetchRecipe.mockResolvedValue(recipeWithoutIngredients)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.queryByText('Ingredients')).not.toBeInTheDocument()
    })

    it('should handle empty ingredients array', async () => {
      const recipeWithEmptyIngredients = { ...sampleRecipe, ingredients: [] }
      mockFetchRecipe.mockResolvedValue(recipeWithEmptyIngredients)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.queryByText('Ingredients')).not.toBeInTheDocument()
    })
  })

  describe('Instructions Display', () => {
    it('should display all cooking instructions in order', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText('Instructions')).toBeInTheDocument()
      
      // Check for specific instructions
      expect(screen.getByText(/Marinate chicken breast in olive oil/)).toBeInTheDocument()
      expect(screen.getByText(/Preheat grill or grill pan/)).toBeInTheDocument()
      expect(screen.getByText(/Season chicken with salt and pepper/)).toBeInTheDocument()
      expect(screen.getByText(/Arrange chicken and vegetables in bowls/)).toBeInTheDocument()
    })

    it('should display instructions in numbered list format', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      // Should be in an ordered list
      const instructionsSection = screen.getByText('Instructions').closest('section')
      expect(instructionsSection?.querySelector('ol')).toBeInTheDocument()
    })

    it('should handle missing instructions gracefully', async () => {
      const recipeWithoutInstructions = { ...sampleRecipe, instructions: null }
      mockFetchRecipe.mockResolvedValue(recipeWithoutInstructions)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.queryByText('Instructions')).not.toBeInTheDocument()
    })

    it('should handle empty instructions array', async () => {
      const recipeWithEmptyInstructions = { ...sampleRecipe, instructions: [] }
      mockFetchRecipe.mockResolvedValue(recipeWithEmptyInstructions)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.queryByText('Instructions')).not.toBeInTheDocument()
    })
  })

  describe('Additional Information Display', () => {
    it('should display calories per serving when available', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText('Calories per serving:')).toBeInTheDocument()
      expect(screen.getByText('450')).toBeInTheDocument()
    })

    it('should display rating when available', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText('Rating:')).toBeInTheDocument()
      expect(screen.getByText('4.7/5 ⭐')).toBeInTheDocument()
    })

    it('should display safety validation status', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      expect(screen.getByText(/Safety validated/)).toBeInTheDocument()
      expect(screen.getByText(/reviewed for common allergens/)).toBeInTheDocument()
    })

    it('should handle missing additional information gracefully', async () => {
      const recipeWithMissingInfo = {
        ...sampleRecipe,
        calories_per_serving: null,
        rating_average: null,
        safety_validated: false
      }
      mockFetchRecipe.mockResolvedValue(recipeWithMissingInfo)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      // Should not display missing information
      expect(screen.queryByText('Calories per serving:')).not.toBeInTheDocument()
      expect(screen.queryByText('Rating:')).not.toBeInTheDocument()
      expect(screen.queryByText(/Safety validated/)).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should call notFound when recipe does not exist', async () => {
      mockFetchRecipe.mockResolvedValue(null)
      
      try {
        await RecipePage({ params: Promise.resolve({ id: 'nonexistent-id' }) })
      } catch (error) {
        // Expected to throw
      }
      
      expect(mockNotFound).toHaveBeenCalled()
    })

    it('should handle recipe fetch errors gracefully', async () => {
      mockFetchRecipe.mockRejectedValue(new Error('Database error'))
      
      try {
        await RecipePage({ params: Promise.resolve({ id: 'error-id' }) })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('Accessibility and User Experience', () => {
    it('should have proper heading hierarchy', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      // Main title should be h1
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      
      // Section headings should be h2
      const sectionHeadings = screen.getAllByRole('heading', { level: 2 })
      expect(sectionHeadings.length).toBeGreaterThan(0)
    })

    it('should have proper semantic structure for ingredients and instructions', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      // Ingredients should be in unordered list
      const ingredientsSection = screen.getByText('Ingredients').closest('section')
      expect(ingredientsSection?.querySelector('ul')).toBeInTheDocument()
      
      // Instructions should be in ordered list
      const instructionsSection = screen.getByText('Instructions').closest('section')
      expect(instructionsSection?.querySelector('ol')).toBeInTheDocument()
    })

    it('should provide meaningful alt text for images', async () => {
      mockFetchRecipe.mockResolvedValue(sampleRecipe)
      
      render(await RecipePage({ params: Promise.resolve({ id: 'test-id' }) }))
      
      const image = screen.getByAltText('Mediterranean Chicken Bowl')
      expect(image).toBeInTheDocument()
    })
  })
}) 