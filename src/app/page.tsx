'use client'

import { RecipeSection } from '@/components/recipe/RecipeSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Recipe Discovery Section */}
      <RecipeSection className="py-16 px-4 bg-gray-50" />
                  
      {/* Rebuild Progress Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                🏗️ Rebuild in Progress
              </h2>
              <p className="text-gray-600 mb-4">
                We&apos;re systematically rebuilding ChompChew with:
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>✅ Testing infrastructure setup complete</li>
                <li>✅ Feature backup preserved (27 features)</li>
                <li>✅ Mission-aligned header navigation</li>
                <li>✅ Recipe cards with horizontal categories</li>
                <li>✅ Enhanced visual design and user experience</li>
                <li>✅ Component testing with 26 passing tests</li>
                <li>🔄 Phase 1: Finalizing foundation components</li>
              </ul>
              <div className="mt-6 text-sm text-gray-500">
                Phase 0: Complete ✅ | Phase 1: Foundation - 90% Complete 🔄
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}