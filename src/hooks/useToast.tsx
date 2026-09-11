import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, AlertTriangle, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastTone = 'success' | 'info' | 'warning' | 'error'

interface Toast {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

interface ToastInput {
  title: string
  description?: string
  tone?: ToastTone
  duration?: number
}

interface ToastContextValue {
  toast: (input: ToastInput) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toneConfig: Record<
  ToastTone,
  { icon: typeof Info; className: string }
> = {
  success: { icon: CheckCircle2, className: 'text-accent-600' },
  info: { icon: Info, className: 'text-[#42506b]' },
  warning: { icon: AlertTriangle, className: 'text-warn-600' },
  error: { icon: XCircle, className: 'text-negative-600' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    ({ title, description, tone = 'success', duration = 4000 }: ToastInput) => {
      const id = ++counter.current
      setToasts((prev) => [...prev, { id, title, description, tone }])
      window.setTimeout(() => remove(id), duration)
    },
    [remove],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-4 sm:items-end"
          role="region"
          aria-live="polite"
          aria-label="Notifications"
        >
          {toasts.map((t) => {
            const { icon: Icon, className } = toneConfig[t.tone]
            return (
              <div
                key={t.id}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-ink-200/70 bg-white px-4 py-3 shadow-overlay animate-toast-in"
              >
                <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', className)} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-900">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-[13px] text-ink-500">
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => remove(t.id)}
                  aria-label="Dismiss notification"
                  className="-mr-1 -mt-1 rounded p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
