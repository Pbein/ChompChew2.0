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
      "sticky top-0 z-50 w-full border-b border-emerald-200/30 bg-gradient-to-r from-emerald-50 via-white to-teal-50 backdrop-blur-md supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-emerald-50/90 supports-[backdrop-filter]:via-white/90 supports-[backdrop-filter]:to-teal-50/90 shadow-lg shadow-emerald-100/20",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left Side */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-90 transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200/50 group-hover:shadow-xl group-hover:shadow-emerald-300/50 transition-all duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-lg">🍴</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-700 to-teal-800 bg-clip-text text-transparent drop-shadow-sm">
              ChompChew
            </span>
          </Link>

          {/* Center Navigation - Core User Journey */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/search" 
              className="text-sm font-semibold text-gray-800 hover:text-emerald-700 transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/60 hover:shadow-sm"
            >
              <span>🔍</span>
              <span>Find Recipes</span>
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-200 group-hover:w-[calc(100%-24px)] rounded-full"></span>
            </Link>
            <Link 
              href="/dietary-needs" 
              className="text-sm font-semibold text-gray-800 hover:text-emerald-700 transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/60 hover:shadow-sm"
            >
              <span>🛡️</span>
              <span>My Dietary Needs</span>
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-200 group-hover:w-[calc(100%-24px)] rounded-full"></span>
            </Link>
            <Link 
              href="/saved-recipes" 
              className="text-sm font-semibold text-gray-800 hover:text-emerald-700 transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/60 hover:shadow-sm"
            >
              <span>💾</span>
              <span>Saved Recipes</span>
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-200 group-hover:w-[calc(100%-24px)] rounded-full"></span>
            </Link>
          </nav>

          {/* Right Side - User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Quick Access to Safety Settings */}
            <button className="p-2 rounded-lg hover:bg-white/60 hover:shadow-sm transition-all duration-200 text-gray-700 hover:text-emerald-700 hover:scale-105" title="Quick Safety Check">
              <span className="text-lg">⚠️</span>
            </button>
            
            {/* User Profile/Auth */}
            <Link href="/profile">
              <Button
                variant="ghost"
                size="md"
                className="font-semibold hover:bg-white/60 hover:shadow-sm transition-all duration-200 text-gray-800 hover:text-emerald-700"
              >
                Profile
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                variant="primary"
                size="md"
                className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-200 hover:scale-105 border-0"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "md:hidden p-2 rounded-lg hover:bg-white/60 hover:shadow-sm transition-all duration-200",
              "min-h-touch min-w-touch flex items-center justify-center"
            )}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={cn(
                "block w-5 h-0.5 bg-gray-700 transition-all duration-300 rounded-full",
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              )} />
              <span className={cn(
                "block w-5 h-0.5 bg-gray-700 mt-1.5 transition-all duration-300 rounded-full",
                isMobileMenuOpen ? "opacity-0" : ""
              )} />
              <span className={cn(
                "block w-5 h-0.5 bg-gray-700 mt-1.5 transition-all duration-300 rounded-full",
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              )} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-200/50 bg-gradient-to-b from-white/95 to-emerald-50/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200 shadow-lg shadow-emerald-100/20">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {/* Core Navigation */}
              <Link
                href="/search"
                className="block px-4 py-3 text-base font-semibold text-gray-800 hover:text-emerald-700 hover:bg-white/60 hover:shadow-sm rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span>🔍</span>
                  <span>Find Recipes</span>
                </div>
              </Link>
              <Link
                href="/dietary-needs"
                className="block px-4 py-3 text-base font-semibold text-gray-800 hover:text-emerald-700 hover:bg-white/60 hover:shadow-sm rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span>🛡️</span>
                  <span>My Dietary Needs</span>
                </div>
              </Link>
              <Link
                href="/saved-recipes"
                className="block px-4 py-3 text-base font-semibold text-gray-800 hover:text-emerald-700 hover:bg-white/60 hover:shadow-sm rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span>💾</span>
                  <span>Saved Recipes</span>
                </div>
              </Link>
              
              {/* Safety Quick Access */}
              <button
                className="block w-full px-4 py-3 text-base font-semibold text-gray-800 hover:text-emerald-700 hover:bg-white/60 hover:shadow-sm rounded-lg transition-all duration-200 text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span>⚠️</span>
                  <span>Safety Check</span>
                </div>
              </button>
              
              {/* Auth Buttons */}
              <div className="pt-4 space-y-3 border-t border-emerald-200/50">
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start font-semibold text-gray-800 hover:text-emerald-700 hover:bg-white/60"
                  >
                    Profile
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-start font-semibold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-200/50"
                  >
                    Get Started
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