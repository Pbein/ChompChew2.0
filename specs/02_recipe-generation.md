### Feature 1: Hero Search & Recipe Generation

**Goal:** AI-powered recipe search accepting natural language queries and dietary constraints, returning 3 tailored recipes within 1.5 seconds.

**API Relationships:**
- `/api/generate` - Main recipe generation endpoint
- OpenAI GPT-4o API with function calling
- LangSmith for prompt observability
- Upstash Redis for rate limiting
- USDA FoodData Central for nutrition validation

**Detailed Requirements:**

**Architecture Overview:**
- Edge-optimized API routes for minimal latency
- Streaming responses for real-time generation feedback
- Redis-based caching layer for common queries
- Fallback system with pre-curated recipe database

**Database Schema:**
```sql
-- Recipe generation logs
CREATE TABLE recipe_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    query TEXT NOT NULL,
    dietary_restrictions JSONB,
    generated_recipes JSONB NOT NULL,
    generation_time_ms INTEGER,
    ai_model_version VARCHAR(50),
    langsmith_trace_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rate limiting
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(100) NOT NULL, -- IP or user_id
    endpoint VARCHAR(100) NOT NULL,
    requests_count INTEGER DEFAULT 0,
    window_start TIMESTAMP DEFAULT NOW(),
    UNIQUE(identifier, endpoint)
);

-- Recipe cache
CREATE TABLE recipe_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_hash VARCHAR(64) UNIQUE NOT NULL,
    dietary_hash VARCHAR(64),
    cached_recipes JSONB NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recipe_cache_query ON recipe_cache(query_hash, dietary_hash);
CREATE INDEX idx_rate_limits_window ON rate_limits(identifier, endpoint, window_start);
```

**API Design:**
```typescript
// POST /api/generate
interface GenerateRequest {
  query: string;                    // "pasta with chicken and spinach"
  dietaryRestrictions?: {
    allergens: string[];            // ["nuts", "dairy"]
    dietType?: string;              // "keto" | "vegan" | "paleo"
    dislikes: string[];            // ["mushrooms", "spicy"]
    medicalConditions?: string[];   // ["ulcerative-colitis"]
  };
  regenerate?: boolean;             // Force new generation vs cache
}

interface GenerateResponse {
  recipes: Recipe[];
  generationTime: number;
  cacheHit: boolean;
  traceId: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  dietaryCompliance: DietaryCompliance;
  imageUrl?: string;
}

```