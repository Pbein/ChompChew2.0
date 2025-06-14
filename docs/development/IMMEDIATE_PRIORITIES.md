# ⚡ Immediate Sprint Technical Specifications

> **📋 For complete roadmap and sprint planning, see [DEVELOPMENT_TODO.md](DEVELOPMENT_TODO.md)**
> 
> This document provides detailed technical specifications for the immediate 8-week sprint cycle.

## 🎯 **Mission Alignment**
Based on our product description: **"ChompChew removes the daily 'What can I actually eat?' anxiety"** through multi-modal search (ingredients, calories, macros) and comprehensive dietary management.

---

## 🔥 **Sprint 1: Enhanced Search Bar** (Week 1-2)

### **🎯 Goal**: Enable multi-modal search (ingredients + calories + macros)

#### **A. Calorie Goal Input Component**
```typescript
// src/components/recipe/CalorieGoalInput.tsx
interface CalorieGoalInputProps {
  value?: number
  onChange: (calories: number | undefined) => void
  className?: string
}

interface CalorieGoalState {
  inputValue: string
  selectedPreset?: number
  isValid: boolean
  validationMessage?: string
}

// Validation rules:
const CALORIE_CONSTRAINTS = {
  min: 100,
  max: 3000,
  presets: [300, 500, 800, 1200, 1500, 2000]
}
```

**UI Requirements:**
- Input field with validation (100-3000 range)
- Quick preset buttons (300, 500, 800, 1200, 1500, 2000)
- Visual integration with existing search bar
- Error states with helpful messaging
- Accessibility: ARIA labels, keyboard navigation

#### **B. Macro Target Specification Component**
```typescript
// src/components/recipe/MacroTargetSliders.tsx
interface MacroTargets {
  protein: number    // percentage (20-40%)
  carbs: number     // percentage (20-60%)
  fat: number       // percentage (15-40%)
}

interface MacroTargetSlidersProps {
  value?: MacroTargets
  onChange: (macros: MacroTargets | undefined) => void
  className?: string
}

// Validation rules:
const MACRO_CONSTRAINTS = {
  protein: { min: 20, max: 40, default: 25 },
  carbs: { min: 20, max: 60, default: 45 },
  fat: { min: 15, max: 40, default: 30 }
}

// Popular presets:
const MACRO_PRESETS = {
  balanced: { protein: 25, carbs: 45, fat: 30 },
  highProtein: { protein: 35, carbs: 35, fat: 30 },
  lowCarb: { protein: 30, carbs: 20, fat: 50 },
  keto: { protein: 25, carbs: 5, fat: 70 }
}
```

**UI Requirements:**
- Macro ratio sliders with real-time validation
- Visual macro pie chart preview
- Popular preset buttons (Balanced, High Protein, Low Carb, Keto)
- Percentage totals must equal 100%
- Touch-optimized sliders for mobile

#### **C. Enhanced Search Interface**
```typescript
// src/components/recipe/SearchBar.tsx - Updated interface
interface EnhancedSearchQuery {
  ingredients: string[]
  calorieGoal?: number
  macroTargets?: MacroTargets
  dietaryRestrictions: string[]
  avoidFoods: string[]
}

interface SearchBarProps {
  onSearch: (query: EnhancedSearchQuery) => void
  isLoading?: boolean
  className?: string
}
```

**Implementation Tasks:**
- [ ] Update SearchBar component to include calorie and macro inputs
- [ ] Add visual indicators for active search modes
- [ ] Implement collapsible advanced options
- [ ] Update search prompt generation for multi-modal input
- [ ] Add loading states and error handling
- [ ] Test accessibility with screen readers

---

## 🔥 **Sprint 2: Diet Quick-Set Modal** (Week 3-4)

### **🎯 Goal**: Full modal with List Y (embrace) and List Z (avoid) management

#### **A. Modal Structure & Data Types**
```typescript
// src/types/dietary-preferences.ts
interface DietPreferences {
  embraceFoods: string[]      // List Y - foods to include/prefer
  avoidFoods: string[]        // List Z - foods to avoid
  medicalConditions: MedicalCondition[]
  triggerFoods: TriggerFood[]
  severityLevels: SeverityMap
}

interface MedicalCondition {
  id: string
  name: 'UC' | 'Crohns' | 'IBS' | 'GERD' | 'Celiac' | 'Custom'
  severity: 'mild' | 'moderate' | 'severe'
  customName?: string
}

interface TriggerFood {
  name: string
  condition: string
  severity: 'mild' | 'moderate' | 'severe'
  userAdded: boolean
  notes?: string
}

interface SeverityMap {
  [foodName: string]: 'preference' | 'medical'
}
```

