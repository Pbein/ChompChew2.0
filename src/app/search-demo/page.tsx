'use client'

import React from 'react'
import { SmartSemanticSearch, SearchQuery } from '@/components/search'

export default function SearchDemoPage() {
  const handleSearch = (query: SearchQuery) => {
    console.log('Search executed with query:', query)
    
    // Here you would typically navigate to results or trigger search
    alert(`Search executed! Check console for structured query. Found ${Object.values(query).flat().length} filters.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍽️ Smart Semantic Search Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                         Try typing natural language queries like <strong>&ldquo;chicken paleo no dairy dinner&rdquo;</strong> and watch how the system intelligently categorizes each term.
          </p>
        </div>

        {/* Search Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <SmartSemanticSearch
            onSearch={handleSearch}
            autoFocus={true}
            className="w-full"
          />
        </div>

        {/* Instructions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🎯 Try These Examples
            </h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-gray-50 rounded font-mono">
                chicken paleo no dairy dinner
              </div>
              <div className="p-2 bg-gray-50 rounded font-mono">
                quick italian pasta under 30 minutes
              </div>
              <div className="p-2 bg-gray-50 rounded font-mono">
                vegan breakfast without gluten
              </div>
              <div className="p-2 bg-gray-50 rounded font-mono">
                salmon grilled mediterranean lunch
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ✨ How It Works
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">1.</span>
                Type your search naturally
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">2.</span>
                System suggests categories for each term
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">3.</span>
                Click suggestions to confirm or press Enter
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">4.</span>
                See your filters as colored chips
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">5.</span>
                Click Search to execute structured query
              </li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🚀 Features Implemented
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Smart Parsing</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Natural language input</li>
                <li>• Real-time token parsing</li>
                <li>• Confidence scoring</li>
                <li>• Exclusion detection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Category Detection</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• 🥕 Ingredients</li>
                <li>• 🚫 Exclusions</li>
                <li>• 🥗 Diets</li>
                <li>• 🍽️ Meal types</li>
                <li>• 🌍 Cuisines</li>
                <li>• ⏱️ Time constraints</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">User Experience</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Visual confirmation</li>
                <li>• Editable chips</li>
                <li>• Keyboard shortcuts</li>
                <li>• Structured output</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 