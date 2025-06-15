'use client'

import React, { useState } from 'react'

interface SearchData {
  ingredients: string
  dietary: string
  mealType: string
  servings: string
}

interface HeroSearchProps {
  onSearch?: (data: SearchData) => void
  className?: string
}

export function HeroSearch({ onSearch, className }: HeroSearchProps) {
  const [searchData, setSearchData] = useState<SearchData>({
    ingredients: '',
    dietary: '',
    mealType: '',
    servings: ''
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleInputChange = (field: keyof SearchData, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    console.log('Searching with:', searchData)
    onSearch?.(searchData)
  }

  const handleQuickSuggestion = (suggestion: Partial<SearchData>) => {
    setSearchData(prev => ({ ...prev, ...suggestion }))
  }

  const inputFieldClass = (fieldName: string) => `
    text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none w-full font-medium
    transition-all duration-200
    ${focusedField === fieldName ? 'text-gray-900' : ''}
  `

  const fieldContainerClass = (fieldName: string) => `
    flex-1 px-8 py-5 rounded-full cursor-pointer transition-all duration-200 hover:bg-gray-50
    ${focusedField === fieldName ? 'bg-emerald-50 ring-2 ring-emerald-200' : ''}
  `

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      {/* Main Search Container */}
      <div className="bg-white rounded-full shadow-xl border border-gray-100 p-3 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex flex-col md:flex-row">
          {/* Ingredients Field */}
          <div className={fieldContainerClass('ingredients')}>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">
                What ingredients do you have?
              </label>
              <input
                type="text"
                placeholder="e.g., chicken breast, broccoli, quinoa..."
                value={searchData.ingredients}
                onChange={(e) => handleInputChange('ingredients', e.target.value)}
                onFocus={() => setFocusedField('ingredients')}
                onBlur={() => setFocusedField(null)}
                className={inputFieldClass('ingredients')}
              />
            </div>
          </div>

          <div className="hidden md:block w-px bg-gray-300 my-6" />

          {/* Dietary Needs Field */}
          <div className={fieldContainerClass('dietary')}>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">
                Dietary needs
              </label>
              <input
                type="text"
                placeholder="e.g., gluten-free, dairy-free, keto, vegan..."
                value={searchData.dietary}
                onChange={(e) => handleInputChange('dietary', e.target.value)}
                onFocus={() => setFocusedField('dietary')}
                onBlur={() => setFocusedField(null)}
                className={inputFieldClass('dietary')}
              />
            </div>
          </div>

          <div className="hidden md:block w-px bg-gray-300 my-6" />

          {/* Meal Type Field */}
          <div className={fieldContainerClass('mealType')}>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">
                Meal type
              </label>
              <input
                type="text"
                placeholder="e.g., breakfast, lunch, dinner, snack..."
                value={searchData.mealType}
                onChange={(e) => handleInputChange('mealType', e.target.value)}
                onFocus={() => setFocusedField('mealType')}
                onBlur={() => setFocusedField(null)}
                className={inputFieldClass('mealType')}
              />
            </div>
          </div>

          <div className="hidden md:block w-px bg-gray-300 my-6" />

          {/* Servings Field */}
          <div className={fieldContainerClass('servings')}>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">
                Servings
              </label>
              <input
                type="text"
                placeholder="e.g., 2 people, family of 4..."
                value={searchData.servings}
                onChange={(e) => handleInputChange('servings', e.target.value)}
                onFocus={() => setFocusedField('servings')}
                onBlur={() => setFocusedField(null)}
                className={inputFieldClass('servings')}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-center px-3">
            <button
              onClick={handleSearch}
              className="btn-primary h-10 touch-target bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full px-10 py-5 font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-base transform hover:scale-105"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => handleQuickSuggestion({ 
            ingredients: 'chicken breast', 
            dietary: 'high protein', 
            mealType: 'dinner', 
            servings: '2' 
          })}
          className="px-6 py-3 bg-white hover:bg-gray-50 rounded-full text-sm font-semibold text-gray-700 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 hover:border-emerald-200 hover:text-emerald-700"
        >
          🍗 High Protein Dinner
        </button>
        <button
          onClick={() => handleQuickSuggestion({ 
            ingredients: 'vegetables', 
            dietary: 'vegetarian', 
            mealType: 'lunch', 
            servings: '1' 
          })}
          className="px-6 py-3 bg-white hover:bg-gray-50 rounded-full text-sm font-semibold text-gray-700 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 hover:border-emerald-200 hover:text-emerald-700"
        >
          🥗 Vegetarian Lunch
        </button>
        <button
          onClick={() => handleQuickSuggestion({ 
            ingredients: 'eggs', 
            dietary: 'quick', 
            mealType: 'breakfast', 
            servings: '1' 
          })}
          className="px-6 py-3 bg-white hover:bg-gray-50 rounded-full text-sm font-semibold text-gray-700 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 hover:border-emerald-200 hover:text-emerald-700"
        >
          🍳 Quick Breakfast
        </button>
        <button
          onClick={() => handleQuickSuggestion({ 
            ingredients: 'rice flour', 
            dietary: 'gluten-free', 
            mealType: 'any', 
            servings: '4' 
          })}
          className="px-6 py-3 bg-white hover:bg-gray-50 rounded-full text-sm font-semibold text-gray-700 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 hover:border-emerald-200 hover:text-emerald-700"
        >
          🌾 Gluten-Free Options
        </button>
      </div>
    </div>
  )
} 