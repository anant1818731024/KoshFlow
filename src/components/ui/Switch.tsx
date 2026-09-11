import { cn } from '@/lib/utils'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  id?: string
}

export function Switch({ checked, onChange, label, description, id }: SwitchProps) {
  const switchId = id || label?.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <label htmlFor={switchId} className="min-w-0 cursor-pointer">
          {label && (
            <span className="block text-[13px] font-medium text-ink-800">
              {label}
            </span>
          )}
          {description && (
            <span className="mt-0.5 block text-xs text-ink-400">
              {description}
            </span>
          )}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-accent-500/60 focus-visible:ring-offset-2',
          checked ? 'bg-accent-600' : 'bg-ink-200',
        )}
      >
        <span
          className={cn(
            'inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  )
}
