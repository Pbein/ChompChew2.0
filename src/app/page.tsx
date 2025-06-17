'use client'

import { useState } from 'react'
import { RecipeSection } from '@/components/recipe/RecipeSection'

interface SimpleSearchData {
  query: string
  dietary: string
}

export default function HomePage() {
  const [searchData, setSearchData] = useState<SimpleSearchData>({
    query: '',
    dietary: ''
  })

  const handleSearch = () => {
    console.log('Searching for:', searchData)
    // TODO: Implement search functionality
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Search Section */}
      <section className="bg-background border-b border-border py-4 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-full shadow-lg border border-border p-2 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center gap-1">
                {/* Main Search Input */}
                <div className="flex-1 px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchData.query}
                    onChange={(e) => setSearchData({ ...searchData, query: e.target.value })}
                    className="w-full text-sm text-foreground placeholder-muted-foreground border-none outline-none bg-transparent"
                  />
                </div>

                <div className="w-px h-8 bg-border"></div>

                {/* Dietary Filter */}
                <div className="px-4 py-2">
                  <select
                    value={searchData.dietary}
                    onChange={(e) => setSearchData({ ...searchData, dietary: e.target.value })}
                    className="text-sm text-foreground border-none outline-none bg-transparent cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
                  >
                    <option value="">Any diet</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="keto">Keto</option>
                  </select>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Discovery Section */}
      <RecipeSection className="py-16 px-4 bg-muted/30" />
                  
      {/* Rebuild Progress Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="bg-card rounded-lg shadow-sm border border-border p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                🏗️ Rebuild in Progress
              </h2>
              <p className="text-foreground mb-4">
                We&apos;re systematically rebuilding ChompChew with:
              </p>
              <ul className="text-left text-foreground space-y-2">
                <li>✅ Testing infrastructure setup complete</li>
                <li>✅ Feature backup preserved (27 features)</li>
                <li>✅ Mission-aligned header navigation</li>
                <li>✅ Recipe cards with horizontal categories</li>
                <li>✅ Enhanced visual design and user experience</li>
                <li>✅ Component testing with 26 passing tests</li>
                <li>🔄 Phase 1: Finalizing foundation components</li>
              </ul>
              <div className="mt-6 text-sm text-muted-foreground">
                Phase 0: Complete ✅ | Phase 1: Foundation - 90% Complete 🔄
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}