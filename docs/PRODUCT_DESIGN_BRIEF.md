# ChompChew Design Brief
*Functional Specifications for Anxiety-Free Recipe Discovery Platform*

## 🎯 **Mission Alignment**
**ChompChew removes the daily "What can I actually eat?" anxiety** through multi-modal search (ingredients, calories, macros) and comprehensive dietary management including medical condition support.

Every design decision must serve this core mission of helping users feel confident and safe about their food choices.

---

## Feature 1: Multi-Modal Search Interface

### Screen: Landing Page

#### State: Initial Load
* **Hero section** spans 70vh with gradient background (subtle warm-to-cool transition) and centered content layout
* **Primary headline** "Find recipes you can actually eat" in display typography emphasizing anxiety relief
* **Subheadline** "Search by ingredients, calories, and macros - we'll handle your dietary restrictions" with strategic color accent
* **Multi-modal search bar** prominently centered with three integrated input modes:
  - **Ingredient search** with placeholder "What ingredients do you have?"
  - **Calorie goal input** with quick presets (300, 500, 800, 1200, 1500, 2000)
  - **Macro target sliders** with visual pie chart preview
* **Search button** "Find Safe Recipes" with confident styling and loading spinner integration
* **Diet Quick-Set button** prominently displayed for comprehensive dietary management
* **Safety badges** showing "Allergen Safe" and "Medical Condition Aware" with trust-building iconography
* **Navigation header** with logo, sign-in/sign-up CTAs using consistent button hierarchy
* **Skeleton loading** appears under 200ms when search is initiated, maintaining spatial layout continuity

#### State: Search Focus
* **Multi-modal search expansion** animation with subtle scale transform and shadow depth increase
* **Background blur** effect applied to non-essential elements creating focus tunnel
* **Calorie and macro inputs** become visible with smooth slide-in animations
* **Diet Quick-Set** button appears with prominent styling for comprehensive dietary management
* **Auto-suggestions dropdown** appears with ingredient matches, each item with hover states and keyboard navigation support
* **Recent multi-modal searches** display showing previous ingredient + calorie + macro combinations
* **Safety indicators** show active dietary restrictions and medical conditions

#### State: Search in Progress  
* **Loading animation** replaces search button with circular progress indicator
* **Search bar maintains focus** with disabled state styling
* **Progressive feedback** shows "Finding safe recipes for you..." with animated ellipsis
* **Safety validation indicators** show "Checking allergens..." and "Validating dietary restrictions..."
* **Background content** remains visible but with reduced opacity for context retention
* **Estimated time remaining** appears if search exceeds 800ms threshold
* **Multi-modal processing** shows separate progress for ingredient matching, calorie optimization, and macro balancing

---

## Feature 2: Comprehensive Dietary Safety Management

### Screen: Diet Configuration Modal

#### State: Modal Entry
* **Modal overlay** with 60% opacity backdrop and smooth fade-in transition
* **Modal container** slides up from bottom on mobile, center-scales on desktop with spring animation
* **Close affordances** include backdrop click, ESC key, and X button with clear visual hierarchy
* **Header section** with "Set Up Your Safe Eating Profile" title emphasizing safety and confidence
* **Progress indicator** for multi-step flow with clear safety validation checkpoints
* **Medical condition priority** section prominently displayed for users with UC, Crohn's, IBS, GERD, Celiac
* **Three-column layout** on desktop: "Embrace Foods", "Avoid Foods", and "Medical Conditions"

#### State: Include List (List Y) Configuration
* **Search-to-add interface** for dietary preferences and allowed ingredients
* **Popular diet templates** as clickable cards (Mediterranean, Keto, Paleo) with visual previews
* **Selected items** display as removable chips with consistent interaction patterns
* **Auto-suggestions** for dietary restrictions with semantic grouping (proteins, grains, vegetables)
* **Visual feedback** for selections with check states and color coding aligned with brand palette

#### State: Avoid List (List Z) Configuration  
* **Medical condition triggers** prominently displayed first with condition-specific food lists:
  - **UC triggers**: spicy foods, high-fiber vegetables, nuts, seeds, alcohol, caffeine
  - **Crohn's triggers**: high-fiber foods, fatty foods, dairy, spicy foods, alcohol
  - **IBS triggers**: high-FODMAP foods, dairy, gluten, artificial sweeteners, caffeine
  - **GERD triggers**: citrus, tomatoes, spicy foods, chocolate, caffeine, alcohol
* **Allergen quick-select** grid with common allergens as toggle buttons with clear on/off states
* **Custom ingredient input** with real-time validation and duplicate prevention
* **Severity indicators** with clear visual hierarchy: Medical Necessity (red) vs. Preference (yellow)
* **Safety warnings** with appropriate iconography and accessible color contrast
* **Zero-tolerance policy** clearly explained for medical conditions and severe allergies

