import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useSavedRecipesStore } from '@/store/savedRecipesStore'
import SavedRecipesPage from '@/app/saved-recipes/page'

// Mock the saved recipes store
vi.mock('@/store/savedRecipesStore', () => ({
  useSavedRecipesStore: vi.fn()
}))

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  createClientComponentClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null }
      })
    }
  })),
  getSupabaseClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null }
      }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    }
  }))
}))

// Mock RecipeGrid component
vi.mock('@/components/recipe/RecipeGrid', () => ({
  RecipeGrid: ({ recipes, onSaveRecipe, onViewRecipe }: {
    recipes: Array<{ id: string; title: string }>;
    onSaveRecipe?: (recipe: any) => void;
    onViewRecipe?: (recipe: any) => void;
  }) => (
    <div data-testid="recipe-grid">
      {recipes.map((recipe) => (
        <div key={recipe.id} data-testid={`recipe-${recipe.id}`}>
          <h3>{recipe.title}</h3>
          <button onClick={() => onSaveRecipe?.(recipe)} data-testid={`save-${recipe.id}`}>
            Save
          </button>
          <button onClick={() => onViewRecipe?.(recipe)} data-testid={`view-${recipe.id}`}>
            View
          </button>
        </div>
      ))}
    </div>
  )
}))

