import { NavLink } from 'react-router-dom'
import { LifeBuoy } from 'lucide-react'
import { navSections } from './nav'
import { Logo } from './Logo'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-ink-200/70 lg:bg-white">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navSections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <p className="mb-1.5 px-3 text-2xs font-semibold uppercase tracking-wider text-ink-400">
                {section.heading}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-ink-100 text-ink-900'
                          : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-600 transition-opacity',
                            isActive ? 'opacity-100' : 'opacity-0',
                          )}
                          aria-hidden
                        />
                        <item.icon
                          className={cn(
                            'h-[18px] w-[18px] shrink-0 transition-colors',
                            isActive
                              ? 'text-ink-900'
                              : 'text-ink-400 group-hover:text-ink-600',
                          )}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.live && (
                          <span className="flex items-center gap-1 text-2xs font-semibold text-accent-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse-dot" />
                            Live
                          </span>
                        )}
                        {item.badge && (
                          <span className="rounded-full bg-gold-50 px-1.5 py-0.5 text-2xs font-semibold text-gold-700 ring-1 ring-inset ring-gold-300/40">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-ink-100 p-3">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800"
        >
          <LifeBuoy className="h-[18px] w-[18px] text-ink-400" />
          Help &amp; support
        </a>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar name="Riya Mehta" hue={150} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-ink-800">
              Riya Mehta
            </p>
            <p className="truncate text-2xs text-ink-400">Aarohi Collective · Pro</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