#### **B. Modal Component Architecture**
```typescript
// src/components/recipe/DietQuickSetModal.tsx
interface DietQuickSetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (preferences: DietPreferences) => void
  initialPreferences?: DietPreferences
}

// Modal sections:
enum ModalSection {
  EMBRACE_FOODS = 'embrace',
  AVOID_FOODS = 'avoid',
  MEDICAL_CONDITIONS = 'medical',
  REVIEW = 'review'
}
```

**UI Requirements:**
- Responsive design (mobile slide-up, desktop center)
- Multi-step flow with progress indicator
- Keyboard navigation and accessibility
- Save/cancel functionality with confirmation
- Data persistence across sessions

#### **C. List Y (Embrace Foods) Interface**
```typescript
// Pre-populated diet templates
const DIET_TEMPLATES = {
  mediterranean: {
    name: 'Mediterranean Diet',
    foods: ['olive oil', 'fish', 'vegetables', 'whole grains', 'legumes'],
    description: 'Heart-healthy with emphasis on whole foods'
  },
  keto: {
    name: 'Ketogenic Diet',
    foods: ['avocado', 'nuts', 'fatty fish', 'low-carb vegetables', 'cheese'],
    description: 'High fat, very low carb for ketosis'
  },
  paleo: {
    name: 'Paleo Diet',
    foods: ['lean meats', 'fish', 'vegetables', 'fruits', 'nuts'],
    description: 'Whole foods, no processed ingredients'
  }
}
```

**Implementation Features:**
- Search-to-add ingredient functionality
- Popular diet template cards with one-click selection
- Visual chips with remove functionality
- Category organization (Proteins, Vegetables, Grains, etc.)
- Auto-suggestions with semantic grouping

#### **D. List Z (Avoid Foods) Interface**
```typescript
// Common allergens for quick selection
const COMMON_ALLERGENS = [
  'nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 
  'fish', 'sesame', 'sulfites', 'corn'
]

// Medical condition trigger foods
const CONDITION_TRIGGERS = {
  UC: ['spicy foods', 'high-fiber vegetables', 'nuts', 'seeds', 'alcohol', 'caffeine'],
  Crohns: ['high-fiber foods', 'fatty foods', 'dairy', 'spicy foods', 'alcohol'],
  IBS: ['high-FODMAP foods', 'dairy', 'gluten', 'artificial sweeteners', 'caffeine'],
  GERD: ['citrus', 'tomatoes', 'spicy foods', 'chocolate', 'caffeine', 'alcohol']
}
```

**Implementation Features:**
- Allergen quick-select grid with toggle buttons
- Custom ingredient input with validation
- Medical condition categories with pre-populated triggers
- Severity indicators (preference vs. medical necessity)
- Safety warnings with appropriate iconography

---

## 🔥 **Sprint 3: Recipe Card Deck Interface** (Week 5-6)

### **🎯 Goal**: Core swipeable recipe discovery experience

#### **A. Card Deck Component Architecture**
```typescript
// src/components/recipe/RecipeCardDeck.tsx
interface RecipeCardDeckProps {
  recipes: Recipe[]
  onSave: (recipe: Recipe) => void
  onSkip: (recipe: Recipe) => void
  onViewDetails: (recipe: Recipe) => void
  onLoadMore: () => void
  isLoading?: boolean
}

interface SwipeGesture {
  direction: 'left' | 'right' | 'up'
  velocity: number
  distance: number
}
```

**Animation Requirements:**
- Physics-based swipe animations with spring curves
- Elastic boundaries for partial swipes
- Staggered card reveal animations
- Touch gesture support with fallback buttons
- Smooth transitions between cards

#### **B. Recipe Card Component**
```typescript
// src/components/recipe/RecipeCard.tsx
interface RecipeCardProps {
  recipe: Recipe
  isActive?: boolean
  onSave: () => void
  onSkip: () => void
  onViewDetails: () => void
  className?: string
}
```

**Visual Requirements:**
- Hero image with text overlay legibility
- Recipe metadata (time, difficulty, servings) with icons
- Dietary compliance badges with color coding
- Touch-optimized action buttons (44px+ minimum)
- Accessibility: ARIA labels, keyboard navigation

#### **C. Empty State Handling**
```typescript
// src/components/recipe/EmptyRecipeState.tsx
interface EmptyRecipeStateProps {
  searchQuery: EnhancedSearchQuery
  onMakeOneForMe: () => void
  onAdjustConstraints: () => void
  onNewSearch: () => void
}
```

**UX Requirements:**
- Empathetic messaging with encouraging copy
- "Make One for Me" CTA prominently displayed
- Constraint adjustment suggestions
- Alternative search prompts
- Illustration or visual element for engagement

---

## 🔥 **Sprint 4: Medical Condition Support** (Week 7-8)

### **🎯 Goal**: Support for UC, Crohn's, IBS with trigger food management

