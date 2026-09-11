import { NavLink } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { navSections } from './nav'
import { Logo } from './Logo'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 flex h-full w-[82%] max-w-xs flex-col bg-white shadow-overlay animate-slide-in-right">
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
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
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-ink-100 text-ink-900'
                            : 'text-ink-600 hover:bg-ink-50',
                        )
                      }
                    >
                      <item.icon className="h-[18px] w-[18px] text-ink-400" />
                      <span className="flex-1">{item.label}</span>
                      {item.live && (
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse-dot" />
                      )}
                      {item.badge && (
                        <span className="rounded-full bg-gold-50 px-1.5 py-0.5 text-2xs font-semibold text-gold-700">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3 border-t border-ink-100 p-4">
          <Avatar name="Riya Mehta" hue={150} size="md" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink-800">
              Riya Mehta
            </p>
            <p className="truncate text-2xs text-ink-400">Aarohi Collective · Pro</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
