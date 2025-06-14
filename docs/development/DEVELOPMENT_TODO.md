# 🚀 ChompChew Development Roadmap

## 🎯 **Mission-Aligned Development**
**Core Goal**: Remove the daily "What can I actually eat?" anxiety through multi-modal search (ingredients, calories, macros) and comprehensive dietary management including medical condition support.

---

## 📊 **Current Status & Critical Gaps**

### ✅ **FOUNDATION COMPLETE**
- ✅ **Backend Services**: Supabase, OpenAI, Redis, NextAuth fully configured
- ✅ **Design System**: Comprehensive with accessibility compliance
- ✅ **Basic Search**: Ingredient-based search with categorized suggestions
- ✅ **AI Recipe Generation**: OpenAI integration with dietary restrictions
- ✅ **Diet Badges**: Basic dietary preference selection

### ❌ **CRITICAL GAPS (Blocking Product Vision)**
- ❌ **Multi-Modal Search**: Missing calorie goals and macro targets
- ❌ **Diet Quick-Set Modal**: Missing List Y/Z management
- ❌ **Recipe Card Deck Interface**: Missing swipeable recipe discovery (CORE UX)
- ❌ **Interactive Cooking Mode**: Missing step-by-step cooking experience
- ❌ **Make One for Me**: Missing custom recipe generation for empty states
- ❌ **Medical Condition Support**: No trigger food management
- ❌ **Safety Validation**: No allergen checking or warnings
- ❌ **Public Recipe Sharing**: Missing shareable recipe pages

---

## 🔥 **IMMEDIATE PRIORITIES** (Weeks 1-8)

### **Sprint 1: Enhanced Search Bar** (Week 1-2) - CRITICAL
> **Goal**: Enable multi-modal search (ingredients + calories + macros)

#### **SearchBar Component Enhancement**
- [ ] **Add calorie goal input field**
  - Input with validation (100-3000 range)
  - Quick preset buttons (300, 500, 800, 1200)
  - Visual integration with existing search bar
  
- [ ] **Add macro target specification**
  - Macro ratio sliders (protein/carbs/fat percentages)
  - Visual macro pie chart preview
  - Popular presets (High Protein, Low Carb, Balanced)
  
- [ ] **Update search prompt generation**
  - Handle calorie-focused recipe requests
  - Incorporate macro optimization
  - Combine ingredient + calorie + macro inputs

#### **Recipe Generation Service Updates**
- [ ] **Extend prompt builder for calorie-focused recipes**
- [ ] **Add macro optimization logic**
- [ ] **Update nutrition calculation accuracy**
- [ ] **Add portion scaling for calorie targets**
- [ ] **Test with various input combinations**

### **Sprint 2: Diet Quick-Set Modal** (Week 3-4) - CRITICAL
> **Goal**: Full modal with List Y (embrace) and List Z (avoid) management

#### **Modal Component Development**
- [ ] **Create modal overlay and container**
  - Responsive design (mobile slide-up, desktop center)
  - Proper z-index and backdrop handling
  - Keyboard navigation and accessibility
  
- [ ] **Build List Y (Embrace Foods) interface**
  - Search-to-add ingredient functionality
  - Popular diet templates (Mediterranean, Keto, Paleo)
  - Visual chips with remove functionality
  - Category organization (Proteins, Vegetables, etc.)
  
- [ ] **Build List Z (Avoid Foods) interface**
  - Allergen quick-select grid
  - Custom ingredient input with validation
  - Medical condition categories
  - Severity indicators (preference vs. medical necessity)

#### **Data Management**
- [ ] **Create diet preferences data structure**
- [ ] **Implement local storage for session persistence**
- [ ] **Add validation for food lists**
- [ ] **Test data persistence across sessions**

### **Sprint 3: Recipe Card Deck Interface** (Week 5-6) - CRITICAL UX
> **Goal**: Core swipeable recipe discovery experience (Feature 3 from design brief)

#### **Card Deck Component Development**
- [ ] **Create swipeable card deck container**
  - Stack layout with depth perception
  - Physics-based swipe animations
  - Touch gesture support with fallback buttons
  - Elastic boundaries and spring animations
  
- [ ] **Build recipe card components**
  - Hero image with overlay text legibility
  - Recipe metadata (time, difficulty, servings)
  - Dietary compliance badges
  - Save/Skip/Details action buttons (44px+ touch targets)
  
- [ ] **Implement swipe gesture logic**
  - Left swipe = Skip (with animation feedback)
  - Right swipe = Save (with heart animation)
  - Tap = View Details
  - Keyboard navigation support
  
