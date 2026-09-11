import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'bottom' | 'right'
  className?: string
}

/** Lightweight CSS/JS tooltip — appears on hover and keyboard focus. */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [open, setOpen] = useState(false)

  const position =
    side === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      : side === 'bottom'
        ? 'top-full left-1/2 -translate-x-1/2 mt-2'
        : 'left-full top-1/2 -translate-y-1/2 ml-2'

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-ink-950 px-2 py-1 text-2xs font-medium text-ink-50 shadow-elevated animate-fade-in',
            position,
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  )
}
