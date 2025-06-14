### Feature 9: Smart Shopping Lists

**Goal:** Automated shopping list generation from saved recipes with smart grouping, quantity optimization, and store integration.

**API Relationships:**
- `/api/shopping-lists` - Shopping list management
- `/api/pantry` - User pantry tracking
- Grocery store APIs for pricing and availability
- Nutrition APIs for ingredient verification

**Database Schema:**
```sql
-- Shopping lists
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    recipe_ids UUID[],
    custom_items JSONB,
    total_estimated_cost DECIMAL(8,2),
    store_preference VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Shopping list items
CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopping_list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(200) NOT NULL,
    quantity DECIMAL(8,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    estimated_price DECIMAL(6,2),
    category VARCHAR(100), -- 'produce', 'dairy', 'meat', etc.
    is_purchased BOOLEAN DEFAULT false,
    notes TEXT,
    recipe_sources UUID[] -- which recipes need this ingredient
);

-- User pantry
CREATE TABLE user_pantry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(200) NOT NULL,
    quantity DECIMAL(8,2),
    unit VARCHAR(50),
    expiration_date DATE,
    purchase_date DATE,
    location VARCHAR(100), -- 'fridge', 'pantry', 'freezer'
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, ingredient_name, location)
);

-- Ingredient price tracking
CREATE TABLE ingredient_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredient_name VARCHAR(200) NOT NULL,
    store_name VARCHAR(100) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    size VARCHAR(100), -- '1 lb', '16 oz', etc.
    region VARCHAR(100),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(ingredient_name, store_name, size, region)
);

CREATE INDEX idx_shopping_lists_user ON shopping_lists(user_id, created_at DESC);
CREATE INDEX idx_shopping_list_items_list ON shopping_list_items(shopping_list_id);
CREATE INDEX idx_user_pantry_user ON user_pantry(user_id, ingredient_name);
CREATE INDEX idx_ingredient_prices_lookup ON ingredient_prices(ingredient_name, store_name);
```

**Smart List Generation:**
```pseudocode
FUNCTION generateShoppingList(userId, recipeIds, preferences):
    // Get all ingredients from selected recipes
    allIngredients = []
    FOR recipeId IN recipeIds:
        recipe = await getRecipe(recipeId)
        allIngredients = [...allIngredients, ...recipe.ingredients]
    
    // Check user's pantry for existing ingredients
    pantryItems = await getUserPantry(userId)
    
    // Consolidate and calculate needed quantities
    consolidatedList = {}
    FOR ingredient IN allIngredients:
        key = normalizeIngredientName(ingredient.name)
        
        IF consolidatedList[key]:
            // Combine quantities, handling unit conversions
            combinedQty = convertAndCombineUnits(
                consolidatedList[key].quantity,
                consolidatedList[key].unit,
                ingredient.amount,
                ingredient.unit
            )
            consolidatedList[key].quantity = combinedQty.amount
            consolidatedList[key].unit = combinedQty.unit
        ELSE:
            consolidatedList[key] = {
                name: ingredient.name,
                quantity: ingredient.amount,
                unit: ingredient.unit,
                category: ingredient.category,
                recipeId: ingredient.recipeId
            }
    
    // Subtract pantry items
    shoppingNeeded = []
    FOR item IN consolidatedList:
        pantryItem = pantryItems.find(p => p.ingredient_name === item.name)
        
        IF pantryItem:
            neededQty = item.quantity - pantryItem.quantity
            IF neededQty > 0:
                shoppingNeeded.push({
                    ...item,
                    quantity: neededQty,
                    partiallyInPantry: true
                })
        ELSE:
            shoppingNeeded.push(item)
    
    // Optimize quantities for store packaging
    optimizedList = await optimizeForStorePackaging(shoppingNeeded, preferences.store)
    
    // Estimate costs
    estimatedCosts = await estimateShoppingCosts(optimizedList, preferences.store)
    
    // Group by store sections for efficient shopping
    groupedList = groupByStoreSection(optimizedList)
    
    RETURN {
        items: groupedList,
        totalEstimatedCost: estimatedCosts.total,
        savingsFromPantry: estimatedCosts.pantryValue,
        optimizations: optimizedList.optimizations
    }
```

**Pantry Management:**
```pseudocode
FUNCTION managePantry(userId, action, itemData):
    SWITCH action:
        CASE 'add':
            // Add or update pantry item
            existingItem = await getPantryItem(userId, itemData.name, itemData.location)
            
            IF existingItem:
                // Update quantity and expiration
                newQuantity = existingItem.quantity + itemData.quantity
                await updatePantryItem(existingItem.id, {
                    quantity: newQuantity,
                    expiration_date: itemData.expirationDate,
                    updated_at: new Date()
                })
            ELSE:
                await createPantryItem({
                    user_id: userId,
                    ingredient_name: itemData.name,
                    quantity: itemData.quantity,
                    unit: itemData.unit,
                    expiration_date: itemData.expirationDate,
                    location: itemData.location
                })
            
            // Update user's taste profile based on purchases
            await updateTasteProfile(userId, itemData.name, 'purchased')
        
        CASE 'use':
            // Reduce quantity when cooking
            pantryItem = await getPantryItem(userId, itemData.name, itemData.location)
            
            IF pantryItem AND pantryItem.quantity >= itemData.usedQuantity:
                newQuantity = pantryItem.quantity - itemData.usedQuantity
                
                IF newQuantity <= 0:
                    await deletePantryItem(pantryItem.id)
                ELSE:
                    await updatePantryItem(pantryItem.id, {
                        quantity: newQuantity,
                        updated_at: new Date()
                    })
        
        CASE 'check_expiration':
            // Get items expiring soon
            expiringItems = await query(`
                SELECT * FROM user_pantry 
                WHERE user_id = $1 
                AND expiration_date <= $2 
                AND expiration_date > CURRENT_DATE
                ORDER BY expiration_date ASC
            `, [userId, new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)]) // 3 days
            
            // Suggest recipes using expiring ingredients
            suggestions = await findRecipesUsingIngredients(
                expiringItems.map(item => item.ingredient_name)
            )
            
            RETURN {
                expiringItems,
                recipeSuggestions: suggestions
            }
```