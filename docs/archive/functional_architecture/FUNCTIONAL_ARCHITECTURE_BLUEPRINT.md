# 🏗️ ChompChew Functional Architecture Blueprint

This document outlines the complete functional architecture of ChompChew, detailing every component, page, service, and utility with their specific responsibilities, data flows, and interconnections.

---

## 📱 **PAGES & ROUTES**

### **1. Home Page (`/`)**
- **File**: `src/app/page.tsx`
- **Responsibility**: Landing page with hero section, featured recipes, and how-it-works explanation
- **Input Data**: None (static content)
- **Output Data**: Search queries to recipe generation, diet modal triggers
- **Dependencies**: Header, HeroSection, SearchBar
- **Connections**: 
  - Routes to `/generate` on search
  - Opens DietQuickSetModal for preferences
  - Displays featured recipe previews

### **2. Recipe Generation Page (`/generate`)**
- **File**: `src/app/generate/page.tsx` *(TO BE CREATED)*
- **Responsibility**: Main recipe discovery interface with search results and swipeable cards
- **Input Data**: Search query parameters, user preferences
- **Output Data**: Recipe selections, save/skip actions
- **Dependencies**: RecipeCardDeck, SearchBar, DietQuickSetModal
- **Connections**:
  - Receives search from home page
  - Calls recipe generation API
  - Saves recipes to user profile

### **3. Recipe Detail Page (`/recipe/[id]`)**
- **File**: `src/app/recipe/[id]/page.tsx` *(TO BE CREATED)*
- **Responsibility**: Full recipe view with ingredients, instructions, nutrition
- **Input Data**: Recipe ID, user dietary preferences
- **Output Data**: Cooking mode activation, recipe modifications
- **Dependencies**: SafetyValidationService, RecipeCard
- **Connections**:
  - Accessed from RecipeCardDeck
  - Shows safety warnings/validations
  - Links to cooking mode

### **4. User Profile Page (`/profile`)**
- **File**: `src/app/profile/page.tsx` *(TO BE CREATED)*
- **Responsibility**: User preferences, saved recipes, dietary restrictions management
- **Input Data**: User authentication data
- **Output Data**: Updated preferences, recipe collections
- **Dependencies**: DietQuickSetModal, UserService, Auth
- **Connections**:
  - Manages dietary preferences
  - Shows saved recipe history
  - Connects to all safety validations

### **5. Cooking Mode Page (`/cook/[id]`)**
- **File**: `src/app/cook/[id]/page.tsx` *(TO BE CREATED)*
- **Responsibility**: Step-by-step cooking interface with timers and progress tracking
- **Input Data**: Recipe ID, user modifications
- **Output Data**: Cooking progress, completion status
- **Dependencies**: Recipe data, timer utilities
- **Connections**:
  - Launched from recipe detail page
  - Tracks cooking progress
  - Provides feedback collection

---

## 🧩 **CORE COMPONENTS**

### **Search & Discovery Components**

#### **SearchBar**
- **File**: `src/components/recipe/SearchBar.tsx`
- **Responsibility**: Multi-modal search interface (ingredients + calories + macros)
- **Input Data**: User search query, calorie goals, macro targets
- **Output Data**: `EnhancedSearchQuery` object
- **Dependencies**: CalorieGoalInput, MacroTargetSliders, dietary-preferences types
- **Connections**:
  - Used in HeroSection and generate page
  - Triggers recipe generation API calls
  - Integrates with diet preferences

#### **CalorieGoalInput**
- **File**: `src/components/recipe/CalorieGoalInput.tsx`
- **Responsibility**: Calorie target input with validation and presets
- **Input Data**: Current calorie goal (number)
- **Output Data**: Validated calorie goal (100-3000 range)
- **Dependencies**: UI components, validation utilities
- **Connections**:
  - Embedded in SearchBar
  - Feeds into recipe generation parameters
  - Connects to user preference storage

#### **MacroTargetSliders**
- **File**: `src/components/recipe/MacroTargetSliders.tsx`
- **Responsibility**: Interactive macro percentage sliders with visual feedback
- **Input Data**: Current macro targets (MacroTargets type)
- **Output Data**: Validated macro percentages (totaling 100%)
- **Dependencies**: UI sliders, chart visualization
- **Connections**:
  - Embedded in SearchBar
  - Provides macro constraints to recipe generation
  - Syncs with user dietary preferences

### **Recipe Display Components**

#### **RecipeCardDeck**
- **File**: `src/components/recipe/RecipeCardDeck.tsx`
- **Responsibility**: Swipeable recipe card interface with save/skip functionality
- **Input Data**: Array of Recipe objects, user preferences
- **Output Data**: Recipe save/skip actions, detail view requests
- **Dependencies**: RecipeCard, swipe gesture libraries
- **Connections**:
  - Main interface on generate page
  - Receives recipes from generation API
  - Sends actions to user service

