// ChompChew Design System
// Comprehensive design tokens and utility functions for the recipe platform

export const designSystem = {
  // Color palette
  colors: {
    // Brand colors - Food-inspired
    brand: {
      primary: '#ff6b35',      // Vibrant orange - energy, appetite
      secondary: '#4a7c59',    // Fresh green - healthy, natural  
      accent: '#f4a261',       // Warm yellow - comfort, warmth
    },
    
    // Status colors
    status: {
      success: '#10b981',      // Fresh green
      warning: '#f59e0b',      // Amber
      error: '#ef4444',        // Red - spicy
      info: '#3b82f6',         // Blue
    },
    
    // Food category colors
    dietary: {
      vegetarian: '#22c55e',   // Green
      vegan: '#16a34a',        // Darker green
      glutenFree: '#8b5cf6',   // Purple
      dairyFree: '#06b6d4',    // Cyan
      keto: '#f97316',         // Orange
      paleo: '#84cc16',        // Lime
    },
    
    // Difficulty colors
    difficulty: {
      easy: '#22c55e',         // Green
      medium: '#f59e0b',       // Amber
      hard: '#ef4444',         // Red
    },
    
    // Neutral colors
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    }
  },
  
  // Typography scale
  typography: {
    fonts: {
      sans: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
      mono: 'var(--font-geist-mono), Fira Code, monospace',
      display: 'Playfair Display, Georgia, serif',
    },
    
    sizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
    },
    
    weights: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
  
  // Spacing scale
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '5rem',    // 80px
    '5xl': '6rem',    // 96px
  },
  
  // Border radius
  radius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',   // Full rounded
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Animation durations
  animations: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
}

// Utility functions for design system
export const ds = {
  // Color utilities
  color: (path: string) => {
    const keys = path.split('.')
    let value: unknown = designSystem.colors
    for (const key of keys) {
      value = value && typeof value === 'object' && key in value 
        ? (value as Record<string, unknown>)[key] 
        : undefined
    }
    return (typeof value === 'string' ? value : path)
  },
  
  // Typography utilities
  font: (key: keyof typeof designSystem.typography.fonts) => 
    designSystem.typography.fonts[key],
  
  fontSize: (key: keyof typeof designSystem.typography.sizes) => 
    designSystem.typography.sizes[key],
  
  fontWeight: (key: keyof typeof designSystem.typography.weights) => 
    designSystem.typography.weights[key],
  
  // Spacing utilities
  space: (key: keyof typeof designSystem.spacing) => 
    designSystem.spacing[key],
  
  // Border radius utilities
  radius: (key: keyof typeof designSystem.radius) => 
    designSystem.radius[key],
  
  // Shadow utilities
  shadow: (key: keyof typeof designSystem.shadows) => 
    designSystem.shadows[key],
}

