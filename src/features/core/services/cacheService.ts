import { RedisCache, REDIS_KEYS, CACHE_TTL } from '@/lib/redis'
import { Recipe, UserProfile } from '@/features/core/types/database'

export class CacheService {
  
  // User Profile Caching
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const key = REDIS_KEYS.USER_PROFILE(userId)
    return RedisCache.get<UserProfile>(key)
  }

  static async setUserProfile(userId: string, profile: UserProfile): Promise<void> {
    const key = REDIS_KEYS.USER_PROFILE(userId)
    await RedisCache.set(key, profile, CACHE_TTL.LONG)
  }

  static async invalidateUserProfile(userId: string): Promise<void> {
    const key = REDIS_KEYS.USER_PROFILE(userId)
    await RedisCache.del(key)
  }

  // User Favorites Caching
  static async getUserFavorites(userId: string): Promise<unknown[] | null> {
    const key = REDIS_KEYS.USER_FAVORITES(userId)
    return RedisCache.get<unknown[]>(key)
  }

  static async setUserFavorites(userId: string, favorites: unknown[]): Promise<void> {
    const key = REDIS_KEYS.USER_FAVORITES(userId)
    await RedisCache.set(key, favorites, CACHE_TTL.MEDIUM)
  }

  static async invalidateUserFavorites(userId: string): Promise<void> {
    const key = REDIS_KEYS.USER_FAVORITES(userId)
    await RedisCache.del(key)
  }

  // Recipe Caching
  static async getRecipe(recipeId: string): Promise<Recipe | null> {
    const key = REDIS_KEYS.RECIPE(recipeId)
    return RedisCache.get<Recipe>(key)
  }

  static async setRecipe(recipeId: string, recipe: Recipe): Promise<void> {
    const key = REDIS_KEYS.RECIPE(recipeId)
    await RedisCache.set(key, recipe, CACHE_TTL.LONG)
  }

  static async invalidateRecipe(recipeId: string): Promise<void> {
    const key = REDIS_KEYS.RECIPE(recipeId)
    await RedisCache.del(key)
  }

  // Recipe Reviews Caching
  static async getRecipeReviews(recipeId: string): Promise<unknown[] | null> {
    const key = REDIS_KEYS.RECIPE_REVIEWS(recipeId)
    return RedisCache.get<unknown[]>(key)
  }

  static async setRecipeReviews(recipeId: string, reviews: unknown[]): Promise<void> {
    const key = REDIS_KEYS.RECIPE_REVIEWS(recipeId)
    await RedisCache.set(key, reviews, CACHE_TTL.MEDIUM)
  }

  static async invalidateRecipeReviews(recipeId: string): Promise<void> {
    const key = REDIS_KEYS.RECIPE_REVIEWS(recipeId)
    await RedisCache.del(key)
  }

  // Popular and Recent Recipes
  static async getPopularRecipes(): Promise<Recipe[] | null> {
    return RedisCache.get<Recipe[]>(REDIS_KEYS.POPULAR_RECIPES)
  }

  static async setPopularRecipes(recipes: Recipe[]): Promise<void> {
    await RedisCache.set(REDIS_KEYS.POPULAR_RECIPES, recipes, CACHE_TTL.MEDIUM)
  }

  static async getRecentRecipes(): Promise<Recipe[] | null> {
    return RedisCache.get<Recipe[]>(REDIS_KEYS.RECENT_RECIPES)
  }

  static async setRecentRecipes(recipes: Recipe[]): Promise<void> {
    await RedisCache.set(REDIS_KEYS.RECENT_RECIPES, recipes, CACHE_TTL.SHORT)
  }

  // Search Results Caching
  static async getSearchResults(query: string, filters: Record<string, unknown> = {}): Promise<Recipe[] | null> {
    const filtersString = JSON.stringify(filters)
    const key = REDIS_KEYS.SEARCH_RESULTS(query, filtersString)
    return RedisCache.get<Recipe[]>(key)
  }

  static async setSearchResults(
    query: string, 
    filters: Record<string, unknown> = {}, 
    results: Recipe[]
  ): Promise<void> {
    const filtersString = JSON.stringify(filters)
    const key = REDIS_KEYS.SEARCH_RESULTS(query, filtersString)
    await RedisCache.set(key, results, CACHE_TTL.SHORT)
  }

  // Search Suggestions Caching
  static async getSearchSuggestions(query: string): Promise<string[] | null> {
    const key = REDIS_KEYS.SEARCH_SUGGESTIONS(query)
    return RedisCache.get<string[]>(key)
  }

  static async setSearchSuggestions(query: string, suggestions: string[]): Promise<void> {
    const key = REDIS_KEYS.SEARCH_SUGGESTIONS(query)
    await RedisCache.set(key, suggestions, CACHE_TTL.LONG)
  }

  // AI Recipe Generation Caching
  static async getAIRecipe(promptHash: string): Promise<Recipe | null> {
    const key = REDIS_KEYS.AI_RECIPE_GENERATION(promptHash)
    return RedisCache.get<Recipe>(key)
  }

  static async setAIRecipe(promptHash: string, recipe: Recipe): Promise<void> {
    const key = REDIS_KEYS.AI_RECIPE_GENERATION(promptHash)
    await RedisCache.set(key, recipe, CACHE_TTL.VERY_LONG)
  }

  // Analytics Caching
  static async incrementRecipeViews(recipeId: string): Promise<number> {
    const key = REDIS_KEYS.RECIPE_VIEWS(recipeId)
    return RedisCache.incr(key, CACHE_TTL.LONG)
  }

  static async getRecipeViews(recipeId: string): Promise<number> {
    const key = REDIS_KEYS.RECIPE_VIEWS(recipeId)
    const views = await RedisCache.get<number>(key)
    return views || 0
  }

  static async incrementDailyActiveUsers(date: string): Promise<number> {
    const key = REDIS_KEYS.DAILY_ACTIVE_USERS(date)
    return RedisCache.incr(key, CACHE_TTL.VERY_LONG)
  }

  // Session Management
  static async setUserSession(sessionId: string, sessionData: unknown): Promise<void> {
    const key = REDIS_KEYS.USER_SESSION(sessionId)
    await RedisCache.set(key, sessionData, CACHE_TTL.LONG)
  }

  static async getUserSession(sessionId: string): Promise<unknown | null> {
    const key = REDIS_KEYS.USER_SESSION(sessionId)
    return RedisCache.get<unknown>(key)
  }

  static async deleteUserSession(sessionId: string): Promise<void> {
    const key = REDIS_KEYS.USER_SESSION(sessionId)
    await RedisCache.del(key)
  }

  // Temporary Data Storage
  static async setTempData(key: string, data: unknown, ttl: number = CACHE_TTL.SHORT): Promise<void> {
    const redisKey = REDIS_KEYS.TEMP_DATA(key)
    await RedisCache.set(redisKey, data, ttl)
  }

  static async getTempData(key: string): Promise<unknown | null> {
    const redisKey = REDIS_KEYS.TEMP_DATA(key)
    return RedisCache.get<unknown>(redisKey)
  }

  static async deleteTempData(key: string): Promise<void> {
    const redisKey = REDIS_KEYS.TEMP_DATA(key)
    await RedisCache.del(redisKey)
  }

  // Cache Invalidation Helpers
  static async invalidateUserData(userId: string): Promise<void> {
    await Promise.all([
      this.invalidateUserProfile(userId),
      this.invalidateUserFavorites(userId),
      RedisCache.delPattern(REDIS_KEYS.USER_RECIPES(userId) + '*')
    ])
  }

  static async invalidateRecipeData(recipeId: string): Promise<void> {
    await Promise.all([
      this.invalidateRecipe(recipeId),
      this.invalidateRecipeReviews(recipeId),
      // Clear popular/recent recipe caches when any recipe changes
      RedisCache.del(REDIS_KEYS.POPULAR_RECIPES),
      RedisCache.del(REDIS_KEYS.RECENT_RECIPES)
    ])
  }

  static async invalidateSearchCache(query?: string): Promise<void> {
    if (query) {
      await RedisCache.delPattern(REDIS_KEYS.SEARCH_RESULTS(query, '*'))
    } else {
      await RedisCache.delPattern('search:*')
    }
  }

  // Health Check
  static async healthCheck(): Promise<{ redis: boolean; message: string }> {
    try {
      const testKey = 'health_check'
      const testValue = Date.now().toString()
      
      await RedisCache.set(testKey, testValue, 60)
      const retrieved = await RedisCache.get<string>(testKey)
      await RedisCache.del(testKey)
      
      const isHealthy = retrieved === testValue
      
      return {
        redis: isHealthy,
        message: isHealthy ? 'Redis is healthy' : 'Redis health check failed'
      }
    } catch (error) {
      return {
        redis: false,
        message: `Redis error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}

export default CacheService 