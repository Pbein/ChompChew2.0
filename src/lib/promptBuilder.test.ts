import { buildRecipePrompt } from './promptBuilder'
import { DIET_TEMPLATES, COMMON_ALLERGENS } from '@/features/core/types/dietary-preferences'

describe('buildRecipePrompt', () => {
  it('should build basic prompt with just recipe request', () => {
    const messages = buildRecipePrompt({
      prompt: 'chicken burrito'
    })

    expect(messages).toHaveLength(2)
    expect(messages[0].role).toBe('system')
    expect(messages[0].content).toContain('ChompChew AI')
    expect(messages[1].role).toBe('user')
    expect(messages[1].content).toContain('chicken burrito')
    expect(messages[1].content).toContain('Return ONLY valid JSON')
  })

  it('should include dietary preferences in prompt', () => {
    const messages = buildRecipePrompt({
      prompt: 'pasta dish',
      dietaryPreferences: ['vegetarian', 'low-sodium']
    })

    const userMessage = messages[1].content
    expect(userMessage).toContain('Dietary preferences to embrace: vegetarian, low-sodium')
  })

  it('should include allergens to avoid in prompt', () => {
    const messages = buildRecipePrompt({
      prompt: 'chocolate cake',
      allergens: ['nuts', 'dairy']
    })

    const userMessage = messages[1].content
    expect(userMessage).toContain('Foods to avoid (allergens): nuts, dairy')
  })

  it('should include both dietary preferences and allergens', () => {
    const messages = buildRecipePrompt({
      prompt: 'breakfast smoothie',
      dietaryPreferences: ['vegan', 'high-protein'],
      allergens: ['soy', 'gluten']
    })

    const userMessage = messages[1].content
    expect(userMessage).toContain('Dietary preferences to embrace: vegan, high-protein')
    expect(userMessage).toContain('Foods to avoid (allergens): soy, gluten')
  })

  it('should handle empty arrays gracefully', () => {
    const messages = buildRecipePrompt({
      prompt: 'simple salad',
      dietaryPreferences: [],
      allergens: []
    })

    const userMessage = messages[1].content
    expect(userMessage).not.toContain('Dietary preferences')
    expect(userMessage).not.toContain('Foods to avoid')
    expect(userMessage).toContain('simple salad')
  })

  it('should include additional context when provided', () => {
    const messages = buildRecipePrompt({
      prompt: 'dinner recipe',
      additionalContext: {
        embraceFoods: ['quinoa', 'kale'],
        avoidFoods: ['processed foods']
      }
    })

    const userMessage = messages[1].content
    expect(userMessage).toContain('embraceFoods: quinoa, kale')
    expect(userMessage).toContain('avoidFoods: processed foods')
  })

  it('should handle common allergens from constants', () => {
    const commonAllergens = [COMMON_ALLERGENS[0], COMMON_ALLERGENS[1]]
    const messages = buildRecipePrompt({
      prompt: 'safe recipe',
      allergens: commonAllergens
    })

    const userMessage = messages[1].content
    expect(userMessage).toContain(`Foods to avoid (allergens): ${commonAllergens.join(', ')}`)
  })

  it('should handle diet template preferences', () => {
    const mediterraneanFoods = [...DIET_TEMPLATES.mediterranean.foods]
    const messages = buildRecipePrompt({
      prompt: 'healthy meal',
      dietaryPreferences: mediterraneanFoods
    })

    const userMessage = messages[1].content
    expect(userMessage).toContain(`Dietary preferences to embrace: ${mediterraneanFoods.join(', ')}`)
  })

  it('should properly escape special characters in prompt', () => {
    const messages = buildRecipePrompt({
      prompt: 'recipe with "quotes" and special chars: $@#'
    })

    const userMessage = messages[1].content
    expect(userMessage).toContain('recipe with "quotes" and special chars: $@#')
  })

  it('should include TypeScript interface in instructions', () => {
    const messages = buildRecipePrompt({
      prompt: 'any recipe'
    })

    const userMessage = messages[1].content
    expect(userMessage).toContain('interface Recipe {')
    expect(userMessage).toContain('title: string')
    expect(userMessage).toContain('ingredients:')
    expect(userMessage).toContain('instructions: string[]')
    expect(userMessage).toContain('difficulty?:')
  })
}) 