- [ ] **Add empty state handling**
  - "No more recipes" with empathetic messaging
  - "Make One for Me" CTA prominently displayed
  - Constraint adjustment suggestions
  - Alternative search prompts

#### **Card Deck Animations & Interactions**
- [ ] **Implement swipe animations**
  - Smooth card transitions with spring physics
  - Next card reveal with staggered animation
  - Save action heart animation with scale transform
  - Skip action with directional slide-out
  
- [ ] **Add loading states**
  - Skeleton cards while loading new batch
  - Progressive loading when approaching deck end
  - Seamless transition between batches

### **Sprint 4: Medical Condition Support** (Week 7-8) - HIGH PRIORITY
> **Goal**: Support for UC, Crohn's, IBS with trigger food management

#### **Trigger Food Database**
- [ ] **Build trigger food database**
  - UC triggers: spicy foods, high-fiber vegetables, nuts, seeds
  - Crohn's triggers: high-fiber foods, fatty foods, dairy
  - IBS triggers: high-FODMAP foods, dairy, gluten
  - Custom user-added trigger foods
  
- [ ] **Implement severity levels**
  - Mild discomfort vs. severe reaction
  - Visual indicators and warnings
  - User education about severity implications

#### **Safety Validation System**
- [ ] **Build recipe safety validation service**
- [ ] **Add allergen checking logic**
- [ ] **Implement trigger food detection**
- [ ] **Create warning/blocker UI components**
- [ ] **Test with various medical conditions**

---

## 🚀 **PHASE 1: Core Platform** (Weeks 9-16)

### **Week 9-10: Recipe Detail & Interactive Cooking Mode** - CRITICAL UX
> **Goal**: Feature 4 from design brief - Full recipe view with cooking mode

#### **Recipe Detail Page**
- [ ] **Create recipe detail layout**
  - Hero image section with text overlay
  - Recipe metadata bar with icons
  - Dietary compliance badges
  - Ingredients list with quantity scaling
  - Step-by-step instructions with numbering
  - Expandable nutrition panel
  
- [ ] **Build interactive cooking mode**
  - Step highlighting with progress indicator
  - Timer integration for time-sensitive steps
  - Hands-free navigation with large touch targets
  - Ingredient checking with completion animations
  - Voice control hints and accessibility
  
- [ ] **Add personalization features**
  - Ingredient substitution overlay
  - Portion scaling with real-time updates
  - Personal notes section with rich text
  - Reaction logging for medical conditions

### **Week 11-12: Make One for Me & Custom Generation** - CRITICAL
> **Goal**: Feature 6 from design brief - Empty state generation & sign-up flow

#### **Custom Recipe Generation**
- [ ] **Create generation prompt interface**
  - Encouraging headline and supportive tone
  - Constraint confirmation with edit options
  - Inspiration input for flavors/cuisine types
  - Generate button with confident styling
  - Loading animation with progress indicators
  
- [ ] **Build sign-up requirement modal**
  - Clear value proposition for account creation
  - OAuth options (Google/Apple) prominently displayed
  - Email magic link with privacy assurance
  - Guest continuation with limited functionality
  - Trust indicators and security practices
  
- [ ] **Add account creation success flow**
  - Welcome confirmation with personalized greeting
  - Preference import from session data
  - Onboarding checklist with tutorial
  - Generated recipe delivery emphasis

### **Week 13-14: User Authentication & Profiles**
- [ ] **Complete authentication pages** (login, register, forgot password)
- [ ] **Implement NextAuth.js with Supabase adapter**
- [ ] **Create user profile management**
- [ ] **Add dietary preference persistence**
- [ ] **Implement email verification flow**

### **Week 15-16: My Cookbook & Recipe Management** - CRITICAL
> **Goal**: Feature 5 from design brief - Personal recipe collection

#### **Recipe Collection Interface**
- [ ] **Create cookbook overview page**
  - Grid layout with recipe cards
  - Search and filter with faceted navigation
  - Collection organization with folders/tags
  - Recently added section with temporal ordering
  - Quick actions (share, edit, remove)
  
- [ ] **Build recipe management features**
  - Bulk selection with checkbox interface
  - Sorting options with visual feedback
  - Export functionality (PDF, email sharing)
  - Sync status indicators
  - Recipe status (cooking history, ratings)
  
- [ ] **Add collection sharing**
  - Share modal with privacy controls
  - Collaboration features for dietitians
  - Public/private toggle with clear implications
  - Social sharing with optimized previews

---

