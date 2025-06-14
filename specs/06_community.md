### Feature 10: Community Features & Recipe Sharing

**Goal:** Social features enabling users to share recipes, rate others' creations, and participate in cooking challenges.

**API Relationships:**
- `/api/community` - Community features
- `/api/challenges` - Cooking challenges
- `/api/reviews` - Recipe ratings and reviews
- Real-time features with WebSockets
- Push notifications for community activities

**Database Schema:**
```sql
-- Community profiles
CREATE TABLE community_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    cooking_level VARCHAR(20) DEFAULT 'beginner',
    specialties TEXT[],
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    recipes_shared INTEGER DEFAULT 0,
    total_likes_received INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Social connections
CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Recipe reviews and ratings
CREATE TABLE recipe_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    cooking_notes TEXT, -- modifications made
    photos TEXT[], -- user's cooking photos
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(recipe_id, user_id)
);

-- Cooking challenges
CREATE TABLE cooking_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    challenge_type VARCHAR(50), -- 'ingredient', 'technique', 'time', 'theme'
    rules JSONB NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    prize_description TEXT,
    participant_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Challenge participations
CREATE TABLE challenge_participations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES cooking_challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id),
    submission_photos TEXT[],
    submission_notes TEXT,
    votes_received INTEGER DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(challenge_id, user_id)
);

-- Community feed
CREATE TABLE community_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'recipe_shared', 'review_posted', 'challenge_joined'
    object_id UUID, -- recipe_id, review_id, etc.
    object_type VARCHAR(50),
    visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'followers', 'private'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_community_profiles_user ON community_profiles(user_id);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_recipe_reviews_recipe ON recipe_reviews(recipe_id, rating DESC);
CREATE INDEX idx_cooking_challenges_dates ON cooking_challenges(start_date, end_date);
CREATE INDEX idx_community_activities_user ON community_activities(user_id, created_at DESC);
```

**Community Feed System:**
```pseudocode
FUNCTION getCommunityFeed(userId, limit, offset):
    // Get users this person follows
    followingUsers = await getFollowingUsers(userId)
    
    // Get recent activities from followed users
    feedActivities = await query(`
        SELECT ca.*, cp.display_name, cp.avatar_url,
               CASE 
                   WHEN ca.activity_type = 'recipe_shared' THEN r.title
                   WHEN ca.activity_type = 'review_posted' THEN rr.review_text
                   WHEN ca.activity_type = 'challenge_joined' THEN cc.title
               END as object_title
        FROM community_activities ca
        JOIN community_profiles cp ON ca.user_id = cp.user_id
        LEFT JOIN recipes r ON ca.object_type = 'recipe' AND ca.object_id = r.id
        LEFT JOIN recipe_reviews rr ON ca.object_type = 'review' AND ca.object_id = rr.id
        LEFT JOIN cooking_challenges cc ON ca.object_type = 'challenge' AND ca.object_id = cc.id
        WHERE ca.user_id = ANY($1)
        AND ca.visibility IN ('public', 'followers')
        ORDER BY ca.created_at DESC
        LIMIT $2 OFFSET $3
    `, [followingUsers, limit, offset])
    
    // Enhance with interaction data
    enhancedFeed = []
    FOR activity IN feedActivities:
        interactionData = await getActivityInteractions(activity.id, userId)
        enhancedFeed.push({
            ...activity,
            hasLiked: interactionData.hasLiked,
            likeCount: interactionData.likeCount,
            commentCount: interactionData.commentCount
        })
    
    RETURN enhancedFeed
```

**Challenge System:**
```pseudocode
FUNCTION createCookingChallenge(creatorId, challengeData):
    // Validate challenge data
    IF challengeData.end_date <= challengeData.start_date:
        throw new Error('End date must be after start date')
    
    challenge = await createChallenge({
        title: challengeData.title,
        description: challengeData.description,
        challenge_type: challengeData.type,
        rules: challengeData.rules,
        start_date: challengeData.start_date,
        end_date: challengeData.end_date,
        prize_description: challengeData.prize,
        created_by: creatorId
    })
    
    // Create community activity
    await createActivity({
        user_id: creatorId,
        activity_type: 'challenge_created',
        object_id: challenge.id,
        object_type: 'challenge'
    })
    
    // Send notifications to followers
    followers = await getFollowers(creatorId)
    FOR follower IN followers:
        await sendNotification({
            user_id: follower.id,
            type: 'new_challenge',
            title: 'New Challenge Created!',
            message: `${challenge.creator.display_name} created a new challenge: ${challenge.title}`,
            data: { challenge_id: challenge.id }
        })
    
    RETURN challenge
```

**Review and Rating System:**
```pseudocode
FUNCTION submitRecipeReview(userId, recipeId, reviewData):
    // Check if user has already reviewed this recipe
    existingReview = await getExistingReview(userId, recipeId)
    
    IF existingReview:
        // Update existing review
        updatedReview = await updateReview(existingReview.id, {
            rating: reviewData.rating,
            review_text: reviewData.text,
            cooking_notes: reviewData.notes,
            photos: reviewData.photos,
            updated_at: new Date()
        })
    ELSE:
        // Create new review
        newReview = await createReview({
            recipe_id: recipeId,
            user_id: userId,
            rating: reviewData.rating,
            review_text: reviewData.text,
            cooking_notes: reviewData.notes,
            photos: reviewData.photos
        })
    
    // Update recipe's aggregate rating
    await updateRecipeRating(recipeId)
    
    // Create community activity
    await createActivity({
        user_id: userId,
        activity_type: 'review_posted',
        object_id: newReview.id,
        object_type: 'review'
    })
    
    // Notify recipe creator if it's not the same user
    recipe = await getRecipe(recipeId)
    IF recipe.created_by AND recipe.created_by !== userId:
        await sendNotification({
            user_id: recipe.created_by,
            type: 'recipe_reviewed',
            title: 'Your recipe was reviewed!',
            message: `Someone gave your recipe "${recipe.title}" ${reviewData.rating} stars`,
            data: { recipe_id: recipeId, review_id: newReview.id }
        })
    
    RETURN newReview
```