# 🧪 ChompChew Testing Strategy

## **🎯 Testing Philosophy**

**Test-Driven Rebuild**: Introduce comprehensive testing from Phase 0 to ensure every feature is properly tested as it's integrated back into the application.

**Testing Pyramid**:
- **Unit Tests** (70%) - Fast, isolated tests for business logic
- **Integration Tests** (20%) - Component and service interactions
- **E2E Tests** (10%) - Critical user workflows

---

## **🛠️ Testing Infrastructure Setup**

### **Phase 0: Testing Foundation**
**Duration**: Part of Phase 0 preparation (0.5 days)

**Testing Stack**:
```json
{
  "testRunner": "Vitest",
  "componentTesting": "@testing-library/react",
  "e2eTesting": "Playwright",
  "mocking": "MSW (Mock Service Worker)",
  "coverage": "c8 (built into Vitest)",
  "accessibility": "@axe-core/react"
}
```

**Setup Actions**:
- [ ] Install testing dependencies
- [ ] Configure Vitest with TypeScript support
- [ ] Set up Testing Library with custom render utilities
- [ ] Configure MSW for API mocking
- [ ] Set up Playwright for E2E tests
- [ ] Configure coverage reporting
- [ ] Set up CI/CD testing pipeline

**Configuration Files**:
```
tests/
├── setup/
│   ├── vitest.config.ts       # Vitest configuration
│   ├── test-utils.tsx         # Custom render utilities
│   ├── msw-handlers.ts        # API mock handlers
│   └── playwright.config.ts   # E2E test configuration
├── mocks/
│   ├── zustand.ts            # Store mocking utilities
│   ├── next-router.ts        # Next.js router mocks
│   └── openai.ts             # OpenAI API mocks
└── fixtures/
    ├── recipes.ts            # Test recipe data
    ├── users.ts              # Test user data
    └── search-queries.ts     # Test search data
```

---

## **🔬 Unit Testing Strategy by Phase**

### **Phase 1: Foundation & Core Services**

#### **1.1 Core Infrastructure Testing**
**Focus**: Test utilities, stores, and configuration

**Test Categories**:
```typescript
// Core Utilities
describe('Design System Utils', () => {
  test('cn() combines class names correctly')
  test('color utilities generate correct values')
  test('spacing utilities work with design tokens')
})

// Zustand Store Testing
describe('Search Store', () => {
  test('initializes with correct default state')
  test('parseTokenToCategories() categorizes correctly')
  test('addSearchChip() updates state properly')
  test('clearSearch() resets state')
})

// Configuration Testing
describe('OpenAI Config', () => {
  test('client initializes with correct settings')
  test('handles API key validation')
})
```

**Testing Utilities**:
```typescript
// tests/setup/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Custom render with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

#### **1.2 Service Layer Testing**
**Focus**: Test all business logic services

**Test Structure**:
```typescript
// Recipe Generation Service Tests
describe('RecipeGenerationService', () => {
  beforeEach(() => {
    // Setup MSW handlers for OpenAI API
  })

  test('generateRecipe() creates valid recipe from input')
  test('handles dietary restrictions correctly')
  test('validates input schema properly')
  test('handles API errors gracefully')
  test('estimates token costs accurately')
})

// Safety Validation Service Tests
describe('SafetyValidationService', () => {
  test('validateRecipeSafety() detects allergens')
  test('handles medical condition triggers')
  test('distinguishes severity levels correctly')
  test('suggests safe alternatives')
  test('validates search constraints')
})

// Cache Service Tests
describe('CacheService', () => {
  test('stores and retrieves recipes correctly')
  test('handles TTL expiration')
  test('invalidates cache properly')
  test('handles Redis connection errors')
})
```

---

### **Phase 2: Search Foundation**

#### **2.1 Search Component Testing**
**Focus**: Test search input, parsing, and state management

**Component Tests**:
```typescript
// Search Input Component
describe('SearchInput', () => {
  test('renders with placeholder text')
  test('updates input value on typing')
  test('triggers parsing on input change')
  test('shows suggestions popover when focused')
  test('handles keyboard shortcuts (Enter, Escape)')
  test('calls onSearch callback with structured query')
})

