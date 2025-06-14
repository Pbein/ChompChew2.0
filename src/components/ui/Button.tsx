import React from 'react'
import { cn } from '@/lib/utils'
import { componentClasses } from '@/lib/design-system'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cta' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  className,
  disabled,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        componentClasses.button.base,
        componentClasses.button.variants[variant],
        componentClasses.button.sizes[size],
        componentClasses.utilities.touchTarget,
        loading && 'opacity-70 cursor-not-allowed',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className={componentClasses.loading.spinner} />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

// Specific button variants for common use cases
export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="primary" {...props} />
}

export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="secondary" {...props} />
}

export function CTAButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="cta" {...props} />
} 