#### **RecipeCard**
- **File**: `src/components/recipe/RecipeCard.tsx`
- **Responsibility**: Individual recipe display with safety indicators and actions
- **Input Data**: Recipe object, safety validation results
- **Output Data**: User actions (save, skip, view details)
- **Dependencies**: Safety validation service, UI components
- **Connections**:
  - Used within RecipeCardDeck
  - Shows safety compliance badges
  - Links to recipe detail page

### **Preference Management Components**

#### **DietQuickSetModal**
- **File**: `src/components/recipe/DietQuickSetModal.tsx`
- **Responsibility**: Comprehensive dietary preference configuration interface
- **Input Data**: Current user preferences (DietPreferences type)
- **Output Data**: Updated dietary preferences, medical conditions, trigger foods
- **Dependencies**: dietary-preferences types, SafetyValidationService
- **Connections**:
  - Opened from multiple locations (hero, profile, search)
  - Updates user profile via UserService
  - Affects all recipe generation and validation

### **Layout Components**

#### **Header**
- **File**: `src/components/layout/Header.tsx`
- **Responsibility**: Main navigation, user authentication, quick access to preferences
- **Input Data**: User authentication state, current route
- **Output Data**: Navigation actions, auth state changes
- **Dependencies**: Auth service, navigation utilities
- **Connections**:
  - Present on all pages
  - Links to profile and preferences
  - Shows authentication status

#### **HeroSection**
- **File**: `src/components/recipe/HeroSection.tsx`
- **Responsibility**: Landing page hero with primary search interface
- **Input Data**: None (static content + search interactions)
- **Output Data**: Search queries, diet modal triggers
- **Dependencies**: SearchBar, DietQuickSetModal
- **Connections**:
  - Main entry point for recipe discovery
  - Triggers search flow
  - Opens preference configuration

---

## ⚙️ **SERVICES & UTILITIES**

### **Core Services**

#### **RecipeGenerationService**
- **File**: `src/lib/services/recipeGenerationService.ts`
- **Responsibility**: AI-powered recipe generation with dietary constraints
- **Input Data**: `EnhancedSearchQuery`, user preferences, safety constraints
- **Output Data**: Array of generated Recipe objects
- **Dependencies**: OpenAI API, SafetyValidationService, CacheService
- **Connections**:
  - Called from generate page
  - Integrates safety validation
  - Caches results for performance

#### **SafetyValidationService**
- **File**: `src/lib/services/safetyValidationService.ts`
- **Responsibility**: Medical safety validation for recipes and ingredients
- **Input Data**: Recipe ingredients, user medical conditions, trigger foods
- **Output Data**: Safety validation results, warnings, blockers
- **Dependencies**: Trigger food database, medical condition mappings
- **Connections**:
  - Used by recipe generation
  - Validates all recipe displays
  - Provides safety badges and warnings

#### **UserService**
- **File**: `src/lib/services/userService.ts`
- **Responsibility**: User profile management, preferences, and recipe history
- **Input Data**: User ID, preference updates, recipe actions
- **Output Data**: User profile data, saved recipes, preference history
- **Dependencies**: Supabase database, authentication
- **Connections**:
  - Manages all user data
  - Stores dietary preferences
  - Tracks recipe interactions

#### **CacheService**
- **File**: `src/lib/services/cacheService.ts`
- **Responsibility**: Redis-based caching for recipes and API responses
- **Input Data**: Cache keys, data objects, TTL settings
- **Output Data**: Cached data retrieval, cache invalidation
- **Dependencies**: Redis client, serialization utilities
- **Connections**:
  - Improves recipe generation performance
  - Caches user preferences
  - Reduces API call costs

### **Data & Configuration**

#### **Trigger Foods Database**
- **File**: `src/lib/data/trigger-foods.ts`
- **Responsibility**: Comprehensive database of trigger foods for medical conditions
- **Input Data**: Medical condition queries
- **Output Data**: Trigger food lists, severity levels, alternatives
- **Dependencies**: Medical condition types
- **Connections**:
  - Used by SafetyValidationService
  - Referenced in DietQuickSetModal
  - Drives recipe filtering logic

#### **Dietary Preferences Types**
- **File**: `src/types/dietary-preferences.ts`
- **Responsibility**: TypeScript type definitions for all dietary and medical data
- **Input Data**: N/A (type definitions)
- **Output Data**: Type safety across application
- **Dependencies**: None
- **Connections**:
  - Used throughout entire application
  - Ensures type safety for all dietary data
  - Defines API contracts

### **Infrastructure Utilities**

