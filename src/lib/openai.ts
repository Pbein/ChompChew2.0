import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY,
})

// Validate that the API key is present
if (!process.env.OPENAI_SECRET_KEY) {
  throw new Error('OPENAI_SECRET_KEY environment variable is required')
}

// Export the configured client
export { openai }

// OpenAI configuration constants
export const OPENAI_CONFIG = {
  model: 'gpt-4o-mini', // Cost-effective model for recipe generation
  maxTokens: 2000,
  temperature: 0.7, // Balanced creativity for recipe generation
  topP: 0.9,
} as const

// Rate limiting configuration
export const RATE_LIMITS = {
  requestsPerMinute: 20,
  requestsPerHour: 500,
  requestsPerDay: 2000,
} as const 