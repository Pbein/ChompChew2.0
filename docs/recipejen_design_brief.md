# RecipeGen Design Brief
*Functional Specifications for AI-Powered Recipe Discovery Platform*

---

## Feature 1: Landing Page & Hero Search

### Screen: Landing Page

#### State: Initial Load
* **Hero section** spans 70vh with gradient background (subtle warm-to-cool transition) and centered content layout
* **Primary headline** "Discover recipes made for you" in display typography with appropriate line height and letter spacing
* **Subheadline** explains core value proposition in readable body text with strategic color accent
* **Hero search bar** prominently centered, featuring rounded corners, subtle shadow, and generous padding for touch-friendly interaction
* **Search input** includes placeholder text "What ingredients do you have?" with smooth focus transitions
* **Search button** with micro-interaction hover states and loading spinner integration
* **Quick diet badges** below search bar for common restrictions (Vegan, Keto, Gluten-Free) with pill-style design and subtle hover animations
* **Navigation header** with logo, sign-in/sign-up CTAs using consistent button hierarchy
* **Skeleton loading** appears under 200ms when search is initiated, maintaining spatial layout continuity

#### State: Search Focus
* **Search bar expansion** animation with subtle scale transform and shadow depth increase
* **Background blur** effect applied to non-essential elements creating focus tunnel
* **Diet Quick-Set** button appears with smooth fade-in animation positioned strategically near search input
* **Auto-suggestions dropdown** appears with ingredient matches, each item with hover states and keyboard navigation support
* **Recent searches** display for returning users with clear visual differentiation from suggestions

#### State: Search in Progress  
* **Loading animation** replaces search button with circular progress indicator
* **Search bar maintains focus** with disabled state styling
* **Progressive feedback** shows "Finding recipes..." with animated ellipsis
* **Background content** remains visible but with reduced opacity for context retention
* **Estimated time remaining** appears if search exceeds 800ms threshold

---

## Feature 2: Diet Quick-Set Modal

### Screen: Diet Configuration Modal

#### State: Modal Entry
* **Modal overlay** with 60% opacity backdrop and smooth fade-in transition
* **Modal container** slides up from bottom on mobile, center-scales on desktop with spring animation
* **Close affordances** include backdrop click, ESC key, and X button with clear visual hierarchy
* **Header section** with "Customize Your Diet" title and progress indicator for multi-step flow
* **Two-column layout** on desktop with "Include" and "Avoid" sections clearly delineated

#### State: Include List (List Y) Configuration
* **Search-to-add interface** for dietary preferences and allowed ingredients
* **Popular diet templates** as clickable cards (Mediterranean, Keto, Paleo) with visual previews
* **Selected items** display as removable chips with consistent interaction patterns
* **Auto-suggestions** for dietary restrictions with semantic grouping (proteins, grains, vegetables)
* **Visual feedback** for selections with check states and color coding aligned with brand palette

#### State: Avoid List (List Z) Configuration  
* **Allergen quick-select** grid with common allergens as toggle buttons with clear on/off states
* **Custom ingredient input** with real-time validation and duplicate prevention
* **Severity indicators** for restrictions (preference vs. medical necessity) with appropriate visual weight
* **Trigger foods section** specifically for condition-based users with explanation copy
* **Safety warnings** for medical restrictions with appropriate iconography and accessible color contrast

#### State: Confirmation & Apply
* **Summary preview** showing selected dietary parameters with edit affordances
* **Apply button** with confident styling and success state animation
* **Save preferences** toggle for authenticated users with clear value proposition
* **Modal dismissal** with smooth transition back to search interface
* **Search bar update** reflects applied filters with visual confirmation

---

## Feature 3: AI Recipe Picks Deck

### Screen: Recipe Results Deck

#### State: Initial Results Load
* **Card deck interface** with swipeable/tappable recipe cards in stack layout
* **Leading card** prominently displayed with high-quality hero image and essential details
* **Card design** includes recipe title, prep time, difficulty level, and dietary compliance badges
* **Swipe affordances** with directional arrows and gesture hints for discoverability
* **Background cards** partially visible with subtle parallax effect suggesting depth
* **Action buttons** for Save (heart), Skip, and View Details with touch-optimized sizing

#### State: Card Interaction & Swiping
* **Swipe gestures** with physics-based animations and elastic boundaries
* **Card transition** uses smooth spring animation with appropriate easing curves
* **Save action** triggers heart icon animation with scale transform and color change
* **Next card reveal** with staggered animation revealing following recipe
* **Empty deck handling** when all cards viewed with clear next-action guidance
* **Loading new batch** when approaching end of current results with seamless transition

#### State: No Results Found
* **Empathetic empty state** with appropriate illustration and encouraging copy
* **"We couldn't find recipes..." message** with clear explanation of constraint conflicts
* **Make One for Me CTA** prominently placed with distinct visual treatment
* **Constraint adjustment suggestions** with quick-edit options for filters
* **Alternative search prompts** to guide users toward successful results

---

## Feature 4: Recipe Detail Page

### Screen: Full Recipe View

#### State: Initial Recipe Load
* **Hero image section** with high-quality recipe photo and subtle overlay for text legibility
* **Recipe metadata bar** showing prep time, cook time, servings, difficulty with iconography
* **Dietary compliance badges** aligned with user's restrictions, clearly highlighting safe/unsafe elements
* **Ingredients list** with smart quantity scaling and substitution suggestions inline
* **Step-by-step instructions** with numbered sequence and optional timer integration
* **Nutrition panel** expandable section with macro breakdown and visual representations

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

### Performance Considerations
- Skeleton loading states maintain layout continuity under 200ms
- Image optimization with WebP/AVIF formats and progressive loading
- Code splitting for modal components and heavy features
- Service worker caching for offline recipe access

### Accessibility Standards
- WCAG 2.2 AA compliance throughout all interfaces
- Keyboard navigation for all interactive elements
- Screen reader labels for complex UI components
- Color contrast ratios meeting accessibility requirements
- Focus management for modal interactions

### Animation Philosophy
- Physics-based transitions using spring animations
- Micro-interactions providing immediate feedback
- Loading states that maintain spatial context
- Gesture-based interactions with clear affordances
- Performance-optimized animations using CSS transforms

### Responsive Design Strategy
- Mobile-first approach with progressive enhancement
- Touch-optimized interface elements (minimum 44px targets)
- Adaptive layouts for tablet and desktop breakpoints
- Content prioritization for smaller screens
- Gesture support with fallback button alternatives