describe('SavedRecipesPage', () => {
  const mockSavedRecipes = [
    {
      id: 'recipe-1',
      title: 'Saved Chicken Soup',
      image: 'https://example.com/soup.jpg',
      prepTime: 30,
      difficulty: 'easy',
      servings: 4,
      dietaryCompliance: ['low-fiber', 'uc-safe'],
      safetyValidated: true,
      calories: 280,
      rating: 4.5
    },
    {
      id: 'recipe-2',
      title: 'Saved Vegan Cookies',
      image: 'https://example.com/cookies.jpg',
      prepTime: 25,
      difficulty: 'medium',
      servings: 12,
      dietaryCompliance: ['vegan', 'dairy-free'],
      safetyValidated: true,
      calories: 160,
      rating: 4.2
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loading state while fetching saved recipes', () => {
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: [],
        loading: true,
        loadSaved: vi.fn(),
        toggleSave: vi.fn(),
        handleUserAuthentication: vi.fn()
      })

      render(<SavedRecipesPage />)

      expect(screen.getByText('Loading your cookbook...')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no recipes are saved', async () => {
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: [],
        loading: false,
        loadSaved: vi.fn(),
        toggleSave: vi.fn(),
        handleUserAuthentication: vi.fn().mockResolvedValue(undefined)
      })

      render(<SavedRecipesPage />)
      
      // Wait for the component to finish loading
      await waitFor(() => {
        expect(screen.queryByText('Loading your cookbook...')).not.toBeInTheDocument()
      })

      expect(screen.getByText(/You haven't saved any recipes yet/)).toBeInTheDocument()
      expect(screen.getByText(/Start exploring and save your favorites/)).toBeInTheDocument()
    })
  })

  describe('Saved Recipes Display', () => {
    it('should display saved recipes when available', async () => {
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: mockSavedRecipes,
        loading: false,
        loadSaved: vi.fn(),
        toggleSave: vi.fn(),
        handleUserAuthentication: vi.fn().mockResolvedValue(undefined)
      })

      render(<SavedRecipesPage />)
      
      // Wait for the component to finish loading
      await waitFor(() => {
        expect(screen.queryByText('Loading your cookbook...')).not.toBeInTheDocument()
      })

      expect(screen.getByText('💾 My Saved Recipes')).toBeInTheDocument()
      expect(screen.getByTestId('recipe-grid')).toBeInTheDocument()
      expect(screen.getByText('Saved Chicken Soup')).toBeInTheDocument()
      expect(screen.getByText('Saved Vegan Cookies')).toBeInTheDocument()
    })

    it('should show recipe grid when recipes exist', async () => {
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: [mockSavedRecipes[0]], // Only one recipe
        loading: false,
        loadSaved: vi.fn(),
        toggleSave: vi.fn(),
        handleUserAuthentication: vi.fn().mockResolvedValue(undefined)
      })

      render(<SavedRecipesPage />)
      
      // Wait for the component to finish loading
      await waitFor(() => {
        expect(screen.queryByText('Loading your cookbook...')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('recipe-grid')).toBeInTheDocument()
      expect(screen.getByText('Saved Chicken Soup')).toBeInTheDocument()
    })
  })

  describe('User Authentication', () => {
    it('should load saved recipes for authenticated user', async () => {
      const mockHandleUserAuth = vi.fn().mockResolvedValue(undefined)
      
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: [],
        loading: false,
        loadSaved: vi.fn(),
        toggleSave: vi.fn(),
        handleUserAuthentication: mockHandleUserAuth
      })

      // Mock authenticated user
      const { getSupabaseClient } = await import('@/lib/supabase')
      vi.mocked(getSupabaseClient).mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } }
          })
        }
      } as any)

      render(<SavedRecipesPage />)

      await waitFor(() => {
        expect(mockHandleUserAuth).toHaveBeenCalledWith('user-123')
      })
    })

    it('should handle unauthenticated user', async () => {
      const mockHandleUserAuth = vi.fn().mockResolvedValue(undefined)
      
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: [],
        loading: false,
        loadSaved: vi.fn(),
        toggleSave: vi.fn(),
        handleUserAuthentication: mockHandleUserAuth
      })

      // Mock unauthenticated user (null user)
      const { getSupabaseClient } = await import('@/lib/supabase')
      vi.mocked(getSupabaseClient).mockReturnValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null }
          })
        }
      } as any)

      render(<SavedRecipesPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading your cookbook...')).not.toBeInTheDocument()
      })
      
      // For unauthenticated users, handleUserAuthentication should not be called
      expect(mockHandleUserAuth).not.toHaveBeenCalled()
    })
  })

  describe('Recipe Interactions', () => {
    it('should render recipe grid with save functionality', async () => {
      const mockToggleSave = vi.fn()
      
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: mockSavedRecipes,
        loading: false,
        loadSaved: vi.fn(),
        toggleSave: mockToggleSave,
        handleUserAuthentication: vi.fn().mockResolvedValue(undefined)
      })

      render(<SavedRecipesPage />)
      
      // Wait for the component to finish loading
      await waitFor(() => {
        expect(screen.queryByText('Loading your cookbook...')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('recipe-grid')).toBeInTheDocument()
      expect(screen.getByTestId('save-recipe-1')).toBeInTheDocument()
      expect(screen.getByTestId('view-recipe-1')).toBeInTheDocument()
    })

    it('should render recipe viewing buttons', async () => {
      const mockToggleSave = vi.fn()
      
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: mockSavedRecipes,
        loading: false,
        loadSaved: vi.fn(),
        toggleSave: mockToggleSave,
        handleUserAuthentication: vi.fn().mockResolvedValue(undefined)
      })

      render(<SavedRecipesPage />)
      
      // Wait for the component to finish loading
      await waitFor(() => {
        expect(screen.queryByText('Loading your cookbook...')).not.toBeInTheDocument()
      })

      const viewButton = screen.getByTestId('view-recipe-1')
      expect(viewButton).toBeInTheDocument()
      expect(viewButton).toHaveTextContent('View')
    })
  })

  describe('Page Structure', () => {
    it('should have proper page structure and headings', async () => {
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: mockSavedRecipes,
        loading: false,
        loadSaved: vi.fn(),
        toggleSave: vi.fn(),
        handleUserAuthentication: vi.fn().mockResolvedValue(undefined)
      })

      render(<SavedRecipesPage />)
      
      // Wait for the component to finish loading
      await waitFor(() => {
        expect(screen.queryByText('Loading your cookbook...')).not.toBeInTheDocument()
      })

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByText('💾 My Saved Recipes')).toBeInTheDocument()
    })

    it('should be accessible with proper headings', async () => {
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: mockSavedRecipes,
        loading: false,
        loadSaved: vi.fn(),
        toggleSave: vi.fn(),
        handleUserAuthentication: vi.fn().mockResolvedValue(undefined)
      })

      render(<SavedRecipesPage />)
      
      // Wait for the component to finish loading
      await waitFor(() => {
        expect(screen.queryByText('Loading your cookbook...')).not.toBeInTheDocument()
      })
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('💾 My Saved Recipes')
    })
  })

  describe('Error Handling', () => {
    it('should handle store errors gracefully', () => {
      vi.mocked(useSavedRecipesStore).mockReturnValue({
        saved: [],
        loading: false,
        loadSaved: vi.fn(),
        toggleSave: vi.fn(),
        handleUserAuthentication: vi.fn().mockResolvedValue(undefined)
      })

      // Should not throw error even with minimal store state
      expect(() => render(<SavedRecipesPage />)).not.toThrow()
    })
  })
}) 