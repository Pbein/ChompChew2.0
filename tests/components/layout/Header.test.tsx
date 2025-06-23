import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

// Simple test component to verify basic functionality
const SimpleHeader = () => {
  return (
    <header role="banner">
      <div>
        <span>ChompChew</span>
        <nav>
          <a href="/generate-recipe">Generate Recipe</a>
          <a href="/saved-recipes">Saved Recipes</a>
          <a href="/dietary-needs">Dietary Needs</a>
        </nav>
        <div>
          <a href="/auth/signin">Sign In</a>
          <a href="/auth/signup">Get Started</a>
        </div>
      </div>
    </header>
  )
}

// Mock Supabase with a factory function
vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
      signOut: vi.fn()
    }
  })
}))

describe('Header Component - Simple Tests', () => {
  it('should render basic elements', () => {
    render(<SimpleHeader />)
    
    expect(screen.getByText('ChompChew')).toBeInTheDocument()
    expect(screen.getByText('Generate Recipe')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('should have correct navigation links', () => {
    render(<SimpleHeader />)
    
    const generateLink = screen.getByText('Generate Recipe')
    expect(generateLink.closest('a')).toHaveAttribute('href', '/generate-recipe')
    
    const signInLink = screen.getByText('Sign In')
    expect(signInLink.closest('a')).toHaveAttribute('href', '/auth/signin')
  })
})

// Mock savedRecipesStore
const mockHandleUserAuthentication = vi.fn()
vi.mock('@/store/savedRecipesStore', () => ({
  useSavedRecipesStore: () => ({
    handleUserAuthentication: mockHandleUserAuthentication
  })
}))

// Mock theme provider and components
vi.mock('@/components/providers/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: vi.fn(() => ({
    theme: 'light',
    setTheme: vi.fn(),
    resolvedTheme: 'light'
  }))
}))

vi.mock('@/components/ui/ThemeToggle', () => ({
  ThemeToggleCompact: () => <div data-testid="theme-toggle-compact">Theme Toggle</div>,
  ThemeToggleWithLabel: () => <div data-testid="theme-toggle-with-label">Light Mode</div>
}))

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string; [key: string]: unknown }>) => (
    <a href={href} {...props}>{children}</a>
  )
}))

// Mock Button component
vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, variant, size, className, ...props }: React.PropsWithChildren<{
    onClick?: () => void;
    variant?: string;
    size?: string;
    className?: string;
    [key: string]: unknown;
  }>) => (
    <button onClick={onClick} className={className} data-variant={variant} data-size={size} {...props}>
      {children}
    </button>
  )
}))

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

// Import the actual Header after mocks
import { Header } from '@/components/layout/Header'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

describe('Header Component - Real Implementation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderHeader = () => {
    return render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )
  }

  it('should render logo', async () => {
    renderHeader()
    
    await waitFor(() => {
      expect(screen.getByText('ChompChew')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should show sign in button when not authenticated', async () => {
    renderHeader()
    
    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should have mobile menu button', async () => {
    renderHeader()
    
    await waitFor(() => {
      expect(screen.getByLabelText('Toggle mobile menu')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should render theme toggle', async () => {
    renderHeader()
    
    await waitFor(() => {
      expect(screen.getByTestId('theme-toggle-compact')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should have proper accessibility attributes', async () => {
    renderHeader()
    
    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument()
    }, { timeout: 3000 })
  })
}) 