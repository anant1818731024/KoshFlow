import { useState, type ReactNode } from 'react'
import {
  User,
  Building2,
  Bell,
  SlidersHorizontal,
  Shield,
  Check,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

type Section = 'profile' | 'business' | 'notifications' | 'preferences' | 'security'

const sections: { key: Section; label: string; icon: typeof User }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'business', label: 'Business', icon: Building2 },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { key: 'security', label: 'Security', icon: Shield },
]

export default function Settings() {
  const { toast } = useToast()
  const [active, setActive] = useState<Section>('profile')

  const [notif, setNotif] = useState({
    wtbMatches: true,
    priceDrops: true,
    orderUpdates: true,
    supplierReplies: true,
    weeklyDigest: false,
    marketing: false,
  })
  const [prefs, setPrefs] = useState({
    currency: 'USD',
    dateFormat: 'MMM D, YYYY',
    density: 'comfortable',
    reduceMotion: false,
  })

  const save = () =>
    toast({
      title: 'Settings saved',
      description: 'Your changes have been applied.',
      tone: 'success',
    })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, business details and preferences."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Section nav */}
        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:w-full',
                active === s.key
                  ? 'bg-ink-100 text-ink-900'
                  : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800',
              )}
            >
              <s.icon className="h-[18px] w-[18px]" />
              {s.label}
            </button>
          ))}
        </nav>

        {/* Panels */}
        <div className="min-w-0">
          {active === 'profile' && (
            <Card>
              <CardBody className="space-y-6 pt-5">
                <SectionTitle title="Profile" description="How you appear across KoshFlow." />
                <div className="flex items-center gap-4">
                  <Avatar name="Riya Mehta" hue={150} size="lg" />
                  <div>
                    <Button variant="secondary" size="sm">
                      Change photo
                    </Button>
                    <p className="mt-1.5 text-2xs text-ink-400">
                      JPG or PNG, up to 2MB.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="First name" defaultValue="Riya" />
                  <Input label="Last name" defaultValue="Mehta" />
                  <Input label="Email" type="email" defaultValue="riya@aarohicollective.in" />
                  <Input label="Phone" defaultValue="+91 98201 44782" />
                  <div className="sm:col-span-2">
                    <Input label="Handle" defaultValue="@riyamehta" leftIcon={<span className="text-sm">@</span>} />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {active === 'business' && (
            <Card>
              <CardBody className="space-y-6 pt-5">
                <SectionTitle
                  title="Business information"
                  description="Details used on invoices and your storefront."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input label="Business name" defaultValue="Aarohi Collective" />
                  </div>
                  <Select
                    label="Business type"
                    defaultValue="reseller"
                    options={[
                      { value: 'reseller', label: 'Independent reseller' },
                      { value: 'personal-shopper', label: 'Personal shopper' },
                      { value: 'boutique', label: 'Boutique / consignment' },
                    ]}
                  />
                  <Select
                    label="Base currency"
                    defaultValue="USD"
                    options={[
                      { value: 'USD', label: 'USD — US Dollar' },
                      { value: 'GBP', label: 'GBP — British Pound' },
                      { value: 'EUR', label: 'EUR — Euro' },
                    ]}
                  />
                  <Input label="GSTIN" defaultValue="27AARCR4821M1ZP" />
                  <Input label="Country" defaultValue="India" />
                  <div className="sm:col-span-2">
                    <Input label="Business address" defaultValue="21 Turner Road, Bandra West, Mumbai 400050" />
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {active === 'notifications' && (
            <Card>
              <CardBody className="space-y-1 pt-5">
                <SectionTitle
                  title="Notifications"
                      description="Choose what KoshFlow alerts you about."
                />
                <div className="divide-y divide-ink-100">
                  <ToggleRow>
                    <Switch
                      label="WTB matches"
                      description="When a buyer wants something you hold in stock"
                      checked={notif.wtbMatches}
                      onChange={(v) => setNotif((n) => ({ ...n, wtbMatches: v }))}
                    />
                  </ToggleRow>
                  <ToggleRow>
                    <Switch
                      label="Price drops"
                      description="When a saved marketplace item changes price"
                      checked={notif.priceDrops}
                      onChange={(v) => setNotif((n) => ({ ...n, priceDrops: v }))}
                    />
                  </ToggleRow>
                  <ToggleRow>
                    <Switch
                      label="Order updates"
                      description="Payment, shipping and status changes"
                      checked={notif.orderUpdates}
                      onChange={(v) => setNotif((n) => ({ ...n, orderUpdates: v }))}
                    />
                  </ToggleRow>
                  <ToggleRow>
                    <Switch
                      label="Supplier replies"
                      description="When a supplier responds to your enquiry"
                      checked={notif.supplierReplies}
                      onChange={(v) => setNotif((n) => ({ ...n, supplierReplies: v }))}
                    />
                  </ToggleRow>
                  <ToggleRow>
                    <Switch
                      label="Weekly digest"
                      description="A Monday summary of your performance"
                      checked={notif.weeklyDigest}
                      onChange={(v) => setNotif((n) => ({ ...n, weeklyDigest: v }))}
                    />
                  </ToggleRow>
                  <ToggleRow>
                    <Switch
                      label="Product news"
                      description="Occasional updates about new KoshFlow features"
                      checked={notif.marketing}
                      onChange={(v) => setNotif((n) => ({ ...n, marketing: v }))}
                    />
                  </ToggleRow>
                </div>
              </CardBody>
            </Card>
          )}

          {active === 'preferences' && (
            <Card>
              <CardBody className="space-y-6 pt-5">
                <SectionTitle
                  title="Preferences"
                  description="Tune how the app looks and formats data."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select
                    label="Display currency"
                    value={prefs.currency}
                    onChange={(e) => setPrefs((p) => ({ ...p, currency: e.target.value }))}
                    options={[
                      { value: 'USD', label: 'USD — US Dollar' },
                      { value: 'GBP', label: 'GBP — British Pound' },
                      { value: 'EUR', label: 'EUR — Euro' },
                    ]}
                  />
                  <Select
                    label="Date format"
                    value={prefs.dateFormat}
                    onChange={(e) => setPrefs((p) => ({ ...p, dateFormat: e.target.value }))}
                    options={[
                      { value: 'MMM D, YYYY', label: 'Sep 11, 2026' },
                      { value: 'DD/MM/YYYY', label: '11/09/2026' },
                      { value: 'YYYY-MM-DD', label: '2026-09-11' },
                    ]}
                  />
                  <Select
                    label="Table density"
                    value={prefs.density}
                    onChange={(e) => setPrefs((p) => ({ ...p, density: e.target.value }))}
                    options={[
                      { value: 'comfortable', label: 'Comfortable' },
                      { value: 'compact', label: 'Compact' },
                    ]}
                  />
                </div>
                <div className="border-t border-ink-100 pt-4">
                  <Switch
                    label="Reduce motion"
                    description="Minimise animations and transitions"
                    checked={prefs.reduceMotion}
                    onChange={(v) => setPrefs((p) => ({ ...p, reduceMotion: v }))}
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {active === 'security' && (
            <Card>
              <CardBody className="space-y-6 pt-5">
                <SectionTitle
                  title="Security"
                  description="Keep your account protected."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Current password" type="password" defaultValue="••••••••••" />
                  <div className="hidden sm:block" />
                  <Input label="New password" type="password" placeholder="Enter a new password" />
                  <Input label="Confirm password" type="password" placeholder="Re-enter new password" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50/60 p-4">
                  <div>
                    <p className="text-[13px] font-medium text-ink-800">
                      Two-factor authentication
                    </p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      Add an extra layer of security at sign-in.
                    </p>
                  </div>
                  <Badge tone="positive" dot>
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-[13px] text-accent-800">
                  <Check className="h-4 w-4 shrink-0" />
                  Your account is protected and in good standing.
                </div>
              </CardBody>
            </Card>
          )}

          <div className="mt-4 flex items-center justify-end gap-3">
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary" onClick={save}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-ink-100 pb-4">
      <h2 className="text-base font-semibold text-ink-900">{title}</h2>
      <p className="mt-0.5 text-[13px] text-ink-500">{description}</p>
    </div>
  )
}

function ToggleRow({ children }: { children: ReactNode }) {
  return <div className="py-3.5">{children}</div>
}
