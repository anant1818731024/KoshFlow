import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    // Move focus into the dialog for keyboard users.
    const t = window.setTimeout(() => panelRef.current?.focus(), 20)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      window.clearTimeout(t)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Dialog'}
    >
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full rounded-t-2xl bg-white shadow-overlay outline-none animate-slide-up sm:rounded-2xl sm:animate-scale-in',
          sizes[size],
          className,
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 pt-5 pb-4">
            <div className="min-w-0">
              {title && (
                <h2 className="font-display text-xl font-medium text-ink-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-ink-500">{description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close dialog"
              className="-mr-2 -mt-1 shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-ink-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
