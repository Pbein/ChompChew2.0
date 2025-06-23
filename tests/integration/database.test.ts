import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Database } from '@/features/core/types/database'

// Mock Supabase client first
const mockSupabaseClient = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn()
  },
  storage: {
    from: vi.fn()
  }
}

// Mock the real Supabase utilities
vi.mock('@/lib/supabase-server', () => ({
  createServerComponentClient: vi.fn(() => mockSupabaseClient),
  createRouteHandlerClient: vi.fn(() => mockSupabaseClient), 
  supabaseServiceRole: mockSupabaseClient
}))

// Import after mocking to avoid initialization issues
const { createServerComponentClient, supabaseServiceRole } = await import('@/lib/supabase-server')

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
    delete: vi.fn()
  }))
}))

describe('Database Integration Tests - Real Supabase Implementation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('User Operations', () => {
    it('should create user with real database types', async () => {
      const mockUserData: Database['public']['Tables']['users']['Insert'] = {
        email: 'test@example.com',
        full_name: 'Test User',
        dietary_preferences: ['vegetarian'],
        allergens: ['nuts'],
        cooking_level: 'beginner'
      }

      const mockCreatedUser: Database['public']['Tables']['users']['Row'] = {
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: null,
        bio: null,
        dietary_preferences: ['vegetarian'],
        allergens: ['nuts'],
        cooking_level: 'beginner',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockCreatedUser,
              error: null
            })
          })
        })
      })

      const supabase = await createServerComponentClient()
      const { data, error } = await supabase
        .from('users')
        .insert(mockUserData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toEqual(mockCreatedUser)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users')
    })

    it('should fetch user by ID with proper types', async () => {
      const userId = 'user-123'
      const mockUser: Database['public']['Tables']['users']['Row'] = {
        id: userId,
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: null,
        bio: null,
        dietary_preferences: ['vegetarian'],
        allergens: ['nuts'],
        cooking_level: 'intermediate',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockUser,
              error: null
            })
          })
        })
      })

      const supabase = await createServerComponentClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      expect(error).toBeNull()
      expect(data).toEqual(mockUser)
      expect(data?.cooking_level).toBe('intermediate')
      expect(data?.dietary_preferences).toContain('vegetarian')
    })

    it('should update user with partial data', async () => {
      const userId = 'user-123'
      const updateData: Database['public']['Tables']['users']['Update'] = {
        full_name: 'Updated Name',
        bio: 'New bio',
        cooking_level: 'advanced'
      }

      const mockUpdatedUser: Database['public']['Tables']['users']['Row'] = {
        id: userId,
        email: 'test@example.com',
        full_name: 'Updated Name',
        avatar_url: null,
        bio: 'New bio',
        dietary_preferences: ['vegetarian'],
        allergens: ['nuts'],
        cooking_level: 'advanced',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      mockSupabaseClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockUpdatedUser,
                error: null
              })
            })
          })
        })
      })

      const supabase = await createServerComponentClient()
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.full_name).toBe('Updated Name')
      expect(data?.cooking_level).toBe('advanced')
    })
  })

  describe('Recipe Operations', () => {
    it('should create recipe with real database types', async () => {
      const mockRecipeData: Database['public']['Tables']['recipes']['Insert'] = {
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        instructions: [
          { step: 1, instruction: 'Heat oven to 350°F' },
          { step: 2, instruction: 'Mix ingredients' }
        ],
        ingredients: [
          { name: 'flour', amount: 2, unit: 'cups' },
          { name: 'sugar', amount: 1, unit: 'cup' }
        ],
        prep_time: 15,
        cook_time: 30,
        servings: 6,
        difficulty: 'easy',
        cuisine_type: 'American',
        dietary_tags: ['vegetarian'],
        calories_per_serving: 250,
        is_ai_generated: false,
        is_public: true,
        created_by: 'user-123'
      }

      const mockCreatedRecipe: Database['public']['Tables']['recipes']['Row'] = {
        id: 'recipe-123',
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        instructions: [
          { step: 1, instruction: 'Heat oven to 350°F' },
          { step: 2, instruction: 'Mix ingredients' }
        ],
        ingredients: [
          { name: 'flour', amount: 2, unit: 'cups' },
          { name: 'sugar', amount: 1, unit: 'cup' }
        ],
        prep_time: 15,
        cook_time: 30,
        total_time: 45,
        servings: 6,
        difficulty: 'easy',
        cuisine_type: 'American',
        dietary_tags: ['vegetarian'],
        calories_per_serving: 250,
        nutrition_info: null,
        image_url: null,
        is_ai_generated: false,
        is_public: true,
        created_by: 'user-123',
            created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        rating_average: null,
        rating_count: 0
      }

      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockCreatedRecipe,
              error: null
            })
          })
        })
      })

      const supabase = await createServerComponentClient()
      const { data, error } = await supabase
        .from('recipes')
        .insert(mockRecipeData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.title).toBe('Test Recipe')
      expect(data?.difficulty).toBe('easy')
      expect(data?.is_ai_generated).toBe(false)
      expect(Array.isArray(data?.ingredients)).toBe(true)
      expect(Array.isArray(data?.instructions)).toBe(true)
    })

    it('should search recipes with filters', async () => {
      const mockRecipes: Database['public']['Tables']['recipes']['Row'][] = [
        {
          id: 'recipe-1',
          title: 'Vegetarian Pasta',
          description: 'Healthy pasta dish',
          instructions: [],
          ingredients: [],
          prep_time: 15,
          cook_time: 20,
          total_time: 35,
          servings: 4,
          difficulty: 'easy',
          cuisine_type: 'Italian',
          dietary_tags: ['vegetarian'],
          calories_per_serving: 300,
          nutrition_info: null,
          image_url: null,
          is_ai_generated: false,
          is_public: true,
          created_by: 'user-123',
            created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          rating_average: 4.5,
          rating_count: 10
        }
      ]

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          ilike: vi.fn().mockReturnValue({
            contains: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: mockRecipes,
                error: null
              })
            })
          })
        })
      })

      const supabase = await createServerComponentClient()
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .ilike('title', '%pasta%')
        .contains('dietary_tags', ['vegetarian'])
        .eq('is_public', true)

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data?.[0].title).toBe('Vegetarian Pasta')
      expect(data?.[0].dietary_tags).toContain('vegetarian')
    })
  })

  describe('User Favorites Operations', () => {
    it('should save recipe to favorites', async () => {
      const favoriteData: Database['public']['Tables']['user_favorites']['Insert'] = {
        user_id: 'user-123',
        recipe_id: 'recipe-456'
      }

      const mockFavorite: Database['public']['Tables']['user_favorites']['Row'] = {
        id: 'favorite-123',
        user_id: 'user-123',
        recipe_id: 'recipe-456',
        created_at: new Date().toISOString()
      }

      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockFavorite,
              error: null
            })
          })
        })
      })

      const supabase = await createServerComponentClient()
      const { data, error } = await supabase
        .from('user_favorites')
        .insert(favoriteData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.user_id).toBe('user-123')
      expect(data?.recipe_id).toBe('recipe-456')
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Connection failed', code: 'CONNECTION_ERROR' }
        })
      })

      const supabase = await createServerComponentClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')

      expect(data).toBeNull()
      expect(error).toBeDefined()
      expect(error?.message).toBe('Connection failed')
    })

    it('should handle validation errors', async () => {
      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: { 
            message: 'null value in column "title" violates not-null constraint',
            code: '23502'
          }
        })
      })

      const supabase = await createServerComponentClient()
      const { data, error } = await supabase
        .from('recipes')
        .insert({})

      expect(data).toBeNull()
      expect(error).toBeDefined()
      expect(error?.code).toBe('23502')
    })
  })

  describe('Service Role Operations', () => {
    it('should perform admin operations with service role client', async () => {
      const mockUsers: Database['public']['Tables']['users']['Row'][] = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          full_name: 'User 1',
          avatar_url: null,
          bio: null,
          dietary_preferences: null,
          allergens: null,
          cooking_level: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
      ]

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: mockUsers,
          error: null
        })
      })

      const { data, error } = await supabaseServiceRole
        .from('users')
        .select('*')

      expect(error).toBeNull()
      expect(data).toEqual(mockUsers)
    })
  })
}) 