import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Pact, Matchers } from '@pact-js/pact'
import { createServerComponentClient } from '@/lib/supabase-server'

const { like, eachLike, term } = Matchers

describe('Supabase API Contract Tests', () => {
  let provider: Pact

  beforeAll(() => {
    provider = new Pact({
      consumer: 'ChompChew-Frontend',
      provider: 'Supabase-Backend',
      port: 3001,
      log: './tests/logs/pact.log',
      dir: './tests/pacts',
      logLevel: 'INFO'
    })
    
    return provider.setup()
  })

  afterAll(() => {
    return provider.finalize()
  })

  describe('User Operations Contract', () => {
    it('should get user profile with valid structure', async () => {
      await provider
        .given('user exists with ID 123')
        .uponReceiving('a request for user profile')
        .withRequest({
          method: 'GET',
          path: '/rest/v1/users',
          query: 'id=eq.123&select=*',
          headers: {
            'apikey': like('mock-api-key'),
            'Authorization': like('Bearer mock-token'),
            'Content-Type': 'application/json'
          }
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: eachLike({
            id: like('123'),
            email: like('user@example.com'),
            full_name: like('Test User'),
            dietary_preferences: like(['vegetarian']),
            allergens: like(['nuts']),
            cooking_level: term({ generate: 'intermediate', matcher: 'beginner|intermediate|advanced' }),
            created_at: like('2024-01-01T00:00:00.000Z'),
            updated_at: like('2024-01-01T00:00:00.000Z')
          })
        })

      return provider.verify()
    })

    it('should create user with required fields', async () => {
      const newUser = {
        email: 'newuser@example.com',
        full_name: 'New User',
        dietary_preferences: ['vegan'],
        allergens: ['dairy'],
        cooking_level: 'beginner'
      }

      await provider
        .given('user does not exist')
        .uponReceiving('a request to create user')
        .withRequest({
          method: 'POST',
          path: '/rest/v1/users',
          headers: {
            'apikey': like('mock-api-key'),
            'Authorization': like('Bearer mock-token'),
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: like(newUser)
        })
        .willRespondWith({
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          },
          body: like({
            ...newUser,
            id: like('new-user-id'),
            created_at: like('2024-01-01T00:00:00.000Z'),
            updated_at: like('2024-01-01T00:00:00.000Z')
          })
        })

      return provider.verify()
    })
  })

  describe('Recipe Operations Contract', () => {
    it('should fetch recipes with pagination', async () => {
      await provider
        .given('recipes exist in database')
        .uponReceiving('a request for paginated recipes')
        .withRequest({
          method: 'GET',
          path: '/rest/v1/recipes',
          query: 'select=*&limit=10&offset=0&order=created_at.desc',
          headers: {
            'apikey': like('mock-api-key'),
            'Authorization': like('Bearer mock-token'),
            'Content-Type': 'application/json'
          }
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Content-Range': like('0-9/100')
          },
          body: eachLike({
            id: like('recipe-123'),
            title: like('Delicious Recipe'),
            description: like('A tasty recipe description'),
            ingredients: eachLike({
              name: like('flour'),
              amount: like(2),
              unit: like('cups')
            }),
            instructions: eachLike({
              step: like(1),
              instruction: like('Mix ingredients together')
            }),
            prep_time: like(15),
            cook_time: like(30),
            servings: like(4),
            difficulty: term({ generate: 'easy', matcher: 'easy|medium|hard' }),
            cuisine_type: like('Italian'),
            dietary_tags: like(['vegetarian']),
            calories_per_serving: like(350),
            is_public: like(true),
            created_at: like('2024-01-01T00:00:00.000Z')
          })
        })

      return provider.verify()
    })

    it('should save recipe to user favorites', async () => {
      await provider
        .given('user exists and recipe exists')
        .uponReceiving('a request to save recipe to favorites')
        .withRequest({
          method: 'POST',
          path: '/rest/v1/saved_recipes',
          headers: {
            'apikey': like('mock-api-key'),
            'Authorization': like('Bearer mock-token'),
            'Content-Type': 'application/json'
          },
          body: like({
            user_id: like('user-123'),
            recipe_id: like('recipe-456'),
            saved_at: like('2024-01-01T00:00:00.000Z')
          })
        })
        .willRespondWith({
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          },
          body: like({
            id: like('saved-recipe-id'),
            user_id: like('user-123'),
            recipe_id: like('recipe-456'),
            saved_at: like('2024-01-01T00:00:00.000Z')
          })
        })

      return provider.verify()
    })
  })

  describe('Error Handling Contract', () => {
    it('should handle authentication errors properly', async () => {
      await provider
        .given('invalid authentication token')
        .uponReceiving('a request with invalid auth')
        .withRequest({
          method: 'GET',
          path: '/rest/v1/users',
          headers: {
            'apikey': like('mock-api-key'),
            'Authorization': 'Bearer invalid-token',
            'Content-Type': 'application/json'
          }
        })
        .willRespondWith({
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          },
          body: like({
            message: like('Invalid JWT'),
            code: like('PGRST301')
          })
        })

      return provider.verify()
    })

    it('should handle resource not found errors', async () => {
      await provider
        .given('user does not exist')
        .uponReceiving('a request for non-existent user')
        .withRequest({
          method: 'GET',
          path: '/rest/v1/users',
          query: 'id=eq.non-existent&select=*',
          headers: {
            'apikey': like('mock-api-key'),
            'Authorization': like('Bearer valid-token'),
            'Content-Type': 'application/json'
          }
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: []
        })

      return provider.verify()
    })
  })
}) 