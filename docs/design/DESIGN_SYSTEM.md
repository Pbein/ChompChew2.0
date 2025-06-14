# 🎨 ChompChew Design System

Welcome to the ChompChew Design System - a comprehensive visual language designed specifically for our AI-powered recipe discovery platform. This system implements the complete functional specifications from our design brief, including hero sections, card decks, modals, and interactive cooking experiences.

## 🌈 Color Palette

### Brand Colors
Our food-inspired color palette evokes appetite, freshness, and warmth:

- **Primary Orange** `#ff6b35` - Vibrant orange that stimulates appetite and conveys energy
- **Secondary Green** `#4a7c59` - Fresh green representing healthy, natural ingredients
- **Accent Yellow** `#f4a261` - Warm yellow that evokes comfort and warmth

### Status Colors
- **Success** `#10b981` - Fresh green for success states
- **Warning** `#f59e0b` - Amber for caution
- **Error** `#ef4444` - Red for errors and spicy content
- **Info** `#3b82f6` - Blue for informational content

### Food Category Colors
- **Vegetarian** `#22c55e` - Green
- **Vegan** `#16a34a` - Darker green
- **Gluten-Free** `#8b5cf6` - Purple
- **Dairy-Free** `#06b6d4` - Cyan
- **Keto** `#f97316` - Orange
- **Paleo** `#84cc16` - Lime

### Difficulty Colors
- **Easy** `#22c55e` - Green
- **Medium** `#f59e0b` - Amber
- **Hard** `#ef4444` - Red

## 📝 Typography

### Font Families
- **Sans Serif**: Geist Sans (primary) → Inter → system-ui
- **Monospace**: Geist Mono → Fira Code → monospace
- **Display**: Playfair Display → Georgia → serif (for headings and special content)

### Font Scale
```
xs:   12px (0.75rem)
sm:   14px (0.875rem)
base: 16px (1rem)
lg:   18px (1.125rem)
xl:   20px (1.25rem)
2xl:  24px (1.5rem)
3xl:  30px (1.875rem)
4xl:  36px (2.25rem)
5xl:  48px (3rem)
6xl:  60px (3.75rem)
```

### Usage Examples
```jsx
// Display heading
<h1 className="font-display text-4xl font-bold text-gradient">
  ChompChew
</h1>

// Body text
<p className="font-sans text-base text-foreground">
  Discover amazing recipes...
</p>

// Code snippets
<code className="font-mono text-sm bg-muted px-2 py-1 rounded">
  npm install
</code>
```

## 🏗️ Components

### Hero Section

The hero section spans 70vh with a warm-to-cool gradient background and centered content layout:

```jsx
<section className={componentClasses.hero.section}>
  <div className="container mx-auto px-4 text-center">
    <h1 className={componentClasses.hero.title}>
      Discover recipes made for you
    </h1>
    <p className={componentClasses.hero.subtitle}>
      AI-powered recipe discovery tailored to your dietary needs and preferences
    </p>
    <div className={componentClasses.hero.searchContainer}>
      <SearchBar />
    </div>
  </div>
</section>
```

### Search Components

#### Hero Search Bar
```jsx
<div className={componentClasses.search.bar}>
  <input 
    className={componentClasses.search.input}
    placeholder="What ingredients do you have?"
  />
  <button className={componentClasses.search.button}>
    Search Recipes
  </button>
</div>
```

#### Search with Suggestions
```jsx
<div className="relative">
  <div className={componentClasses.search.bar}>
    <input className={componentClasses.search.input} />
  </div>
  <div className={componentClasses.search.suggestions}>
    <div className={componentClasses.search.suggestionItem}>
      Chicken breast
    </div>
    <div className={componentClasses.search.suggestionItem}>
      Broccoli
    </div>
  </div>
</div>
```

### Buttons

#### Primary Button
```jsx
<button className="btn-primary px-4 py-2 rounded-md">
  Generate Recipe
</button>
```

#### CTA Button (Large)
```jsx
<button className={cn(
  componentClasses.button.base,
  componentClasses.button.variants.cta
)}>
  Start Cooking Now
</button>
```

#### Secondary Button
```jsx
<button className="btn-secondary px-4 py-2 rounded-md">
  Save to Favorites
</button>
```

