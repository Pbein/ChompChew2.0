import { cn } from '@/lib/utils'

/**
 * Utility functions for consistent UI styling across the app
 */

// Text color utilities with dark mode support
export const textColors = {
  // Primary text colors
  primary: 'text-gray-900 dark:text-gray-100',
  secondary: 'text-gray-600 dark:text-gray-300',
  muted: 'text-gray-500 dark:text-gray-400',
  
  // Semantic colors
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
  
  // Brand colors
  brand: 'text-emerald-600 dark:text-emerald-400',
  brandHover: 'hover:text-emerald-700 dark:hover:text-emerald-300',
}

// Background color utilities
export const bgColors = {
  // Card backgrounds
  card: 'bg-white dark:bg-gray-800',
  cardSecondary: 'bg-gray-50 dark:bg-gray-700',
  
  // Input backgrounds
  input: 'bg-white dark:bg-gray-800',
  
  // Status backgrounds
  success: 'bg-green-50 dark:bg-green-900/20',
  warning: 'bg-amber-50 dark:bg-amber-900/20',
  error: 'bg-red-50 dark:bg-red-900/20',
  info: 'bg-blue-50 dark:bg-blue-900/20',
}

// Border color utilities
export const borderColors = {
  default: 'border-gray-300 dark:border-gray-600',
  light: 'border-gray-200 dark:border-gray-700',
  muted: 'border-gray-100 dark:border-gray-800',
  
  // Status borders
  success: 'border-green-200 dark:border-green-700',
  warning: 'border-amber-200 dark:border-amber-700',
  error: 'border-red-200 dark:border-red-700',
  info: 'border-blue-200 dark:border-blue-700',
}

// Placeholder color utilities
export const placeholderColors = {
  default: 'placeholder-gray-500 dark:placeholder-gray-400',
  light: 'placeholder-gray-400 dark:placeholder-gray-500',
}

/**
 * Get consistent input field classes
 */
export const getInputClasses = (variant: 'default' | 'error' = 'default') => {
  const baseClasses = cn(
    'w-full px-4 py-3 rounded-lg transition-colors duration-200',
    'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
    bgColors.input,
    textColors.primary,
    placeholderColors.default
  )
  
  const variantClasses = {
    default: borderColors.default,
    error: borderColors.error,
  }
  
  return cn(baseClasses, variantClasses[variant])
}

/**
 * Get consistent label classes
 */
export const getLabelClasses = () => {
  return cn(
    'block text-sm font-semibold mb-2',
    textColors.primary
  )
}

/**
 * Get consistent heading classes
 */
export const getHeadingClasses = (size: 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
    xl: 'text-4xl font-bold',
  }
  
  return cn(sizeClasses[size], textColors.primary)
}

/**
 * Get consistent card classes
 */
export const getCardClasses = (variant: 'default' | 'elevated' = 'default') => {
  const baseClasses = cn(
    'rounded-2xl border p-8',
    bgColors.card,
    borderColors.light
  )
  
  const variantClasses = {
    default: '',
    elevated: 'shadow-xl shadow-emerald-100/20',
  }
  
  return cn(baseClasses, variantClasses[variant])
}

/**
 * Get consistent alert/notification classes
 */
export const getAlertClasses = (variant: 'success' | 'warning' | 'error' | 'info') => {
  const variantClasses = {
    success: cn(bgColors.success, borderColors.success, 'text-green-700 dark:text-green-300'),
    warning: cn(bgColors.warning, borderColors.warning, 'text-amber-700 dark:text-amber-300'),
    error: cn(bgColors.error, borderColors.error, 'text-red-700 dark:text-red-300'),
    info: cn(bgColors.info, borderColors.info, 'text-blue-700 dark:text-blue-300'),
  }
  
  return cn(
    'p-4 rounded-lg border text-sm',
    variantClasses[variant]
  )
} 