#### **Authentication Service**
- **File**: `src/lib/auth.ts`
- **Responsibility**: User authentication and session management
- **Input Data**: Login credentials, session tokens
- **Output Data**: Authentication state, user sessions
- **Dependencies**: Supabase Auth, middleware
- **Connections**:
  - Protects user-specific features
  - Enables preference persistence
  - Required for recipe saving

#### **Database Client**
- **File**: `src/lib/supabase.ts`
- **Responsibility**: Database connection and query utilities
- **Input Data**: Database queries, user data
- **Output Data**: Query results, data mutations
- **Dependencies**: Supabase client library
- **Connections**:
  - Used by all services requiring persistence
  - Stores user profiles and preferences
  - Manages recipe history

#### **OpenAI Integration**
- **File**: `src/lib/openai.ts`
- **Responsibility**: AI model integration for recipe generation
- **Input Data**: Recipe generation prompts, constraints
- **Output Data**: AI-generated recipe content
- **Dependencies**: OpenAI API client
- **Connections**:
  - Core of recipe generation service
  - Processes dietary constraints
  - Generates personalized content

---

## 🔌 **API ENDPOINTS**

### **Recipe APIs**

#### **POST /api/recipes/generate**
- **Responsibility**: Generate recipes based on search criteria and dietary preferences
- **Input Data**: `EnhancedSearchQuery`, user preferences
- **Output Data**: Array of generated recipes with safety validation
- **Dependencies**: RecipeGenerationService, SafetyValidationService
- **Connections**: Called from generate page, cached by CacheService

#### **GET /api/recipes/[id]**
- **Responsibility**: Retrieve specific recipe details with user-specific safety info
- **Input Data**: Recipe ID, user authentication
- **Output Data**: Complete recipe object with safety validation
- **Dependencies**: Database, SafetyValidationService
- **Connections**: Used by recipe detail page

#### **POST /api/recipes/[id]/save**
- **Responsibility**: Save recipe to user's collection
- **Input Data**: Recipe ID, user authentication
- **Output Data**: Save confirmation, updated user profile
- **Dependencies**: UserService, authentication
- **Connections**: Called from RecipeCard actions

### **User Management APIs**

#### **GET /api/user/preferences**
- **Responsibility**: Retrieve user's dietary preferences and medical conditions
- **Input Data**: User authentication
- **Output Data**: Complete user preference profile
- **Dependencies**: UserService, authentication
- **Connections**: Used by all preference-dependent features

#### **PUT /api/user/preferences**
- **Responsibility**: Update user's dietary preferences
- **Input Data**: Updated preferences object, user authentication
- **Output Data**: Confirmation, updated preference profile
- **Dependencies**: UserService, SafetyValidationService
- **Connections**: Called from DietQuickSetModal

### **Safety & Validation APIs**

#### **POST /api/safety/validate**
- **Responsibility**: Validate recipe safety for specific user conditions
- **Input Data**: Recipe ingredients, user medical conditions
- **Output Data**: Safety validation results, warnings, alternatives
- **Dependencies**: SafetyValidationService, trigger food database
- **Connections**: Used throughout recipe display and generation

---

## 🔄 **DATA FLOW ARCHITECTURE**

### **Primary User Journeys**

1. **Recipe Discovery Flow**:
   ```
   HomePage → SearchBar → /generate → RecipeGenerationService → RecipeCardDeck → RecipeCard
   ```

2. **Preference Management Flow**:
   ```
   Any Page → DietQuickSetModal → UserService → Database → SafetyValidationService
   ```

3. **Recipe Safety Flow**:
   ```
   Recipe Display → SafetyValidationService → Trigger Food Database → Safety Badges
   ```

4. **Recipe Interaction Flow**:
   ```
   RecipeCard → UserService → Database → Profile Updates
   ```

### **Cross-Cutting Concerns**

- **Authentication**: Required for preferences, saving, and personalization
- **Safety Validation**: Applied to all recipe displays and generation
- **Caching**: Improves performance across all API calls
- **Type Safety**: Enforced throughout with TypeScript interfaces

---

## 🎯 **INTEGRATION POINTS**

### **External Dependencies**
- **OpenAI API**: Recipe generation and content creation
- **Supabase**: Database, authentication, and real-time features
- **Redis**: Caching and session management
- **Next.js**: Framework providing routing, API, and SSR capabilities

### **Internal Integration Patterns**
- **Service Layer**: All business logic encapsulated in services
- **Type Safety**: Shared types ensure consistency across components
- **Event-Driven**: Components communicate through props and callbacks
- **Centralized State**: User preferences managed through UserService
- **Safety-First**: All recipe operations validated through SafetyValidationService

This architecture provides a comprehensive foundation for ChompChew's mission of anxiety-free recipe discovery with medical safety as the top priority. 