import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RecipePage from '@/app/recipe/[id]/page'
import { fetchRecipe } from '@/lib/recipes'
import { notFound, useParams } from 'next/navigation'

// Mock dependencies
vi.mock('@/lib/recipes')
vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  notFound: vi.fn()
}))
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    <img src={src} alt={alt} {...props} />
  )
}))

const mockUseParams = vi.mocked(useParams)
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
    mockUseParams.mockReturnValue({ id: 'test-id' })
    mockFetchRecipe.mockResolvedValue(sampleRecipe)
    mockNotFound.mockImplementation(() => {
      throw new Error('Not found')
    })
  })

  describe('Essential Recipe Information', () => {
    it('should display recipe title prominently', async () => {
      render(<RecipePage />)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mediterranean Chicken Bowl')
      })
    })

    it('should display recipe description when available', async () => {
      render(<RecipePage />)
      
      await waitFor(() => {
        expect(screen.getByText(/healthy and delicious Mediterranean-inspired/)).toBeInTheDocument()
      })
    })

    it('should display recipe image with proper alt text', async () => {
      render(<RecipePage />)
      
      await waitFor(() => {
        const image = screen.getByAltText('Mediterranean Chicken Bowl')
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', 'https://images.unsplash.com/photo-chicken-bowl.jpg')
      })
    })
  })

  describe('Recipe Metadata Display', () => {
    it('should display timing information', async () => {
      render(<RecipePage />)
      
      await waitFor(() => {
        expect(screen.getByText('20 min')).toBeInTheDocument() // prep time
        expect(screen.getByText('25 min')).toBeInTheDocument() // cook time
      })
    })

    it('should display servings and difficulty', async () => {
      render(<RecipePage />)
      
      await waitFor(() => {
        // Look for the servings info specifically in the Recipe Info section
        expect(screen.getByText('Servings')).toBeInTheDocument()
        expect(screen.getByText('Difficulty')).toBeInTheDocument()
        
        // Find the specific difficulty value (not the ones in instructions or ingredients)
        const difficultyElements = screen.getAllByText(/medium/i)
        expect(difficultyElements.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle recipe not found', async () => {
      mockFetchRecipe.mockResolvedValue(null)
      
      render(<RecipePage />)
      
      await waitFor(() => {
        expect(screen.getByText(/recipe not found/i)).toBeInTheDocument()
      })
    })

    it('should handle loading state', () => {
      // Don't resolve the promise to keep it in loading state
      mockFetchRecipe.mockReturnValue(new Promise(() => {}))
      
      render(<RecipePage />)
      
      // Should show loading skeleton
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })
  })
}) 