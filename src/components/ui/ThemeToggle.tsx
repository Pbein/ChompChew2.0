'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getIcon = () => {
    if (theme === 'system') return Monitor
    return resolvedTheme === 'dark' ? Moon : Sun
  }

  const Icon = getIcon()

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "relative flex items-center justify-center w-10 h-10 rounded-lg",
        "bg-muted hover:bg-muted/80 border border-border shadow-sm",
        "transition-all duration-200 hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
      title={`Current: ${theme} theme (click to cycle)`}
      aria-label={`Switch theme (currently ${theme})`}
    >
      <Icon className="w-5 h-5 text-foreground transition-transform duration-200" />
      
      {/* Animated background */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-200" />
      
      {/* Theme indicator dot */}
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background shadow-sm">
        <div className={cn(
          "w-full h-full rounded-full transition-colors duration-200",
          theme === 'light' && "bg-yellow-400",
          theme === 'dark' && "bg-blue-600", 
          theme === 'system' && "bg-gradient-to-br from-yellow-400 to-blue-600"
        )} />
      </div>
    </button>
  )
} 