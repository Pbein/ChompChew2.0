## API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/signin
POST /api/auth/signup
POST /api/auth/signout
GET  /api/auth/session
POST /api/auth/magic-link
```

### Recipe Endpoints
```typescript
POST /api/generate              // Generate new recipes
GET  /api/recipes              // Search and list recipes
GET  /api/recipes/[id]         // Get specific recipe
POST /api/recipes/save         // Save/unsave recipe
POST /api/recipes/customize    // Customize recipe
GET  /api/recipes/[id]/pdf     // Download recipe PDF
```

### User Endpoints
```typescript
GET  /api/user/profile         // Get user profile
PUT  /api/user/profile         // Update user profile
GET  /api/user/preferences     // Get dietary preferences
PUT  /api/user/preferences     // Update preferences
GET  /api/user/cookbook        // Get saved recipes
GET  /api/user/pantry          // Get pantry items
POST /api/user/pantry          // Add pantry item
```

### Community Endpoints
```typescript
GET  /api/community/feed       // Get community feed
POST /api/community/follow     // Follow/unfollow user
GET  /api/community/challenges // Get active challenges
POST /api/community/challenges // Create new challenge
POST /api/reviews              // Submit recipe review
GET  /api/reviews/[recipeId]   // Get recipe reviews
```

### Shopping List Endpoints
```typescript
GET  /api/shopping-lists       // Get user's shopping lists
POST /api/shopping-lists       // Create shopping list
PUT  /api/shopping-lists/[id]  // Update shopping list
DELETE /api/shopping-lists/[id] // Delete shopping list
```