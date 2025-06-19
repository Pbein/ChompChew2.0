'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const

  return (
    <div className="relative">
      <div className="flex items-center bg-muted rounded-lg p-1 shadow-sm border border-border">
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200",
              "hover:bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              theme === value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={`Switch to ${label.toLowerCase()} theme`}
            aria-label={`Switch to ${label.toLowerCase()} theme`}
          >
            <Icon className="w-4 h-4" />
            {theme === value && (
              <div className="absolute inset-0 bg-primary/10 rounded-md animate-pulse" />
            )}
          </button>
        ))}
      </div>
      
      {/* Current theme indicator */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border border-border shadow-sm">
          {resolvedTheme === 'dark' ? '🌙' : '☀️'}
        </span>
      </div>
    </div>
  )
}

export function ThemeToggleCompact() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Fix hydration error by only rendering after client mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    // Simple toggle between light and dark (skip system for toggle simplicity)
    if (theme === 'light' || (theme === 'system' && resolvedTheme === 'light')) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  const isDark = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')

  // Don't render anything until mounted on client
  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Theme</span>
        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 border border-gray-300">
          <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-md border border-gray-300 translate-x-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-foreground">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
      <button
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border",
          isDark ? "bg-blue-500 border-blue-600" : "bg-gray-200 border-gray-300"
        )}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Currently ${isDark ? 'dark' : 'light'} mode - click to toggle`}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-md border border-gray-300",
            isDark ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  )
}

// Version with label for mobile menu
export function ThemeToggleWithLabel() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Fix hydration error by only rendering after client mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    // Simple toggle between light and dark (skip system for toggle simplicity)
    if (theme === 'light' || (theme === 'system' && resolvedTheme === 'light')) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  const isDark = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')

  // Don't render anything until mounted on client
  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold text-card-foreground">Theme</span>
        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 border border-gray-300">
          <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-md border border-gray-300 translate-x-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-base font-semibold text-card-foreground">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
      <button
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border",
          isDark ? "bg-blue-500 border-blue-600" : "bg-gray-200 border-gray-300"
        )}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-md border border-gray-300",
            isDark ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  )
} 