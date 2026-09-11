import { NavLink } from 'react-router-dom'
import { mobileNavItems } from './nav'
import { cn } from '@/lib/utils'

export function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-200/70 bg-white/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <ul className="flex items-stretch">
        {mobileNavItems.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2.5 text-2xs font-medium transition-colors',
                  isActive ? 'text-ink-900' : 'text-ink-400',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <item.icon
                      className={cn(
                        'h-[22px] w-[22px]',
                        isActive && 'text-accent-600',
                      )}
                    />
                    {item.live && (
                      <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white animate-pulse-dot" />
                    )}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
