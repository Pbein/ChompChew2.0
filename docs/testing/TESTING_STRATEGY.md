# 🧪 ChompChew Testing Strategy

## 🎯 Testing Philosophy

**Test-Driven Rebuild**: We will use a comprehensive testing strategy to ensure every feature is properly validated as it's built and integrated.

**The Testing Pyramid**: Our approach is balanced to maximize confidence and speed.
- **E2E (End-to-End) Tests (10%)**: Simulates full user journeys in a real browser. Highest confidence, but slower.
- **Integration Tests (30%)**: Verifies that different parts of the app (components, services, stores) work together correctly.
- **Unit Tests (60%)**: Fast, isolated tests for individual functions and business logic.

---

## 🛠️ Testing Infrastructure

**Testing Stack**:
-   **Test Runner**: Vitest
-   **Component & Integration Testing**: React Testing Library
-   **E2E Testing**: Playwright
-   **API Mocking**: MSW (Mock Service Worker)
-   **Coverage**: `v8` (built into Vitest)
-   **Accessibility**: `@axe-core/react`

**✅ CURRENT STATUS**: The testing infrastructure is fully operational with **229 tests** across **25 suites**, boasting an **~87% coverage rate** and a **94% pass rate**.

**Note on Known Failures**: There are currently test failures in `tests/savedRecipesStore.test.ts` and `tests/components/Header.test.tsx` related to a persistent Supabase client mocking issue in the test environment. The tests themselves document critical logic (localStorage migration, theme switching), but they are unable to pass due to this technical challenge. These will be addressed in a future technical debt sprint.

---

## 🔬 Test Plan by Feature

This section outlines the testing requirements for each phase of the application, marking what's complete and what's next.

### Phase 1 & 2: Core Services, Auth & Search

#### **✅ Implemented & Well-Covered**
-   **Zustand Stores**: `ProfileStore` and `SavedRecipesStore` are unit-tested. Includes tests for intelligent `localStorage` migration for guest users.
-   **Search Components**: `HeroSearch` and related UI are tested.
-   **Search Integration**: Logic for merging profile preferences with search is tested.
-   **Basic Recipe Fetching**: Core `fetchRecipes` and `fetchRecipe` logic is covered.
-   **Core UI Components**: The main `Header`, including navigation, mobile menu, and theme (dark/light mode) toggling, is covered by tests.

#### **❌ Critical Missing Tests**

This is the most urgent area to address to ensure user safety and application stability.

```typescript
// 🚨 URGENT - SafetyValidationService Tests
// File: tests/services/safetyValidation.test.ts
// Source: src/features/core/services/safetyValidationService.ts
// WHY: Core to the app's mission. Bugs can have real-world health consequences.
describe('SafetyValidationService', () => {
  test('validateRecipeSafety() correctly identifies and blocks recipes with known allergens') ❌
  test('validateRecipeSafety() correctly warns for trigger foods based on medical conditions') ❌
  test('validateRecipeSafety() distinguishes between severity levels (warning vs. blocker)') ❌
  test('validateSearchConstraints() detects conflicting embrace/avoid foods') ❌
  test('getSafeAlternatives() suggests appropriate substitutions for common allergens') ❌
});

// 🚨 URGENT - UserService & Auth Tests
// File: tests/services/userService.test.ts
// Source: src/features/core/services/userService.ts
// WHY: Handles all user data, profiles, and authentication. Critical for user trust.
describe('UserService & Auth', () => {
  test('getUserProfile() and updateUserProfile() handle all CRUD operations correctly') ❌
  test('handles user favorites (add, remove, view) correctly') ❌
  test('createUserProfile() works on first sign-up and handles duplicates') ❌
  // Note: Full E2E tests are required for the complete auth journey (see Phase 7).
});

// 🚨 HIGH PRIORITY - CacheService Tests
// File: tests/services/cacheService.test.ts
// Source: src/features/core/services/cacheService.ts
// WHY: Performance and data consistency rely on the cache.
describe('CacheService', () => {
  test('correctly stores and retrieves data (e.g., user profiles) from Redis cache') ❌
  test('cache invalidation (e.g., after a profile update) works as expected') ❌
  test('handles cache misses and Redis connection errors gracefully') ❌
  test('cache TTL (Time To Live) behavior is correctly implemented') ❌
});
```

---

### Phase 3 & 4: Recipe Discovery & Safety Features

#### **✅ Implemented & Well-Covered**
-   **Recipe Components**: `RecipeCard` and `SavedRecipesPage` are well-tested.
-   **AI Image Generation**: The `aiImageService` is tested.
-   **Recent Validations**: Tests for recipe display counts, UUID formats, and database fallbacks have been implemented.

