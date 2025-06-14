# 🤖 OpenAI Integration Setup Guide

This guide covers the complete OpenAI integration for ChompChew's AI-powered recipe generation system.

## 📋 Prerequisites

- OpenAI API account with billing enabled
- API key with sufficient credits
- Node.js environment with TypeScript support

## 🔑 Environment Configuration

### Required Environment Variables

Add the following to your `.env.local` file:

```env
# OpenAI Configuration
OPENAI_SECRET_KEY=sk-your-openai-api-key-here
```

### Verification

The system will automatically validate the API key on startup. If the key is missing or invalid, you'll see an error in the console.

## 🏗️ Architecture Overview

### Core Components

1. **OpenAI Client** (`src/lib/openai.ts`)
   - Configured OpenAI client instance
   - API key validation
   - Rate limiting constants

2. **Recipe Generation Service** (`src/lib/services/recipeGenerationService.ts`)
   - Comprehensive prompt engineering
   - Input/output validation with Zod schemas
   - Error handling and retry logic

3. **API Endpoint** (`src/app/api/recipes/generate/route.ts`)
   - RESTful API for recipe generation
   - Rate limiting integration
   - Database persistence for authenticated users

## 🎯 Usage Examples

### Basic Recipe Generation

```typescript
import { RecipeGenerationService } from '@/lib/services/recipeGenerationService'

const recipe = await RecipeGenerationService.generateRecipe({
  ingredients: ['chicken breast', 'broccoli', 'rice'],
  difficulty: 'easy',
  servings: 4,
  cookingTime: 30
})
```

### Advanced Recipe Generation with Constraints

```typescript
const recipe = await RecipeGenerationService.generateRecipe({
  ingredients: ['salmon', 'asparagus', 'quinoa'],
  dietaryRestrictions: ['gluten-free', 'dairy-free'],
  allergies: ['nuts'],
  cuisineType: 'Mediterranean',
  difficulty: 'medium',
  servings: 2,
  cookingTime: 45,
  mealType: 'dinner',
  equipment: ['oven', 'stovetop'],
  inspiration: 'Light and healthy summer meal'
})
```

### Recipe Variations

```typescript
const variation = await RecipeGenerationService.generateRecipeVariation(
  originalRecipe,
  'Make it spicier with jalapeños and hot sauce'
)
```

### Ingredient Substitutions

```typescript
const substituted = await RecipeGenerationService.generateWithSubstitutions(
  originalRecipe,
  {
    'chicken breast': 'tofu',
    'butter': 'olive oil'
  }
)
```

## 🌐 API Endpoints

### POST /api/recipes/generate

Generate a new recipe using AI.

**Request Body:**
```json
{
  "ingredients": ["chicken", "vegetables"],
  "difficulty": "easy",
  "servings": 4,
  "dietaryRestrictions": ["gluten-free"],
  "allergies": ["nuts"],
  "cuisineType": "Italian",
  "cookingTime": 30,
  "mealType": "dinner",
  "equipment": ["oven"],
  "inspiration": "Comfort food for family dinner"
}
```

**Response:**
```json
{
  "success": true,
  "recipe": {
    "title": "Herb-Crusted Chicken with Roasted Vegetables",
    "description": "A delicious and healthy meal...",
    "ingredients": [...],
    "instructions": [...],
    "nutrition": {...},
    "metadata": {...},
    "tags": [...],
    "tips": [...]
  },
  "metadata": {
    "generatedAt": "2024-01-15T10:30:00Z",
    "estimatedTokens": 1250,
    "userAuthenticated": true
  }
}
```

### GET /api/recipes/generate

Health check and service information.

**Response:**
```json
{
  "service": "Recipe Generation API",
  "status": "operational",
  "version": "1.0.0",
  "endpoints": {
    "POST": "/api/recipes/generate - Generate a new recipe"
  },
  "rateLimit": {
    "ai_generation": "10 requests per hour"
  }
}
```

## ⚡ Rate Limiting

### Current Limits

- **AI Recipe Generation**: 10 requests per hour per IP/user
- **General API**: 100 requests per hour per IP/user

### Rate Limit Headers

All responses include rate limiting information:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1642248600
```

### Rate Limit Exceeded Response

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many recipe generation requests. Please try again later.",
  "retryAfter": 1642248600
}
```

## 🔧 Configuration

### Model Configuration

Current settings in `src/lib/openai.ts`:

```typescript
export const OPENAI_CONFIG = {
  model: 'gpt-4o-mini',     // Cost-effective model
  maxTokens: 2000,          // Maximum response length
  temperature: 0.7,         // Creativity level (0-1)
  topP: 0.9,               // Nucleus sampling
}
```

### Prompt Engineering

The system uses sophisticated prompt templates that include:

