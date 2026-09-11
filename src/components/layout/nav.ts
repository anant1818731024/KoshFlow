import {
  LayoutDashboard,
  Package,
  Receipt,
  Store,
  Users,
  Radio,
  BarChart3,
  Sparkles,
  Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  badge?: string
  live?: boolean
}

export interface NavSection {
  heading?: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/inventory', label: 'Inventory', icon: Package },
      { to: '/orders', label: 'Orders', icon: Receipt },
    ],
  },
  {
    heading: 'Sourcing',
    items: [
      { to: '/marketplace', label: 'Marketplace', icon: Store },
      { to: '/suppliers', label: 'Suppliers', icon: Users },
      { to: '/source', label: 'Source', icon: Radio, live: true },
    ],
  },
  {
    heading: 'Intelligence',
    items: [
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/assistant', label: 'AI Assistant', icon: Sparkles, badge: 'Beta' },
    ],
  },
  {
    items: [{ to: '/settings', label: 'Settings', icon: Settings }],
  },
]

// Flattened list for the mobile bottom bar (primary destinations only).
export const mobileNavItems: NavItem[] = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/source', label: 'Source', icon: Radio, live: true },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/assistant', label: 'Assistant', icon: Sparkles },
]

export const allNavItems: NavItem[] = navSections.flatMap((s) => s.items)
