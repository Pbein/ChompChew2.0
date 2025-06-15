import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '../setup/test-utils'
import { Header } from '@/components/layout/Header'

describe('Header Component', () => {
  it('should render the ChompChew logo', () => {
    render(<Header />)
    
    expect(screen.getByText('ChompChew')).toBeInTheDocument()
    expect(screen.getByText('🍴')).toBeInTheDocument()
  })

  it('should render core navigation links', () => {
    render(<Header />)
    
    // Check for mission-aligned navigation
    expect(screen.getByText('Dietary Needs')).toBeInTheDocument()
    expect(screen.getByText('Saved Recipes')).toBeInTheDocument()
    expect(screen.getByText('Generate Recipe')).toBeInTheDocument()
  })

    it('should render user action buttons', async () => {
    render(<Header />)

    // Wait for loading to complete and buttons to appear
    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('should have mobile menu toggle button', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    expect(mobileMenuButton).toBeInTheDocument()
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('should have mobile menu functionality', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('should have proper navigation structure for accessibility', () => {
    render(<Header />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    // Check that navigation links are properly structured
    const dietaryNeedsLink = screen.getByRole('link', { name: /dietary needs/i })
    expect(dietaryNeedsLink).toHaveAttribute('href', '/dietary-needs')
    
    const savedRecipesLink = screen.getByRole('link', { name: /saved recipes/i })
    expect(savedRecipesLink).toHaveAttribute('href', '/saved-recipes')
    
    const generateRecipeLink = screen.getByRole('link', { name: /generate recipe/i })
    expect(generateRecipeLink).toHaveAttribute('href', '/generate-recipe')
  })
}) 