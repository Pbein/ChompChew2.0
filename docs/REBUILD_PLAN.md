# 🏗️ ChompChew Rebuild Plan

## **🎯 Rebuild Strategy**

**Goal**: Start with a clean, minimal foundation and systematically add back features in a logical order that allows for proper testing, UI/UX design, and integration at each step.

**Approach**: 
1. **Preserve Core Logic** - Move all business logic, services, and stores to a safe location
2. **Clean Slate UI** - Start with minimal pages and components
3. **Sequential Integration** - Add features one by one with proper testing
4. **Design-First** - Focus on UI/UX at each integration step

---

## **📦 Phase 0: Preparation & Backup**

### **Step 0.1: Create Feature Backup** 
**Duration**: 1 day

**Actions**:
- [x] Create `src/features/` directory structure
- [x] Move all core services to `src/features/core/services/`
- [x] Move Zustand stores to `src/features/core/stores/`
- [x] Move type definitions to `src/features/core/types/`
- [x] Move utilities to `src/features/core/utils/`
- [x] Create feature-specific directories for components

**Backup Structure**:
```
src/features/
├── core/
│   ├── services/          # All business logic services
│   ├── stores/           # Zustand stores
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utility functions
├── search/
│   └── components/       # Smart semantic search components
├── recipes/
│   └── components/       # Recipe-related components
├── safety/
│   └── components/       # Safety and dietary components
└── nutrition/
    └── components/       # Macro and calorie components
```

### **Step 0.2: Set Up Testing Infrastructure**
**Duration**: 0.5 days

**Actions**:
- [x] Install testing dependencies (Vitest, Testing Library, Playwright, MSW)
- [x] Configure Vitest with TypeScript support
- [x] Set up Testing Library with custom render utilities
- [x] Configure MSW for API mocking
- [x] Set up Playwright for E2E tests
- [x] Configure coverage reporting (>90% target)
- [ ] Set up CI/CD testing pipeline

**Testing Stack Setup**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test msw @axe-core/react
npm install -D @testing-library/user-event c8
```

### **Step 0.3: Clean Current Structure**
**Duration**: 0.5 days

**Actions**:
- [x] Remove all pages except basic layout
- [x] Remove all components except essential UI primitives
- [x] Keep only core configuration files
- [x] Maintain API routes structure
- [x] Create test directory structure

**Minimal Structure After Cleanup**:
```
src/
├── app/
│   ├── layout.tsx        # Basic layout only
│   ├── page.tsx          # Minimal landing page
│   └── api/              # Keep all API routes
├── components/
│   └── ui/               # Keep basic UI components only
├── lib/
│   ├── utils.ts          # Basic utilities only
│   └── config/           # Configuration files
├── features/             # All preserved features
└── tests/                # Testing infrastructure
    ├── setup/
    │   ├── vitest.config.ts
    │   ├── test-utils.tsx
    │   ├── msw-handlers.ts
    │   └── playwright.config.ts
    ├── mocks/
    └── fixtures/
