import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 active:scale-[0.98]'

const variants: Record<Variant, string> = {
  primary:
    'bg-ink-950 text-ink-50 hover:bg-ink-800 shadow-sm focus-visible:ring-ink-900/40',
  secondary:
    'bg-white text-ink-800 border border-ink-200 hover:bg-ink-50 hover:border-ink-300 shadow-sm focus-visible:ring-ink-300',
  outline:
    'bg-transparent text-ink-700 border border-ink-200 hover:bg-white hover:border-ink-300 focus-visible:ring-ink-300',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900 focus-visible:ring-ink-300',
  danger:
    'bg-negative-600 text-white hover:bg-negative-700 shadow-sm focus-visible:ring-negative-500/40',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-[38px] px-4 text-sm',
  lg: 'h-11 px-5 text-[15px]',
  icon: 'h-9 w-9 p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    )
  },
)
Button.displayName = 'Button'
