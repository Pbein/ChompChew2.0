import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from '../mocks/server'

// Mock Supabase globally for all tests using importOriginal approach
vi.mock('@/lib/supabase', async () => {
  // Create a comprehensive mock factory that handles all Supabase query patterns
  const createTableMock = (tableName: string) => {
    if (tableName === 'user_favorites') {
      // For user_favorites table - count queries and inserts
      return {
        select: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
        })),
        insert: vi.fn().mockResolvedValue({ error: null }),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
            })),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ error: null }),
        })),
      }
    } else if (tableName === 'users') {
      // For users table - comprehensive support for all patterns
      return {
        select: vi.fn((fields = '*') => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ 
              data: fields === 'id' ? null : { 
                id: 'test-user-id', 
                email: 'test@example.com',
                dietary_preferences: { diet: 'vegetarian' },
                allergens: ['nuts'],
                macro_targets: { calories: 2000 }
              }, 
              error: fields === 'id' ? { code: 'PGRST116', message: 'No rows found' } : null 
            }),
          })),
        })),
        insert: vi.fn().mockResolvedValue({ error: null }),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ 
                data: { 
                  id: 'test-user-id', 
                  email: 'test@example.com',
                  dietary_preferences: { diet: 'vegetarian' },
                  allergens: ['nuts'],
                  macro_targets: { calories: 2000 }
                }, 
                error: null 
              }),
            })),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ error: null }),
        })),
      }
    } else {
      // Default table mock
      return {
        select: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          order: vi.fn(() => ({
            limit: vi.fn().mockResolvedValue({ data: [], error: null }),
          })),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
          })),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
            })),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ error: null }),
        })),
      }
    }
  }

  const mockAuth = {
    getUser: vi.fn().mockImplementation(() => {
      // Return proper structure even when mocked to return null/undefined
      return Promise.resolve({
        data: { user: { id: 'new-user-id', email: 'test@example.com' } },
        error: null
      })
    }),
    onAuthStateChange: vi.fn((callback) => {
      // Mock subscription object
      const subscription = {
        unsubscribe: vi.fn(),
      }
      
      // Optionally call the callback immediately for tests that need it
      if (typeof callback === 'function') {
        setTimeout(() => {
          callback('SIGNED_IN', { 
            user: { id: 'new-user-id', email: 'test@example.com' },
            access_token: 'mock-token'
          })
        }, 0)
      }
      
      return { data: { subscription } }
    }),
  }

  const mockSupabaseClient = {
    from: vi.fn((tableName: string) => createTableMock(tableName)),
    auth: mockAuth,
  }

  return {
    supabase: mockSupabaseClient,
    getSupabaseClient: vi.fn(() => mockSupabaseClient),
    createClientComponentClient: vi.fn(() => mockSupabaseClient),
  }
})

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-key'
process.env.REDIS_URL = 'redis://localhost:6379'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'

// Mock crypto.randomUUID for consistent test results
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'mock-uuid-1234')
  }
})

// Mock window.matchMedia for theme testing (only in DOM environments)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Setup MSW
beforeAll(() => server.listen())
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
    toString: vi.fn(),
  }),
  usePathname: () => '/',
})) 