```

---

## **🏗️ Phase 1: Foundation & Core Services**

### **Step 1.1: Establish Core Infrastructure** 
**Duration**: 2 days

**Focus**: Get the foundation working without UI complexity

**Actions**:
- [x] Set up basic layout with navigation
- [x] Integrate design system from `src/features/core/utils/design-system.ts`
- [x] Set up Zustand store integration
- [x] Create basic error boundaries and loading states
- [x] Set up testing framework (Vitest + Testing Library)

**Deliverables**:
- Clean, minimal app shell
- Working state management
- Basic navigation structure
- Testing infrastructure

**Testing**: 
- [x] Unit tests for core utilities (design system, configuration)
- [x] Zustand store testing with proper mocking
- [x] Integration tests for store setup
- [x] Test coverage >90% for all core infrastructure (17 tests passing)

### **Step 1.2: API & Service Layer**
**Duration**: 2 days

**Focus**: Ensure all backend services work independently

**Actions**:
- [x] Integrate recipe generation service
- [x] Integrate safety validation service
- [x] Integrate cache service
- [x] Integrate user service
- [x] Create service integration tests

**Deliverables**:
- All services working and tested
- API endpoints functional
- Service layer documentation

**Testing**:
- [x] Unit tests for each service (recipe generation, safety validation, cache, user)
- [x] API endpoint tests with MSW mocking
- [x] Service integration tests with real API calls
- [x] Critical safety validation tests (zero-tolerance allergen blocking)
- [x] Error handling and edge case tests

---

## **🔍 Phase 2: Search Foundation**

### **Step 2.1: Basic Search Interface**
**Duration**: 3 days

**Focus**: Create a clean, unified search experience

**Actions**:
- [ ] Design new search interface (consolidate multiple search bars)
- [ ] Integrate smart semantic search store
- [ ] Create unified search input component
- [ ] Add basic search results display
- [ ] Implement search state management

**Components to Build**:
- `SearchInterface` - Main search component
- `SearchInput` - Unified input with smart features
- `SearchResults` - Basic results display
- `SearchFilters` - Filter management

**Deliverables**:
- Single, unified search interface
- Working semantic search with categorization
- Clean search results display

**Testing**:
- [ ] Search input functionality tests (typing, keyboard shortcuts)
- [ ] Token parsing and categorization tests (natural language processing)
- [ ] Search state management tests (Zustand store interactions)
- [ ] User interaction tests (suggestions, chips, history)
- [ ] Accessibility tests for search interface
- [ ] Performance tests for search response times

### **Step 2.2: Advanced Search Features**
**Duration**: 2 days

**Focus**: Add intelligent search features

**Actions**:
- [ ] Integrate suggestion popover
- [ ] Add search chips for filters
- [ ] Implement search history
- [ ] Add search intent detection
- [ ] Create search demo page

**Deliverables**:
- Full smart semantic search functionality
- Visual filter management
- Search history and suggestions

**Testing**:
- [ ] Suggestion system tests
- [ ] Filter management tests
- [ ] Search history tests

---

## **🛡️ Phase 3: Dietary Needs & User Preferences**

### **Step 3.1: Dietary Preferences Page**
**Duration**: 3 days

**Focus**: Build a dedicated page for users to manage their dietary needs, which will influence search and recommendations across the app.

**Actions**:
- [ ] Design the UI for the "Dietary Needs" page, accessible from the main navigation.
- [ ] Build the frontend components for selecting and saving dietary profiles (e.g., Paleo, Keto, Vegan).
- [ ] Implement state management (Zustand) to handle user's dietary preferences.
- [ ] Connect the preferences to a backend service to persist user choices.
- [ ] Ensure preferences are clearly displayed and can be easily updated.

**Components to Build**:
- `DietaryNeedsPage` - The main page for managing preferences.
- `DietaryProfileSelector` - Component for choosing predefined diets.
- `AllergenManager` - Interface for adding and removing specific allergens.
- `PreferenceCard` - A component to display a summary of the user's current settings.

**Deliverables**:
- A fully functional "Dietary Needs" page.
- Persistent storage of user dietary preferences.
- A global state that makes preferences accessible to other parts of the application.

**Testing**:
- [ ] Unit tests for preference selection components.
- [ ] State management tests for the dietary store.
- [ ] Integration tests to ensure preferences are saved and retrieved correctly.
- [ ] E2E test for the user flow of setting and changing a dietary profile.

### **Step 3.2: Integration with Search**
**Duration**: 2 days

**Focus**: Integrate the saved dietary preferences directly into the search functionality.

**Actions**:
- [ ] Modify the search query logic to automatically include dietary profile filters.
- [ ] Update the `searchStore` to be aware of the user's dietary settings.
- [ ] Display active dietary filters as non-removable chips or indicators in the search UI.
- [ ] Ensure that search suggestions are also influenced by the dietary profile.

**Deliverables**:
- Search results that are automatically filtered by the user's saved dietary preferences.
- A clear visual indication in the UI that dietary filters are active.

**Testing**:
- [ ] Integration tests for search results with active dietary filters.
- [ ] Unit tests for the logic that incorporates dietary preferences into the search query.
- [ ] E2E test: perform a search, set a dietary preference, and verify the search results are updated accordingly.

---

## **🍽️ Phase 4: Recipe Discovery**

### **Step 4.1: Recipe Display System**
**Duration**: 3 days

**Focus**: Create beautiful, functional recipe displays

**Actions**:
- [ ] Design new recipe card system
- [ ] Integrate recipe generation service
- [ ] Create recipe detail views
- [ ] Add recipe loading and error states
- [ ] Implement recipe card deck interface

**Components to Build**:
- `RecipeCard` - Unified recipe display
- `RecipeGrid` - Grid layout for multiple recipes
- `RecipeDetail` - Detailed recipe view
- `RecipeCardDeck` - Swipeable interface

**Deliverables**:
- Beautiful recipe display system
- Working recipe generation integration
- Swipeable recipe discovery

**Testing**:
- [ ] Recipe display tests
- [ ] Recipe generation integration tests
- [ ] User interaction tests

### **Step 4.2: Recipe Management**
**Duration**: 2 days

**Focus**: Recipe saving, collections, and user features

**Actions**:
- [ ] Add recipe saving functionality
- [ ] Create recipe collections
- [ ] Implement recipe sharing
- [ ] Add recipe rating and feedback

**Deliverables**:
- Recipe collection management
- User recipe interactions
- Recipe sharing capabilities

**Testing**:
- [ ] Recipe saving tests
- [ ] Collection management tests
- [ ] Sharing functionality tests

---

## **🛡️ Phase 5: Advanced Safety & Dietary Features**

### **Step 5.1: Medical & Allergen Integration**
**Duration**: 3 days

**Focus**: Enhance safety features with medical condition support and advanced allergen handling.

**Actions**:
- [ ] Redesign diet quick-set modal for more complex scenarios.
- [ ] Integrate safety validation service more deeply based on user profiles.
- [ ] Add explicit support for medical conditions (e.g., UC, Crohn's, IBS).
- [ ] Implement robust allergen management and cross-contamination warnings.

**Components to Build**:
- `MedicalConditionSelector` - Interface for users to specify medical conditions.
- `SafetyIndicators` - Visual safety feedback on recipe cards and pages.
- `IngredientSafetyTooltip` - On-hover details for potentially unsafe ingredients.

**Deliverables**:
- Comprehensive dietary preference system considering medical needs.
- Stronger safety validation and user warnings.

**Testing**:
- [ ] Tests for medical condition filtering.
- [ ] Critical safety validation tests for allergens.

### **Step 5.2: Safety in UI**
**Duration**: 2 days

**Focus**: Integrate safety feedback throughout the application.

**Actions**:
- [ ] Add dynamic safety indicators to all recipe displays.
- [ ] Implement contextual safety warnings and blockers.
- [ ] Create intelligent ingredient substitution suggestions for unsafe items.
- [ ] Add safety validation filters to search results.

**Deliverables**:
- App-wide safety integration.
- Clear safety indicators and warnings.
- Ingredient substitution system based on dietary profiles.

**Testing**:
- [ ] UI tests for safety indicators and warnings.
- [ ] Tests for the substitution suggestion engine.

---

## **🎯 Phase 6: Nutrition & Macro Features**

### **Step 6.1: Nutrition Tracking**
**Duration**: 2 days

**Focus**: Calorie and macro management

**Actions**:
- [ ] Integrate calorie goal input
- [ ] Add macro target sliders
- [ ] Create nutrition display components
- [ ] Implement nutrition-based search

**Components to Build**:
- `NutritionGoals` - Goal setting interface
- `MacroSliders` - Interactive macro targeting
- `NutritionDisplay` - Recipe nutrition info
- `CalorieTracker` - Calorie goal management

**Deliverables**:
- Nutrition goal setting
- Macro targeting system
- Nutrition-aware search

**Testing**:
- [ ] Nutrition goal tests
- [ ] Macro calculation tests
- [ ] Nutrition display tests

---

## **🎨 Phase 7: UI/UX Polish & Advanced Features**

### **Step 7.1: UI/UX Enhancement**
**Duration**: 3 days

**Focus**: Polish the user experience

**Actions**:
- [ ] Implement responsive design
- [ ] Add animations and transitions
- [ ] Improve accessibility (WCAG 2.2 AA)
- [ ] Add keyboard navigation
- [ ] Optimize mobile experience

**Deliverables**:
- Polished, responsive UI
- Accessible interface
- Smooth animations
- Mobile-optimized experience

**Testing**:
- [ ] Accessibility tests
- [ ] Responsive design tests
- [ ] Mobile interaction tests
- [ ] Performance tests

### **Step 7.2: Advanced Features**
**Duration**: 2 days

**Focus**: Add premium features

**Actions**:
- [ ] Add recipe variations
- [ ] Implement ingredient substitutions
- [ ] Create meal planning features
- [ ] Add social sharing

**Deliverables**:
- Recipe variation system
- Meal planning capabilities
- Social features

**Testing**:
- [ ] Advanced feature tests
- [ ] Integration tests
- [ ] User flow tests

---

## **🚀 Phase 8: Integration & Launch Preparation**

### **Step 8.1: Full Integration Testing**
**Duration**: 2 days

**Focus**: Ensure everything works together

**Actions**:
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Error handling review
- [ ] User acceptance testing

**Deliverables**:
- Fully integrated application
- Performance optimizations
- Comprehensive test coverage

### **Step 8.2: Documentation & Launch**
**Duration**: 1 day

**Focus**: Prepare for launch

**Actions**:
- [ ] Update all documentation
- [ ] Create user guides
- [ ] Prepare deployment
- [ ] Set up monitoring

**Deliverables**:
- Complete documentation
- Deployment-ready application
- Monitoring and analytics

---

## **📋 Implementation Guidelines**

### **Development Principles**
1. **Feature-First**: Each phase focuses on complete, testable features
2. **Test-Driven**: Write tests before or alongside implementation
3. **Design-Conscious**: Consider UI/UX at every step
4. **Safety-First**: Always validate safety and dietary requirements
5. **Performance-Aware**: Monitor and optimize performance continuously

### **Testing Strategy**
- **Unit Tests**: For all business logic and utilities
- **Integration Tests**: For service interactions and API endpoints
- **Component Tests**: For UI components and user interactions
- **E2E Tests**: For complete user workflows
- **Accessibility Tests**: For WCAG compliance

### **Quality Gates**
Each phase must pass:
- [ ] All tests passing (unit, integration, component)
- [ ] Test coverage >90% for new code
- [ ] Code review completed
- [ ] Accessibility audit passed (WCAG 2.2 AA)
- [ ] Performance benchmarks met
- [ ] No critical safety validation failures
- [ ] Documentation updated
- [ ] E2E tests for critical user paths

---

## **📊 Timeline Summary**

| Phase | Duration | Focus | Key Deliverables |
|-------|----------|-------|------------------|
| 0 | 1.5 days | Preparation | Feature backup, clean slate |
| 1 | 4 days | Foundation | Core infrastructure, services |
| 2 | 5 days | Search | Unified search interface |
| 3 | 5 days | Dietary Needs | User preferences & search integration |
| 4 | 5 days | Recipes | Recipe display and management |
| 5 | 5 days | Safety | Advanced safety and medical |
| 6 | 2 days | Nutrition | Macro and calorie features |
| 7 | 5 days | Polish | UI/UX and advanced features |
| 8 | 3 days | Launch | Integration and deployment |

**Total Duration**: ~35 days

---

## **🎯 Success Criteria**

### **Technical**
- [ ] All original features preserved and working
- [ ] Improved code organization and maintainability
- [ ] Comprehensive test coverage (>90%)
- [ ] Performance improvements
- [ ] Accessibility compliance (WCAG 2.2 AA)

### **User Experience**
- [ ] Cleaner, more intuitive interface
- [ ] Faster search and recipe discovery
- [ ] Better mobile experience
- [ ] Improved safety and dietary management
- [ ] Seamless feature integration

### **Business**
- [ ] All core mission features working
- [ ] Reduced "What can I eat?" anxiety
- [ ] Improved user retention metrics
- [ ] Better conversion rates
- [ ] Positive user feedback

---

**Ready to begin? Start with Phase 0 to preserve all our valuable work while creating a clean foundation for the rebuild.** 