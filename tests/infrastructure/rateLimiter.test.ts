import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { 
  createRateLimiter, 
  rateLimiters, 
  withRateLimit, 
  checkRateLimit,
  RATE_LIMIT_CONFIGS 
} from '@/lib/middleware/rateLimiter'
import { RateLimiter } from '@/lib/redis'

// Mock the Redis RateLimiter
vi.mock('@/lib/redis', () => ({
  RateLimiter: {
    checkRateLimit: vi.fn()
  }
}))

// Mock IP utility
vi.mock('@/lib/utils/ip', () => ({
  getClientIP: vi.fn(() => '192.168.1.1')
}))

describe('Rate Limiter Infrastructure - Real Implementation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rate Limit Configurations', () => {
    it('should have proper rate limit configurations', () => {
      expect(RATE_LIMIT_CONFIGS.DEFAULT).toEqual({
        requests: 100,
        windowSeconds: 3600
      })

      expect(RATE_LIMIT_CONFIGS.AUTH_LOGIN).toEqual({
        requests: 5,
        windowSeconds: 900
      })

      expect(RATE_LIMIT_CONFIGS.AI_RECIPE_GENERATION).toEqual({
        requests: 10,
        windowSeconds: 3600
      })

      expect(RATE_LIMIT_CONFIGS.SEARCH).toEqual({
        requests: 200,
        windowSeconds: 3600
      })
    })
  })

  describe('createRateLimiter Function', () => {
    it('should allow requests within rate limits', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 99,
        resetTime: Date.now() + 3600000
      })

      const rateLimiter = createRateLimiter({
        requests: 100,
        windowSeconds: 3600
      })

      const mockRequest = new NextRequest('https://example.com/api/test')
      const result = await rateLimiter(mockRequest)

      expect(result).toBeDefined()
      expect(result?.status).not.toBe(429)
      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        '192.168.1.1',
        100,
        3600
      )
    })

    it('should block requests exceeding rate limits', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 3600000
      })

      const rateLimiter = createRateLimiter({
        requests: 5,
        windowSeconds: 900
      })

      const mockRequest = new NextRequest('https://example.com/api/auth/login')
      const result = await rateLimiter(mockRequest)

      expect(result).toBeDefined()
      expect(result?.status).toBe(429)
      
      const responseBody = await result?.json()
      expect(responseBody).toMatchObject({
        error: 'Rate limit exceeded',
        message: expect.stringContaining('5 requests')
      })
    })

    it('should add rate limit headers to responses', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      const resetTime = Date.now() + 3600000
      mockCheckRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 95,
        resetTime
      })

      const rateLimiter = createRateLimiter({
        requests: 100,
        windowSeconds: 3600
      })

      const mockRequest = new NextRequest('https://example.com/api/test')
      const result = await rateLimiter(mockRequest)

      expect(result?.headers.get('X-RateLimit-Limit')).toBe('100')
      expect(result?.headers.get('X-RateLimit-Remaining')).toBe('95')
      expect(result?.headers.get('X-RateLimit-Reset')).toBe(resetTime.toString())
    })

    it('should handle Redis errors gracefully', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockRejectedValue(new Error('Redis connection failed'))

      const rateLimiter = createRateLimiter({
        requests: 100,
        windowSeconds: 3600
      })

      const mockRequest = new NextRequest('https://example.com/api/test')
      const result = await rateLimiter(mockRequest)

      // Should allow request when Redis is down
      expect(result?.status).not.toBe(429)
    })

    it('should use custom identifier when provided', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 99,
        resetTime: Date.now() + 3600000
      })

      const rateLimiter = createRateLimiter({
        requests: 100,
        windowSeconds: 3600
      })

      const mockRequest = new NextRequest('https://example.com/api/test')
      await rateLimiter(mockRequest, 'custom-user-id')

      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        'custom-user-id',
        100,
        3600
      )
    })

    it('should use user-id header when available', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 99,
        resetTime: Date.now() + 3600000
      })

      const rateLimiter = createRateLimiter({
        requests: 100,
        windowSeconds: 3600
      })

      const mockRequest = new NextRequest('https://example.com/api/test')
      mockRequest.headers.set('user-id', 'header-user-id')
      
      await rateLimiter(mockRequest)

      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        'header-user-id',
        100,
        3600
      )
    })
  })

  describe('Pre-configured Rate Limiters', () => {
    it('should have working default rate limiter', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 99,
        resetTime: Date.now() + 3600000
      })

      const mockRequest = new NextRequest('https://example.com/api/test')
      const result = await rateLimiters.default(mockRequest)

      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        '192.168.1.1',
        100, // DEFAULT config
        3600
      )
    })

    it('should have working auth login rate limiter', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 4,
        resetTime: Date.now() + 900000
      })

      const mockRequest = new NextRequest('https://example.com/api/auth/login')
      const result = await rateLimiters.authLogin(mockRequest)

      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        '192.168.1.1',
        5, // AUTH_LOGIN config
        900
      )
    })

    it('should have working AI recipe generation rate limiter', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 9,
        resetTime: Date.now() + 3600000
      })

      const mockRequest = new NextRequest('https://example.com/api/recipes/generate')
      const result = await rateLimiters.aiRecipeGeneration(mockRequest)

      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        '192.168.1.1',
        10, // AI_RECIPE_GENERATION config
        3600
      )
    })
  })

  describe('withRateLimit Higher-Order Function', () => {
    it('should wrap handler with rate limiting', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 99,
        resetTime: Date.now() + 3600000
      })

      const mockHandler = vi.fn().mockResolvedValue(
        new NextResponse(JSON.stringify({ success: true }))
      )

      const rateLimitedHandler = withRateLimit(mockHandler, RATE_LIMIT_CONFIGS.DEFAULT)
      
      const mockRequest = new NextRequest('https://example.com/api/test')
      const result = await rateLimitedHandler(mockRequest)

      expect(mockCheckRateLimit).toHaveBeenCalled()
      expect(mockHandler).toHaveBeenCalledWith(mockRequest)
      expect(result.status).not.toBe(429)
    })

    it('should block handler execution when rate limited', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 3600000
      })

      const mockHandler = vi.fn().mockResolvedValue(
        new NextResponse(JSON.stringify({ success: true }))
      )

      const rateLimitedHandler = withRateLimit(mockHandler, RATE_LIMIT_CONFIGS.DEFAULT)
      
      const mockRequest = new NextRequest('https://example.com/api/test')
      const result = await rateLimitedHandler(mockRequest)

      expect(mockCheckRateLimit).toHaveBeenCalled()
      expect(mockHandler).not.toHaveBeenCalled() // Handler should not be called
      expect(result.status).toBe(429)
    })

    it('should use custom identifier function', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 99,
        resetTime: Date.now() + 3600000
      })

      const mockHandler = vi.fn().mockResolvedValue(
        new NextResponse(JSON.stringify({ success: true }))
      )

      const customIdentifier = (req: NextRequest) => 'custom-id-from-request'
      const rateLimitedHandler = withRateLimit(
        mockHandler, 
        RATE_LIMIT_CONFIGS.DEFAULT,
        customIdentifier
      )
      
      const mockRequest = new NextRequest('https://example.com/api/test')
      await rateLimitedHandler(mockRequest)

      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        'custom-id-from-request',
        100,
        3600
      )
    })
  })

  describe('Utility Functions', () => {
    it('should check rate limit without middleware', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      const expectedResult = {
        allowed: true,
        remaining: 99,
        resetTime: Date.now() + 3600000
      }
      mockCheckRateLimit.mockResolvedValue(expectedResult)

      const result = await checkRateLimit('test-user')

      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        'test-user',
        100, // DEFAULT config
        3600
      )
      expect(result).toEqual(expectedResult)
    })

    it('should check rate limit with custom config', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      const expectedResult = {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 900000
      }
      mockCheckRateLimit.mockResolvedValue(expectedResult)

      const result = await checkRateLimit('test-user', RATE_LIMIT_CONFIGS.AUTH_LOGIN)

      expect(mockCheckRateLimit).toHaveBeenCalledWith(
        'test-user',
        5, // AUTH_LOGIN config
        900
      )
      expect(result).toEqual(expectedResult)
    })
  })

  describe('Different Rate Limiting Scenarios', () => {
    it('should handle multiple simultaneous requests from same client', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      
      // First request allowed
      mockCheckRateLimit.mockResolvedValueOnce({
        allowed: true,
        remaining: 4,
        resetTime: Date.now() + 900000
      })
      
      // Second request blocked
      mockCheckRateLimit.mockResolvedValueOnce({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 900000
      })

      const rateLimiter = rateLimiters.authLogin
      const mockRequest = new NextRequest('https://example.com/api/auth/login')

      const result1 = await rateLimiter(mockRequest)
      const result2 = await rateLimiter(mockRequest)

      expect(result1?.status).not.toBe(429)
      expect(result2?.status).toBe(429)
    })

    it('should handle different clients independently', async () => {
      const mockCheckRateLimit = vi.mocked(RateLimiter.checkRateLimit)
      mockCheckRateLimit.mockResolvedValue({
        allowed: true,
        remaining: 99,
        resetTime: Date.now() + 3600000
      })

      const rateLimiter = createRateLimiter({
        requests: 100,
        windowSeconds: 3600
      })

      const mockRequest1 = new NextRequest('https://example.com/api/test')
      const mockRequest2 = new NextRequest('https://example.com/api/test')
      
      await rateLimiter(mockRequest1, 'client-1')
      await rateLimiter(mockRequest2, 'client-2')

      expect(mockCheckRateLimit).toHaveBeenCalledWith('client-1', 100, 3600)
      expect(mockCheckRateLimit).toHaveBeenCalledWith('client-2', 100, 3600)
    })
  })
}) 