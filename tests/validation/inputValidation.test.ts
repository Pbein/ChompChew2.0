import { describe, it, expect } from 'vitest'
import { aiRecipeSchema, ingredientSchema } from '@/lib/validators'
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

describe('Input Validation & Sanitization', () => {
  describe('Recipe Input Validation - Real Validators', () => {
    it('should validate recipe with real aiRecipeSchema', () => {
      const validRecipe = {
        title: 'Chocolate Chip Cookies',
        description: 'Delicious homemade cookies',
        ingredients: [
          { name: 'flour', quantity: '2', unit: 'cups' },
          { name: 'sugar', quantity: '1', unit: 'cup' }
        ],
        instructions: [
          'Preheat oven to 350°F (175°C) and grease a baking sheet.',
          'In a large bowl, mix flour, sugar, and baking powder.'
        ],
        prep_time: 15,
        cook_time: 25,
        servings: 12,
        difficulty: 'easy' as const
      }

      const result = aiRecipeSchema.safeParse(validRecipe)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.title).toBe('Chocolate Chip Cookies')
        expect(result.data.ingredients).toHaveLength(2)
        expect(result.data.instructions).toHaveLength(2)
      }
    })

    it('should reject invalid recipe with real aiRecipeSchema', () => {
      const invalidRecipe = {
        title: '', // Empty title should fail
        ingredients: [], // Empty ingredients should fail
        instructions: [], // Empty instructions should fail
        prep_time: -5, // Negative time should fail
      }

      const result = aiRecipeSchema.safeParse(invalidRecipe)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message)
        expect(errors.some(error => error.includes('ingredient'))).toBe(true)
        expect(errors.some(error => error.includes('instruction'))).toBe(true)
        expect(errors.some(error => error.includes('negative'))).toBe(true)
      }
    })

    it('should validate ingredients with real ingredientSchema', () => {
      const validIngredient = {
        name: 'flour',
        quantity: '2',
        unit: 'cups'
      }

      const result = ingredientSchema.safeParse(validIngredient)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.name).toBe('flour')
        expect(result.data.quantity).toBe('2')
        expect(result.data.unit).toBe('cups')
      }
    })

    it('should reject invalid ingredients with real ingredientSchema', () => {
      const invalidIngredient = {
        name: '', // Empty name should fail
        quantity: '2',
        unit: 'cups'
      }

      const result = ingredientSchema.safeParse(invalidIngredient)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Ingredient name cannot be empty')
      }
    })

    it('should handle optional fields in ingredientSchema', () => {
      const minimalValidIngredient = {
        name: 'salt'
        // quantity and unit are optional
      }

      const result = ingredientSchema.safeParse(minimalValidIngredient)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.name).toBe('salt')
        expect(result.data.quantity).toBeUndefined()
        expect(result.data.unit).toBeUndefined()
      }
    })
  })

  describe('User Input Sanitization', () => {
    it('should sanitize HTML content for XSS prevention', () => {
      const maliciousInput = '<script>alert("xss")</script><p>Safe content</p>'
      const sanitized = DOMPurify.sanitize(maliciousInput)
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert')
      expect(sanitized).toContain('<p>Safe content</p>')
    })

    it('should preserve safe HTML content', () => {
      const safeInput = '<p>This is <strong>safe</strong> content with <em>emphasis</em></p>'
      const sanitized = DOMPurify.sanitize(safeInput)
      
      expect(sanitized).toBe(safeInput)
    })

    it('should remove dangerous attributes', () => {
      const dangerousInput = '<img src="test.jpg" onerror="alert(\'xss\')" />'
      const sanitized = DOMPurify.sanitize(dangerousInput)
      
      expect(sanitized).not.toContain('onerror')
      expect(sanitized).not.toContain('alert')
      expect(sanitized).toContain('src="test.jpg"')
    })
  })

  describe('Search Query Validation', () => {
    const searchQuerySchema = z.string()
      .min(1, 'Search query cannot be empty')
      .max(100, 'Search query too long')
      .regex(/^[a-zA-Z0-9\s\-',.()&]+$/, 'Search query contains invalid characters')

    it('should validate safe search queries', () => {
      const validQueries = [
        'chocolate chip cookies',
        'pasta with cheese',
        "mom's recipe",
        'quick & easy meals'
      ]

      validQueries.forEach(query => {
        const result = searchQuerySchema.safeParse(query)
        expect(result.success).toBe(true)
      })
    })

    it('should reject unsafe search queries', () => {
      const invalidQueries = [
        '',
        '<script>alert("xss")</script>',
        'query with | pipes',
        'A'.repeat(101) // Too long
      ]

      invalidQueries.forEach(query => {
        const result = searchQuerySchema.safeParse(query)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('Email Validation with Zod', () => {
    const emailSchema = z.string().email('Invalid email format')

    it('should validate correct email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.email+tag@domain.co.uk',
        'user123@test-domain.org'
      ]

      validEmails.forEach(email => {
        const result = emailSchema.safeParse(email)
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user space@domain.com'
      ]

      invalidEmails.forEach(email => {
        const result = emailSchema.safeParse(email)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('Allergen Validation', () => {
    const allergenSchema = z.array(z.string().min(1)).max(20, 'Too many allergens selected')

    it('should validate allergen arrays', () => {
      const validAllergens = ['nuts', 'dairy', 'gluten']
      const result = allergenSchema.safeParse(validAllergens)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validAllergens)
      }
    })

    it('should reject invalid allergen data', () => {
      const tooManyAllergens = Array(21).fill('allergen')
      const result = allergenSchema.safeParse(tooManyAllergens)
      
      expect(result.success).toBe(false)
    })
  })

  describe('Dietary Preferences Validation', () => {
    const dietaryPrefsSchema = z.object({
      diet: z.string().optional(),
      embraceFoods: z.array(z.string()).optional(),
      avoidFoods: z.array(z.string()).optional(),
      calorieGoal: z.number().int().min(500).max(5000).optional(),
      macros: z.object({
        protein: z.number().min(0).max(100).optional(),
        carbs: z.number().min(0).max(100).optional(),
        fat: z.number().min(0).max(100).optional()
      }).optional()
    })

    it('should validate dietary preferences', () => {
      const validPrefs = {
        diet: 'vegetarian',
        embraceFoods: ['vegetables', 'fruits'],
        avoidFoods: ['meat'],
        calorieGoal: 2000,
        macros: {
          protein: 20,
          carbs: 50,
          fat: 30
        }
      }

      const result = dietaryPrefsSchema.safeParse(validPrefs)
      expect(result.success).toBe(true)
    })

    it('should reject invalid calorie goals', () => {
      const invalidPrefs = {
        calorieGoal: 100 // Too low
      }

      const result = dietaryPrefsSchema.safeParse(invalidPrefs)
      expect(result.success).toBe(false)
    })
  })

  describe('File Upload Validation', () => {
    const fileUploadSchema = z.object({
      name: z.string().min(1, 'Filename required'),
      size: z.number().max(5 * 1024 * 1024, 'File too large (max 5MB)'),
      type: z.string().regex(/^image\/(jpeg|jpg|png|webp)$/, 'Invalid file type')
    })

    it('should validate proper image uploads', () => {
      const validFile = {
        name: 'recipe-image.jpg',
        size: 1024 * 1024, // 1MB
        type: 'image/jpeg'
      }

      const result = fileUploadSchema.safeParse(validFile)
      expect(result.success).toBe(true)
    })

    it('should reject invalid file uploads', () => {
      const invalidFiles = [
        { name: '', size: 1000, type: 'image/jpeg' }, // Empty name
        { name: 'test.jpg', size: 10 * 1024 * 1024, type: 'image/jpeg' }, // Too large
        { name: 'test.txt', size: 1000, type: 'text/plain' } // Wrong type
      ]

      invalidFiles.forEach(file => {
        const result = fileUploadSchema.safeParse(file)
        expect(result.success).toBe(false)
      })
    })
  })
}) 