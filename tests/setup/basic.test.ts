import { describe, it, expect } from 'vitest'

describe('Testing Infrastructure', () => {
  it('should be able to run basic tests', () => {
    expect(true).toBe(true)
  })

  it('should have access to test utilities', () => {
    expect(typeof describe).toBe('function')
    expect(typeof it).toBe('function')
    expect(typeof expect).toBe('function')
  })

  it('should be able to test async functions', async () => {
    const asyncFunction = async () => {
      return Promise.resolve('test')
    }
    
    const result = await asyncFunction()
    expect(result).toBe('test')
  })
}) 