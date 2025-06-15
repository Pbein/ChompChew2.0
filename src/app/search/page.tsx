'use client'

import React from 'react'
import { SmartSemanticSearch } from '@/features/search/components/SmartSemanticSearch'

export default function SearchPage() {
  const handleSearch = (searchData: unknown) => {
    console.log('Search executed:', searchData)
    // TODO: Integrate with recipe generation service
    // TODO: Navigate to results or show results on same page
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Recipes You Can Actually Eat
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Use our intelligent search to find recipes that match your ingredients, dietary needs, and preferences. 
              Just type naturally - we&apos;ll understand what you&apos;re looking for.
            </p>
          </div>
        </div>
      </section>

      {/* Smart Search Interface */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SmartSemanticSearch 
              onSearch={handleSearch}
              placeholder="Try: 'chicken paleo no dairy dinner' or 'quick breakfast under 300 calories'"
              className="mb-8"
            />
          </div>
        </div>
      </section>

      {/* Search Tips Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              How to Search Like a Pro
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Natural Language */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Natural Language
                </h3>
                <p className="text-gray-600 text-sm">
                  Type naturally: &quot;chicken dinner for 4 people&quot; or &quot;quick breakfast no gluten&quot;
                </p>
              </div>

              {/* Dietary Needs */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Dietary Restrictions
                </h3>
                <p className="text-gray-600 text-sm">
                  Include restrictions: "keto", "dairy-free", "low sodium", "paleo"
                </p>
              </div>

              {/* Exclusions */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚫</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Exclude Ingredients
                </h3>
                <p className="text-gray-600 text-sm">
                  Use &quot;no&quot; or &quot;without&quot;: &quot;no nuts&quot;, &quot;without dairy&quot;, &quot;avoid shellfish&quot;
                </p>
              </div>

              {/* Meal Types */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Meal Types
                </h3>
                <p className="text-gray-600 text-sm">
                  Specify meals: "breakfast", "lunch", "dinner", "snack", "dessert"
                </p>
              </div>

              {/* Cooking Methods */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍🍳</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cooking Methods
                </h3>
                <p className="text-gray-600 text-sm">
                  Add methods: "grilled", "baked", "one-pot", "no-cook", "slow cooker"
                </p>
              </div>

              {/* Time & Difficulty */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Time & Difficulty
                </h3>
                <p className="text-gray-600 text-sm">
                  Include constraints: "quick", "30 minutes", "easy", "beginner"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Searches */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Try These Example Searches
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  query: "chicken paleo no dairy dinner",
                  description: "Paleo-friendly chicken dinner without dairy"
                },
                {
                  query: "quick breakfast under 300 calories",
                  description: "Fast, low-calorie morning meals"
                },
                {
                  query: "vegetarian pasta comfort food",
                  description: "Hearty vegetarian pasta dishes"
                },
                {
                  query: "keto dessert no artificial sweeteners",
                  description: "Natural keto-friendly sweet treats"
                },
                {
                  query: "one pot mediterranean fish",
                  description: "Easy Mediterranean fish dishes"
                },
                {
                  query: "gluten free pizza family dinner",
                  description: "Family-friendly gluten-free pizza options"
                }
              ].map((example, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    // TODO: Pre-fill search with example query
                    console.log('Example clicked:', example.query)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-mono text-emerald-700 font-medium mb-1">
                        "{example.query}"
                      </p>
                      <p className="text-gray-600 text-sm">
                        {example.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 