- **Dietary Constraints**: Automatic handling of restrictions and allergies
- **Equipment Limitations**: Adapts recipes based on available tools
- **Difficulty Scaling**: Adjusts complexity based on user skill level
- **Nutritional Information**: Provides estimated macro and calorie counts
- **Cooking Tips**: Includes helpful suggestions and substitutions

## 🛡️ Error Handling

### Common Error Scenarios

1. **Invalid API Key**
   ```json
   {
     "error": "Configuration error",
     "message": "Recipe generation service is temporarily unavailable."
   }
   ```

2. **Rate Limit Exceeded**
   ```json
   {
     "error": "Service overloaded",
     "message": "Recipe generation service is busy. Please try again in a few minutes."
   }
   ```

3. **Invalid Input**
   ```json
   {
     "error": "Invalid input",
     "message": "Please check your recipe generation parameters.",
     "details": [...]
   }
   ```

4. **Generation Failed**
   ```json
   {
     "error": "Generation failed",
     "message": "Unable to generate recipe. Please try again with different ingredients."
   }
   ```

## 💰 Cost Management

### Token Estimation

The service includes token cost estimation:

```typescript
const estimatedTokens = RecipeGenerationService.estimateTokenCost(input)
console.log(`Estimated tokens: ${estimatedTokens}`)
```

### Cost Optimization Tips

1. **Use Specific Ingredients**: More specific inputs lead to better, shorter responses
2. **Set Reasonable Limits**: Don't request overly complex recipes
3. **Cache Results**: Store generated recipes to avoid regeneration
4. **Monitor Usage**: Track API usage through OpenAI dashboard

### Current Pricing (as of 2024)

- **GPT-4o-mini**: $0.15 per 1M input tokens, $0.60 per 1M output tokens
- **Average Recipe**: ~1,500 tokens total (~$0.001 per recipe)

## 🔍 Monitoring & Debugging

### Logging

The service includes comprehensive logging:

```typescript
console.log('Generating recipe with input:', input)
console.error('OpenAI API error:', error)
console.error('Recipe parsing error:', error)
```

### Health Checks

Monitor service health via:
- `GET /api/recipes/generate` - Service status
- `GET /api/health` - Overall system health

### Common Issues

1. **API Key Issues**
   - Verify key is correctly set in `.env.local`
   - Check OpenAI account billing status
   - Ensure key has sufficient permissions

2. **Rate Limiting**
   - Monitor usage patterns
   - Implement user-specific rate limiting
   - Consider upgrading OpenAI plan

3. **Response Parsing**
   - Check OpenAI model responses
   - Validate JSON structure
   - Review prompt engineering

## 🚀 Production Deployment

### Environment Variables

Ensure these are set in production:

```env
OPENAI_SECRET_KEY=sk-prod-your-production-key
```

### Security Considerations

1. **API Key Protection**: Never expose API keys in client-side code
2. **Rate Limiting**: Implement robust rate limiting to prevent abuse
3. **Input Validation**: Always validate user inputs before sending to OpenAI
4. **Error Handling**: Don't expose internal errors to users

### Scaling Considerations

1. **Caching**: Implement Redis caching for common recipes
2. **Queue System**: Use background jobs for expensive operations
3. **Load Balancing**: Distribute requests across multiple instances
4. **Monitoring**: Set up alerts for API failures and rate limits

## 📊 Analytics & Metrics

### Key Metrics to Track

1. **Generation Success Rate**: Percentage of successful recipe generations
2. **Average Response Time**: Time from request to response
3. **Token Usage**: Daily/monthly token consumption
4. **User Satisfaction**: Recipe ratings and feedback
5. **Error Rates**: Failed generations by error type

### Implementation

```typescript
// Track generation metrics
const startTime = Date.now()
const recipe = await RecipeGenerationService.generateRecipe(input)
const duration = Date.now() - startTime

// Log metrics
console.log(`Recipe generated in ${duration}ms`)
console.log(`Estimated cost: $${(estimatedTokens * 0.0000015).toFixed(6)}`)
```

## 🔄 Future Enhancements

### Planned Features

1. **Recipe Caching**: Cache popular ingredient combinations
2. **User Preferences**: Learn from user feedback to improve suggestions
3. **Batch Generation**: Generate multiple recipe variations at once
4. **Image Generation**: Add AI-generated recipe images
5. **Voice Integration**: Voice-to-recipe generation

### Model Upgrades

- Monitor new OpenAI model releases
- A/B test different models for quality vs. cost
- Implement model fallbacks for reliability

---

## 🆘 Support

For issues with the OpenAI integration:

1. Check the [OpenAI Status Page](https://status.openai.com/)
2. Review the [OpenAI API Documentation](https://platform.openai.com/docs)
3. Monitor application logs for specific error messages
4. Test with the health check endpoint

**Happy cooking with AI! 🍳🤖** 