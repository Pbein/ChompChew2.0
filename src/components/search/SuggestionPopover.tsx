'use client'

import React from 'react'
import { ParsedToken, TokenCategory, CATEGORY_CONFIG } from '@/stores/searchStore'
import { cn } from '@/lib/utils'

interface SuggestionPopoverProps {
  tokens: ParsedToken[]
  onConfirmToken: (tokenIndex: number, category: TokenCategory, label: string) => void
  onClose: () => void
}

export const SuggestionPopover: React.FC<SuggestionPopoverProps> = ({
  tokens,
  onConfirmToken,
  onClose
}) => {
  // Filter tokens that haven't been confirmed yet
  const unconfirmedTokens = tokens.filter(token => !token.confirmed)

  if (unconfirmedTokens.length === 0) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
      <div className="p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Categorize your search terms:
        </div>
        
        {unconfirmedTokens.map((token, tokenIndex) => {
          const originalIndex = tokens.indexOf(token)
          
          return (
                         <div key={`${token.text}-${tokenIndex}`} className="mb-4 last:mb-0">
               <div className="text-sm font-medium text-gray-600 mb-2">
                 &ldquo;{token.text}&rdquo;
               </div>
              
              <div className="space-y-1">
                {token.suggestedCategories.map((suggestion, suggestionIndex) => {
                  const config = CATEGORY_CONFIG[suggestion.category]
                  
                  return (
                    <button
                      key={suggestionIndex}
                      onClick={() => {
                        onConfirmToken(originalIndex, suggestion.category, suggestion.label)
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg border transition-all hover:shadow-sm",
                        "flex items-center justify-between group",
                        config.color,
                        "hover:scale-[1.02]"
                      )}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{config.emoji}</span>
                        <span className="font-medium">{suggestion.label}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-xs opacity-70 mr-2">
                          {Math.round(suggestion.confidence * 100)}% match
                        </span>
                        <div className="w-2 h-2 rounded-full bg-current opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Press Enter to auto-confirm best matches
            </div>
            <button
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 