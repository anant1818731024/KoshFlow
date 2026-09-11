import { BadgeCheck } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'

export function VerifiedMark({
  className,
  label = 'Verified supplier',
  withLabel = false,
}: {
  className?: string
  label?: string
  withLabel?: boolean
}) {
  if (withLabel) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gold-700">
        <BadgeCheck className={cn('h-4 w-4', className)} />
        {label}
      </span>
    )
  }
  return (
    <Tooltip content={label}>
      <BadgeCheck
        className={cn('h-4 w-4 text-gold-500', className)}
        aria-label={label}
      />
    </Tooltip>
  )
}
