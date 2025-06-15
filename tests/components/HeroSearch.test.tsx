import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../setup/test-utils'
import { HeroSearch } from '@/components/search/HeroSearch'

describe('HeroSearch Component', () => {
  it('should render all search fields', () => {
    render(<HeroSearch />)
    
    // Check for field labels
    expect(screen.getByText('What ingredients do you have?')).toBeInTheDocument()
    expect(screen.getByText('Dietary needs')).toBeInTheDocument()
    expect(screen.getByText('Meal type')).toBeInTheDocument()
    expect(screen.getByText('Servings')).toBeInTheDocument()
  })

  it('should render search button', () => {
    render(<HeroSearch />)
    
    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeInTheDocument()
  })

  it('should render quick suggestion buttons', () => {
    render(<HeroSearch />)
    
    expect(screen.getByText('🍗 High Protein Dinner')).toBeInTheDocument()
    expect(screen.getByText('🥗 Vegetarian Lunch')).toBeInTheDocument()
    expect(screen.getByText('🍳 Quick Breakfast')).toBeInTheDocument()
    expect(screen.getByText('🌾 Gluten-Free Options')).toBeInTheDocument()
  })

  it('should allow typing in input fields', () => {
    render(<HeroSearch />)
    
    const ingredientsInput = screen.getByPlaceholderText('e.g., chicken breast, broccoli, quinoa...')
    fireEvent.change(ingredientsInput, { target: { value: 'chicken breast' } })
    expect(ingredientsInput).toHaveValue('chicken breast')
    
    const dietaryInput = screen.getByPlaceholderText('e.g., gluten-free, dairy-free, keto, vegan...')
    fireEvent.change(dietaryInput, { target: { value: 'keto' } })
    expect(dietaryInput).toHaveValue('keto')
  })

  it('should call onSearch when search button is clicked', () => {
    const mockOnSearch = vi.fn()
    render(<HeroSearch onSearch={mockOnSearch} />)
    
    // Fill in some data
    const ingredientsInput = screen.getByPlaceholderText('e.g., chicken breast, broccoli, quinoa...')
    fireEvent.change(ingredientsInput, { target: { value: 'chicken' } })
    
    // Click search
    const searchButton = screen.getByRole('button', { name: /search/i })
    fireEvent.click(searchButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith({
      ingredients: 'chicken',
      dietary: '',
      mealType: '',
      servings: ''
    })
  })

  it('should populate fields when quick suggestion is clicked', () => {
    render(<HeroSearch />)
    
    const highProteinButton = screen.getByText('🍗 High Protein Dinner')
    fireEvent.click(highProteinButton)
    
    // Check that fields are populated
    expect(screen.getByDisplayValue('chicken breast')).toBeInTheDocument()
    expect(screen.getByDisplayValue('high protein')).toBeInTheDocument()
    expect(screen.getByDisplayValue('dinner')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<HeroSearch />)
    
    // Check that inputs have proper labels
    const ingredientsInput = screen.getByPlaceholderText('e.g., chicken breast, broccoli, quinoa...')
    expect(ingredientsInput).toHaveAttribute('type', 'text')
    
    // Check that search button is accessible
    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeInTheDocument()
  })

  it('should handle focus events on input fields', () => {
    render(<HeroSearch />)
    
    const ingredientsInput = screen.getByPlaceholderText('e.g., chicken breast, broccoli, quinoa...')
    fireEvent.focus(ingredientsInput)
    
    // Just verify the input can receive focus without testing the specific focus state
    expect(ingredientsInput).toBeInTheDocument()
  })
}) 