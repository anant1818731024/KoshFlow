import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  eyebrow?: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: string
}

/** A right-hand side panel — used for detail views on desktop & mobile. */
export function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  width = 'max-w-md',
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => panelRef.current?.focus(), 20)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      window.clearTimeout(t)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 flex h-full w-full flex-col bg-white shadow-overlay outline-none animate-slide-in-right',
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 pt-5 pb-4">
          <div className="min-w-0">
            {eyebrow && (
              <div className="mb-1 text-2xs font-semibold uppercase tracking-wider text-ink-400">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="font-display text-xl font-medium leading-snug text-ink-900">
                {title}
              </h2>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close panel"
            className="-mr-2 -mt-1 shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center gap-3 border-t border-ink-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