// Component class variants
export const componentClasses = {
  // Button variants
  button: {
    base: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target',
    
    variants: {
      primary: 'btn-primary',
      secondary: 'btn-secondary', 
      accent: 'btn-accent',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      cta: 'btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all',
    },
    
    sizes: {
      sm: 'h-9 rounded-md px-3',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 rounded-md px-8',
      xl: 'h-14 px-10 text-lg',
      icon: 'h-10 w-10',
      'icon-lg': 'h-12 w-12',
    }
  },
  
  // Card variants
  card: {
    base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
    variants: {
      default: 'border-border',
      elevated: 'shadow-md hover:shadow-lg transition-shadow',
      recipe: 'recipe-card',
      interactive: 'cursor-pointer hover:shadow-md transition-all',
    }
  },
  
  // Badge variants
  badge: {
    base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    
    variants: {
      default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'text-foreground border-border',
      
      // Dietary badges
      vegetarian: 'badge-vegetarian',
      vegan: 'badge-vegan',
      glutenFree: 'badge-gluten-free',
      dairyFree: 'badge-dairy-free',
      keto: 'badge-keto',
      paleo: 'badge-paleo',
      
      // Difficulty badges
      easy: 'badge-easy',
      medium: 'badge-medium',
      hard: 'badge-hard',
    }
  },
  
  // Input variants
  input: {
    base: 'input-field',
    variants: {
      default: '',
      error: 'border-error focus:ring-error',
      success: 'border-success focus:ring-success',
    }
  },
  
  // Text variants
  text: {
    display: 'text-display',
    gradient: 'text-gradient',
    muted: 'text-muted-foreground',
  },
  
  // Layout utilities
  layout: {
    container: 'container mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-12 lg:py-16',
    grid: {
      recipes: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      features: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    }
  },
  
  // Animation classes
  animation: {
    fadeIn: 'animate-in fade-in duration-500',
    slideIn: 'animate-in slide-in-from-bottom-4 duration-500',
    pulse: 'animate-pulse-slow',
    slideUpModal: 'animate-slide-up-modal',
    scaleInModal: 'animate-scale-in-modal',
    swipeLeft: 'animate-swipe-left',
    swipeRight: 'animate-swipe-right',
    heartBeat: 'animate-heart-beat',
    timerPulse: 'animate-timer-pulse',
  },

  // Hero section
  hero: {
    section: 'hero-section gradient-hero',
    title: 'font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-6',
    subtitle: 'text-lg md:text-xl text-white/90 text-center mb-8 max-w-2xl mx-auto',
    searchContainer: 'w-full max-w-2xl mx-auto',
  },

  // Search components
  search: {
    bar: 'search-bar w-full',
    input: 'w-full bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground',
    button: 'btn-primary px-6 py-3 rounded-lg ml-4 whitespace-nowrap',
    expanded: 'search-bar-expanded',
    suggestions: 'absolute top-full left-0 right-0 bg-white border border-border rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-50',
    suggestionItem: 'px-4 py-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0',
  },

  // Modal components
  modal: {
    overlay: 'fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4',
    container: 'modal-container w-full max-w-2xl max-h-[90vh] overflow-y-auto',
    mobileContainer: 'modal-container modal-slide-up w-full max-w-2xl',
    desktopContainer: 'modal-container modal-scale-in w-full max-w-2xl',
    header: 'flex items-center justify-between p-6 border-b border-border',
    title: 'text-xl font-semibold',
    closeButton: 'p-2 hover:bg-muted rounded-lg transition-colors',
    content: 'p-6',
    footer: 'flex items-center justify-end gap-3 p-6 border-t border-border',
  },

  // Card deck components
  cardDeck: {
    container: 'card-deck relative w-full max-w-sm mx-auto',
    card: 'recipe-card-deck w-full',
    stack: 'recipe-card-stack',
    actions: 'flex items-center justify-center gap-4 mt-6',
    actionButton: 'w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110',
    skipButton: 'bg-muted text-muted-foreground hover:bg-muted/80',
    saveButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
    detailsButton: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  },

  // Recipe card components
  recipeCard: {
    base: 'recipe-card overflow-hidden',
    image: 'w-full aspect-recipe object-cover',
    content: 'p-6',
    title: 'font-semibold text-xl mb-2 line-clamp-2',
    description: 'text-muted-foreground text-sm mb-4 line-clamp-3',
    metadata: 'flex items-center gap-4 text-sm text-muted-foreground mb-3',
    metadataItem: 'flex items-center gap-1',
    badges: 'flex flex-wrap gap-2 mb-3',
    actions: 'flex items-center justify-between',
  },

  // Diet and allergen components
  diet: {
    templateCard: 'diet-template-card',
    templateSelected: 'selected',
    chipRemovable: 'chip-removable bg-primary/10 text-primary border border-primary/20',
    chipRemoveButton: 'chip-remove-btn',
    allergenToggle: 'allergen-toggle',
    allergenActive: 'active',
  },

  // Cooking mode components
  cooking: {
    step: 'cooking-step',
    stepActive: 'active',
    stepCompleted: 'completed',
    timer: 'timer-display',
    timerAlert: 'timer-alert',
    progressBar: 'progress-bar h-2',
    progressFill: 'progress-fill',
  },

  // Loading states
  loading: {
    spinner: 'spinner w-6 h-6',
    spinnerLarge: 'spinner w-8 h-8',
    skeleton: 'skeleton',
    skeletonText: 'skeleton-text',
    skeletonTitle: 'skeleton-title',
    skeletonImage: 'skeleton-image',
  },

  // Utility classes
  utilities: {
    touchTarget: 'touch-target',
    backdropBlur: 'backdrop-blur-focus',
    printHide: 'no-print',
    printOptimize: 'print-optimize',
    heartSave: 'heart-save',
  }
}

// Helper function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// Color palette for easy reference
export const colors = designSystem.colors

// Export individual tokens for easy importing
export const { fonts, sizes: fontSizes, weights: fontWeights } = designSystem.typography
export const spacing = designSystem.spacing
export const radius = designSystem.radius
export const shadows = designSystem.shadows
export const breakpoints = designSystem.breakpoints 