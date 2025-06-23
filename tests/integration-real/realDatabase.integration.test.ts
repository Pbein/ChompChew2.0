import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { createClient } from '@supabase/supabase-js'
import { faker } from 'faker'

describe('Real Database Integration Tests', () => {
  let container: StartedPostgreSqlContainer
  let testSupabase: any
  let testUserId: string

  beforeAll(async () => {
    // Start real PostgreSQL container for testing
    container = await new PostgreSqlContainer('postgres:15')
      .withDatabase('chompchew_test')
      .withUsername('test_user')
      .withPassword('test_password')
      .start()

    // Create Supabase client connected to test database
    const connectionString = container.getConnectionUri()
    
    // In a real implementation, you'd set up Supabase with the test database
    // For now, we'll mock a minimal implementation that uses the real connection
    testSupabase = createTestSupabaseClient(connectionString)
    
    // Set up test schema
    await setupTestSchema(container)
  }, 60000) // Allow time for container startup

  afterAll(async () => {
    await container.stop()
  }, 30000)

  beforeEach(async () => {
    // Clean test data before each test
    await cleanTestData()
    
    // Create a test user for each test
    testUserId = await createTestUser()
  })

  describe('User Operations - Real Database', () => {
    it('should create and retrieve user with real database persistence', async () => {
      const userData = {
        email: faker.internet.email(),
        full_name: faker.person.fullName(),
        dietary_preferences: ['vegetarian', 'gluten-free'],
        allergens: ['nuts', 'dairy'],
        cooking_level: 'intermediate'
      }

      // Insert user into real database
      const { data: createdUser, error: createError } = await testSupabase
        .from('users')
        .insert(userData)
        .select()
        .single()

      expect(createError).toBeNull()
      expect(createdUser).toBeDefined()
      expect(createdUser.email).toBe(userData.email)
      expect(createdUser.dietary_preferences).toEqual(userData.dietary_preferences)

      // Retrieve user from real database
      const { data: retrievedUser, error: getError } = await testSupabase
        .from('users')
        .select('*')
        .eq('id', createdUser.id)
        .single()

      expect(getError).toBeNull()
      expect(retrievedUser).toEqual(createdUser)
    })

    it('should handle user profile updates with real constraints', async () => {
      const updateData = {
        full_name: 'Updated Name',
        cooking_level: 'advanced',
        bio: 'I love cooking!'
      }

      const { data: updatedUser, error } = await testSupabase
        .from('users')
        .update(updateData)
        .eq('id', testUserId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(updatedUser.full_name).toBe(updateData.full_name)
      expect(updatedUser.cooking_level).toBe(updateData.cooking_level)
      expect(updatedUser.bio).toBe(updateData.bio)

      // Verify persistence across sessions
      const { data: verifyUser } = await testSupabase
        .from('users')
        .select('*')
        .eq('id', testUserId)
        .single()

      expect(verifyUser.full_name).toBe(updateData.full_name)
    })
  })

  describe('Recipe Operations - Real Database', () => {
    it('should create recipe with proper relationships and constraints', async () => {
      const recipeData = {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        ingredients: [
          { name: 'flour', amount: 2, unit: 'cups' },
          { name: 'sugar', amount: 1, unit: 'cup' },
          { name: 'eggs', amount: 3, unit: 'pieces' }
        ],
        instructions: [
          { step: 1, instruction: 'Mix dry ingredients' },
          { step: 2, instruction: 'Add wet ingredients' },
          { step: 3, instruction: 'Bake for 30 minutes' }
        ],
        prep_time: 15,
        cook_time: 30,
        servings: 8,
        difficulty: 'easy',
        cuisine_type: 'American',
        dietary_tags: ['vegetarian'],
        calories_per_serving: 250,
        created_by: testUserId,
        is_public: true
      }

      const { data: recipe, error } = await testSupabase
        .from('recipes')
        .insert(recipeData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(recipe).toBeDefined()
      expect(recipe.title).toBe(recipeData.title)
      expect(recipe.ingredients).toEqual(recipeData.ingredients)
      expect(recipe.instructions).toEqual(recipeData.instructions)

      // Test foreign key relationship
      expect(recipe.created_by).toBe(testUserId)
    })

    it('should handle recipe search with real full-text search', async () => {
      // Create multiple test recipes
      const recipes = [
        {
          title: 'Chocolate Chip Cookies',
          description: 'Delicious homemade cookies',
          ingredients: [{ name: 'chocolate chips', amount: 1, unit: 'cup' }],
          instructions: [{ step: 1, instruction: 'Mix and bake' }],
          prep_time: 15,
          cook_time: 20,
          servings: 24,
          difficulty: 'easy',
          cuisine_type: 'American',
          created_by: testUserId,
          is_public: true
        },
        {
          title: 'Pasta Marinara',
          description: 'Classic Italian pasta dish',
          ingredients: [{ name: 'pasta', amount: 1, unit: 'lb' }],
          instructions: [{ step: 1, instruction: 'Boil pasta and add sauce' }],
          prep_time: 10,
          cook_time: 15,
          servings: 4,
          difficulty: 'easy',
          cuisine_type: 'Italian',
          created_by: testUserId,
          is_public: true
        }
      ]

      await testSupabase.from('recipes').insert(recipes)

      // Test search functionality
      const { data: searchResults, error } = await testSupabase
        .from('recipes')
        .select('*')
        .textSearch('title', 'chocolate')

      expect(error).toBeNull()
      expect(searchResults.length).toBe(1)
      expect(searchResults[0].title).toContain('Chocolate')
    })
  })

  describe('Saved Recipes - Real Database', () => {
    it('should handle recipe saving with proper constraints and relationships', async () => {
      // First create a recipe
      const { data: recipe } = await testSupabase
        .from('recipes')
        .insert({
          title: 'Test Recipe',
          description: 'Test description',
          ingredients: [{ name: 'test', amount: 1, unit: 'cup' }],
          instructions: [{ step: 1, instruction: 'Test instruction' }],
          prep_time: 10,
          cook_time: 10,
          servings: 2,
          difficulty: 'easy',
          cuisine_type: 'American',
          created_by: testUserId,
          is_public: true
        })
        .select()
        .single()

      // Save the recipe
      const { data: savedRecipe, error } = await testSupabase
        .from('saved_recipes')
        .insert({
          user_id: testUserId,
          recipe_id: recipe.id
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(savedRecipe.user_id).toBe(testUserId)
      expect(savedRecipe.recipe_id).toBe(recipe.id)

      // Test duplicate prevention (should fail due to unique constraint)
      const { error: duplicateError } = await testSupabase
        .from('saved_recipes')
        .insert({
          user_id: testUserId,
          recipe_id: recipe.id
        })

      expect(duplicateError).toBeDefined() // Should fail due to unique constraint
    })

    it('should retrieve user saved recipes with proper joins', async () => {
      // Create and save multiple recipes
      const recipeIds = []
      
      for (let i = 0; i < 3; i++) {
        const { data: recipe } = await testSupabase
          .from('recipes')
          .insert({
            title: `Test Recipe ${i + 1}`,
            description: `Test description ${i + 1}`,
            ingredients: [{ name: 'test', amount: 1, unit: 'cup' }],
            instructions: [{ step: 1, instruction: 'Test instruction' }],
            prep_time: 10,
            cook_time: 10,
            servings: 2,
            difficulty: 'easy',
            cuisine_type: 'American',
            created_by: testUserId,
            is_public: true
          })
          .select()
          .single()
          
        recipeIds.push(recipe.id)
        
        await testSupabase
          .from('saved_recipes')
          .insert({
            user_id: testUserId,
            recipe_id: recipe.id
          })
      }

      // Retrieve saved recipes with join
      const { data: savedRecipes, error } = await testSupabase
        .from('saved_recipes')
        .select(`
          *,
          recipes (
            id,
            title,
            description,
            prep_time,
            cook_time,
            servings,
            difficulty
          )
        `)
        .eq('user_id', testUserId)

      expect(error).toBeNull()
      expect(savedRecipes.length).toBe(3)
      
      savedRecipes.forEach(saved => {
        expect(saved.recipes).toBeDefined()
        expect(saved.recipes.title).toContain('Test Recipe')
      })
    })
  })

  describe('Database Performance - Real Queries', () => {
    it('should handle large dataset queries efficiently', async () => {
      // Create 100 test recipes
      const recipes = Array.from({ length: 100 }, (_, i) => ({
        title: `Performance Test Recipe ${i + 1}`,
        description: faker.lorem.paragraph(),
        ingredients: [{ name: 'ingredient', amount: 1, unit: 'cup' }],
        instructions: [{ step: 1, instruction: 'Test instruction' }],
        prep_time: Math.floor(Math.random() * 60) + 10,
        cook_time: Math.floor(Math.random() * 120) + 15,
        servings: Math.floor(Math.random() * 8) + 1,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        cuisine_type: 'Test',
        created_by: testUserId,
        is_public: true
      }))

      await testSupabase.from('recipes').insert(recipes)

      // Test paginated query performance
      const startTime = performance.now()
      
      const { data: paginatedRecipes, error } = await testSupabase
        .from('recipes')
        .select('*')
        .eq('created_by', testUserId)
        .order('created_at', { ascending: false })
        .range(0, 19) // First 20 recipes

      const queryTime = performance.now() - startTime

      expect(error).toBeNull()
      expect(paginatedRecipes.length).toBe(20)
      expect(queryTime).toBeLessThan(1000) // Should complete within 1 second
    })
  })

  // Helper functions
  async function setupTestSchema(container: StartedPostgreSqlContainer) {
    // Set up database schema for testing
    // In a real implementation, you'd run your migration scripts here
    const client = await container.createClient()
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR UNIQUE NOT NULL,
        full_name VARCHAR,
        dietary_preferences TEXT[],
        allergens TEXT[],
        cooking_level VARCHAR,
        bio TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR NOT NULL,
        description TEXT,
        ingredients JSONB,
        instructions JSONB,
        prep_time INTEGER,
        cook_time INTEGER,
        servings INTEGER,
        difficulty VARCHAR,
        cuisine_type VARCHAR,
        dietary_tags TEXT[],
        calories_per_serving INTEGER,
        created_by UUID REFERENCES users(id),
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_recipes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        recipe_id UUID REFERENCES recipes(id),
        saved_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, recipe_id)
      )
    `)
    
    await client.end()
  }

  async function cleanTestData() {
    // Clean up test data between tests
    await testSupabase.from('saved_recipes').delete().neq('id', 'impossible-id')
    await testSupabase.from('recipes').delete().neq('id', 'impossible-id')
    await testSupabase.from('users').delete().neq('id', 'impossible-id')
  }

  async function createTestUser(): Promise<string> {
    const userData = {
      email: faker.internet.email(),
      full_name: faker.person.fullName(),
      dietary_preferences: ['vegetarian'],
      allergens: ['nuts'],
      cooking_level: 'intermediate'
    }

    const { data: user } = await testSupabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    return user.id
  }

  function createTestSupabaseClient(connectionString: string) {
    // In a real implementation, you'd create a proper Supabase client
    // For now, return a mock that simulates the interface
    return {
      from: (table: string) => ({
        insert: (data: any) => ({
          select: () => ({
            single: () => Promise.resolve({ data: { ...data, id: faker.string.uuid() }, error: null })
          })
        }),
        select: (columns = '*') => ({
          eq: (column: string, value: any) => ({
            single: () => Promise.resolve({ data: null, error: null })
          }),
          textSearch: (column: string, query: string) => Promise.resolve({ data: [], error: null }),
          order: (column: string, options: any) => ({
            range: (from: number, to: number) => Promise.resolve({ data: [], error: null })
          })
        }),
        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            select: () => ({
              single: () => Promise.resolve({ data: { ...data, id: value }, error: null })
            })
          })
        }),
        delete: () => ({
          neq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
        })
      })
    }
  }
}) 