#### Touch-Optimized Action Button
```jsx
<button className={cn(
  componentClasses.cardDeck.actionButton,
  componentClasses.cardDeck.saveButton
)}>
  ❤️
</button>
```

### Modals

#### Diet Configuration Modal
```jsx
<div className={componentClasses.modal.overlay}>
  <div className={componentClasses.modal.desktopContainer}>
    <div className={componentClasses.modal.header}>
      <h2 className={componentClasses.modal.title}>Customize Your Diet</h2>
      <button className={componentClasses.modal.closeButton}>×</button>
    </div>
    <div className={componentClasses.modal.content}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-4">Include</h3>
          <div className="space-y-3">
            <div className={componentClasses.diet.templateCard}>
              Mediterranean Diet
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Avoid</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className={cn(
              componentClasses.diet.allergenToggle,
              componentClasses.diet.allergenActive
            )}>
              Nuts
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Card Deck Interface

#### Recipe Card Deck (Swipeable)
```jsx
<div className={componentClasses.cardDeck.container}>
  <div className={componentClasses.cardDeck.card}>
    <img src="recipe.jpg" alt="Recipe" className={componentClasses.recipeCard.image} />
    <div className={componentClasses.recipeCard.content}>
      <h3 className={componentClasses.recipeCard.title}>Delicious Pasta</h3>
      <div className={componentClasses.recipeCard.metadata}>
        <span className={componentClasses.recipeCard.metadataItem}>
          🕒 30 min
        </span>
        <span className={componentClasses.recipeCard.metadataItem}>
          👨‍🍳 Easy
        </span>
      </div>
      <div className={componentClasses.recipeCard.badges}>
        <span className="badge-vegetarian">Vegetarian</span>
      </div>
      <p className={componentClasses.recipeCard.description}>
        A mouth-watering pasta dish with fresh ingredients...
      </p>
    </div>
  </div>
  
  <div className={componentClasses.cardDeck.actions}>
    <button className={cn(
      componentClasses.cardDeck.actionButton,
      componentClasses.cardDeck.skipButton
    )}>
      ⏭️
    </button>
    <button className={cn(
      componentClasses.cardDeck.actionButton,
      componentClasses.cardDeck.saveButton,
      componentClasses.utilities.heartSave
    )}>
      ❤️
    </button>
    <button className={cn(
      componentClasses.cardDeck.actionButton,
      componentClasses.cardDeck.detailsButton
    )}>
      👁️
    </button>
  </div>
</div>
```

### Cards

#### Standard Recipe Card
```jsx
<div className={componentClasses.recipeCard.base}>
  <img src="recipe.jpg" alt="Recipe" className={componentClasses.recipeCard.image} />
  <div className={componentClasses.recipeCard.content}>
    <h3 className={componentClasses.recipeCard.title}>Delicious Recipe</h3>
    <div className={componentClasses.recipeCard.metadata}>
      <span className={componentClasses.recipeCard.metadataItem}>
        🕒 25 min
      </span>
      <span className={componentClasses.recipeCard.metadataItem}>
        👨‍🍳 Medium
      </span>
    </div>
    <div className={componentClasses.recipeCard.badges}>
      <span className="badge-vegetarian">Vegetarian</span>
      <span className="badge-gluten-free">Gluten-Free</span>
    </div>
    <p className={componentClasses.recipeCard.description}>
      A mouth-watering dish with fresh ingredients...
    </p>
  </div>
</div>
```

### Badges

#### Dietary Badges
```jsx
<span className="badge-base badge-vegetarian">Vegetarian</span>
<span className="badge-base badge-vegan">Vegan</span>
<span className="badge-base badge-gluten-free">Gluten-Free</span>
<span className="badge-base badge-keto">Keto</span>
```

#### Difficulty Badges
```jsx
<span className="badge-base badge-easy">Easy</span>
<span className="badge-base badge-medium">Medium</span>
<span className="badge-base badge-hard">Hard</span>
```

### Form Inputs
```jsx
<input 
  type="text" 
  className="input-field w-full" 
  placeholder="Search recipes..."
/>

<input 
  type="email" 
  className="input-field input-error w-full" 
  placeholder="Email address"
