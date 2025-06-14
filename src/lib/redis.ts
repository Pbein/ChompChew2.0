import { Redis } from '@upstash/redis'

// Validate required environment variables
const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

if (!redisUrl || !redisToken) {
  throw new Error('Missing required Redis environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
}

// Create Redis client instance
export const redis = Redis.fromEnv()

// Redis key prefixes for organization
export const REDIS_KEYS = {
  // User caching
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  USER_FAVORITES: (userId: string) => `user:favorites:${userId}`,
  USER_RECIPES: (userId: string) => `user:recipes:${userId}`,
  
  // Recipe caching
  RECIPE: (recipeId: string) => `recipe:${recipeId}`,
  RECIPE_REVIEWS: (recipeId: string) => `recipe:reviews:${recipeId}`,
  POPULAR_RECIPES: 'recipes:popular',
  RECENT_RECIPES: 'recipes:recent',
  
  // Search caching
  SEARCH_RESULTS: (query: string, filters: string) => `search:${query}:${filters}`,
  SEARCH_SUGGESTIONS: (query: string) => `search:suggestions:${query}`,
  
  // Rate limiting
  RATE_LIMIT: (identifier: string, window: string) => `rate_limit:${identifier}:${window}`,
  API_RATE_LIMIT: (userId: string, endpoint: string) => `api:rate_limit:${userId}:${endpoint}`,
  
  // Recipe generation caching
  AI_RECIPE_GENERATION: (hash: string) => `ai:recipe:${hash}`,
  
  // Session and temporary data
  USER_SESSION: (sessionId: string) => `session:${sessionId}`,
  TEMP_DATA: (key: string) => `temp:${key}`,
  
  // Analytics and counters
  DAILY_ACTIVE_USERS: (date: string) => `analytics:dau:${date}`,
  RECIPE_VIEWS: (recipeId: string) => `analytics:recipe_views:${recipeId}`,
} as const

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 3600,    // 1 hour
  LONG: 86400,     // 24 hours
  VERY_LONG: 604800, // 7 days
} as const

// Utility functions for common caching patterns
export class RedisCache {
  
  /**
   * Get cached data with JSON parsing
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data as T | null
    } catch (error) {
      console.error('Redis GET error:', error)
      return null
    }
  }

  /**
   * Set cached data with JSON serialization and TTL
   */
  static async set(key: string, value: unknown, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Redis SET error:', error)
      return false
    }
  }

  /**
   * Delete cached data
   */
  static async del(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error('Redis DEL error:', error)
      return false
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  static async delPattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
      return true
    } catch (error) {
      console.error('Redis DEL pattern error:', error)
      return false
    }
  }

  /**
   * Increment counter with expiration
   */
  static async incr(key: string, ttl: number = CACHE_TTL.MEDIUM): Promise<number> {
    try {
      const count = await redis.incr(key)
      if (count === 1) {
        // Set expiration only on first increment
        await redis.expire(key, ttl)
      }
      return count
    } catch (error) {
      console.error('Redis INCR error:', error)
      return 0
    }
  }

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const exists = await redis.exists(key)
      return exists === 1
    } catch (error) {
      console.error('Redis EXISTS error:', error)
      return false
    }
  }

  /**
   * Get multiple keys at once
   */
  static async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      if (keys.length === 0) return []
      const values = await redis.mget(...keys)
      return values.map(value => value as T | null)
    } catch (error) {
      console.error('Redis MGET error:', error)
      return new Array(keys.length).fill(null)
    }
  }

  /**
   * Add item to set
   */
  static async sadd(key: string, member: string): Promise<boolean> {
    try {
      await redis.sadd(key, member)
      return true
    } catch (error) {
      console.error('Redis SADD error:', error)
      return false
    }
  }

  /**
   * Check if item is in set
   */
  static async sismember(key: string, member: string): Promise<boolean> {
    try {
      const isMember = await redis.sismember(key, member)
      return isMember === 1
    } catch (error) {
      console.error('Redis SISMEMBER error:', error)
      return false
    }
  }

  /**
   * Remove item from set
   */
  static async srem(key: string, member: string): Promise<boolean> {
    try {
      await redis.srem(key, member)
      return true
    } catch (error) {
      console.error('Redis SREM error:', error)
      return false
    }
  }
}

// Rate limiting utilities
export class RateLimiter {
  
  /**
   * Check rate limit using sliding window
   */
  static async checkRateLimit(
    identifier: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const key = REDIS_KEYS.RATE_LIMIT(identifier, windowSeconds.toString())
      const now = Date.now()
      const windowStart = now - windowSeconds * 1000

      // Clean old entries and count current requests
      await redis.zremrangebyscore(key, 0, windowStart)
      const currentCount = await redis.zcard(key)

      if (currentCount >= limit) {
        const resetTime = Math.ceil((windowStart + windowSeconds * 1000) / 1000)
        return {
          allowed: false,
          remaining: 0,
          resetTime
        }
      }

      // Add current request
      await redis.zadd(key, { score: now, member: now.toString() })
      await redis.expire(key, windowSeconds)

      return {
        allowed: true,
        remaining: limit - currentCount - 1,
        resetTime: Math.ceil((now + windowSeconds * 1000) / 1000)
      }
    } catch (error) {
      console.error('Rate limit check error:', error)
      // Fail open - allow request if Redis is down
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: Math.ceil((Date.now() + windowSeconds * 1000) / 1000)
      }
    }
  }

  /**
   * Simple rate limiting for API endpoints
   */
  static async checkApiRateLimit(
    userId: string,
    endpoint: string,
    limit: number = 100,
    windowSeconds: number = 3600
  ) {
    const key = REDIS_KEYS.API_RATE_LIMIT(userId, endpoint)
    return this.checkRateLimit(key, limit, windowSeconds)
  }
} 