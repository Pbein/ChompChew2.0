import { NextRequest, NextResponse } from 'next/server'
import { RateLimiter } from '@/lib/redis'
import { getClientIP } from '@/lib/utils/ip'

interface RateLimitConfig {
  requests: number
  windowSeconds: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

// Default rate limiting configurations for different endpoint types
export const RATE_LIMIT_CONFIGS = {
  // General API endpoints
  DEFAULT: { requests: 100, windowSeconds: 3600 }, // 100 requests per hour
  
  // Authentication endpoints
  AUTH_LOGIN: { requests: 5, windowSeconds: 900 }, // 5 login attempts per 15 minutes
  AUTH_REGISTER: { requests: 3, windowSeconds: 1800 }, // 3 registration attempts per 30 minutes
  AUTH_RESET_PASSWORD: { requests: 3, windowSeconds: 3600 }, // 3 password reset attempts per hour
  
  // Recipe generation endpoints (more expensive)
  AI_RECIPE_GENERATION: { requests: 10, windowSeconds: 3600 }, // 10 AI generations per hour
  
  // Search endpoints
  SEARCH: { requests: 200, windowSeconds: 3600 }, // 200 searches per hour
  
  // User action endpoints
  USER_ACTIONS: { requests: 50, windowSeconds: 3600 }, // 50 user actions per hour (likes, follows, etc.)
  
  // File upload endpoints
  FILE_UPLOAD: { requests: 20, windowSeconds: 3600 }, // 20 file uploads per hour
} as const

/**
 * Rate limiting middleware factory
 */
export function createRateLimiter(config: RateLimitConfig) {
  return async function rateLimitMiddleware(
    request: NextRequest,
    identifier?: string
  ): Promise<NextResponse | null> {
    try {
      // Get identifier (user ID, IP address, or custom identifier)
      const rateLimitId = identifier || 
                         request.headers.get('user-id') || 
                         getClientIP(request) || 
                         'anonymous'

      // Check rate limit
      const rateLimitResult = await RateLimiter.checkRateLimit(
        rateLimitId,
        config.requests,
        config.windowSeconds
      )

      // If rate limit exceeded, return 429 response
      if (!rateLimitResult.allowed) {
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: `Too many requests. You have exceeded the limit of ${config.requests} requests per ${config.windowSeconds} seconds.`,
            retryAfter: rateLimitResult.resetTime
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': config.requests.toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
              'Retry-After': Math.ceil((rateLimitResult.resetTime * 1000 - Date.now()) / 1000).toString(),
            },
          }
        )
      }

      // Add rate limit headers to successful responses
      return NextResponse.next({
        headers: {
          'X-RateLimit-Limit': config.requests.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      })

    } catch (error) {
      console.error('Rate limiter error:', error)
      // If Redis is down, allow the request but log the error
      return NextResponse.next()
    }
  }
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
  default: createRateLimiter(RATE_LIMIT_CONFIGS.DEFAULT),
  authLogin: createRateLimiter(RATE_LIMIT_CONFIGS.AUTH_LOGIN),
  authRegister: createRateLimiter(RATE_LIMIT_CONFIGS.AUTH_REGISTER),
  authResetPassword: createRateLimiter(RATE_LIMIT_CONFIGS.AUTH_RESET_PASSWORD),
  aiRecipeGeneration: createRateLimiter(RATE_LIMIT_CONFIGS.AI_RECIPE_GENERATION),
  search: createRateLimiter(RATE_LIMIT_CONFIGS.SEARCH),
  userActions: createRateLimiter(RATE_LIMIT_CONFIGS.USER_ACTIONS),
  fileUpload: createRateLimiter(RATE_LIMIT_CONFIGS.FILE_UPLOAD),
}

/**
 * Higher-order function to wrap API route handlers with rate limiting
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.DEFAULT,
  getIdentifier?: (req: NextRequest) => string
) {
  const rateLimiter = createRateLimiter(config)

  return async function rateLimitedHandler(req: NextRequest): Promise<NextResponse> {
    // Apply rate limiting
    const identifier = getIdentifier ? getIdentifier(req) : undefined
    const rateLimitResponse = await rateLimiter(req, identifier)
    
    if (rateLimitResponse && rateLimitResponse.status === 429) {
      return rateLimitResponse
    }

    // Continue to the actual handler
    const response = await handler(req)

    // Merge rate limit headers with the response
    if (rateLimitResponse) {
      const rateLimitHeaders = rateLimitResponse.headers
      rateLimitHeaders.forEach((value, key) => {
        response.headers.set(key, value)
      })
    }

    return response
  }
}

/**
 * Utility function to check rate limit without middleware
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.DEFAULT
) {
  return RateLimiter.checkRateLimit(identifier, config.requests, config.windowSeconds)
}

/**
 * Utility function to manually increment rate limit counter
 */
export async function incrementRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.DEFAULT
) {
  // This is a simplified version - for production, you'd want to use the same
  // sliding window logic as in the RateLimiter class
  const count = await RateLimiter.checkRateLimit(identifier, config.requests, config.windowSeconds)
  return count
} 