/>
```

## 🎨 Gradients

### Appetizing Gradient
```jsx
<div className="bg-gradient-appetizing text-white p-6 rounded-lg">
  Stimulates appetite with warm orange-to-yellow gradient
</div>
```

### Fresh Gradient
```jsx
<div className="bg-gradient-fresh text-white p-6 rounded-lg">
  Conveys freshness with green gradient
</div>
```

### Text Gradient
```jsx
<h1 className="text-gradient text-4xl font-bold">
  Eye-catching gradient text
</h1>
```

## 📐 Layout

### Container
```jsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  Content goes here...
</div>
```

### Section Spacing
```jsx
<section className="py-12 lg:py-16">
  Section content with consistent vertical spacing
</section>
```

### Recipe Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {recipes.map(recipe => (
    <RecipeCard key={recipe.id} recipe={recipe} />
  ))}
</div>
```

### Cooking Mode Components

#### Interactive Cooking Steps
```jsx
<div className="space-y-4">
  <div className={cn(
    componentClasses.cooking.step,
    componentClasses.cooking.stepCompleted
  )}>
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center text-sm font-bold">
        ✓
      </span>
      <p>Heat oil in a large pan over medium heat.</p>
    </div>
  </div>
  
  <div className={cn(
    componentClasses.cooking.step,
    componentClasses.cooking.stepActive
  )}>
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
        2
      </span>
      <p>Add garlic and cook for 1 minute until fragrant.</p>
      <div className={cn(
        componentClasses.cooking.timer,
        componentClasses.cooking.timerAlert
      )}>
        0:45
      </div>
    </div>
  </div>
</div>
```

#### Progress Indicator
```jsx
<div className={componentClasses.cooking.progressBar}>
  <div 
    className={componentClasses.cooking.progressFill}
    style={{ width: '60%' }}
  />
</div>
```

### Loading States

#### Skeleton Loading
```jsx
<div className="space-y-4">
  <div className={componentClasses.loading.skeletonImage} />
  <div className={componentClasses.loading.skeletonTitle} />
  <div className={componentClasses.loading.skeletonText} />
  <div className={componentClasses.loading.skeletonText} />
</div>
```

#### Loading Spinner
```jsx
<div className="flex items-center gap-3">
  <div className={componentClasses.loading.spinner} />
  <span>Finding recipes...</span>
</div>
```

## ✨ Animations

### Modal Animations
```jsx
// Mobile modal (slides up from bottom)
<div className={componentClasses.modal.mobileContainer}>
  Modal content
</div>

// Desktop modal (scales in from center)
<div className={componentClasses.modal.desktopContainer}>
  Modal content
</div>
```

### Card Swipe Animations
```jsx
// Swipe left (reject)
<div className={componentClasses.animation.swipeLeft}>
  Recipe card
</div>

// Swipe right (save)
<div className={componentClasses.animation.swipeRight}>
  Recipe card
</div>
```

### Heart Save Animation
```jsx
<button 
  className={componentClasses.utilities.heartSave}
  onClick={() => saveRecipe()}
>
  ❤️ Save Recipe
</button>
```

### Search Bar Focus Animation
```jsx
<div className={cn(
  componentClasses.search.bar,
  isFocused && componentClasses.search.expanded
)}>
  <input className={componentClasses.search.input} />
</div>
```

### Timer Pulse Animation
```jsx
<div className={cn(
  componentClasses.cooking.timer,
  isUrgent && componentClasses.cooking.timerAlert
)}>
  0:30
</div>
```

## 🌙 Dark Mode

Our design system automatically supports dark mode through CSS variables:

```css
/* Light mode (default) */
:root {
  --background: #fefefe;
  --foreground: #1a1a1a;
  --primary: #ff6b35;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #fafafa;
    --primary: #ff7849;
  }
}
```

## 📱 Responsive Design

### Breakpoints
- **xs**: 475px (extra small phones)
- **sm**: 640px (small tablets)
- **md**: 768px (tablets)
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktops)
- **2xl**: 1536px (large desktops)
- **3xl**: 1600px (ultra-wide)

### Usage
```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text that scales with screen size
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid layout
</div>
```

## 🎯 Design Brief Implementation

