import { describe, it, expect } from 'vitest'
import { render, screen } from '../setup/test-utils'
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
    expect(screen.getByText('Find Recipes')).toBeInTheDocument()
    expect(screen.getByText('My Dietary Needs')).toBeInTheDocument()
    expect(screen.getByText('Saved Recipes')).toBeInTheDocument()
  })

  it('should render user action buttons', () => {
    render(<Header />)
    
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('should have safety quick access button', () => {
    render(<Header />)
    
    const safetyButton = screen.getByTitle('Quick Safety Check')
    expect(safetyButton).toBeInTheDocument()
    expect(safetyButton).toHaveTextContent('⚠️')
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
    const findRecipesLink = screen.getByRole('link', { name: /find recipes/i })
    expect(findRecipesLink).toHaveAttribute('href', '/search')
    
    const dietaryNeedsLink = screen.getByRole('link', { name: /my dietary needs/i })
    expect(dietaryNeedsLink).toHaveAttribute('href', '/dietary-needs')
    
    const savedRecipesLink = screen.getByRole('link', { name: /saved recipes/i })
    expect(savedRecipesLink).toHaveAttribute('href', '/saved-recipes')
  })
}) 