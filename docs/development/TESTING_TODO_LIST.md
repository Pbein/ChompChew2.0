# Testing TODO List

## Overview
This document outlines critical missing tests that need to be implemented to ensure ChompChew's reliability, safety, and performance. These tests have been prioritized based on user safety, core functionality impact, and system reliability.

**Last Updated**: December 2024  
**Status**: 3 Critical Test Files Missing  
**Current Coverage**: ~20 test files, ~159 tests

---

## 🚨 Critical Priority Tests (Must Implement)

### 1. Safety Validation Service Tests ⚠️ **HIGHEST PRIORITY**
**File to Create**: `tests/lib/safetyValidationService.test.ts`  
**Source**: `src/features/core/services/safetyValidationService.ts`

**Why Critical**: This service validates recipe safety against user allergies and medical conditions. Bugs could cause serious medical issues for users.

**Test Coverage Needed**:
- [ ] **`validateRecipeSafety()` Function**
  - [ ] Test allergen detection in ingredients
  - [ ] Test medical condition trigger detection
  - [ ] Test severity level handling (mild, moderate, severe, medical)
  - [ ] Test warning generation for mild/moderate issues
  - [ ] Test blocker generation for severe/medical issues
  - [ ] Test suggestion generation based on validation results
  - [ ] Test edge cases (empty ingredients, malformed data)
  - [ ] Test multiple allergens in single ingredient
  - [ ] Test case-insensitive ingredient matching

- [ ] **`validateSearchConstraints()` Function**
  - [ ] Test conflicting embrace/avoid food detection
  - [ ] Test medical condition vs embrace food conflicts
  - [ ] Test empty preference handling
  - [ ] Test malformed preference data

- [ ] **`getSafeAlternatives()` Function**
  - [ ] Test dairy alternative suggestions
  - [ ] Test gluten alternative suggestions
  - [ ] Test nut alternative suggestions
  - [ ] Test unknown ingredient handling
  - [ ] Test empty ingredient input

**Estimated Effort**: 2-3 hours  
**Risk if Not Done**: User safety compromised, potential medical emergencies

---

### 2. User Service Tests ⚠️ **HIGH PRIORITY**
**File to Create**: `tests/lib/userService.test.ts`  
**Source**: `src/features/core/services/userService.ts`

**Why Critical**: Handles all user data operations including profiles, favorites, and account management. Core user functionality depends on this.

**Test Coverage Needed**:
- [ ] **User Profile Operations**
  - [ ] Test `getUserProfile()` success case
  - [ ] Test `getUserProfile()` with non-existent user
  - [ ] Test `getUserProfile()` database error handling
  - [ ] Test `updateUserProfile()` success case
  - [ ] Test `updateUserProfile()` with invalid data
  - [ ] Test `updateUserProfile()` database error handling
  - [ ] Test `createUserProfile()` success case
  - [ ] Test `createUserProfile()` duplicate user handling
  - [ ] Test `deleteUserProfile()` success case
  - [ ] Test `deleteUserProfile()` non-existent user

- [ ] **Favorites Management**
  - [ ] Test `getUserFavorites()` success case
  - [ ] Test `getUserFavorites()` empty favorites
  - [ ] Test `addToFavorites()` success case
  - [ ] Test `addToFavorites()` duplicate handling
  - [ ] Test `removeFromFavorites()` success case
  - [ ] Test `removeFromFavorites()` non-existent favorite

- [ ] **Error Handling & Edge Cases**
  - [ ] Test network timeout scenarios
  - [ ] Test malformed user ID inputs
  - [ ] Test database connection failures
  - [ ] Test concurrent operation handling

**Estimated Effort**: 2-3 hours  
**Risk if Not Done**: User data corruption, account management failures, privacy issues

---

### 3. Cache Service Tests ⚠️ **MEDIUM PRIORITY**
**File to Create**: `tests/lib/cacheService.test.ts`  
**Source**: `src/features/core/services/cacheService.ts`

**Why Critical**: Handles all Redis caching operations. Performance and data consistency depend on proper caching behavior.

**Test Coverage Needed**:
- [ ] **User Data Caching**
  - [ ] Test `getUserProfile()` cache hit/miss
  - [ ] Test `setUserProfile()` cache storage
  - [ ] Test `invalidateUserProfile()` cache clearing
  - [ ] Test `getUserFavorites()` cache operations
  - [ ] Test cache TTL behavior

- [ ] **Recipe Caching**
  - [ ] Test `getRecipe()` cache operations
  - [ ] Test `setRecipe()` cache storage
  - [ ] Test `invalidateRecipe()` and cascade effects
  - [ ] Test popular/recent recipe caching
  - [ ] Test recipe review caching