### Performance Requirements
- **Skeleton loading** appears under 200ms to maintain layout continuity
- **Physics-based animations** using spring animations for natural feel
- **Touch-optimized elements** with minimum 44px touch targets
- **Progressive loading** with WebP/AVIF image optimization

### Interaction Patterns

#### Search Focus Behavior
```jsx
const [isFocused, setIsFocused] = useState(false)

<div className={cn(
  componentClasses.search.bar,
  isFocused && componentClasses.search.expanded,
  isFocused && componentClasses.utilities.backdropBlur
)}>
  <input 
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
  />
</div>
```

#### Card Deck Swipe Gestures
```jsx
const handleSwipe = (direction) => {
  if (direction === 'left') {
    cardRef.current.className += ` ${componentClasses.animation.swipeLeft}`
  } else {
    cardRef.current.className += ` ${componentClasses.animation.swipeRight}`
  }
}
```

#### Modal Responsive Behavior
```jsx
const isMobile = useMediaQuery('(max-width: 768px)')

<div className={
  isMobile 
    ? componentClasses.modal.mobileContainer 
    : componentClasses.modal.desktopContainer
}>
  Modal content
</div>
```

### Accessibility Standards (WCAG 2.2 AA)

#### Touch Targets
All interactive elements use the `touch-target` class ensuring minimum 44px size:
```jsx
<button className={cn(
  componentClasses.button.base,
  componentClasses.utilities.touchTarget
)}>
  Accessible Button
</button>
```

#### Focus Management
```jsx
<div className="focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Focusable element
</div>
```

#### Screen Reader Support
```jsx
<button aria-label="Save recipe to favorites">
  ❤️
</button>
```

### Print Optimization
```jsx
<div className={componentClasses.utilities.printOptimize}>
  <div className={componentClasses.utilities.printHide}>
    <button>Share Recipe</button>
  </div>
  <div className="recipe-content">
    Recipe details that will print nicely
  </div>
</div>
```

## 🎯 Best Practices

### 1. Touch-First Design
- All interactive elements meet 44px minimum touch target
- Generous padding on search bars and buttons
- Swipe gestures with clear visual affordances

### 2. Performance Optimization
- Skeleton loading states maintain spatial context
- CSS transforms for smooth animations
- Backdrop blur effects for focus states
- Progressive image loading

### 3. Responsive Behavior
- Mobile-first approach with progressive enhancement
- Different modal animations for mobile vs desktop
- Adaptive card layouts for different screen sizes

### 4. Animation Philosophy
- Physics-based transitions using cubic-bezier curves
- Micro-interactions provide immediate feedback
- Loading states that maintain context
- Spring animations for natural feel

### 5. Accessibility First
- High contrast ratios for all text
- Keyboard navigation for all interactions
- Screen reader labels for complex components
- Focus management for modal interactions

## 🛠️ Design System Usage

### Importing Design Tokens
```typescript
import { designSystem, ds, componentClasses, cn } from '@/lib/design-system'

// Use design tokens
const primaryColor = ds.color('brand.primary')
const mediumSpacing = ds.space('md')

// Combine classes
const buttonClasses = cn(
  componentClasses.button.base,
  componentClasses.button.variants.primary,
  componentClasses.button.sizes.md
)
```

### Custom Component Example
```tsx
interface RecipeCardProps {
  recipe: Recipe
  className?: string
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  return (
    <div className={cn(
      componentClasses.card.base,
      componentClasses.card.variants.recipe,
      className
    )}>
      <img 
        src={recipe.image} 
        alt={recipe.title}
        className="w-full aspect-recipe object-cover rounded-lg mb-4"
      />
      <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
      <div className="flex gap-2 mb-3">
        {recipe.dietary.map(diet => (
          <span 
            key={diet}
            className={cn(
              componentClasses.badge.base,
              componentClasses.badge.variants[diet]
            )}
          >
            {diet}
          </span>
        ))}
      </div>
      <p className="text-muted-foreground text-sm">{recipe.description}</p>
    </div>
  )
}
```

## 🔄 Updates and Maintenance

This design system is living and evolving. When making updates:

1. Update the CSS variables in `globals.css`
2. Update the design tokens in `design-system.ts`
3. Update the Tailwind config in `tailwind.config.ts`
4. Update this documentation
5. Test across all components and pages

---

**Happy cooking with great design! 🍳✨** 