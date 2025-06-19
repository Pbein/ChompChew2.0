import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CacheService } from '@/features/core/services/cacheService';
import { RedisCache } from '@/lib/redis';
import { UserProfile } from '@/features/core/types/database';

// Mock the entire RedisCache module
vi.mock('@/lib/redis', () => ({
  RedisCache: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    delPattern: vi.fn(),
    incr: vi.fn(),
  },
  REDIS_KEYS: {
    USER_PROFILE: (id: string) => `user:profile:${id}`,
    USER_FAVORITES: (id: string) => `user:favorites:${id}`,
    USER_RECIPES: (id: string) => `user:recipes:${id}`,
    RECIPE: (id: string) => `recipe:${id}`,
    POPULAR_RECIPES: 'recipes:popular',
    RECENT_RECIPES: 'recipes:recent',
    SEARCH_RESULTS: (query: string, filters: string) => `search:${query}:${filters}`,
    TEMP_DATA: (key: string) => `temp:${key}`,
  },
  CACHE_TTL: {
    SHORT: 300,
    MEDIUM: 3600,
    LONG: 86400,
    VERY_LONG: 604800,
  }
}));

describe('CacheService', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('User Profile Caching', () => {
    it('should correctly store and retrieve a user profile from Redis cache', async () => {
      // Arrange
      const userId = 'user-123';
      const mockProfile: UserProfile = {
        id: userId,
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        dietary_preferences: ['vegetarian', 'gluten-free'],
        allergens: ['nuts', 'dairy'],
        cooking_level: 'intermediate',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      // Mock RedisCache methods
      const mockSet = vi.mocked(RedisCache.set);
      const mockGet = vi.mocked(RedisCache.get);
      
      mockSet.mockResolvedValue(true);
      mockGet.mockResolvedValue(mockProfile);

      // Act - Store the profile
      await CacheService.setUserProfile(userId, mockProfile);

      // Assert - Verify set was called correctly
      expect(mockSet).toHaveBeenCalledWith(
        `user:profile:${userId}`,
        mockProfile,
        86400 // CACHE_TTL.LONG
      );

      // Act - Retrieve the profile
      const retrievedProfile = await CacheService.getUserProfile(userId);

      // Assert - Verify get was called correctly and returned the correct profile
      expect(mockGet).toHaveBeenCalledWith(`user:profile:${userId}`);
      expect(retrievedProfile).toEqual(mockProfile);
    });

    it('cache invalidation for a user profile should work as expected', async () => {
      // Arrange
      const userId = 'user-456';
      const mockDel = vi.mocked(RedisCache.del);
      mockDel.mockResolvedValue(true);

      // Act
      await CacheService.invalidateUserProfile(userId);

      // Assert
      expect(mockDel).toHaveBeenCalledWith(`user:profile:${userId}`);
    });

    it('should handle cache misses gracefully when fetching a user profile', async () => {
      // Arrange
      const userId = 'non-existent-user';
      const mockGet = vi.mocked(RedisCache.get);
      mockGet.mockResolvedValue(null); // Simulate cache miss

      // Act
      const result = await CacheService.getUserProfile(userId);

      // Assert
      expect(mockGet).toHaveBeenCalledWith(`user:profile:${userId}`);
      expect(result).toBeNull();
    });
  });

  describe('Generic Cache Behavior', () => {
    it('should implement and respect cache TTL (Time To Live)', async () => {
      // Arrange
      const userId = 'user-ttl-test';
      const mockProfile: UserProfile = {
        id: userId,
        email: 'ttl@example.com',
        full_name: 'TTL Test User',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };
      
      const mockSet = vi.mocked(RedisCache.set);
      mockSet.mockResolvedValue(true);

      // Act
      await CacheService.setUserProfile(userId, mockProfile);

      // Assert
      expect(mockSet).toHaveBeenCalledWith(
        `user:profile:${userId}`,
        mockProfile,
        86400 // CACHE_TTL.LONG - correct TTL for user profiles
      );
    });

    it('should handle Redis connection errors gracefully', async () => {
      // Arrange
      const userId = 'error-test-user';
      const mockGet = vi.mocked(RedisCache.get);
      mockGet.mockRejectedValue(new Error('Redis connection error'));

      // Act & Assert - Since CacheService doesn't catch errors, it should throw
      await expect(CacheService.getUserProfile(userId)).rejects.toThrow('Redis connection error');
      expect(mockGet).toHaveBeenCalledWith(`user:profile:${userId}`);
    });
  });

  describe('Additional Cache Operations', () => {
    it('should handle cache invalidation for all user data', async () => {
      // Arrange
      const userId = 'user-invalidate-all';
      const mockDel = vi.mocked(RedisCache.del);
      const mockDelPattern = vi.mocked(RedisCache.delPattern);
      
      mockDel.mockResolvedValue(true);
      mockDelPattern.mockResolvedValue(true);

      // Act
      await CacheService.invalidateUserData(userId);

      // Assert - Should call all user-related cache invalidations
      expect(mockDel).toHaveBeenCalledWith(`user:profile:${userId}`);
      expect(mockDel).toHaveBeenCalledWith(`user:favorites:${userId}`);
      expect(mockDelPattern).toHaveBeenCalledWith(`user:recipes:${userId}*`);
    });

    it('should perform health check correctly', async () => {
      // Arrange
      const mockSet = vi.mocked(RedisCache.set);
      const mockGet = vi.mocked(RedisCache.get);
      const mockDel = vi.mocked(RedisCache.del);
      
      mockSet.mockResolvedValue(true);
      mockDel.mockResolvedValue(true);
      
      // We need to simulate the dynamic timestamp behavior
      // by returning the same value that was set
      mockGet.mockImplementation(async (key: string) => {
        // Get the value that was set by checking the mock calls
        const setCall = mockSet.mock.calls.find(call => call[0] === key);
        return setCall ? setCall[1] : null;
      });

      // Act
      const healthResult = await CacheService.healthCheck();

      // Assert
      expect(mockSet).toHaveBeenCalledWith('health_check', expect.any(String), 60);
      expect(mockGet).toHaveBeenCalledWith('health_check');
      expect(mockDel).toHaveBeenCalledWith('health_check');
      expect(healthResult.redis).toBe(true);
      expect(healthResult.message).toBe('Redis is healthy');
    });

    it('should handle health check failure gracefully', async () => {
      // Arrange
      const mockSet = vi.mocked(RedisCache.set);
      mockSet.mockRejectedValue(new Error('Redis connection failed'));

      // Act
      const healthResult = await CacheService.healthCheck();

      // Assert
      expect(healthResult.redis).toBe(false);
      expect(healthResult.message).toContain('Redis error');
    });
  });
}); 