// Token Parsing Logic
describe('Token Parsing', () => {
  test('categorizes ingredients correctly')
  test('detects exclusion patterns ("no dairy")')
  test('identifies dietary preferences')
  test('recognizes meal types and cuisines')
  test('calculates confidence scores accurately')
  test('handles edge cases and typos')
})

// Search Chips Component
describe('SearchChip', () => {
  test('renders with correct category styling')
  test('becomes editable on click')
  test('saves changes on blur/enter')
  test('removes chip on X button click')
  test('shows correct category emoji and color')
})
```

#### **2.2 Search Store Integration Testing**
**Focus**: Test store interactions and state updates

**Integration Tests**:
```typescript
describe('Search Store Integration', () => {
  test('input parsing updates store state correctly')
  test('suggestion selection creates search chips')
  test('search execution generates structured query')
  test('search history is maintained properly')
  test('store resets correctly on clear')
})
```

---

### **Phase 3: Recipe Discovery**

#### **3.1 Recipe Display Testing**
**Focus**: Test recipe cards, grids, and detail views

**Component Tests**:
```typescript
// Recipe Card Component
describe('RecipeCard', () => {
  test('renders recipe information correctly')
  test('displays dietary compliance indicators')
  test('shows safety warnings when present')
  test('handles missing image gracefully')
  test('calls correct callbacks on user actions')
})

// Recipe Card Deck
describe('RecipeCardDeck', () => {
  test('displays current recipe correctly')
  test('advances to next recipe on save/skip')
  test('shows empty state when no recipes')
  test('handles loading states properly')
  test('calls onLoadMore when reaching end')
})
```

#### **3.2 Recipe Generation Integration**
**Focus**: Test recipe API integration and data flow

**Integration Tests**:
```typescript
describe('Recipe Generation Integration', () => {
  test('search query generates appropriate recipes')
  test('dietary restrictions are applied correctly')
  test('recipe safety validation works end-to-end')
  test('caching improves performance')
  test('error states are handled gracefully')
})
```

---

### **Phase 4: Safety & Dietary Features**

#### **4.1 Safety System Testing**
**Focus**: Critical safety validation testing

**Safety Tests**:
```typescript
// Diet Quick-Set Modal
describe('DietQuickSetModal', () => {
  test('saves dietary preferences correctly')
  test('applies diet templates properly')
  test('handles medical condition selection')
  test('validates allergen restrictions')
  test('shows severity level indicators')
})

// Safety Validation Integration
describe('Safety Validation Integration', () => {
  test('blocks recipes with allergens (zero tolerance)')
  test('warns about trigger foods for medical conditions')
  test('suggests safe ingredient alternatives')
  test('validates search constraints before generation')
  test('handles edge cases in ingredient detection')
})
```

**Critical Safety Test Cases**:
```typescript
// Zero Tolerance Allergen Testing
describe('Allergen Safety (Critical)', () => {
  const allergens = ['dairy', 'nuts', 'gluten', 'shellfish']
  
  allergens.forEach(allergen => {
    test(`blocks ALL recipes containing ${allergen}`, async () => {
      const userPrefs = { avoidFoods: [allergen], severityLevels: { [allergen]: 'medical' } }
      const recipe = { ingredients: [`contains ${allergen}`] }
      
      const validation = await validateRecipeSafety(recipe, userPrefs)
      
      expect(validation.isSafe).toBe(false)
      expect(validation.blockers).toHaveLength(1)
      expect(validation.blockers[0].severity).toBe('severe')
    })
  })
})
```

---

### **Phase 5: Nutrition & Macro Features**

#### **5.1 Nutrition Component Testing**
**Focus**: Test calorie and macro calculation accuracy

**Component Tests**:
```typescript
// Macro Target Sliders
describe('MacroTargetSliders', () => {
  test('maintains 100% total when adjusting sliders')
  test('validates macro percentages correctly')
  test('applies preset macro templates')
  test('calculates calorie distribution accurately')
})

