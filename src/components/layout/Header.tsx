'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { createClientComponentClient } from '@/lib/supabase'
import { ThemeToggleCompact } from '@/components/ui/ThemeToggle'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClientComponentClient()

  // Check authentication status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border bg-gradient-to-r from-primary/10 via-background to-secondary/10 backdrop-blur-md supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-primary/5 supports-[backdrop-filter]:via-background/90 supports-[backdrop-filter]:to-secondary/5 shadow-lg shadow-muted/20",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left Side */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-90 transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-200 group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-lg">🍴</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">
              ChompChew
            </span>
          </Link>

          {/* Center Navigation - Core User Journey */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/generate-recipe" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm"
            >
              <span>✨</span>
              <span>Generate Recipe</span>
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-200 group-hover:w-[calc(100%-24px)] rounded-full"></span>
            </Link>
            <Link 
              href="/saved-recipes" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm"
            >
              <span>💾</span>
              <span>Saved Recipes</span>
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-200 group-hover:w-[calc(100%-24px)] rounded-full"></span>
            </Link>
            <Link 
              href="/dietary-needs" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm"
            >
              <span>🛡️</span>
              <span>Dietary Needs</span>
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-200 group-hover:w-[calc(100%-24px)] rounded-full"></span>
            </Link>
          </nav>

          {/* Right Side - User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggleCompact />
            {!loading && (
              <>
                {user ? (
                  // Authenticated user options
                  <>
            <Link href="/profile">
                                    <Button
                        variant="ghost"
                        size="md"
                        className="font-semibold hover:bg-muted/60 hover:shadow-sm transition-all duration-200 text-foreground hover:text-primary"
                      >
                        Profile
                      </Button>
            </Link>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={handleSignOut}
                      className="font-semibold hover:bg-muted/60 hover:shadow-sm transition-all duration-200 text-foreground hover:text-primary"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  // Unauthenticated user options
                  <>
                    <Link href="/auth/signin">
                      <Button
                        variant="ghost"
                        size="md"
                        className="font-semibold hover:bg-muted/60 hover:shadow-sm transition-all duration-200 text-foreground hover:text-primary"
                      >
                        Sign In
                      </Button>
                    </Link>
            <Link href="/auth/signup">
              <Button
                variant="primary"
                size="md"
                className="font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 hover:scale-105 border-0"
              >
                Get Started
              </Button>
            </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "md:hidden p-2 rounded-lg hover:bg-muted/60 hover:shadow-sm transition-all duration-200",
              "min-h-touch min-w-touch flex items-center justify-center"
            )}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={cn(
                "block w-5 h-0.5 bg-foreground transition-all duration-300 rounded-full",
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              )} />
              <span className={cn(
                "block w-5 h-0.5 bg-foreground mt-1.5 transition-all duration-300 rounded-full",
                isMobileMenuOpen ? "opacity-0" : ""
              )} />
              <span className={cn(
                "block w-5 h-0.5 bg-foreground mt-1.5 transition-all duration-300 rounded-full",
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              )} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-gradient-to-b from-background/95 to-muted/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200 shadow-lg shadow-muted/20">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {/* Core Navigation */}
              <Link
                href="/generate-recipe"
                className="block px-4 py-3 text-base font-semibold text-foreground hover:text-primary hover:bg-muted/60 hover:shadow-sm rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span>✨</span>
                  <span>Generate Recipe</span>
                </div>
              </Link>
              <Link
                href="/saved-recipes"
                className="block px-4 py-3 text-base font-semibold text-foreground hover:text-primary hover:bg-muted/60 hover:shadow-sm rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span>💾</span>
                  <span>Saved Recipes</span>
                </div>
              </Link>
              <Link
                href="/dietary-needs"
                className="block px-4 py-3 text-base font-semibold text-foreground hover:text-primary hover:bg-muted/60 hover:shadow-sm rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span>🛡️</span>
                  <span>Dietary Needs</span>
                </div>
              </Link>
              
              {/* Theme Toggle */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-base font-semibold text-foreground">Theme</span>
                  <ThemeToggleCompact />
                </div>
              </div>

              {/* Auth Buttons */}
              {!loading && (
              <div className="pt-4 space-y-3 border-t border-border">
                  {user ? (
                    // Authenticated user options
                    <>
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start font-semibold text-foreground hover:text-primary hover:bg-muted/60"
                  >
                    Profile
                  </Button>
                </Link>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={handleSignOut}
                        className="w-full justify-start font-semibold text-foreground hover:text-primary hover:bg-muted/60"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    // Unauthenticated user options
                    <>
                      <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full justify-start font-semibold text-foreground hover:text-primary hover:bg-muted/60"
                        >
                          Sign In
                        </Button>
                      </Link>
                <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-start font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    Get Started
                  </Button>
                </Link>
                    </>
                  )}
              </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 