- [ ] **Search Caching**
  - [ ] Test `getSearchResults()` with different filters
  - [ ] Test `setSearchResults()` cache storage
  - [ ] Test search suggestion caching
  - [ ] Test cache key generation consistency

- [ ] **Session & Analytics**
  - [ ] Test session management operations
  - [ ] Test analytics increment operations
  - [ ] Test temporary data storage
  - [ ] Test bulk invalidation operations

- [ ] **Error Handling**
  - [ ] Test Redis connection failures
  - [ ] Test cache corruption scenarios
  - [ ] Test TTL expiration behavior
  - [ ] Test memory pressure handling

**Estimated Effort**: 3-4 hours  
**Risk if Not Done**: Performance degradation, stale data served to users, cache inconsistencies

---

## 📋 Implementation Guidelines

### Test Structure Template
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ServiceName } from '@/path/to/service';

describe('ServiceName', () => {
  beforeEach(() => {
    // Setup mocks and test data
  });

  afterEach(() => {
    // Cleanup
  });

  describe('FunctionName', () => {
    it('should handle success case', () => {
      // Test implementation
    });

    it('should handle error case', () => {
      // Test implementation
    });

    it('should handle edge cases', () => {
      // Test implementation
    });
  });
});
```

### Mock Requirements
- **SafetyValidationService**: Mock dietary preferences, recipe data
- **UserService**: Mock Supabase client, database responses
- **CacheService**: Mock Redis client, cache operations

### Test Data Requirements
- Create fixture files for consistent test data
- Include edge cases (empty, null, malformed data)
- Cover all user types (free, premium, admin)
- Include various dietary restrictions and medical conditions

---

## 📊 Current Test Coverage Status

### ✅ Well-Tested Areas
- **UI Components**: LoadingTidbit, Header, RecipeCard, HeroSearch (5 components)
- **Core Libraries**: loading-tidbits, aiImageService, recipeGenerationService, recipes
- **Integration**: Recipe generation with AI, search with profile
- **Validation**: Recipe detail validation, UUID validation, display validation
- **Authentication**: Auth utilities, user roles, permissions
- **Data**: Validators, prompt builders, recipe actions

### ❌ Missing Critical Tests
- **Safety Validation**: Recipe safety against allergies/medical conditions
- **User Management**: Profile operations, favorites, account management  
- **Caching**: Redis operations, data consistency, performance

### 📈 Test Metrics
- **Current**: ~20 test files, ~159 tests
- **After Implementation**: ~23 test files, ~200+ tests
- **Critical Coverage Gap**: 3 missing files covering life-critical functionality

---

## 🎯 Success Criteria

### Safety Validation Tests
- [ ] 100% function coverage for safety validation service
- [ ] All allergen detection scenarios tested
- [ ] Medical condition validation thoroughly tested
- [ ] Edge cases and error conditions covered

### User Service Tests
- [ ] All CRUD operations tested with success/failure scenarios
- [ ] Database error handling validated
- [ ] Favorites management fully tested
- [ ] Concurrent operation edge cases covered

### Cache Service Tests
- [ ] All cache operations tested (get, set, delete, invalidate)
- [ ] TTL behavior validated
- [ ] Error handling for Redis failures tested
- [ ] Performance characteristics validated

---

## 📅 Implementation Timeline

### Phase 1: Safety First (Week 1)
- [ ] Implement SafetyValidationService tests
- [ ] Validate against real dietary restriction scenarios
- [ ] Test with medical condition data

### Phase 2: Core Functionality (Week 2)
- [ ] Implement UserService tests
- [ ] Cover all user data operations
- [ ] Test error scenarios thoroughly

### Phase 3: Performance & Consistency (Week 3)
- [ ] Implement CacheService tests
- [ ] Validate caching behavior
- [ ] Test performance characteristics

---

## 🔍 Testing Best Practices

### Safety Testing
- Test with real allergen data
- Validate medical condition triggers
- Ensure no false negatives for safety-critical checks
- Test ingredient parsing edge cases

### Service Testing
- Mock external dependencies (database, cache)
- Test both success and failure paths
- Validate error messages and codes
- Test concurrent operations

### Performance Testing
- Validate cache hit/miss ratios
- Test under load conditions
- Measure response times
- Validate memory usage

---

## 📝 Notes

- These tests are **not optional** - they cover life-critical functionality
- Safety validation tests should be run in CI/CD pipeline
- Consider adding integration tests that combine these services
- Update this document as tests are implemented
- Review and update test coverage quarterly

---

**Next Action**: Start with SafetyValidationService tests - user safety is paramount. 