## 🎯 **PHASE 2: Enhanced Features** (Weeks 17-24)

### **Week 17-18: Public Recipe Sharing** - CRITICAL
> **Goal**: Feature 7 from design brief - Public shareable recipe pages

#### **Public Recipe Pages**
- [ ] **Create shareable recipe layout**
  - Clean, printable design optimized for sharing
  - Recipe attribution with generator and date
  - Social proof (view counts, save statistics)
  - Print optimization with CSS formatting
  
- [ ] **Build visitor engagement features**
  - Save to cookbook CTA for authenticated users
  - Try this recipe button for meal planning
  - Similar recipes suggestions
  - Creator follow option for professionals
  - Report functionality with moderation
  
- [ ] **Add SEO & social optimization**
  - Rich meta tags with recipe structured data
  - Social media previews for platform sharing
  - Performance optimization with lazy loading
  - Mobile responsiveness across devices

### **Week 19-20: Advanced Search & Filtering**
- [ ] **Implement advanced search filters** (cuisine, difficulty, time)
- [ ] **Add search autocomplete functionality**
- [ ] **Create search result sorting**
- [ ] **Add search history and saved searches**
- [ ] **Implement faceted search interface**

### **Week 21-22: Recipe Customization Engine**
- [ ] **Build ingredient substitution system**
- [ ] **Create serving size adjustment functionality**
- [ ] **Implement cooking time modifications**
- [ ] **Add dietary restriction adaptations**
- [ ] **Create recipe variation suggestions**

### **Week 23-24: Mobile Optimization & PWA**
- [ ] **Implement responsive design for all components**
- [ ] **Create mobile-first navigation**
- [ ] **Add touch gestures for recipe interaction**
- [ ] **Implement offline recipe access**
- [ ] **Add progressive web app features**
- [ ] **Create service worker for offline functionality**

---

## 🔮 **PHASE 3: Smart Features** (Weeks 25-32)

### **Week 25-26: Advanced Dietary Management**
- [ ] **Create comprehensive dietary profiles**
- [ ] **Implement automatic recipe filtering**
- [ ] **Add nutritional analysis integration**
- [ ] **Create macro tracking functionality**
- [ ] **Implement ingredient blacklist/whitelist**

### **Week 27-28: Shopping List Generation**
- [ ] **Create automatic shopping list generation**
- [ ] **Build shopping list management interface**
- [ ] **Implement ingredient quantity calculations**
- [ ] **Add store section organization**
- [ ] **Create shopping list sharing**

### **Week 29-30: Pantry Management**
- [ ] **Create pantry inventory system**
- [ ] **Build pantry item management interface**
- [ ] **Implement expiration date tracking**
- [ ] **Add pantry-based recipe suggestions**
- [ ] **Create inventory alerts and notifications**

### **Week 31-32: AI Recommendations & Analytics**
- [ ] **Implement AI-powered recipe recommendations**
- [ ] **Create personalized discovery feed**
- [ ] **Build seasonal recipe suggestions**
- [ ] **Add trending recipe detection**
- [ ] **Integrate analytics and error tracking**
- [ ] **Create performance monitoring dashboard**

---

## 🎯 **SUCCESS METRICS & VALIDATION**

### **Sprint 1 Success Criteria**
- [ ] Users can search by ingredient + calorie goal + macro targets
- [ ] Multi-modal search response time < 2 seconds
- [ ] All search modes work on mobile and desktop
- [ ] Accessibility compliance maintained

### **Sprint 2 Success Criteria**
- [ ] Users can easily manage embrace/avoid food lists
- [ ] Modal works perfectly on all devices
- [ ] Data persists across sessions
- [ ] Medical condition categories are comprehensive

### **Sprint 3 Success Criteria (CRITICAL UX)**
- [ ] Users can swipe through recipe recommendations smoothly
- [ ] Card deck interface works on mobile and desktop
- [ ] Save/skip actions provide immediate feedback
- [ ] Empty states guide users to "Make One for Me"
- [ ] Physics-based animations feel natural and responsive

### **Sprint 4 Success Criteria**
- [ ] Users with medical conditions feel safe using platform
- [ ] Zero tolerance for allergen inclusion in recipes
- [ ] Clear warnings for trigger foods
- [ ] Safety validation works at all levels

### **Phase 1 Success Criteria**
- [ ] Complete recipe discovery and cooking experience
- [ ] Interactive cooking mode with timer integration
- [ ] Custom recipe generation for empty states
- [ ] Full user authentication and profile system
- [ ] Personal recipe collection management
- [ ] Public recipe sharing capabilities

---

