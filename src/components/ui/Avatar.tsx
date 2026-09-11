import { cn } from '@/lib/utils'
import { initials } from '@/lib/utils'

export interface AvatarProps {
  name: string
  hue?: number
  size?: 'sm' | 'md' | 'lg'
  verified?: boolean
  className?: string
}

const sizes = {
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
}

export function Avatar({ name, hue = 200, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-ink-800 ring-1 ring-inset ring-black/5',
        sizes[size],
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(140deg, hsl(${hue} 32% 88%), hsl(${
          (hue + 30) % 360
        } 28% 80%))`,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}