#### State: Confirmation & Apply
* **Safety validation summary** showing all dietary restrictions and medical conditions with clear visual hierarchy
* **Risk assessment** displaying any potential conflicts or warnings
* **Apply Safety Profile** button with confident styling emphasizing protection
* **Save preferences** toggle for authenticated users with clear value proposition about consistent safety
* **Modal dismissal** with smooth transition back to search interface
* **Search interface update** shows active safety badges and restriction count
* **Confidence message** "Your safe eating profile is now active" with reassuring tone

---

## Feature 3: Anxiety-Free Recipe Discovery Deck

### Screen: Recipe Results Deck

#### State: Initial Results Load
* **Card deck interface** with swipeable/tappable recipe cards in stack layout designed to reduce decision anxiety
* **Leading card** prominently displayed with high-quality hero image and confidence-building details
* **Card design** includes recipe title, prep time, difficulty level, and prominent **safety compliance badges**
* **Multi-modal match indicators** showing how well the recipe fits calorie goals and macro targets
* **Safety validation badges** prominently displayed: "Allergen Safe", "Condition Safe", "Nutritionally Aligned"
* **Swipe affordances** with directional arrows and gesture hints for discoverability
* **Background cards** partially visible with subtle parallax effect suggesting depth
* **Action buttons** for Save (heart), Skip, and View Details with touch-optimized sizing
* **Confidence messaging** "All recipes are safe for your dietary needs" displayed prominently

#### State: Card Interaction & Swiping
* **Swipe gestures** with physics-based animations and elastic boundaries
* **Card transition** uses smooth spring animation with appropriate easing curves
* **Save action** triggers heart icon animation with scale transform and color change
* **Next card reveal** with staggered animation revealing following recipe
* **Empty deck handling** when all cards viewed with clear next-action guidance
* **Loading new batch** when approaching end of current results with seamless transition

#### State: No Results Found
* **Empathetic empty state** with supportive illustration and anxiety-reducing copy
* **"Don't worry - we've got you covered" message** with reassuring tone instead of focusing on failure
* **"Make One for Me" CTA** prominently placed as the primary solution with confident styling
* **AI-powered custom generation** explanation showing how we'll create a safe recipe specifically for their needs
* **Constraint adjustment suggestions** with quick-edit options for filters as secondary option
* **Success stories** showing how other users with similar restrictions found great recipes
* **Confidence building** messaging emphasizing that having specific dietary needs is normal and manageable

---

## Feature 4: Recipe Detail Page

### Screen: Full Recipe View

#### State: Initial Recipe Load
* **Hero image section** with high-quality recipe photo and subtle overlay for text legibility
* **Safety validation header** prominently displaying "✓ Safe for your dietary needs" with confidence-building styling
* **Recipe metadata bar** showing prep time, cook time, servings, difficulty with iconography
* **Comprehensive safety badges** showing allergen compliance, medical condition safety, and nutritional alignment
* **Ingredients list** with smart quantity scaling and **safety-validated substitution suggestions** inline
* **Trigger food warnings** if any ingredients require attention, with clear explanations and alternatives
* **Step-by-step instructions** with numbered sequence and optional timer integration
* **Detailed nutrition panel** with macro breakdown matching user's targets and visual representations
* **Calorie and macro alignment** showing how the recipe fits the user's specified goals

#### State: Interactive Cooking Mode
* **Step highlighting** with current instruction emphasized and completed steps de-emphasized
* **Progress indicator** showing cooking stage completion with visual milestone markers
* **Timer integration** for time-sensitive steps with audible/visual alerts
* **Hands-free navigation** with large touch targets and voice control hints
* **Ingredient checking** allows users to mark items as completed with satisfying check animations

#### State: Personalization & Adaptations
* **Ingredient substitutions** overlay with AI-powered alternatives based on user preferences
* **Portion scaling** with real-time quantity updates and measurement conversions
* **Reaction logging** for condition-specific users with symptom tracking interface
* **Notes section** for personal modifications with rich text editing capabilities
* **Save to cookbook** CTA with confirmation animation and collection selection

---

## Feature 5: My Cookbook (Saved Recipes)

### Screen: Personal Recipe Collection

#### State: Cookbook Overview
* **Grid layout** with recipe cards showing hero images and essential metadata
* **Search and filter** functionality with faceted navigation for quick discovery
* **Collection organization** with folder/tag system and drag-drop rearrangement
* **Recently added** section highlighting newest saves with temporal ordering
* **Quick actions** on each card for sharing, editing notes, or removal
* **Empty state** for new users with onboarding guidance and discovery prompts

