import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock environment variables first
vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://test-redis.upstash.io')
vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')

// Mock the Upstash Redis client
const mockRedis = {
  get: vi.fn(),
  setex: vi.fn(),
  del: vi.fn(),
  exists: vi.fn(),
  incr: vi.fn(),
  expire: vi.fn(),
  keys: vi.fn(),
  mget: vi.fn(),
  sadd: vi.fn(),
  sismember: vi.fn(),
  srem: vi.fn(),
  zadd: vi.fn(),
  zremrangebyscore: vi.fn(),
  zcard: vi.fn(),
  zrange: vi.fn()
}

vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: vi.fn(() => mockRedis)
  }
}))

// Import after mocking
const { RedisCache, RateLimiter, REDIS_KEYS, CACHE_TTL } = await import('@/lib/redis')

describe('Redis Infrastructure Services - Real Implementation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Redis Key Patterns', () => {
    it('should generate correct user cache keys', () => {
      const userId = '123'
      
      expect(REDIS_KEYS.USER_PROFILE(userId)).toBe('user:profile:123')
      expect(REDIS_KEYS.USER_FAVORITES(userId)).toBe('user:favorites:123')
      expect(REDIS_KEYS.USER_RECIPES(userId)).toBe('user:recipes:123')
    })

    it('should generate correct recipe cache keys', () => {
      const recipeId = 'recipe-456'
      
      expect(REDIS_KEYS.RECIPE(recipeId)).toBe('recipe:recipe-456')
      expect(REDIS_KEYS.RECIPE_REVIEWS(recipeId)).toBe('recipe:reviews:recipe-456')
      expect(REDIS_KEYS.POPULAR_RECIPES).toBe('recipes:popular')
    })

    it('should generate correct rate limit keys', () => {
      const identifier = '192.168.1.1'
      const window = '3600'
      
      expect(REDIS_KEYS.RATE_LIMIT(identifier, window)).toBe('rate_limit:192.168.1.1:3600')
      expect(REDIS_KEYS.API_RATE_LIMIT('user-123', '/api/recipes')).toBe('api:rate_limit:user-123:/api/recipes')
    })

    it('should have appropriate cache TTL constants', () => {
      expect(CACHE_TTL.SHORT).toBe(300)     // 5 minutes
      expect(CACHE_TTL.MEDIUM).toBe(3600)   // 1 hour
      expect(CACHE_TTL.LONG).toBe(86400)    // 24 hours
      expect(CACHE_TTL.VERY_LONG).toBe(604800) // 7 days
    })
  })

  describe('RedisCache Class', () => {
    it('should get cached data', async () => {
      const testData = { id: '123', name: 'Test User' }
      mockRedis.get.mockResolvedValue(testData)

      const result = await RedisCache.get('test-key')

      expect(result).toEqual(testData)
      expect(mockRedis.get).toHaveBeenCalledWith('test-key')
    })

    it('should handle get errors gracefully', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis connection failed'))

      const result = await RedisCache.get('test-key')

      expect(result).toBeNull()
      expect(mockRedis.get).toHaveBeenCalledWith('test-key')
    })

    it('should set cached data with TTL', async () => {
      const testData = { id: '123', name: 'Test User' }
      mockRedis.setex.mockResolvedValue('OK')

      const result = await RedisCache.set('test-key', testData, CACHE_TTL.MEDIUM)

      expect(result).toBe(true)
      expect(mockRedis.setex).toHaveBeenCalledWith('test-key', CACHE_TTL.MEDIUM, JSON.stringify(testData))
    })

    it('should handle set errors gracefully', async () => {
      mockRedis.setex.mockRejectedValue(new Error('Redis connection failed'))

      const result = await RedisCache.set('test-key', { data: 'test' })

      expect(result).toBe(false)
    })

    it('should delete cached data', async () => {
      mockRedis.del.mockResolvedValue(1)

      const result = await RedisCache.del('test-key')

      expect(result).toBe(true)
      expect(mockRedis.del).toHaveBeenCalledWith('test-key')
    })

    it('should delete keys by pattern', async () => {
      mockRedis.keys.mockResolvedValue(['user:123:profile', 'user:123:favorites'])
      mockRedis.del.mockResolvedValue(2)

      const result = await RedisCache.delPattern('user:123:*')

      expect(result).toBe(true)
      expect(mockRedis.keys).toHaveBeenCalledWith('user:123:*')
      expect(mockRedis.del).toHaveBeenCalledWith('user:123:profile', 'user:123:favorites')
    })

    it('should increment counters with expiration', async () => {
      mockRedis.incr.mockResolvedValue(1)
      mockRedis.expire.mockResolvedValue(1)

      const result = await RedisCache.incr('counter-key', CACHE_TTL.SHORT)

      expect(result).toBe(1)
      expect(mockRedis.incr).toHaveBeenCalledWith('counter-key')
      expect(mockRedis.expire).toHaveBeenCalledWith('counter-key', CACHE_TTL.SHORT)
    })

    it('should check if key exists', async () => {
      mockRedis.exists.mockResolvedValue(1)

      const result = await RedisCache.exists('test-key')

      expect(result).toBe(true)
      expect(mockRedis.exists).toHaveBeenCalledWith('test-key')
    })

    it('should get multiple keys at once', async () => {
      const keys = ['key1', 'key2', 'key3']
      const values = ['value1', 'value2', null]
      mockRedis.mget.mockResolvedValue(values)

      const result = await RedisCache.mget(keys)

      expect(result).toEqual(values)
      expect(mockRedis.mget).toHaveBeenCalledWith(...keys)
    })

    it('should handle empty mget gracefully', async () => {
      const result = await RedisCache.mget([])

      expect(result).toEqual([])
      expect(mockRedis.mget).not.toHaveBeenCalled()
    })

    it('should add items to sets', async () => {
      mockRedis.sadd.mockResolvedValue(1)

      const result = await RedisCache.sadd('set-key', 'member')

      expect(result).toBe(true)
      expect(mockRedis.sadd).toHaveBeenCalledWith('set-key', 'member')
    })

    it('should check set membership', async () => {
      mockRedis.sismember.mockResolvedValue(1)

      const result = await RedisCache.sismember('set-key', 'member')

      expect(result).toBe(true)
      expect(mockRedis.sismember).toHaveBeenCalledWith('set-key', 'member')
    })

    it('should remove items from sets', async () => {
      mockRedis.srem.mockResolvedValue(1)

      const result = await RedisCache.srem('set-key', 'member')

      expect(result).toBe(true)
      expect(mockRedis.srem).toHaveBeenCalledWith('set-key', 'member')
    })
  })

  describe('RateLimiter Class', () => {
    it('should check rate limits successfully', async () => {
      const mockTimestamp = Date.now()
      
      // Mock sliding window rate limiter behavior
      mockRedis.zremrangebyscore.mockResolvedValue(0) // No old entries to remove
      mockRedis.zcard.mockResolvedValue(0) // No current requests
      mockRedis.zadd.mockResolvedValue(1) // Add current request
      mockRedis.expire.mockResolvedValue(1)

      const result = await RateLimiter.checkRateLimit('user-123', 100, 3600)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(99)
      expect(result.resetTime).toBeGreaterThan(mockTimestamp / 1000) // resetTime is in seconds
      expect(mockRedis.zremrangebyscore).toHaveBeenCalled()
      expect(mockRedis.zcard).toHaveBeenCalled()
      expect(mockRedis.zadd).toHaveBeenCalled()
    })

    it('should deny requests when rate limit exceeded', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0)
      mockRedis.zcard.mockResolvedValue(100) // At limit

      const result = await RateLimiter.checkRateLimit('user-123', 100, 3600)

      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(mockRedis.zadd).not.toHaveBeenCalled() // Should not add when at limit
    })

    it('should handle rate limiter errors gracefully', async () => {
      mockRedis.zremrangebyscore.mockRejectedValue(new Error('Redis connection failed'))

      const result = await RateLimiter.checkRateLimit('user-123', 100, 3600)

      expect(result.allowed).toBe(true) // Should allow when Redis is down (fail-open)
      expect(result.remaining).toBe(99) // limit - 1
    })

    it('should check API rate limits', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0)
      mockRedis.zcard.mockResolvedValue(4) // 4 existing requests
      mockRedis.zadd.mockResolvedValue(1)
      mockRedis.expire.mockResolvedValue(1)

      const result = await RateLimiter.checkApiRateLimit('user-123', '/api/recipes', 100, 3600)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(95) // 100 - 4 - 1
      expect(mockRedis.zremrangebyscore).toHaveBeenCalled()
      expect(mockRedis.zcard).toHaveBeenCalled()
    })
  })

  describe('Cache Integration Scenarios', () => {
    it('should handle user profile caching workflow', async () => {
      const userId = 'user-123'
      const userProfile = {
        id: userId,
        name: 'John Doe',
        preferences: ['vegetarian'],
        allergens: ['nuts']
      }

      mockRedis.get.mockResolvedValue(null) // Cache miss
      mockRedis.setex.mockResolvedValue('OK')

      // Simulate cache miss and set
      const cachedProfile = await RedisCache.get(REDIS_KEYS.USER_PROFILE(userId))
      expect(cachedProfile).toBeNull()

      await RedisCache.set(REDIS_KEYS.USER_PROFILE(userId), userProfile, CACHE_TTL.MEDIUM)

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'user:profile:user-123',
        CACHE_TTL.MEDIUM,
        JSON.stringify(userProfile)
      )
    })

    it('should handle recipe search caching workflow', async () => {
      const searchQuery = 'chicken pasta'
      const filters = 'vegetarian=true'
      const searchResults = [
        { id: 'recipe-1', title: 'Veggie Chicken Pasta' },
        { id: 'recipe-2', title: 'Creamy Chicken Alfredo' }
      ]

      mockRedis.get.mockResolvedValue(null)
      mockRedis.setex.mockResolvedValue('OK')

      // Use a simple cache key pattern instead of non-existent SEARCH_RESULTS function
      const cacheKey = `search:${searchQuery}:${filters}`
      
      await RedisCache.set(cacheKey, searchResults, CACHE_TTL.SHORT)

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'search:chicken pasta:vegetarian=true',
        CACHE_TTL.SHORT,
        JSON.stringify(searchResults)
      )
    })

    it('should handle cache invalidation after user updates', async () => {
      const userId = 'user-123'
      
      mockRedis.keys.mockResolvedValue([
        'user:profile:user-123',
        'user:favorites:user-123',
        'user:recipes:user-123'
      ])
      mockRedis.del.mockResolvedValue(3)

      const result = await RedisCache.delPattern(`user:${userId}:*`)

      expect(result).toBe(true)
      expect(mockRedis.keys).toHaveBeenCalledWith('user:user-123:*')
      expect(mockRedis.del).toHaveBeenCalledWith(
        'user:profile:user-123',
        'user:favorites:user-123',
        'user:recipes:user-123'
      )
    })
  })
}) 