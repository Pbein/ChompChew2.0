'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface PersonalizedDiscoveryCTAProps {
  className?: string
}

export function PersonalizedDiscoveryCTA({ className }: PersonalizedDiscoveryCTAProps) {
  return (
    <section className={cn("w-full relative overflow-hidden", className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }} />
      </div>

      <div className="container mx-auto px-md max-w-[1200px] relative z-10">
        <div className="grid lg:grid-cols-2 gap-xl items-center">
          {/* Left Column: Preview Cards */}
          <div className="relative">
            <div className="text-center lg:text-left mb-lg">
              <h2 className="font-display text-h1 font-bold mb-md text-gray-900">
                Your Personalized Recipe Feed
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover recipes tailored to your taste preferences, dietary needs, and cooking style. 
                Our AI learns from your interactions to serve you better recommendations every day.
              </p>
            </div>

            {/* Preview Recipe Cards - Stacked */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative w-80 h-64">
                {/* Card 3 - Background */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-lg transform rotate-6 opacity-60">
                  <div className="p-6 h-full flex flex-col">
                    <div className="w-full h-32 bg-gray-200 rounded-xl mb-4" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>

                {/* Card 2 - Middle */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-lg transform rotate-3 opacity-80">
                  <div className="p-6 h-full flex flex-col">
                    <div className="w-full h-32 bg-accent/20 rounded-xl mb-4 flex items-center justify-center">
                      <span className="text-2xl">🥗</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs bg-accent/20 text-accent-dark px-2 py-1 rounded">✅ Healthy</span>
                        <span className="text-xs bg-primary/20 text-primary-dark px-2 py-1 rounded">96% Match</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 1 - Foreground */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="p-6 h-full flex flex-col">
                    <div className="w-full h-32 bg-primary/20 rounded-xl mb-4 flex items-center justify-center">
                      <span className="text-3xl">🍲</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Thai Coconut Curry</h3>
                      <p className="text-sm text-gray-600 mb-3">Creamy coconut curry with fresh vegetables</p>
                      <div className="flex gap-2 mb-3">
                        <span className="text-xs bg-accent/20 text-accent-dark px-2 py-1 rounded">✅ Vegan</span>
                        <span className="text-xs bg-primary/20 text-primary-dark px-2 py-1 rounded font-semibold">94% Match</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>⏱️ 25 min</span>
                        <span>👥 4 servings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: CTA Actions */}
          <div className="text-center lg:text-left">
            <div className="space-y-lg">
              <div className="space-y-md">
                <h3 className="text-h2 font-bold text-gray-900">
                  Ready to get started?
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Set up your preferences once and discover recipes that match your lifestyle perfectly.
                </p>
              </div>

              <div className="space-y-md">
                <Button 
                  size="lg" 
                  className="w-full lg:w-auto bg-primary hover:bg-primary-dark text-white font-semibold px-xl py-lg"
                >
                  🎯 Create Your Recipe Feed
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="w-full lg:w-auto border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-xl py-lg"
                >
                  👀 Preview Sample Feed
                </Button>
              </div>

              {/* Features List */}
              <div className="space-y-sm text-left lg:text-left">
                <div className="flex items-center gap-md">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-dark text-sm">✓</span>
                  </div>
                  <span className="text-base text-gray-600">Learns from your preferences</span>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-dark text-sm">✓</span>
                  </div>
                  <span className="text-base text-gray-600">Adapts to dietary restrictions</span>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-dark text-sm">✓</span>
                  </div>
                  <span className="text-base text-gray-600">Gets better with every interaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 