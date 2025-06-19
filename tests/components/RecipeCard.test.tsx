import { render, screen, fireEvent } from '../setup/test-utils'
import { RecipeCard, RecipeCardData } from '@/components/recipe/RecipeCard'
import { vi } from 'vitest'

const mockRecipe: RecipeCardData = {
  id: '1',
  title: 'Mediterranean Quinoa Bowl',
  image: 'https://example.com/image.jpg',
  prepTime: 25,
  difficulty: 'easy',
  servings: 2,
  dietaryCompliance: ['Vegetarian', 'Gluten-Free', 'High Protein'],
  safetyValidated: true,
  calories: 420,
  rating: 4.8
}

describe('RecipeCard Component', () => {
  test('renders recipe information correctly', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    expect(screen.getByText('Mediterranean Quinoa Bowl')).toBeInTheDocument()
    expect(screen.getByText('25m')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('easy')).toBeInTheDocument()
    expect(screen.getByText('420 cal')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
  })

  test('displays safety badge when recipe is validated', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    expect(screen.getByText('✓ SAFE')).toBeInTheDocument()
  })

  test('shows dietary compliance tags', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    expect(screen.getByText('Vegetarian')).toBeInTheDocument()
    expect(screen.getByText('Gluten-Free')).toBeInTheDocument()
    expect(screen.getByText('High Protein')).toBeInTheDocument()
  })

  test('calls onViewDetails when card is clicked', () => {
    const mockOnViewDetails = vi.fn()
    render(<RecipeCard recipe={mockRecipe} onViewDetails={mockOnViewDetails} />)
    
    fireEvent.click(screen.getByText('Mediterranean Quinoa Bowl'))
    
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockRecipe)
  })

  test('calls onSave when save button is clicked', () => {
    const mockOnSave = vi.fn()
    render(<RecipeCard recipe={mockRecipe} onSave={mockOnSave} />)
    
    const saveButton = screen.getByLabelText('Save recipe')
    fireEvent.click(saveButton)
    
    expect(mockOnSave).toHaveBeenCalledWith(mockRecipe)
  })

  test('prevents event propagation when save button is clicked', () => {
    const mockOnViewDetails = vi.fn()
    const mockOnSave = vi.fn()
    render(
      <RecipeCard 
        recipe={mockRecipe} 
        onViewDetails={mockOnViewDetails}
        onSave={mockOnSave}
      />
    )
    
    const saveButton = screen.getByLabelText('Save recipe')
    fireEvent.click(saveButton)
    
    expect(mockOnSave).toHaveBeenCalledWith(mockRecipe)
    expect(mockOnViewDetails).not.toHaveBeenCalled()
  })

  test('renders placeholder when no image is provided', () => {
    const recipeWithoutImage = { ...mockRecipe, image: undefined }
    const { container } = render(<RecipeCard recipe={recipeWithoutImage} />)
    
    // Should render the placeholder SVG
    const placeholder = container.querySelector('svg')
    expect(placeholder).toBeInTheDocument()
  })

  test('applies correct difficulty styling', () => {
    const { rerender } = render(<RecipeCard recipe={mockRecipe} />)
    
    // Easy difficulty should have success styling
    expect(screen.getByText('easy')).toHaveClass('bg-success/20', 'text-success')
    
    // Test medium difficulty
    const mediumRecipe = { ...mockRecipe, difficulty: 'medium' as const }
    rerender(<RecipeCard recipe={mediumRecipe} />)
    expect(screen.getByText('medium')).toHaveClass('bg-warning/20', 'text-warning')
    
    // Test hard difficulty
    const hardRecipe = { ...mockRecipe, difficulty: 'hard' as const }
    rerender(<RecipeCard recipe={hardRecipe} />)
    expect(screen.getByText('hard')).toHaveClass('bg-error/20', 'text-error')
  })

  test('limits dietary compliance tags display', () => {
    const recipeWithManyTags = {
      ...mockRecipe,
      dietaryCompliance: ['Vegetarian', 'Gluten-Free', 'High Protein', 'Low Sodium', 'Organic']
    }
    render(<RecipeCard recipe={recipeWithManyTags} />)
    
    // Should show first 3 tags
    expect(screen.getByText('Vegetarian')).toBeInTheDocument()
    expect(screen.getByText('Gluten-Free')).toBeInTheDocument()
    expect(screen.getByText('High Protein')).toBeInTheDocument()
    
    // Should show +2 indicator for remaining tags
    expect(screen.getByText('+2')).toBeInTheDocument()
    
    // Should not show the extra tags directly
    expect(screen.queryByText('Low Sodium')).not.toBeInTheDocument()
    expect(screen.queryByText('Organic')).not.toBeInTheDocument()
  })
}) 