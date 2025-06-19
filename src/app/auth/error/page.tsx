'use client'

import { Suspense } from 'react'
import Link from 'next/link'

function AuthErrorContent() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            There was a problem with authentication. This is likely due to missing configuration.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
} 