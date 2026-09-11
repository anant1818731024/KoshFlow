import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-ink-200/70 bg-white shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 px-5 pt-4 pb-3',
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-ink-900">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-[13px] text-ink-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 pb-5', className)} {...props}>
      {children}
    </div>
  )
}