#### State: Recipe Management
* **Bulk selection** mode with checkbox interface and batch action toolbar
* **Sorting options** with visual feedback for active sort criteria
* **Export functionality** with PDF generation and email sharing capabilities
* **Sync status indicators** showing cloud save state and offline availability
* **Recipe status** showing cooking history and personal ratings/notes

#### State: Collection Sharing
* **Share modal** with privacy controls and link generation
* **Collaboration features** for dietitians sharing with clients
* **Public/private toggle** with clear privacy implications
* **Social sharing** with platform-optimized previews and metadata
* **Access management** for shared collections with permission levels

---

## Feature 6: Empty-State Generation & Sign-Up Flow

### Screen: Custom Recipe Generation

#### State: Generation Prompt
* **Encouraging headline** "Let's create something perfect for you" with supportive tone
* **Constraint confirmation** showing user's dietary requirements with edit option
* **Inspiration input** allowing users to describe desired flavors or cuisine types
* **Generate button** with confident styling suggesting AI capability
* **Loading animation** with recipe creation progress indicators and encouraging copy

#### State: Sign-Up Requirement Modal
* **Value proposition** clearly explaining benefits of account creation
* **OAuth options** with Google/Apple sign-in prominently displayed
* **Email option** with magic link explanation and privacy assurance
* **Guest continuation** option with limited functionality explanation
* **Trust indicators** showing security practices and data handling policies

#### State: Account Creation Success
* **Welcome confirmation** with personalized greeting and next steps
* **Preference import** from session data with user consent
* **Onboarding checklist** with optional tutorial and feature highlights
* **Generated recipe delivery** with emphasis on personalization achievement

---

## Feature 7: Public Shareable Recipe Page

### Screen: Public Recipe View

#### State: Shared Recipe Display
* **Clean, printable layout** optimized for sharing and consumption
* **Recipe attribution** showing original generator and share date
* **Social proof** with view counts and save statistics where appropriate
* **Interaction limitations** for non-authenticated users with clear upgrade paths
* **Print optimization** with CSS formatting for physical recipe cards

#### State: Visitor Engagement
* **Save to own cookbook** CTA for authenticated users
* **Try this recipe** button leading to ingredient shopping or meal planning
* **Similar recipes** suggestions based on dietary patterns
* **Creator follow** option if shared by professional user
* **Report functionality** for inappropriate content with clear moderation pathways

#### State: SEO & Social Optimization
* **Rich meta tags** with recipe structured data for search engines
* **Social media previews** optimized for platform-specific sharing
* **Performance optimization** with lazy loading and optimized images
* **Mobile responsiveness** ensuring readability across all device sizes
* **Accessibility compliance** with screen reader support and keyboard navigation

---

## Technical Implementation Notes

### Mission-Critical Performance Requirements
- **Sub-2-second search response** for anxiety reduction - users need immediate confidence
- **Safety validation under 500ms** - medical condition checking cannot delay user experience
- **Skeleton loading states** maintain layout continuity under 200ms to prevent uncertainty
- **Multi-modal search optimization** with parallel processing for ingredients, calories, and macros
- **Image optimization** with WebP/AVIF formats and progressive loading
- **Service worker caching** for offline recipe access and safety profile persistence

### Safety-First Architecture
- **Zero-tolerance validation** for allergens and medical condition triggers at multiple levels
- **Redundant safety checks** in UI, API, and database layers
- **Clear error messaging** that builds confidence rather than creates anxiety
- **Graceful degradation** ensuring safety features work even with poor connectivity
- **Audit logging** for all safety-related decisions and validations

### Accessibility & Inclusion Standards
- **WCAG 2.2 AA compliance** throughout all interfaces - dietary restrictions often correlate with other accessibility needs
- **Keyboard navigation** for all interactive elements, especially critical for cooking mode
- **Screen reader optimization** with detailed labels for safety badges and dietary information
- **Color contrast ratios** exceeding requirements, with additional visual indicators beyond color
- **Focus management** for modal interactions and multi-step flows
- **Voice control hints** for hands-free cooking mode

### Anxiety-Reducing Animation Philosophy
- **Physics-based transitions** using spring animations that feel natural and confident
- **Immediate feedback** micro-interactions to reduce uncertainty about user actions
- **Loading states** that maintain spatial context and provide reassuring progress indicators
- **Gesture-based interactions** with clear affordances and fallback options
- **Performance-optimized animations** using CSS transforms to prevent UI lag that increases anxiety
- **Confidence-building transitions** that emphasize safety and success states

### Mobile-First Safety Design
- **Touch-optimized interface** elements (minimum 44px targets) for stress-free interaction
- **Adaptive layouts** that prioritize safety information on smaller screens
- **Content prioritization** ensuring dietary restrictions and safety badges are always visible
- **Gesture support** with fallback button alternatives for accessibility
- **Offline-first approach** for saved safety profiles and favorite recipes