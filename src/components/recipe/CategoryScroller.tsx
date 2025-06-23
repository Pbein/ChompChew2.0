'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface RecipeCategory {
  id: string
  name: string
  emoji: string
  description?: string
  count?: number
}

interface CategoryScrollerProps {
  categories: RecipeCategory[]
  activeCategory?: string
  onCategorySelect: (categoryId: string) => void
  className?: string
}

export function CategoryScroller({
  categories,
  activeCategory,
  onCategorySelect,
  className
}: CategoryScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons)
      return () => scrollElement.removeEventListener('scroll', checkScrollButtons)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card shadow-lg rounded-full p-2 hover:shadow-xl transition-all duration-200 border border-border"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
      )}

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card shadow-lg rounded-full p-2 hover:shadow-xl transition-all duration-200 border border-border"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      )}

      {/* Fade Gradients */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      )}

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 px-12 [&::-webkit-scrollbar]:hidden"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none'
        }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`
              flex-shrink-0 flex flex-col items-center p-4 rounded-2xl transition-all duration-300 min-w-[120px] group
              ${activeCategory === category.id 
                ? 'bg-secondary text-secondary-foreground shadow-lg transform scale-105' 
                : 'bg-card text-card-foreground hover:bg-card/80 hover:shadow-md border border-border dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted/80 dark:hover:shadow dark:hover:ring-1 dark:hover:ring-secondary/60'
              }
            `}
          >
            <div className={`text-2xl mb-2 transition-transform duration-200 ${
              activeCategory === category.id ? 'scale-110' : 'group-hover:scale-105'
            }`}>
              {category.emoji}
            </div>
            <div className={`text-sm font-semibold mb-1 text-center leading-tight ${
              activeCategory === category.id 
                ? 'text-secondary-foreground' 
                : 'text-foreground dark:text-muted-foreground'
            }`}>
              {category.name}
            </div>
            <div className={`text-xs ${
              activeCategory === category.id 
                ? 'text-secondary-foreground/80' 
                : 'text-muted-foreground'
            }`}>
              {category.count} recipes
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 