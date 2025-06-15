import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

interface AllTheProvidersProps {
  children: ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  // For now, just return children directly
  // We'll add providers (Zustand, React Query, etc.) as we integrate them
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render } 