'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Enhanced Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-xl">🍽️</span>
            </div>
            <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ChompChew
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/generate" 
              className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors duration-200 relative group"
            >
              Generate Recipe
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors duration-200 relative group"
            >
              My Recipes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/explore" 
              className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors duration-200 relative group"
            >
              Explore
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button
                variant="ghost"
                size="md"
                className="font-semibold hover:bg-muted/50 transition-all duration-200"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                variant="primary"
                size="md"
                className="font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "md:hidden p-3 rounded-xl hover:bg-muted/50 transition-all duration-200",
              "min-h-touch min-w-touch flex items-center justify-center"
            )}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={cn(
                "block w-6 h-0.5 bg-foreground transition-all duration-300 rounded-full",
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              )} />
              <span className={cn(
                "block w-6 h-0.5 bg-foreground mt-1.5 transition-all duration-300 rounded-full",
                isMobileMenuOpen ? "opacity-0" : ""
              )} />
              <span className={cn(
                "block w-6 h-0.5 bg-foreground mt-1.5 transition-all duration-300 rounded-full",
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              )} />
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link
                href="/generate"
                className="block px-4 py-3 text-base font-semibold text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span>✨</span>
                  <span>Generate Recipe</span>
                </div>
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-3 text-base font-semibold text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span>📚</span>
                  <span>My Recipes</span>
                </div>
              </Link>
              <Link
                href="/explore"
                className="block px-4 py-3 text-base font-semibold text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span>🔍</span>
                  <span>Explore</span>
                </div>
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-3 border-t border-border/20">
                <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start font-semibold"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-start font-semibold shadow-lg"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 