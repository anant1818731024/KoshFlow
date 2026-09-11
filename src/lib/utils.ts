import type { CSSProperties } from 'react'
import type { Currency } from '@/types'

/** Tiny classnames joiner — keeps JSX readable without a runtime dependency. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  GBP: '£',
  EUR: '€',
}

export function currencySymbol(currency: Currency = 'USD'): string {
  return currencySymbols[currency]
}

/** Compact, human currency: $48,290 or $1.2M — no trailing cents by default. */
export function formatCurrency(
  value: number,
  opts: { currency?: Currency; compact?: boolean; cents?: boolean } = {},
): string {
  const { currency = 'USD', compact = false, cents = false } = opts
  const sym = currencySymbols[currency]
  if (compact && Math.abs(value) >= 1000) {
    const formatted = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
    return `${sym}${formatted}`
  }
  return `${sym}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(value)}`
}

export function formatNumber(value: number, compact = false): string {
  return new Intl.NumberFormat('en-US', {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatPercent(value: number, withSign = true): string {
  const sign = withSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/** "just now", "3m ago", "2h ago", "Yesterday" — for the live feed & orders. */
export function timeAgo(epochMs: number, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.floor((now - epochMs) / 1000))
  if (seconds < 8) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

/**
 * A soft, muted product swatch derived deterministically from a hue.
 * Gives every mock product a distinct-yet-cohesive "image" without assets.
 */
export function swatchStyle(hue: number): CSSProperties {
  return {
    backgroundImage: `linear-gradient(150deg, hsl(${hue} 24% 90%), hsl(${
      (hue + 26) % 360
    } 20% 78%))`,
  }
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

/** Deterministic pseudo-random in [0,1) from an integer seed (mulberry32). */
export function seeded(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)]
}
