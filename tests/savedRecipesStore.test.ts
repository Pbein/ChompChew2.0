import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useSavedRecipesStore } from '@/store/savedRecipesStore'
import { act } from '@testing-library/react'
import { supabase } from '@/lib/supabase'
import {
  PostgrestFilterBuilder,
  PostgrestResponse,
  PostgrestQueryBuilder,
} from '@supabase/postgrest-js'
import { User } from '@supabase/supabase-js'

// Mock the entire supabase library
vi.mock('@/lib/supabase', () => {
  const from = vi.fn(() => ({
    select: vi.fn(),
    insert: vi.fn(),
  }))

  const auth = {
    getUser: vi.fn(),
  }

  // This is the object that will be imported as 'supabase'
  const supabaseMock = {
    from,
    auth,
  }

  return {
    supabase: supabaseMock,
    // getSupabaseClient now returns our self-contained mock
    getSupabaseClient: vi.fn(() => supabaseMock),
  }
})

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
      // ARRANGE: Mock a new user by having the database return an empty array of favorites.
      const eqMock = vi.fn().mockResolvedValue({ count: 0, error: null })
      const selectMock = { eq: eqMock } as unknown as PostgrestFilterBuilder<any, any, any, any, any>
      vi.mocked(supabase.from('user_favorites').select).mockReturnValue(selectMock)

      const insertMock = vi.mocked(supabase.from('user_favorites').insert)

      // ACT: Trigger the authentication handler for a new user.
      await act(async () => {
        await useSavedRecipesStore.getState().handleUserAuthentication('new-user-id')
      })

      // ASSERT:
      // 1. The store should have tried to insert the guest recipe into the user's favorites.
      expect(insertMock).toHaveBeenCalledWith([
        { user_id: 'new-user-id', recipe_id: 'guest-recipe-1' },
      ])

      // 2. The localStorage should be cleared after a successful migration.
      expect(localStorage.getItem('guest_favorites')).toBeNull()
    })

    it('should CLEAR localStorage for an EXISTING user (who already has saved recipes)', async () => {
      // ARRANGE: Mock an existing user by having the database return saved recipes.
      const eqMock = vi.fn().mockResolvedValue({ count: 1, error: null })
      const selectMock = { eq: eqMock } as unknown as PostgrestFilterBuilder<any, any, any, any, any>
      vi.mocked(supabase.from('user_favorites').select).mockReturnValue(selectMock)

      const insertMock = vi.mocked(supabase.from('user_favorites').insert)
      const clearLocalStorageSpy = vi.spyOn(
        useSavedRecipesStore.getState(),
        'clearLocalStorage',
      )

      // ACT: Trigger the authentication handler for an existing user.
      await act(async () => {
        await useSavedRecipesStore.getState().handleUserAuthentication('existing-user-id')
      })

      // ASSERT:
      // 1. The store should NOT have tried to insert any recipes.
      expect(insertMock).not.toHaveBeenCalled()
      // 2. The store should have cleared the localStorage.
      expect(clearLocalStorageSpy).toHaveBeenCalled()
    })

    it('should do nothing if localStorage is empty, regardless of user type', async () => {
      // ARRANGE: Ensure localStorage is empty.
      localStorage.removeItem('guest_favorites')
      const selectMock = vi.mocked(supabase.from('user_favorites').select)
      const insertMock = vi.mocked(supabase.from('user_favorites').insert)

      // ACT: Trigger the authentication handler.
      await act(async () => {
        await useSavedRecipesStore.getState().handleUserAuthentication('any-user-id')
      })

      // ASSERT: No database calls or clearing operations should be performed.
      expect(selectMock).not.toHaveBeenCalled()
      expect(insertMock).not.toHaveBeenCalled()
    })
  })
}) 