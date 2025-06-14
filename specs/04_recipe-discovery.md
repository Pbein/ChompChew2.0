### Feature 8: Recipe Discovery & Search

**Goal:** Advanced search and discovery system with filters, sorting, and AI-powered recommendations based on user preferences and behavior.

**API Relationships:**
- `/api/search` - Main search endpoint with filters
- `/api/recommendations` - Personalized recipe suggestions
- Elasticsearch for full-text search
- Vector embeddings for semantic search
- Collaborative filtering for recommendations

**Database Schema:**
```sql
-- Search index optimization
CREATE TABLE recipe_search_index (
    recipe_id UUID PRIMARY KEY REFERENCES recipes(id),
    title_vector vector(1536),
    ingredients_vector vector(1536),
    description_vector vector(1536),
    combined_text TEXT,
    search_keywords TEXT[],
    popularity_score DECIMAL(5,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User search behavior
CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    search_query TEXT NOT NULL,
    filters_applied JSONB,
    results_count INTEGER,
    clicked_recipe_ids UUID[],
    search_duration_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Recipe interaction tracking
CREATE TABLE recipe_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    recipe_id UUID REFERENCES recipes(id),
    interaction_type VARCHAR(50), -- 'view', 'save', 'share', 'rate', 'cook'
    interaction_duration INTEGER, -- seconds
    created_at TIMESTAMP DEFAULT NOW()
);

-- User taste preferences (learned)
CREATE TABLE user_taste_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    preferred_cuisines TEXT[],
    disliked_ingredients TEXT[],
    cooking_skill_level INTEGER DEFAULT 3, -- 1-5 scale
    time_constraints INTEGER, -- preferred max cook time
    dietary_preferences JSONB,
    flavor_preferences JSONB, -- spicy, sweet, salty preferences
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recipe_search_title ON recipe_search_index USING ivfflat (title_vector vector_cosine_ops);
CREATE INDEX idx_search_history_user ON search_history(user_id, created_at DESC);
CREATE INDEX idx_recipe_interactions_user ON recipe_interactions(user_id, interaction_type);
```

**Advanced Search Implementation:**
```pseudocode
FUNCTION advancedRecipeSearch(query, filters, userId):
    searchResults = []
    
    // Semantic search with vector embeddings
    IF query:
        queryEmbedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: query
        })
        
        semanticResults = await vectorSearch(queryEmbedding, filters.limit * 2)
        searchResults = [...searchResults, ...semanticResults]
    
    // Traditional keyword search for exact matches
    keywordResults = await elasticsearchQuery({
        query: {
            multi_match: {
                query: query,
                fields: ['title^3', 'ingredients^2', 'description', 'tags'],
                fuzziness: 'AUTO'
            }
        },
        filter: buildElasticsearchFilters(filters)
    })
    
    // Combine and deduplicate results
    combinedResults = mergeSearchResults(semanticResults, keywordResults)
    
    // Apply personalization if user is logged in
    IF userId:
        userProfile = await getUserTasteProfile(userId)
        personalizedResults = await personalizeResults(combinedResults, userProfile)
        combinedResults = personalizedResults
    
    // Sort by relevance and popularity
    sortedResults = sortSearchResults(combinedResults, {
        relevanceWeight: 0.6,
        popularityWeight: 0.3,
        personalWeight: 0.1
    })
    
    // Log search for analytics and learning
    await logSearchQuery(query, filters, userId, sortedResults.length)
    
    RETURN {
        recipes: sortedResults.slice(0, filters.limit || 20),
        totalCount: sortedResults.length,
        searchTime: Date.now() - startTime,
        filters: filters
    }
```

**Recommendation Engine:**
```pseudocode
FUNCTION generatePersonalizedRecommendations(userId, context):
    userProfile = await getUserTasteProfile(userId)
    recentInteractions = await getRecentInteractions(userId, limit: 50)
    
    recommendations = []
    
    // Content-based filtering
    contentRecs = await getContentBasedRecommendations(userProfile, limit: 10)
    recommendations = [...recommendations, ...contentRecs]
    
    // Collaborative filtering
    similarUsers = await findSimilarUsers(userId, userProfile)
    collabRecs = await getCollaborativeRecommendations(similarUsers, limit: 10)
    recommendations = [...recommendations, ...collabRecs]
    
    // Trending recipes in user's preference categories
    trendingRecs = await getTrendingRecipes(userProfile.preferred_cuisines, limit: 5)
    recommendations = [...recommendations, ...trendingRecs]
    
    // Context-aware recommendations
    IF context.timeOfDay:
        contextRecs = await getContextualRecommendations(context, userProfile)
        recommendations = [...recommendations, ...contextRecs]
    
    // Remove duplicates and recipes user has already seen
    filteredRecs = removeDuplicatesAndSeen(recommendations, userId)
    
    // Score and rank recommendations
    scoredRecs = await scoreRecommendations(filteredRecs, userProfile, context)
    
    RETURN scoredRecs.slice(0, 20)
```