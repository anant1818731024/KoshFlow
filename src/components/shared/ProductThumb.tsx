import { cn } from '@/lib/utils'
import type { Brand } from '@/types'

export interface ProductThumbProps {
  brand: Brand
  hue: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'h-10 w-10 text-[10px] rounded-lg',
  md: 'h-12 w-12 text-[11px] rounded-lg',
  lg: 'h-16 w-16 text-xs rounded-xl',
  xl: 'h-full w-full text-sm rounded-xl',
}

// Short monogram per brand for the generated swatch.
const monograms: Record<Brand, string> = {
  Chanel: 'CC',
  'Louis Vuitton': 'LV',
  Dior: 'CD',
  Hermès: 'H',
  Gucci: 'GG',
  Prada: 'PR',
  'Bottega Veneta': 'BV',
  'Saint Laurent': 'YSL',
  Celine: 'CE',
  Fendi: 'FF',
}

/**
 * A deterministic, asset-free product "image": a soft two-tone swatch with the
 * brand monogram. Keeps the app fast and offline while still feeling curated.
 */
export function ProductThumb({ brand, hue, size = 'md', className }: ProductThumbProps) {
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden ring-1 ring-inset ring-black/[0.06]',
        sizes[size],
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(145deg, hsl(${hue} 26% 91%), hsl(${
          (hue + 28) % 360
        } 22% 80%))`,
      }}
      aria-hidden
    >
      <span className="font-display font-medium text-ink-700/70">
        {monograms[brand]}
      </span>
      <span
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(120% 80% at 15% 10%, rgba(255,255,255,0.6), transparent 55%)',
        }}
      />
    </div>
  )
}
