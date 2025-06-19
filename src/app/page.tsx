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
                  className="bg-accent hover:bg-accent/90 text-accent-foreground p-2 rounded-full transition-all duration-200 hover:scale-105"
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
                  
      {/* Project Information Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="bg-card rounded-lg shadow-sm border border-border p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                🍽️ About ChompChew
              </h2>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
                <p className="text-blue-800 dark:text-blue-200 text-lg font-medium mb-2">
                  AI-Powered Recipe Discovery for Dietary Safety
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  Modern web application built with safety-first architecture for users with dietary restrictions and health conditions
                </p>
              </div>

              {/* Feature Completion Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-foreground mb-2">🏗️ Foundation & Architecture</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ Modern Next.js 15 + TypeScript setup</li>
                    <li>✅ Comprehensive testing infrastructure</li>
                    <li>✅ Dark mode & theme system</li>
                    <li>✅ Component library integration</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-foreground mb-2">🔍 Recipe Discovery</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ Enhanced recipe cards with safety validation</li>
                    <li>✅ Horizontal category navigation</li>
                    <li>✅ Fallback recipe system (13 recipes)</li>
                    <li>✅ Responsive grid layout</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-foreground mb-2">📱 Recipe Detail Pages</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ Client-side rendered with loading states</li>
                    <li>✅ Mobile-optimized layout order</li>
                    <li>✅ Interactive ingredients checklist</li>
                    <li>✅ Comprehensive error handling</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-foreground mb-2">🤖 AI Recipe Generation</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ OpenAI integration with prompt engineering</li>
                    <li>✅ Image generation service</li>
                    <li>✅ Safety validation pipeline</li>
                    <li>✅ Database integration for saving</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-foreground mb-2">👤 User Management</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ Profile management system</li>
                    <li>✅ Allergen tracking</li>
                    <li>✅ Macro target sliders</li>
                    <li>✅ Dietary preference selection</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-foreground mb-2">🔒 Security & Safety</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ Safety validation service</li>
                    <li>✅ Authentication system</li>
                    <li>✅ Rate limiting</li>
                    <li>✅ Input validation & sanitization</li>
                  </ul>
                </div>
              </div>

              {/* Technical Metrics */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">📊 Technical Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">229</div>
                    <div className="text-sm text-muted-foreground">Tests Passing</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">25</div>
                    <div className="text-sm text-muted-foreground">Test Suites</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">87%</div>
                    <div className="text-sm text-muted-foreground">Test Coverage</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">33</div>
                    <div className="text-sm text-muted-foreground">Components</div>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground mb-3">🛠️ Technology Stack</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong className="text-foreground">Frontend:</strong>
                      <div className="text-muted-foreground">Next.js 15, TypeScript, Tailwind CSS</div>
                    </div>
                    <div>
                      <strong className="text-foreground">Backend:</strong>
                      <div className="text-muted-foreground">Supabase, PostgreSQL, NextAuth</div>
                    </div>
                    <div>
                      <strong className="text-foreground">AI & Services:</strong>
                      <div className="text-muted-foreground">OpenAI GPT-4, Upstash Redis</div>
                    </div>
                    <div>
                      <strong className="text-foreground">Testing:</strong>
                      <div className="text-muted-foreground">Vitest, Playwright, React Testing Library</div>
                    </div>
                    <div>
                      <strong className="text-foreground">UI/UX:</strong>
                      <div className="text-muted-foreground">shadcn/ui, Responsive Design, Dark Mode</div>
                    </div>
                    <div>
                      <strong className="text-foreground">DevOps:</strong>
                      <div className="text-muted-foreground">GitHub Actions, Continuous Integration</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground text-sm">
                  <strong>Mission:</strong> Reducing daily &quot;What can I actually eat?&quot; anxiety through personalized, 
                  AI-powered recipe discovery that respects dietary needs and restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}