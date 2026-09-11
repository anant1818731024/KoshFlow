import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tone =
  | 'neutral'
  | 'accent'
  | 'positive'
  | 'warn'
  | 'negative'
  | 'gold'
  | 'info'

export interface BadgeProps {
  children: ReactNode
  tone?: Tone
  dot?: boolean
  className?: string
  size?: 'sm' | 'md'
}

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-600 ring-ink-200',
  accent: 'bg-accent-50 text-accent-700 ring-accent-200',
  positive: 'bg-positive-50 text-positive-700 ring-positive-500/20',
  warn: 'bg-warn-50 text-warn-600 ring-warn-500/20',
  negative: 'bg-negative-50 text-negative-700 ring-negative-500/20',
  gold: 'bg-gold-50 text-gold-700 ring-gold-300/40',
  info: 'bg-[#eef1f6] text-[#42506b] ring-[#c9d2e2]',
}

const dotColors: Record<Tone, string> = {
  neutral: 'bg-ink-400',
  accent: 'bg-accent-500',
  positive: 'bg-positive-500',
  warn: 'bg-warn-500',
  negative: 'bg-negative-500',
  gold: 'bg-gold-500',
  info: 'bg-[#42506b]',
}

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-0.5 text-xs',
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', dotColors[tone])}
          aria-hidden
        />
      )}
      {children}
    </span>
  )
}
