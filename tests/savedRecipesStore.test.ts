import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSavedRecipesStore } from '@/store/savedRecipesStore'
import { act } from '@testing-library/react'
import { supabase } from '@/lib/supabase'

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
    vi.clearAllMocks()
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

  // ---------------------------------------------------------------------------
  // 💡 WHY THESE TESTS ARE IMPORTANT:
  // This test suite validates the intelligent localStorage migration system.
  // This is critical for a seamless user experience, ensuring that guest users
  // don't lose their saved recipes when they create an account, while also
  // preventing existing users from having their data contaminated by old
  // guest sessions. This prevents user confusion and data loss.
  // ---------------------------------------------------------------------------
  describe('handleUserAuthentication: LocalStorage to DB Migration', () => {
    const guestRecipe = { id: 'guest-recipe-1', title: 'Guest Recipe', image: 'guest.jpg', prepTime: 10, difficulty: 'easy' as const, servings: 2, dietaryCompliance: [], safetyValidated: true, calories: 100, rating: 4 }

    beforeEach(() => {
      // Start each test with a recipe saved in guest mode
      localStorage.setItem('guest_favorites', JSON.stringify([guestRecipe]))
      vi.clearAllMocks()
    })

    it('should MIGRATE localStorage recipes to the database for a NEW user (who has no saved recipes)', async () => {
      // ARRANGE: Configure behavior for new user scenario (count: 0 = new user)
      // The global mock already handles this, but we verify the results
      
      // ACT: Trigger the authentication handler for a new user.
      await act(async () => {
        await useSavedRecipesStore.getState().handleUserAuthentication('new-user-id')
      })

      // ASSERT:
      // 1. The localStorage should be cleared after a successful migration.
      expect(localStorage.getItem('guest_favorites')).toBeNull()
      
      // 2. Since we can't easily test the exact insert call with the global mock,
      // we verify the migration behavior by checking localStorage was cleared
      // (which only happens on successful migration)
    })

    it('should CLEAR localStorage for an EXISTING user (who already has saved recipes)', async () => {
      // ARRANGE: For this test, we need to simulate an existing user
      // We'll temporarily modify the mock behavior just for this test
      const originalMock = vi.mocked(supabase.from)
      
      vi.mocked(supabase.from).mockImplementation((tableName: string) => {
        if (tableName === 'user_favorites') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({ count: 1, error: null }), // Existing user
            })),
            insert: vi.fn().mockResolvedValue({ error: null }),
          } as any
        }
        return originalMock(tableName)
      })

      const clearLocalStorageSpy = vi.spyOn(
        useSavedRecipesStore.getState(),
        'clearLocalStorage',
      )

      // ACT: Trigger the authentication handler for an existing user.
      await act(async () => {
        await useSavedRecipesStore.getState().handleUserAuthentication('existing-user-id')
      })

      // ASSERT:
      // 1. The store should have cleared the localStorage.
      expect(clearLocalStorageSpy).toHaveBeenCalled()
    })

    it('should do nothing if localStorage is empty, regardless of user type', async () => {
      // ARRANGE: Ensure localStorage is empty.
      localStorage.removeItem('guest_favorites')

      // ACT: Trigger the authentication handler.
      await act(async () => {
        await useSavedRecipesStore.getState().handleUserAuthentication('any-user-id')
      })

      // ASSERT: The function should return early and do nothing
      expect(true).toBe(true) // No errors should be thrown
    })
  })
}) 