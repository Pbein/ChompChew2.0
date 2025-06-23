import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProfileStore } from '@/store/profileStore'
import { supabase } from '@/lib/supabase'

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}))

describe('ProfileStore', () => {
  beforeEach(() => {
    // Reset store state
    useProfileStore.setState({
      profile: null,
      loading: false,
      error: null
    })
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { profile, loading, error } = useProfileStore.getState()
      expect(profile).toBeNull()
      expect(loading).toBe(false)
      expect(error).toBeNull()
    })
  })

  describe('fetchProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockProfile = {
        id: 'user-123',
        dietary_preferences: ['vegetarian', 'gluten-free'],
        allergens: ['nuts', 'dairy'],
        macro_targets: {
          calories: 2000,
          protein: 25,
          carbs: 45,
          fat: 30
        },
        fiber_sensitivity: true
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      const mockEq = vi.fn(() => ({ single: mockSingle }))
      const mockSelect = vi.fn(() => ({ eq: mockEq }))
      const mockFrom = vi.fn(() => ({ select: mockSelect }))

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      const { fetchProfile } = useProfileStore.getState()
      await fetchProfile('user-123')

      const { profile, loading, error } = useProfileStore.getState()
      expect(profile).toEqual(mockProfile)
      expect(loading).toBe(false)
      expect(error).toBeNull()
      expect(supabase.from).toHaveBeenCalledWith('users')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123')
    })

    it('should handle fetch errors gracefully', async () => {
      const mockError = { message: 'Database error' }

      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockEq = vi.fn(() => ({ single: mockSingle }))
      const mockSelect = vi.fn(() => ({ eq: mockEq }))
      const mockFrom = vi.fn(() => ({ select: mockSelect }))

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      const { fetchProfile } = useProfileStore.getState()
      await fetchProfile('user-123')

      const { profile, loading, error } = useProfileStore.getState()
      expect(profile).toBeNull()
      expect(loading).toBe(false)
      expect(error).toBe('Database error')
    })

    it('should set loading state during fetch', async () => {
      let resolvePromise: (value: any) => void
      const mockPromise = new Promise(resolve => {
        resolvePromise = resolve
      })

      const mockSingle = vi.fn().mockReturnValue(mockPromise)
      const mockEq = vi.fn(() => ({ single: mockSingle }))
      const mockSelect = vi.fn(() => ({ eq: mockEq }))
      const mockFrom = vi.fn(() => ({ select: mockSelect }))

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      const { fetchProfile } = useProfileStore.getState()
      const fetchPromise = fetchProfile('user-123')

      // Check loading state is true during fetch
      expect(useProfileStore.getState().loading).toBe(true)

      // Resolve the promise
      resolvePromise!({ data: null, error: null })
      await fetchPromise

      // Check loading state is false after fetch
      expect(useProfileStore.getState().loading).toBe(false)
    })
  })

  describe('updateProfile', () => {
    it('should update dietary preferences', async () => {
      const updatedProfile = {
        id: 'user-123',
        dietary_preferences: ['vegetarian', 'gluten-free'],
        allergens: [],
        macro_targets: {},
        fiber_sensitivity: false
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: updatedProfile, error: null })
      const mockSelect = vi.fn(() => ({ single: mockSingle }))
      const mockEq = vi.fn(() => ({ select: mockSelect }))
      const mockUpdate = vi.fn(() => ({ eq: mockEq }))
      const mockFrom = vi.fn(() => ({ update: mockUpdate }))

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      // Set initial profile
      useProfileStore.setState({
        profile: {
          id: 'user-123',
          dietary_preferences: ['vegetarian'],
          allergens: [],
          macro_targets: {},
          fiber_sensitivity: false
        }
      })

      const { updateProfile } = useProfileStore.getState()
      await updateProfile({ dietary_preferences: ['vegetarian', 'gluten-free'] })

      const { profile } = useProfileStore.getState()
      expect(profile?.dietary_preferences).toEqual(['vegetarian', 'gluten-free'])
      expect(mockUpdate).toHaveBeenCalledWith({ dietary_preferences: ['vegetarian', 'gluten-free'] })
    })

    it('should update allergens list', async () => {
      const updatedProfile = {
        id: 'user-123',
        dietary_preferences: [],
        allergens: ['nuts', 'dairy', 'shellfish'],
        macro_targets: {},
        fiber_sensitivity: false
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: updatedProfile, error: null })
      const mockSelect = vi.fn(() => ({ single: mockSingle }))
      const mockEq = vi.fn(() => ({ select: mockSelect }))
      const mockUpdate = vi.fn(() => ({ eq: mockEq }))
      const mockFrom = vi.fn(() => ({ update: mockUpdate }))

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      // Set initial profile
      useProfileStore.setState({
        profile: {
          id: 'user-123',
          dietary_preferences: [],
          allergens: ['nuts'],
          macro_targets: {},
          fiber_sensitivity: false
        }
      })

      const { updateProfile } = useProfileStore.getState()
      await updateProfile({ allergens: ['nuts', 'dairy', 'shellfish'] })

      const { profile } = useProfileStore.getState()
      expect(profile?.allergens).toEqual(['nuts', 'dairy', 'shellfish'])
    })

    it('should update macro targets', async () => {
      const newMacros = {
        calories: 2200,
        protein: 30,
        carbs: 40,
        fat: 30
      }

      const updatedProfile = {
        id: 'user-123',
        dietary_preferences: [],
        allergens: [],
        macro_targets: newMacros,
        fiber_sensitivity: false
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: updatedProfile, error: null })
      const mockSelect = vi.fn(() => ({ single: mockSingle }))
      const mockEq = vi.fn(() => ({ select: mockSelect }))
      const mockUpdate = vi.fn(() => ({ eq: mockEq }))
      const mockFrom = vi.fn(() => ({ update: mockUpdate }))

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      // Set initial profile
      useProfileStore.setState({
        profile: {
          id: 'user-123',
          dietary_preferences: [],
          allergens: [],
          macro_targets: {},
          fiber_sensitivity: false
        }
      })

      const { updateProfile } = useProfileStore.getState()
      await updateProfile({ macro_targets: newMacros })

      const { profile } = useProfileStore.getState()
      expect(profile?.macro_targets).toEqual(newMacros)
    })

    it('should handle update errors gracefully', async () => {
      const mockError = { message: 'Update failed' }
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError })
      const mockSelect = vi.fn(() => ({ single: mockSingle }))
      const mockEq = vi.fn(() => ({ select: mockSelect }))
      const mockUpdate = vi.fn(() => ({ eq: mockEq }))
      const mockFrom = vi.fn(() => ({ update: mockUpdate }))

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      // Set initial profile
      useProfileStore.setState({
        profile: {
          id: 'user-123',
          dietary_preferences: ['vegetarian'],
          allergens: [],
          macro_targets: {},
          fiber_sensitivity: false
        }
      })

      const { updateProfile } = useProfileStore.getState()
      
      // The updateProfile function should throw an error
      await expect(updateProfile({ dietary_preferences: ['vegan'] })).rejects.toThrow('Update failed')

      // Profile should remain unchanged on error
      const { profile, error } = useProfileStore.getState()
      expect(profile?.dietary_preferences).toEqual(['vegetarian'])
      expect(error).toBe('Update failed')
    })
  })

  describe('Fiber Sensitivity', () => {
    it('should update fiber sensitivity setting', async () => {
      const updatedProfile = {
        id: 'user-123',
        dietary_preferences: [],
        allergens: [],
        macro_targets: {},
        fiber_sensitivity: true
      }

      const mockSingle = vi.fn().mockResolvedValue({ data: updatedProfile, error: null })
      const mockSelect = vi.fn(() => ({ single: mockSingle }))
      const mockEq = vi.fn(() => ({ select: mockSelect }))
      const mockUpdate = vi.fn(() => ({ eq: mockEq }))
      const mockFrom = vi.fn(() => ({ update: mockUpdate }))

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      // Set initial profile
      useProfileStore.setState({
        profile: {
          id: 'user-123',
          dietary_preferences: [],
          allergens: [],
          macro_targets: {},
          fiber_sensitivity: false
        }
      })

      const { updateProfile } = useProfileStore.getState()
      await updateProfile({ fiber_sensitivity: true })

      const { profile } = useProfileStore.getState()
      expect(profile?.fiber_sensitivity).toBe(true)
    })
  })
}) 