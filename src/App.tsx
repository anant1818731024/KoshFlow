import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ToastProvider } from '@/hooks/useToast'
import { AppStoreProvider } from '@/hooks/useAppStore'
import Dashboard from '@/pages/Dashboard'
import Inventory from '@/pages/Inventory'
import Orders from '@/pages/Orders'
import Marketplace from '@/pages/Marketplace'
import Suppliers from '@/pages/Suppliers'
import Source from '@/pages/Source'
import Analytics from '@/pages/Analytics'
import Assistant from '@/pages/Assistant'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <ToastProvider>
      <AppStoreProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/source" element={<Source />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AppStoreProvider>
    </ToastProvider>
  )
}