// Calorie Goal Input
describe('CalorieGoalInput', () => {
  test('validates calorie input ranges')
  test('applies quick preset buttons')
  test('integrates with macro calculations')
  test('handles invalid input gracefully')
})
```

---

### **Phase 6: UI/UX Polish & Advanced Features**

#### **6.1 Accessibility Testing**
**Focus**: Ensure WCAG 2.2 AA compliance

**Accessibility Tests**:
```typescript
// Accessibility Testing with axe-core
describe('Accessibility Compliance', () => {
  test('search interface has no accessibility violations', async () => {
    const { container } = render(<SearchInterface />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('recipe cards are keyboard navigable')
  test('screen readers can access all content')
  test('color contrast meets WCAG standards')
  test('focus management works correctly')
})
```

#### **6.2 Performance Testing**
**Focus**: Ensure performance benchmarks are met

**Performance Tests**:
```typescript
describe('Performance Benchmarks', () => {
  test('search response time < 2 seconds')
  test('recipe generation < 5 seconds')
  test('component render time < 100ms')
  test('bundle size within limits')
})
```

---

### **Phase 7: Integration & E2E Testing**

#### **7.1 End-to-End User Workflows**
**Focus**: Test complete user journeys

**E2E Test Scenarios**:
```typescript
// Playwright E2E Tests
describe('Complete User Workflows', () => {
  test('User can search, find, and save a recipe', async ({ page }) => {
    // Navigate to app
    await page.goto('/')
    
    // Perform search
    await page.fill('[data-testid="search-input"]', 'chicken paleo no dairy')
    await page.click('[data-testid="search-button"]')
    
    // Verify results
    await expect(page.locator('[data-testid="recipe-card"]')).toBeVisible()
    
    // Save recipe
    await page.click('[data-testid="save-recipe"]')
    
    // Verify saved
    await expect(page.locator('[data-testid="saved-indicator"]')).toBeVisible()
  })

  test('User can set dietary preferences and get safe recipes')
  test('User can navigate through recipe card deck')
  test('User can generate custom recipe with constraints')
})
```

---

## **📊 Testing Metrics & Coverage**

### **Coverage Targets**
- **Overall Coverage**: >90%
- **Business Logic**: >95%
- **Components**: >85%
- **Integration**: >80%

### **Quality Gates**
Each phase must pass:
- [ ] All unit tests passing
- [ ] Coverage targets met
- [ ] No accessibility violations
- [ ] Performance benchmarks met
- [ ] E2E critical paths working

### **Continuous Testing**
```yaml
# GitHub Actions CI/CD
name: Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run unit tests
        run: npm run test:unit
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Run integration tests
        run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Run E2E tests
        run: npm run test:e2e
```

---

## **🚀 Testing Implementation Timeline**

### **Phase 0: Setup** (0.5 days)
- [ ] Install and configure testing tools
- [ ] Set up test utilities and mocks
- [ ] Create initial test structure
- [ ] Configure CI/CD pipeline

### **Phase 1-7: Progressive Testing** (Integrated with development)
- [ ] Write tests alongside feature development
- [ ] Maintain >90% coverage throughout
- [ ] Run tests on every commit
- [ ] Review and refactor tests as needed

---

## **🎯 Testing Best Practices**

### **Unit Test Guidelines**
1. **Test Behavior, Not Implementation** - Focus on what the code does, not how
2. **Arrange, Act, Assert** - Clear test structure
3. **Descriptive Test Names** - Should read like specifications
4. **Isolated Tests** - Each test should be independent
5. **Fast Execution** - Unit tests should run quickly

### **Component Test Guidelines**
1. **User-Centric Testing** - Test from user's perspective
2. **Accessibility First** - Include accessibility in every test
3. **Error States** - Test loading, error, and empty states
4. **User Interactions** - Test clicks, typing, keyboard navigation
5. **Props and State** - Test component behavior with different inputs

### **Integration Test Guidelines**
1. **Real Scenarios** - Test actual user workflows
2. **API Integration** - Test with mocked but realistic API responses
3. **State Management** - Test store interactions and updates
4. **Error Handling** - Test failure scenarios and recovery
5. **Performance** - Include performance assertions

---

**This testing strategy ensures that every feature is thoroughly tested as it's integrated back into the application, giving us confidence in the rebuild process and the final product quality.** 