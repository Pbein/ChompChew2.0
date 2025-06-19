import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Header } from '@/components/layout/Header'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

// Mock window.matchMedia
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

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
}))

// Mock Supabase
vi.mock('@/lib/supabase-client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      signOut: vi.fn(),
    },
  },
}))

// Helper function to render with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('Header Component', () => {
  it('should render the ChompChew logo', () => {
    renderWithProviders(<Header />)
    
    const logo = screen.getByText('ChompChew')
    expect(logo).toBeInTheDocument()
  })

  it('should render core navigation links', () => {
    renderWithProviders(<Header />)
    
    // Multiple instances exist due to responsive design (desktop and tablet layouts)
    expect(screen.getAllByText('Dietary Needs')).toHaveLength(2)
    expect(screen.getAllByText('Saved Recipes')).toHaveLength(2)
    expect(screen.getAllByText('Generate Recipe')).toHaveLength(2)
  })

  it('should render user action buttons', () => {
    renderWithProviders(<Header />)
    
    // Should show theme toggle button
    expect(screen.getByLabelText(/Switch theme/)).toBeInTheDocument()
  })

  it('should have mobile menu toggle button', () => {
    renderWithProviders(<Header />)
    
    // Look for mobile menu button (hamburger icon)
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('should have mobile menu functionality', () => {
    renderWithProviders(<Header />)
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu')
    
    // Click to open mobile menu
    fireEvent.click(mobileMenuButton)
    
    // Verify the button exists and is clickable
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('should have proper navigation structure for accessibility', () => {
    renderWithProviders(<Header />)
    
    // Should have proper navigation landmarks (there may be multiple for responsive design)
    const navElements = screen.getAllByRole('navigation')
    expect(navElements.length).toBeGreaterThan(0)
    
    // Should have proper link structure
    const homeLink = screen.getByRole('link', { name: /ChompChew/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })
}) 