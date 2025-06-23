import { vi } from 'vitest'
import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement, ReactNode } from 'react'

// Common test data
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  profile: {
    allergens: ['peanuts', 'shellfish'],
    diet: 'vegetarian',
    calorieGoal: 2000,
    embraceFoods: ['vegetables', 'grains'],
    avoidFoods: ['processed foods']
  }
}

export const mockRecipes = [
  {
    id: 'recipe-1',
    title: 'Vegetarian Pasta',
    ingredients: ['pasta', 'tomatoes', 'basil', 'olive oil'],
    instructions: ['Cook pasta', 'Make sauce', 'Combine'],
    nutrition: { calories: 450, protein: 12, carbs: 65, fat: 15 },
    dietary: ['vegetarian'],
    prepTime: 15,
    cookTime: 20,
    servings: 4
  },
  {
    id: 'recipe-2',
    title: 'Chicken Stir Fry',
    ingredients: ['chicken', 'vegetables', 'soy sauce'],
    instructions: ['Cook chicken', 'Add vegetables', 'Stir fry'],
    nutrition: { calories: 380, protein: 28, carbs: 25, fat: 18 },
    dietary: ['high-protein'],
    prepTime: 10,
    cookTime: 15,
    servings: 2
  }
]

// Mock implementations
export const createMockRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn()
})

export const createMockSession = (authenticated = false, user = mockUser) => ({
  data: authenticated ? { user } : null,
  status: authenticated ? 'authenticated' : 'unauthenticated' as const,
  update: vi.fn()
})

export const createMockLocalStorage = () => {
  const storage = new Map<string, string>()
  
  return {
    getItem: vi.fn((key: string) => storage.get(key) || null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    key: vi.fn((index: number) => Array.from(storage.keys())[index] || null),
    get length() { return storage.size }
  }
}

// Setup helpers
export const setupWindowMocks = () => {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock window.ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock window.IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock localStorage
  const mockStorage = createMockLocalStorage()
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage
  })

  return { mockStorage }
}

// Test wrapper providers
export const createTestWrapper = (options: {
  session?: ReturnType<typeof createMockSession>
  router?: ReturnType<typeof createMockRouter>
} = {}) => {
  return ({ children }: { children: ReactNode }) => {
    // Mock providers would go here
    return React.createElement('div', { 'data-testid': 'test-wrapper' }, children)
  }
}

// Custom render with providers
export const renderWithProviders = (
  ui: ReactElement,
  options: RenderOptions & {
    session?: ReturnType<typeof createMockSession>
    router?: ReturnType<typeof createMockRouter>
  } = {}
) => {
  const { session, router, ...renderOptions } = options
  const Wrapper = createTestWrapper({ session, router })
  
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Assertion helpers
export const expectToBeVisible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument()
  expect(element).toBeVisible()
}

export const expectToHaveAccessibleName = (element: HTMLElement, name: string) => {
  expect(element).toHaveAccessibleName(name)
}

export const expectToHaveRole = (element: HTMLElement, role: string) => {
  expect(element).toHaveRole(role)
}

// API testing helpers
export const createMockApiResponse = <T>(data: T, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: vi.fn().mockResolvedValue(data),
  text: vi.fn().mockResolvedValue(JSON.stringify(data)),
  clone: vi.fn().mockReturnThis()
})

export const createMockApiError = (status = 500, message = 'Internal Server Error') => ({
  ok: false,
  status,
  statusText: message,
  json: vi.fn().mockRejectedValue(new Error(message)),
  text: vi.fn().mockResolvedValue(message),
  clone: vi.fn().mockReturnThis()
})

// Performance testing helpers
export const measurePerformance = async (fn: () => Promise<void> | void) => {
  const start = performance.now()
  await fn()
  const end = performance.now()
  return end - start
}

export const expectPerformanceUnder = async (
  fn: () => Promise<void> | void,
  maxTime: number
) => {
  const duration = await measurePerformance(fn)
  expect(duration).toBeLessThan(maxTime)
}

// Memory testing helpers
export const measureMemoryUsage = () => {
  if ('memory' in performance) {
    return (performance as any).memory
  }
  return null
}

export const expectNoMemoryLeaks = (beforeMemory: any, afterMemory: any) => {
  if (beforeMemory && afterMemory) {
    const memoryIncrease = afterMemory.usedJSHeapSize - beforeMemory.usedJSHeapSize
    // Allow for some memory increase but flag significant leaks
    expect(memoryIncrease).toBeLessThan(1000000) // 1MB threshold
  }
}

// Database testing helpers
export const createMockDatabase = () => {
  const data = new Map()
  
  return {
    data,
    async get(key: string) {
      return data.get(key)
    },
    async set(key: string, value: any) {
      data.set(key, value)
      return value
    },
    async delete(key: string) {
      return data.delete(key)
    },
    async clear() {
      data.clear()
    },
    async size() {
      return data.size
    }
  }
}

// Network testing helpers
export const simulateNetworkDelay = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms))

export const simulateNetworkError = () => 
  Promise.reject(new Error('Network request failed'))

