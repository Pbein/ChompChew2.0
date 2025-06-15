import { describe, it, expect, beforeEach } from 'vitest'
import { useSavedRecipesStore } from '@/store/savedRecipesStore'
import { act } from '@testing-library/react'

const sampleRecipe = {
  id: 'test-1',
  title: 'Test Recipe',
  prepTime: 10,
  difficulty: 'easy' as const,
  servings: 1,
  dietaryCompliance: [],
  safetyValidated: true,
}

describe('savedRecipesStore', () => {
  beforeEach(() => {
    // clear store state
    useSavedRecipesStore.setState({ saved: [] })
    localStorage.clear()
  })

  it('adds and removes recipe in guest mode', async () => {
    await act(async () => {
      await useSavedRecipesStore.getState().toggleSave(sampleRecipe)
    })
    expect(useSavedRecipesStore.getState().saved).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem('guest_favorites') || '[]')).toHaveLength(1)

    await act(async () => {
      await useSavedRecipesStore.getState().toggleSave(sampleRecipe)
    })
    expect(useSavedRecipesStore.getState().saved).toHaveLength(0)
  })
}) 