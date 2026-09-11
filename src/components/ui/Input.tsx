import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode
  rightSlot?: ReactNode
  invalid?: boolean
  label?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, rightSlot, invalid, label, hint, className, id, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-[13px] font-medium text-ink-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-[38px] w-full rounded-lg border bg-white text-sm text-ink-900 placeholder:text-ink-400 transition-colors',
              'focus:outline-none focus:ring-4',
              leftIcon ? 'pl-9' : 'pl-3',
              rightSlot ? 'pr-9' : 'pr-3',
              invalid
                ? 'border-negative-500 focus:border-negative-500 focus:ring-negative-500/15'
                : 'border-ink-200 hover:border-ink-300 focus:border-accent-500 focus:ring-accent-500/15',
              className,
            )}
            aria-invalid={invalid || undefined}
            {...props}
          />
          {rightSlot && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
              {rightSlot}
            </span>
          )}
        </div>
        {hint && (
          <p
            className={cn(
              'mt-1.5 text-xs',
              invalid ? 'text-negative-600' : 'text-ink-500',
            )}
          >
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
