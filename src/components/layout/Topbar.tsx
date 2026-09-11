import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Menu, Search, Plus, Command } from 'lucide-react'
import { Logo } from './Logo'
import { allNavItems } from './nav'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface TopbarProps {
  onOpenMenu: () => void
  onQuickAdd: () => void
}

const notifications = [
  { id: 1, title: 'New WTB match', body: '@meera.iyer is looking for your Dior Saddle Bag', time: '2m', tone: 'accent' },
  { id: 2, title: 'Order paid', body: 'Neha Bansal paid $2,190 for Neverfull MM', time: '18m', tone: 'positive' },
  { id: 3, title: 'Low stock', body: 'Gucci Jackie 1961 Small — 1 unit remaining', time: '1h', tone: 'warn' },
  { id: 4, title: 'Supplier reply', body: 'Nandini Rao responded to your enquiry', time: '3h', tone: 'neutral' },
]

export function Topbar({ onOpenMenu, onQuickAdd }: TopbarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const results = query
    ? allNavItems.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase()),
      )
    : allNavItems

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const go = (to: string) => {
    navigate(to)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200/70 bg-ink-50/85 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onOpenMenu}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="lg:hidden">
        <Logo compact />
      </div>

      {/* Global search / command menu */}
      <div ref={searchRef} className="relative ml-auto w-full max-w-md lg:ml-0">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search KoshFlow…"
            aria-label="Search the application"
            className="hidden h-[38px] w-full rounded-lg border border-ink-200 bg-white pl-9 pr-16 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/15 sm:block"
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-2xs text-ink-400 sm:flex">
            <Command className="h-3 w-3" />K
          </span>
        </div>

        {searchOpen && (
          <div className="absolute left-0 right-0 top-full z-40 mt-2 hidden overflow-hidden rounded-xl border border-ink-200 bg-white shadow-overlay animate-fade-in-up sm:block">
            <p className="px-3 pt-2.5 pb-1 text-2xs font-semibold uppercase tracking-wider text-ink-400">
              Navigate
            </p>
            <ul className="max-h-72 overflow-y-auto pb-1.5">
              {results.length === 0 && (
                <li className="px-3 py-3 text-sm text-ink-400">
                  No pages match “{query}”.
                </li>
              )}
              {results.map((item) => (
                <li key={item.to}>
                  <button
                    onClick={() => go(item.to)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-ink-700 transition-colors hover:bg-ink-50"
                  >
                    <item.icon className="h-4 w-4 text-ink-400" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:ml-4">
        <Button
          variant="primary"
          size="sm"
          onClick={onQuickAdd}
          leftIcon={<Plus className="h-4 w-4" />}
          className="hidden sm:inline-flex"
        >
          Add product
        </Button>

        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100"
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-500 ring-2 ring-ink-50" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-overlay animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                <span className="text-sm font-semibold text-ink-900">
                  Notifications
                </span>
                <span className="text-2xs font-medium text-accent-600">
                  4 new
                </span>
              </div>
              <ul className="max-h-96 divide-y divide-ink-100 overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex gap-3 px-4 py-3 transition-colors hover:bg-ink-50"
                  >
                    <span
                      className={cn(
                        'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                        n.tone === 'accent' && 'bg-accent-500',
                        n.tone === 'positive' && 'bg-positive-500',
                        n.tone === 'warn' && 'bg-warn-500',
                        n.tone === 'neutral' && 'bg-ink-300',
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-ink-800">
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-[13px] leading-snug text-ink-500">
                        {n.body}
                      </p>
                      <p className="mt-1 text-2xs text-ink-400">{n.time} ago</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="w-full border-t border-ink-100 py-2.5 text-center text-[13px] font-medium text-ink-600 transition-colors hover:bg-ink-50">
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