## 🚨 **CRITICAL DEVELOPMENT PRINCIPLES**

### **Safety First**
- **Zero tolerance** for allergen inclusion in recipes
- **Clear warnings** for trigger foods and medical conditions
- **Validation at multiple levels** (input, generation, display)
- **User education** about severity implications

### **UX-Driven Development**
- **Card deck interface** is core to recipe discovery experience
- **Interactive cooking mode** essential for user engagement
- **Swipe gestures** must feel natural with physics-based animations
- **Empty states** should guide users to custom generation
- **Touch-first design** with 44px+ minimum touch targets

### **Accessibility Always**
- **WCAG 2.2 AA compliance** for all components
- **Keyboard navigation** for complex interactions
- **Screen reader support** with proper ARIA labels
- **Color contrast** meeting accessibility standards
- **Voice control hints** for cooking mode

### **Performance Focused**
- **Sub-2-second** search response times
- **Physics-based animations** using CSS transforms
- **Progressive enhancement** for complex features
- **Mobile-first** responsive design
- **Efficient caching** strategies

### **User-Centric Design**
- **Reduce anxiety** around meal planning decisions
- **Clear visual hierarchy** and intuitive interactions
- **Helpful error messages** and guidance
- **Consistent design patterns** throughout
- **Empathetic empty states** with actionable next steps

---

## 🛠️ **TECHNICAL IMPLEMENTATION NOTES**

### **Key Files to Update**
- `src/components/recipe/SearchBar.tsx` - Add calorie/macro inputs
- `src/components/recipe/DietQuickSetModal.tsx` - Create new modal
- `src/components/recipe/RecipeCardDeck.tsx` - **NEW: Core swipe interface**
- `src/components/recipe/InteractiveCookingMode.tsx` - **NEW: Cooking experience**
- `src/components/recipe/MakeOneForMe.tsx` - **NEW: Custom generation**
- `src/components/recipe/PublicRecipePage.tsx` - **NEW: Shareable pages**
- `src/lib/services/recipeGenerationService.ts` - Update prompts
- `src/types/database.ts` - Add new interfaces
- `src/lib/validation/` - Create safety validation

### **New Components Needed (Priority Order)**
1. `RecipeCardDeck.tsx` - **CRITICAL: Swipeable recipe discovery**
2. `CalorieGoalInput.tsx` - Calorie input with presets
3. `MacroTargetSliders.tsx` - Macro ratio controls
4. `DietQuickSetModal.tsx` - Full modal component
5. `InteractiveCookingMode.tsx` - **CRITICAL: Step-by-step cooking**
6. `MakeOneForMe.tsx` - **CRITICAL: Custom recipe generation**
7. `TriggerFoodManager.tsx` - Medical condition support
8. `SafetyWarnings.tsx` - Recipe safety alerts
9. `PublicRecipePage.tsx` - **CRITICAL: Shareable recipe pages**
10. `CookbookGrid.tsx` - Personal recipe collection

### **Database Schema Updates**
- User dietary preferences table
- Trigger foods and conditions mapping
- Recipe safety validation logs
- User search history and preferences
- **Recipe sharing and public access controls**
- **Cooking session tracking and timer data**

---

## 📋 **IMMEDIATE NEXT STEPS**

### **This Week (Week 1)**
1. **Start Sprint 1**: Enhanced Search Bar development
2. **Create calorie goal input component**
3. **Design macro target UI mockups**
4. **Update SearchBar component structure**
5. **Begin prompt generation updates**

### **Next Week (Week 2)**
1. **Complete Sprint 1**: Multi-modal search functionality
2. **Test all search combinations thoroughly**
3. **Ensure mobile responsiveness**
4. **Begin Sprint 2 planning**: Diet Quick-Set Modal

### **Week 3-4**
1. **Execute Sprint 2**: Full Diet Quick-Set Modal
2. **Implement List Y/Z management**
3. **Add medical condition categories**
4. **Test data persistence**

### **Week 5-6 (CRITICAL UX SPRINT)**
1. **Execute Sprint 3**: Recipe Card Deck Interface
2. **Implement swipeable card discovery experience**
3. **Add physics-based animations and gestures**
4. **Create empathetic empty states with "Make One for Me"**
5. **Test touch interactions across devices**

---

**Remember: Every feature must directly serve our mission of removing "What can I actually eat?" anxiety. The Recipe Card Deck interface is CORE to our user experience - users need to quickly discover recipes that match their constraints through an intuitive, engaging interface. If it doesn't help users feel confident about their food choices, it's not aligned with our vision.** 