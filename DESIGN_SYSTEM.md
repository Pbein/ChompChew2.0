# 🎨 ChompChew Design System

Welcome to the ChompChew Design System - a comprehensive visual language designed specifically for our AI-powered recipe discovery platform.

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

### Buttons

#### Primary Button
```jsx
<button className="btn-primary px-4 py-2 rounded-md">
  Generate Recipe
</button>
```

#### Secondary Button
```jsx
<button className="btn-secondary px-4 py-2 rounded-md">
  Save to Favorites
</button>
```

#### Accent Button
```jsx
<button className="btn-accent px-4 py-2 rounded-md">
  Start Cooking
</button>
```

### Cards

#### Recipe Card
```jsx
<div className="recipe-card p-6">
  <img src="recipe.jpg" alt="Recipe" className="w-full aspect-recipe object-cover rounded-lg mb-4" />
  <h3 className="font-semibold text-lg mb-2">Delicious Recipe</h3>
  <p className="text-muted-foreground text-sm">A mouth-watering dish...</p>
</div>
```

#### Elevated Card
```jsx
<div className="card-base card-elevated p-6">
  <h3 className="font-semibold mb-4">Featured Content</h3>
  <p>Important information goes here...</p>
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

## ✨ Animations

### Fade In
```jsx
<div className="animate-fade-in">
  Content that fades in smoothly
</div>
```

### Slide Up
```jsx
<div className="animate-slide-up">
  Content that slides up from bottom
</div>
```

### Scale In
```jsx
<div className="animate-scale-in">
  Content that scales in
</div>
```

### Slow Pulse (for loading states)
```jsx
<div className="animate-pulse-slow">
  Loading placeholder
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

## 🎯 Best Practices

### 1. Consistent Spacing
Use our spacing scale consistently:
- `space-xs` (4px) for tight spacing
- `space-sm` (8px) for small gaps
- `space-md` (16px) for default spacing
- `space-lg` (24px) for section spacing
- `space-xl` (32px) for large gaps

### 2. Color Usage
- Use primary orange for main actions and CTAs
- Use secondary green for success states and healthy content
- Use accent yellow for highlights and warmth
- Use dietary colors consistently for recipe categorization

### 3. Typography Hierarchy
- Use display font for main headings and branding
- Use sans-serif for body text and UI elements
- Use monospace for code and technical content

### 4. Interactive States
Always provide hover and focus states:
```jsx
<button className="bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary">
  Interactive button
</button>
```

### 5. Accessibility
- Maintain proper color contrast ratios
- Use semantic HTML elements
- Provide focus indicators
- Include alt text for images

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