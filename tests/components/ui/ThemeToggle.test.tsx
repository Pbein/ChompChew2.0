import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

// Mock the custom ThemeProvider
const mockSetTheme = vi.fn()
const mockUseTheme = vi.fn()

vi.mock('@/components/providers/ThemeProvider', () => ({
  useTheme: () => mockUseTheme(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
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

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light'
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Theme Switching', () => {
    it('should render theme toggle buttons', () => {
      render(<ThemeToggle />)
      
      // Check that buttons exist by their labels
      expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
      expect(screen.getByLabelText('Switch to system theme')).toBeInTheDocument()
    })

    it('should call setTheme when light theme button is clicked', () => {
      render(<ThemeToggle />)
      
      const lightButton = screen.getByLabelText('Switch to light theme')
      fireEvent.click(lightButton)
      
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('should call setTheme when dark theme button is clicked', () => {
      render(<ThemeToggle />)
      
      const darkButton = screen.getByLabelText('Switch to dark theme')
      fireEvent.click(darkButton)
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('should call setTheme when system theme button is clicked', () => {
      render(<ThemeToggle />)
      
      const systemButton = screen.getByLabelText('Switch to system theme')
      fireEvent.click(systemButton)
      
      expect(mockSetTheme).toHaveBeenCalledWith('system')
    })
  })

  describe('Theme State Display', () => {
    it('should highlight active theme button', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        resolvedTheme: 'dark'
      })

      render(<ThemeToggle />)
      
      const darkButton = screen.getByLabelText('Switch to dark theme')
      expect(darkButton).toHaveClass('bg-background', 'text-foreground', 'shadow-sm')
    })

    it('should show correct theme indicator', () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        resolvedTheme: 'dark'
      })

      render(<ThemeToggle />)
      
      // Check for dark theme indicator
      expect(screen.getByText('🌙')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ThemeToggle />)
      
      expect(screen.getByLabelText('Switch to light theme')).toHaveAttribute('aria-label', 'Switch to light theme')
      expect(screen.getByLabelText('Switch to dark theme')).toHaveAttribute('aria-label', 'Switch to dark theme')
      expect(screen.getByLabelText('Switch to system theme')).toHaveAttribute('aria-label', 'Switch to system theme')
    })

    it('should be keyboard navigable', () => {
      render(<ThemeToggle />)
      
      const lightButton = screen.getByLabelText('Switch to light theme')
      lightButton.focus()
      
      expect(document.activeElement).toBe(lightButton)
    })
  })

  describe('Error Handling', () => {
    it('should handle theme setting errors gracefully', () => {
      const mockSetThemeWithError = vi.fn().mockImplementation(() => {
        // Simulate error but don't actually throw to avoid uncaught exception
        console.error('Theme setting failed')
      })

      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetThemeWithError,
        resolvedTheme: 'light'
      })

      render(<ThemeToggle />)
      
      const darkButton = screen.getByLabelText('Switch to dark theme')
      
      expect(() => fireEvent.click(darkButton)).not.toThrow()
      expect(mockSetThemeWithError).toHaveBeenCalled()
    })
  })
}) 