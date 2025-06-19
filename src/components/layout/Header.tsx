"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { createClientComponentClient } from "@/lib/supabase";
import { ThemeToggleCompact } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();

  // Check authentication status
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 shadow-sm",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left Side */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-all duration-200 group flex-shrink-0"
          >
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-xl group-hover:shadow-accent/30 transition-all duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-lg">🍴</span>
            </div>
            <span className="font-bold text-xl text-accent drop-shadow-sm lg:inline md:hidden sm:inline">
              ChompChew
            </span>
          </Link>

          {/* Center Navigation - Core User Journey */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            <Link
              href="/generate-recipe"
              className="text-sm font-semibold text-foreground hover:text-secondary transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm"
            >
              <span>✨</span>
              <span>Generate Recipe</span>
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-secondary transition-all duration-200 group-hover:w-[calc(100%-24px)] rounded-full"></span>
            </Link>
            <Link
              href="/saved-recipes"
              className="text-sm font-semibold text-foreground hover:text-secondary transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm"
            >
              <span>💾</span>
              <span>Saved Recipes</span>
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-secondary transition-all duration-200 group-hover:w-[calc(100%-24px)] rounded-full"></span>
            </Link>
            <Link
              href="/dietary-needs"
              className="text-sm font-semibold text-foreground hover:text-secondary transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm"
            >
              <span>🛡️</span>
              <span>Dietary Needs</span>
              <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-secondary transition-all duration-200 group-hover:w-[calc(100%-24px)] rounded-full"></span>
            </Link>
          </nav>

          {/* Compact Navigation for medium screens - Better centered */}
          <nav className="hidden md:flex lg:hidden items-center space-x-4 flex-1 justify-center">
            <Link
              href="/generate-recipe"
              className="text-sm font-semibold text-foreground hover:text-secondary transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm whitespace-nowrap"
            >
              <span>✨</span>
              <span>Generate Recipe</span>
            </Link>
            <Link
              href="/saved-recipes"
              className="text-sm font-semibold text-foreground hover:text-secondary transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm whitespace-nowrap"
            >
              <span>💾</span>
              <span>Saved Recipes</span>
            </Link>
            <Link
              href="/dietary-needs"
              className="text-sm font-semibold text-foreground hover:text-secondary transition-colors duration-200 relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm whitespace-nowrap"
            >
              <span>🛡️</span>
              <span>Dietary Needs</span>
            </Link>
          </nav>

          {/* Right Side - User Actions (only for large screens) */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            <ThemeToggleCompact />
            {!loading && (
              <>
                {user ? (
                  // Authenticated user options
                  <>
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm font-semibold text-foreground hover:text-secondary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm whitespace-nowrap"
                      >
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-sm font-semibold text-foreground hover:text-secondary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-muted/60 hover:shadow-sm whitespace-nowrap"
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
                        size="sm"
                        className="font-semibold hover:bg-muted/60 hover:shadow-sm transition-all duration-200 text-foreground hover:text-primary px-3 whitespace-nowrap"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button
                        variant="primary"
                        size="sm"
                        className="font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 hover:scale-105 border-0 px-3 whitespace-nowrap"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button - shows at medium screens and below */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "lg:hidden p-2 rounded-lg hover:bg-muted/60 hover:shadow-sm transition-all duration-200 flex-shrink-0",
              "min-h-touch min-w-touch flex items-center justify-center"
            )}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={cn(
                  "block w-5 h-0.5 bg-foreground transition-all duration-300 rounded-full",
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                )}
              />
              <span
                className={cn(
                  "block w-5 h-0.5 bg-foreground mt-1.5 transition-all duration-300 rounded-full",
                  isMobileMenuOpen ? "opacity-0" : ""
                )}
              />
              <span
                className={cn(
                  "block w-5 h-0.5 bg-foreground mt-1.5 transition-all duration-300 rounded-full",
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden relative z-50 border-t border-border bg-card/98 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200 shadow-xl shadow-black/10 mb-6">
            <div className="px-4 pt-4 pb-6 space-y-1 max-h-[60vh] overflow-y-auto">
              {/* Core Navigation */}
              <div className="space-y-1 mb-4">
                <Link
                  href="/generate-recipe"
                  className="block px-4 py-3 text-base font-semibold text-card-foreground hover:text-primary hover:bg-primary/10 hover:shadow-sm rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">✨</span>
                    <span>Generate Recipe</span>
                  </div>
                </Link>
                <Link
                  href="/saved-recipes"
                  className="block px-4 py-3 text-base font-semibold text-card-foreground hover:text-primary hover:bg-primary/10 hover:shadow-sm rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💾</span>
                    <span>Saved Recipes</span>
                  </div>
                </Link>
                <Link
                  href="/dietary-needs"
                  className="block px-4 py-3 text-base font-semibold text-card-foreground hover:text-primary hover:bg-primary/10 hover:shadow-sm rounded-lg transition-all duration-200 border border-transparent hover:border-primary/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🛡️</span>
                    <span>Dietary Needs</span>
                  </div>
                </Link>
              </div>

              {/* Theme Toggle Section */}
              <div className="py-3 border-t border-border/50 border-b border-border/50 mb-4">
                <div className="flex items-center justify-between px-4 py-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🎨</span>
                    <span className="text-base font-semibold text-card-foreground">Theme</span>
                  </div>
                  <ThemeToggleCompact />
                </div>
              </div>

              {/* User Account Section */}
              {!loading && (
                <div className="space-y-2 pb-2">
                  <div className="px-4 py-1">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account</h3>
                  </div>
                  {user ? (
                    // Authenticated user options
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full justify-start font-semibold text-card-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200 py-3 px-4 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">👤</span>
                            <span>Profile Settings</span>
                          </div>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={handleSignOut}
                        className="w-full justify-start font-semibold text-card-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-800/50 transition-all duration-200 py-3 px-4 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🚪</span>
                          <span>Sign Out</span>
                        </div>
                      </Button>
                    </div>
                  ) : (
                    // Unauthenticated user options
                    <div className="space-y-2">
                      <Link
                        href="/auth/signin"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full justify-start font-semibold text-card-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200 py-3 px-4 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">🔑</span>
                            <span>Sign In</span>
                          </div>
                        </Button>
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full justify-start font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 border-0 py-3 px-4 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">🚀</span>
                            <span>Get Started</span>
                          </div>
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
