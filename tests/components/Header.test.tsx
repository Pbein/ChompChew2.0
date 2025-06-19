import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Header } from '@/components/layout/Header'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { act } from 'react'
import { supabase } from '@/lib/supabase'
import { UserResponse } from '@supabase/supabase-js'

// Mock the entire supabase library
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}))

describe('Header Component', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    vi.clearAllMocks()
    // Mock user as unauthenticated by default
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null,
    } as UserResponse)
  })

  it('renders the logo and brand name', () => {
    renderHeader()
    const homeLink = screen.getByRole('link', { name: /chompchew/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('toggles the menu when the hamburger button is clicked on mobile', () => {
    renderHeader()
    const menuButton = screen.getByLabelText('Toggle mobile menu')
    fireEvent.click(menuButton)

    const mobileMenu = screen.getByTestId('mobile-menu')
    const linkInMenu = within(mobileMenu).getByRole('link', {
      name: /generate recipe/i,
    })
    expect(linkInMenu).toBeVisible()
  })

  describe('Theme Toggling', () => {
    it('renders the theme toggle button', () => {
      renderHeader()
      expect(
        screen.getByRole('button', { name: /switch to dark mode/i }),
      ).toBeInTheDocument()
    })

    it('switches to dark mode when clicked', async () => {
      renderHeader()
      const toggleButton = screen.getByRole('button', {
        name: /switch to dark mode/i,
      })
      await act(async () => {
        fireEvent.click(toggleButton)
      })

      expect(
        screen.getByRole('button', { name: /switch to light mode/i }),
      ).toBeInTheDocument()
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('switches back to light mode when clicked again', async () => {
      renderHeader()
      const toggleButton = screen.getByRole('button', {
        name: /switch to dark mode/i,
      })

      await act(async () => {
        fireEvent.click(toggleButton)
      })

      const switchToLightButton = screen.getByRole('button', {
        name: /switch to light mode/i,
      })

      await act(async () => {
        fireEvent.click(switchToLightButton)
      })

      expect(
        screen.getByRole('button', { name: /switch to dark mode/i }),
      ).toBeInTheDocument()
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })
})

const renderHeader = () => {
  return render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>,
  )
} 