#### **❌ Missing Critical Tests**
```typescript
// 🚨 HIGH PRIORITY - Recipe Generation Service Integration
// File: tests/integration/recipeGeneration.test.ts
// WHY: Core feature for premium users that integrates multiple services.
describe('Recipe Generation Integration', () => {
    test('a search query with profile constraints generates appropriate and safe recipes') ❌
    test('the end-to-end flow of AI recipe generation and safety validation works') ❌
    test('OpenAI API integration handles errors and retries gracefully') ❌
});

// 🚨 HIGH PRIORITY - Profile Management Integration Test
// File: tests/integration/profileManagement.test.tsx
// WHY: Ensures users can reliably update the dietary profiles that power the entire app.
describe('Profile Management Page', () => {
  test('allows users to add and remove allergens/avoided foods') ❌
  test('allows users to update macro targets using sliders') ❌
  test('successfully saves the updated profile to the database and updates the state store') ❌
  test('handles database errors gracefully during profile update') ❌
});
```

---

### Phase 5 & 6: Nutrition, UI Polish & Accessibility

This phase is currently planned and does not have existing tests.

#### **📋 Planned Tests**
```typescript
// Nutrition Components
describe('MacroTargetSliders', () => {
  test('maintains 100% total when adjusting sliders') 📋
  test('validates macro percentages correctly') 📋
});

describe('CalorieGoalInput', () => {
  test('validates calorie input ranges') 📋
  test('applies quick preset buttons') 📋
});

// Accessibility & Performance
describe('Accessibility & Performance', () => {
  test('all interactive components are keyboard navigable and have no axe violations') 📋
  test('critical pages meet performance benchmarks (e.g., search < 2s, generation < 5s)') 📋
});
```
---

### Phase 7: E2E (End-to-End) Testing with Playwright

This is the final layer of the pyramid and validates full user journeys. It is a critical gap that needs to be filled.

#### **❌ Missing E2E Test Scenarios**
```typescript
// Playwright E2E Tests (to be created in tests/e2e/)
describe('Critical User Journeys', () => {
  test('Full Authentication Flow (auth.spec.ts)', async ({ page }) => {
    // 1. User can sign up for a new account.
    // 2. User is redirected and sees a logged-in state.
    // 3. User can log out.
    // 4. User can log back in with the same credentials.
  }) ❌

  test('Cookbook and Recipe Saving Flow (cookbook.spec.ts)', async ({ page }) => {
    // 1. User logs in.
    // 2. Searches for a recipe.
    // 3. Saves the recipe from the detail page.
    // 4. Navigates to the "Saved Recipes" page.
    // 5. Verifies the recipe is present.
  }) ❌

  test('Profile-driven Search and Discovery (search.spec.ts)', async ({ page }) => {
    // 1. User logs in.
    // 2. Sets a specific dietary restriction (e.g., "no dairy") in their profile.
    // 3. Navigates to the homepage/search.
    // 4. Verifies that recipes containing dairy are not shown or are appropriately flagged.
  }) ❌
});
```

---

## 📈 Quality & Coverage Goals

-   **Overall Coverage**: Achieve and maintain **>90%** test coverage.
-   **Business Logic**: Target **>95%** coverage for all core services (`/services` directory).
-   **Quality Gates**: All new pull requests are required to pass all CI checks before being eligible for merging into the `main` branch. This is enforced via our GitHub Actions workflow.

## 🚀 Immediate Action Plan (Next 3 Sprints)

1.  **Sprint 1: Critical Service Logic**
    -   Implement all tests for `SafetyValidationService`.
    -   Implement all tests for `UserService`.
2.  **Sprint 2: Integration & E2E Foundation**
    -   Implement integration tests for Recipe Generation and Profile Management.
    -   Build the E2E test for the Authentication Flow.
3.  **Sprint 3: Cache & E2E Expansion**
    -   Implement tests for the `CacheService`.
    -   Build E2E tests for the Cookbook and Profile-driven Search.

This consolidated strategy provides a clear and actionable path to improving application quality and reliability.

## 📋 Planned Tests

-   **New Tests for LocalStorage Migration**:
    -   **Test**: `localStorageMigration.test.ts`
    -   **Purpose**: Ensure that recipes saved by users are correctly migrated between guest and authenticated states.
-   **New Tests for Theme Toggling**:
    -   **Test**: `themeToggling.test.ts`
    -   **Purpose**: Ensure that the application's theme switching functionality works correctly.

This consolidated strategy provides a clear and actionable path to improving application quality and reliability. 