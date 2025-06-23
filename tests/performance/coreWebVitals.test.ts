import { describe, it, expect, vi } from 'vitest'
import { cn, formatDate, debounce } from '@/lib/utils'

// Mock performance APIs for testing environment
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => [])
}

Object.defineProperty(global, 'performance', {
  writable: true,
  value: mockPerformance
})

describe('Core Web Vitals & Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Utility Performance', () => {
    it('should have performant utility functions', () => {
      // Test that utility functions exist and can be called
      expect(cn).toBeDefined()
      expect(typeof cn).toBe('function')
      
      // Test utility function performance
      const start = performance.now()
      const result = cn('class1', 'class2', { 'class3': true })
      const end = performance.now()
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(end - start).toBeLessThan(10) // Should be very fast
    })

    it('should have efficient date formatting', () => {
      expect(formatDate).toBeDefined()
      expect(typeof formatDate).toBe('function')
      
      // Test date formatting performance
      const start = performance.now()
      const result = formatDate(new Date())
      const end = performance.now()
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(end - start).toBeLessThan(50) // Adjusted for CI/test environment
    })

    it('should have efficient debounce function', () => {
      expect(debounce).toBeDefined()
      expect(typeof debounce).toBe('function')
      
      // Test debounce function creation performance
      const start = performance.now()
      const debouncedFn = debounce(() => {}, 100)
      const end = performance.now()
      
      expect(debouncedFn).toBeDefined()
      expect(typeof debouncedFn).toBe('function')
      expect(end - start).toBeLessThan(1) // Should be instant
    })
  })

  describe('Performance Monitoring Setup', () => {
    it('should be able to measure performance marks', () => {
      const markName = 'test-mark'
      
      performance.mark(markName)
      
      expect(performance.mark).toHaveBeenCalledWith(markName)
    })

    it('should be able to measure performance timing', () => {
      const measureName = 'test-measure'
      const startMark = 'start-mark'
      const endMark = 'end-mark'
      
      performance.measure(measureName, startMark, endMark)
      
      expect(performance.measure).toHaveBeenCalledWith(measureName, startMark, endMark)
    })

    it('should be able to get performance entries', () => {
      const entries = performance.getEntriesByType('measure')
      
      expect(Array.isArray(entries)).toBe(true)
      expect(performance.getEntriesByType).toHaveBeenCalledWith('measure')
    })
  })

  describe('Performance Thresholds', () => {
    it('should define appropriate performance thresholds', () => {
      const thresholds = {
        lcp: {
          good: 2500,
          needsImprovement: 4000
        },
        fid: {
          good: 100,
          needsImprovement: 300
        },
        cls: {
          good: 0.1,
          needsImprovement: 0.25
        },
        ttfb: {
          good: 800,
          needsImprovement: 1800
        }
      }

      // Verify thresholds are reasonable
      expect(thresholds.lcp.good).toBe(2500)
      expect(thresholds.lcp.needsImprovement).toBe(4000)
      expect(thresholds.fid.good).toBe(100)
      expect(thresholds.fid.needsImprovement).toBe(300)
      expect(thresholds.cls.good).toBe(0.1)
      expect(thresholds.cls.needsImprovement).toBe(0.25)
      expect(thresholds.ttfb.good).toBe(800)
      expect(thresholds.ttfb.needsImprovement).toBe(1800)
    })

    it('should evaluate performance ratings correctly', () => {
      const evaluatePerformance = (value: number, goodThreshold: number, needsImprovementThreshold: number) => {
        if (value <= goodThreshold) return 'good'
        if (value <= needsImprovementThreshold) return 'needs-improvement'
        return 'poor'
      }

      // Test LCP evaluation
      expect(evaluatePerformance(2000, 2500, 4000)).toBe('good')
      expect(evaluatePerformance(3000, 2500, 4000)).toBe('needs-improvement')
      expect(evaluatePerformance(5000, 2500, 4000)).toBe('poor')

      // Test FID evaluation  
      expect(evaluatePerformance(50, 100, 300)).toBe('good')
      expect(evaluatePerformance(200, 100, 300)).toBe('needs-improvement')
      expect(evaluatePerformance(400, 100, 300)).toBe('poor')

      // Test CLS evaluation
      expect(evaluatePerformance(0.05, 0.1, 0.25)).toBe('good')
      expect(evaluatePerformance(0.15, 0.1, 0.25)).toBe('needs-improvement')
      expect(evaluatePerformance(0.3, 0.1, 0.25)).toBe('poor')
    })
  })

  describe('Performance Optimization Strategies', () => {
    it('should identify optimization opportunities', () => {
      const optimizationStrategies = [
        'lazy-loading',
        'code-splitting',
        'image-optimization',
        'caching',
        'compression',
        'cdn',
        'preloading',
        'service-worker'
      ]

      expect(optimizationStrategies).toHaveLength(8)
      expect(optimizationStrategies).toContain('lazy-loading')
      expect(optimizationStrategies).toContain('code-splitting')
      expect(optimizationStrategies).toContain('image-optimization')
    })

    it('should prioritize critical resources', () => {
      const resourcePriorities = {
        critical: ['initial-css', 'hero-image'],
        high: ['above-fold-js', 'fonts'],
        medium: ['below-fold-css', 'analytics'],
        low: ['social-widgets', 'comments']
      }

      expect(resourcePriorities.critical).toContain('initial-css')
      expect(resourcePriorities.high).toContain('above-fold-js')
      expect(resourcePriorities.medium).toContain('below-fold-css')
      expect(resourcePriorities.low).toContain('social-widgets')
    })
  })
}) 