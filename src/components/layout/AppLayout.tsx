import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { MobileMenu } from './MobileMenu'
import { ProductFormModal } from '@/components/shared/ProductFormModal'

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMenu={() => setMenuOpen(true)}
          onQuickAdd={() => setQuickAddOpen(true)}
        />

        <main
          key={location.pathname}
          className="flex-1 animate-fade-in px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10"
        >
          <div className="mx-auto max-w-[1240px]">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ProductFormModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </div>
  )
}
