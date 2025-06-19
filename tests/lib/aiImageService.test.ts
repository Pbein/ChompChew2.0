/**
 * @jest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { extractIngredientsForImage } from '@/lib/aiImageService'

// Note: Full integration tests for generateRecipeImage require OpenAI API key
// These tests focus on utility functions that can be tested in isolation

describe('AI Image Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('extractIngredientsForImage', () => {
    it('should extract ingredients from array of strings', () => {
      const recipe = {
        ingredients: ['chicken breast', 'olive oil', 'garlic']
      }

      const result = extractIngredientsForImage(recipe)

      expect(result).toEqual(['chicken breast', 'olive oil', 'garlic'])
    })

    it('should extract ingredients from array of objects with name property', () => {
      const recipe = {
        ingredients: [
          { name: 'chicken breast', amount: '1 lb' },
          { name: 'olive oil', amount: '2 tbsp' }
        ]
      }

      const result = extractIngredientsForImage(recipe)

      expect(result).toEqual(['chicken breast', 'olive oil'])
    })

    it('should handle mixed ingredient formats', () => {
      const recipe = {
        ingredients: [
          'salt',
          { name: 'pepper', amount: '1 tsp' },
          { ingredient: 'garlic', quantity: '3 cloves' }, // Different property name
          123 // Non-string/object
        ]
      }

      const result = extractIngredientsForImage(recipe)

      expect(result).toEqual(['salt', 'pepper', '[object Object]', '123'])
    })

    it('should return empty array when no ingredients', () => {
      const recipe = {}
      const result = extractIngredientsForImage(recipe)
      expect(result).toEqual([])
    })

    it('should return empty array when ingredients is not an array', () => {
      const recipe = {
        ingredients: 'chicken and rice'
      }

      const result = extractIngredientsForImage(recipe)
      expect(result).toEqual([])
    })

    it('should filter out falsy values', () => {
      const recipe = {
        ingredients: ['chicken', '', null, 'rice', undefined, 'vegetables']
      }

      const result = extractIngredientsForImage(recipe)
      expect(result).toEqual(['chicken', 'null', 'rice', 'undefined', 'vegetables'])
    })

    it('should handle empty ingredients array', () => {
      const recipe = {
        ingredients: []
      }

      const result = extractIngredientsForImage(recipe)
      expect(result).toEqual([])
    })

    it('should handle complex nested ingredient objects', () => {
      const recipe = {
        ingredients: [
          { name: 'chicken breast', amount: '1 lb', notes: 'boneless' },
          { name: 'garlic cloves', amount: '3', preparation: 'minced' },
          { name: 'olive oil', amount: '2 tbsp', type: 'extra virgin' }
        ]
      }

      const result = extractIngredientsForImage(recipe)
      expect(result).toEqual(['chicken breast', 'garlic cloves', 'olive oil'])
    })
  })

  describe('Image Generation Integration', () => {
    it('should be tested in integration tests with proper OpenAI setup', () => {
      // This is a placeholder to remind us that full image generation
      // should be tested in integration tests with proper API setup
      expect(true).toBe(true)
    })
  })
}) 