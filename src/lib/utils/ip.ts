import { NextRequest } from 'next/server'

/**
 * Get client IP address from Next.js request
 * Handles various proxy headers and fallbacks
 */
export function getClientIP(request: NextRequest): string | null {
  // Check common proxy headers in order of preference
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip', // Cloudflare
    'true-client-ip',   // Cloudflare Enterprise
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ]

  for (const header of ipHeaders) {
    const value = request.headers.get(header)
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim()
      if (isValidIP(ip)) {
        return ip
      }
    }
  }

  // Note: request.ip is not available in Next.js Edge Runtime
  // This would be available in Node.js runtime with additional configuration

  // Last resort - try to get from URL (for localhost development)
  const url = new URL(request.url)
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return '127.0.0.1'
  }

  return null
}

/**
 * Basic IP address validation
 */
function isValidIP(ip: string): boolean {
  // Basic validation for IPv4 and IPv6
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  
  // Quick validation - not perfect but good enough for rate limiting
  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip.includes(':')
}

/**
 * Hash IP address for privacy (optional)
 */
export function hashIP(ip: string): string {
  // Simple hash function for IP anonymization
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
} 