export const simulateTimeout = () => 
  new Promise(() => {}) // Never resolves

// Form testing helpers
export const fillForm = async (form: HTMLElement, data: Record<string, string>) => {
  const { fireEvent } = await import('@testing-library/react')
  
  Object.entries(data).forEach(([name, value]) => {
    const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement
    if (input) {
      fireEvent.change(input, { target: { value } })
    }
  })
}

export const submitForm = async (form: HTMLElement) => {
  const { fireEvent } = await import('@testing-library/react')
  fireEvent.submit(form)
}

// Validation testing helpers
export const expectValidationError = (element: HTMLElement, message?: string) => {
  expect(element).toBeInvalid()
  if (message) {
    expect(element).toHaveAccessibleDescription(message)
  }
}

export const expectValidationSuccess = (element: HTMLElement) => {
  expect(element).toBeValid()
}

// Theme testing helpers
export const expectDarkTheme = () => {
  expect(document.documentElement).toHaveClass('dark')
}

export const expectLightTheme = () => {
  expect(document.documentElement).not.toHaveClass('dark')
}

// Accessibility testing helpers
export const expectAccessibleNavigation = (element: HTMLElement) => {
  expect(element).toHaveAttribute('role', 'navigation')
  expect(element).toHaveAttribute('aria-label')
}

export const expectAccessibleButton = (element: HTMLElement) => {
  expect(element).toHaveRole('button')
  expect(element).not.toHaveAttribute('aria-disabled', 'true')
}

export const expectAccessibleForm = (element: HTMLElement) => {
  expect(element).toHaveRole('form')
  
  // Check for proper labeling
  const inputs = element.querySelectorAll('input, textarea, select')
  inputs.forEach(input => {
    expect(input).toHaveAccessibleName()
  })
}

// Error boundary testing helpers
export const createThrowError = (message = 'Test error') => {
  const ThrowError = () => {
    throw new Error(message)
  }
  return ThrowError
}

export const expectErrorBoundary = (element: HTMLElement, errorMessage?: string) => {
  expect(element).toHaveTextContent('Something went wrong')
  if (errorMessage) {
    expect(element).toHaveTextContent(errorMessage)
  }
}

// Search testing helpers
export const expectSearchResults = (container: HTMLElement, count: number) => {
  const results = container.querySelectorAll('[data-testid*="search-result"]')
  expect(results).toHaveLength(count)
}

export const expectEmptySearchResults = (container: HTMLElement) => {
  expect(container).toHaveTextContent(/no results found/i)
}

// Recipe testing helpers
export const expectRecipeCard = (element: HTMLElement, recipe: typeof mockRecipes[0]) => {
  expect(element).toHaveTextContent(recipe.title)
  expect(element).toHaveTextContent(`${recipe.nutrition.calories} calories`)
  expect(element).toHaveTextContent(`${recipe.prepTime} min prep`)
}

export const expectRecipeDetails = (container: HTMLElement, recipe: typeof mockRecipes[0]) => {
  expect(container).toHaveTextContent(recipe.title)
  
  // Check ingredients
  recipe.ingredients.forEach(ingredient => {
    expect(container).toHaveTextContent(ingredient)
  })
  
  // Check instructions
  recipe.instructions.forEach(instruction => {
    expect(container).toHaveTextContent(instruction)
  })
  
  // Check nutrition
  expect(container).toHaveTextContent(`${recipe.nutrition.calories}`)
  expect(container).toHaveTextContent(`${recipe.nutrition.protein}`)
}

// Loading state helpers
export const expectLoadingState = (container: HTMLElement) => {
  expect(container.querySelector('[data-testid="loading"]')).toBeInTheDocument()
}

export const expectLoadedState = (container: HTMLElement) => {
  expect(container.querySelector('[data-testid="loading"]')).not.toBeInTheDocument()
}

// Error state helpers
export const expectErrorState = (container: HTMLElement, message?: string) => {
  expect(container.querySelector('[data-testid="error"]')).toBeInTheDocument()
  if (message) {
    expect(container).toHaveTextContent(message)
  }
}

// Utility for waiting with timeout
export const waitForWithTimeout = async (
  callback: () => void | Promise<void>,
  timeout = 5000
) => {
  const { waitFor } = await import('@testing-library/react')
  return waitFor(callback, { timeout })
}

// Cleanup helpers
export const cleanupTest = () => {
  vi.clearAllMocks()
  vi.clearAllTimers()
  vi.restoreAllMocks()
}

// Test data generators
export const generateMockRecipe = (overrides: Partial<typeof mockRecipes[0]> = {}) => ({
  ...mockRecipes[0],
  id: `recipe-${Date.now()}`,
  ...overrides
})

export const generateMockUser = (overrides: Partial<typeof mockUser> = {}) => ({
  ...mockUser,
  id: `user-${Date.now()}`,
  ...overrides
})

// Batch testing helpers
export const runTestBatch = async (tests: Array<() => Promise<void>>) => {
  for (const test of tests) {
    await test()
  }
}

export const runTestConcurrently = async (tests: Array<() => Promise<void>>) => {
  await Promise.all(tests.map(test => test()))
} 