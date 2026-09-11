import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[]
  label?: string
  placeholder?: string
  size?: 'sm' | 'md'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, label, placeholder, size = 'md', className, id, ...props }, ref) => {
    const selectId = id || props.name
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-[13px] font-medium text-ink-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-lg border border-ink-200 bg-white pr-9 text-sm text-ink-900 transition-colors',
              'hover:border-ink-300 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/15',
              size === 'sm' ? 'h-8 pl-2.5 text-[13px]' : 'h-[38px] pl-3',
              className,
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
        </div>
      </div>
    )
  },
)
Select.displayName = 'Select'