#### **A. Trigger Food Database**
```typescript
// src/lib/data/trigger-foods.ts
interface TriggerFoodDatabase {
  [condition: string]: {
    common: TriggerFoodEntry[]
    moderate: TriggerFoodEntry[]
    severe: TriggerFoodEntry[]
  }
}

interface TriggerFoodEntry {
  name: string
  category: string
  description?: string
  alternatives?: string[]
}

const TRIGGER_FOOD_DB: TriggerFoodDatabase = {
  UC: {
    common: [
      { name: 'spicy foods', category: 'seasonings', alternatives: ['mild herbs'] },
      { name: 'high-fiber vegetables', category: 'vegetables', alternatives: ['cooked vegetables'] }
    ],
    moderate: [
      { name: 'nuts', category: 'proteins', alternatives: ['nut butters'] },
      { name: 'seeds', category: 'proteins', alternatives: ['ground seeds'] }
    ],
    severe: [
      { name: 'alcohol', category: 'beverages', alternatives: ['herbal teas'] },
      { name: 'caffeine', category: 'beverages', alternatives: ['decaf options'] }
    ]
  }
  // ... other conditions
}
```

#### **B. Safety Validation Service**
```typescript
// src/lib/services/safetyValidationService.ts
interface SafetyValidation {
  isSafe: boolean
  warnings: ValidationWarning[]
  blockers: ValidationBlocker[]
  suggestions: string[]
}

interface ValidationWarning {
  ingredient: string
  reason: string
  severity: 'mild' | 'moderate'
  alternatives?: string[]
}

interface ValidationBlocker {
  ingredient: string
  reason: string
  severity: 'severe'
  medicalCondition?: string
}

export async function validateRecipeSafety(
  recipe: Recipe,
  userPreferences: DietPreferences
): Promise<SafetyValidation> {
  // Implementation details for multi-level validation
}
```

**Validation Levels:**
1. **Input Validation**: Check search constraints
2. **Generation Validation**: Validate AI-generated recipes
3. **Display Validation**: Final check before showing to user
4. **User Feedback**: Allow users to report missed triggers

---

## 📋 **Implementation Checklist**

### **Sprint 1 Tasks**
- [ ] Create CalorieGoalInput component with validation
- [ ] Build MacroTargetSliders with pie chart preview
- [ ] Update SearchBar to integrate new inputs
- [ ] Extend recipe generation prompts for multi-modal search
- [ ] Add visual indicators for active search modes
- [ ] Test accessibility compliance (WCAG 2.2 AA)
- [ ] Mobile responsiveness testing

### **Sprint 2 Tasks**
- [ ] Build DietQuickSetModal with responsive design
- [ ] Implement List Y interface with diet templates
- [ ] Create List Z interface with allergen quick-select
- [ ] Add medical condition categories
- [ ] Implement severity indicators
- [ ] Add data persistence with local storage
- [ ] Test modal accessibility and keyboard navigation

### **Sprint 3 Tasks**
- [ ] Create RecipeCardDeck with swipe gestures
- [ ] Build RecipeCard component with proper styling
- [ ] Implement physics-based animations
- [ ] Add empty state handling with "Make One for Me"
- [ ] Test touch interactions across devices
- [ ] Optimize performance for smooth animations

### **Sprint 4 Tasks**
- [ ] Build trigger food database for common conditions
- [ ] Implement safety validation service
- [ ] Create warning/blocker UI components
- [ ] Add custom trigger food input
- [ ] Test with various medical condition scenarios
- [ ] Validate zero-tolerance allergen policy

---

## 🎯 **Success Criteria**

### **Sprint 1 Success**
- [ ] Users can search by ingredient + calorie goal + macro targets
- [ ] Multi-modal search response time < 2 seconds
- [ ] All search modes work on mobile and desktop
- [ ] Accessibility compliance maintained

### **Sprint 2 Success**
- [ ] Users can easily manage embrace/avoid food lists
- [ ] Modal works perfectly on all devices
- [ ] Data persists across sessions
- [ ] Medical condition categories are comprehensive

### **Sprint 3 Success**
- [ ] Users can swipe through recipe recommendations smoothly
- [ ] Card deck interface works on mobile and desktop
- [ ] Save/skip actions provide immediate feedback
- [ ] Empty states guide users to "Make One for Me"
- [ ] Physics-based animations feel natural and responsive

### **Sprint 4 Success**
- [ ] Users with medical conditions feel safe using platform
- [ ] Zero tolerance for allergen inclusion in recipes
- [ ] Clear warnings for trigger foods
- [ ] Safety validation works at all levels

---

**🎯 Remember: Every technical implementation must serve our core mission of removing "What can I actually eat?" anxiety. Focus on safety, accessibility, and user confidence in their food choices.** 