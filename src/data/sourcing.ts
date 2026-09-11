import type {
  Brand,
  Condition,
  Currency,
  ListingType,
  SourcingListing,
  SourcingStatus,
} from '@/types'

// Seed listings for the live sourcing feed. `createdAt` is expressed as
// "minutes ago" and resolved to epoch ms at load time so the feed always
// looks fresh regardless of when the app is opened.
interface Seed {
  type: ListingType
  product: string
  brand: Brand
  price: number
  currency: Currency
  condition: Condition | 'Any'
  party: string
  verified: boolean
  source: string
  minutesAgo: number
  status: SourcingStatus
  note?: string
}

const seeds: Seed[] = [
  { type: 'WTS', product: 'Mini Flap Square', brand: 'Chanel', price: 3200, currency: 'GBP', condition: 'Excellent', party: '@ashamehta', verified: true, source: 'Sourcing Floor', minutesAgo: 1, status: 'active', note: 'Black caviar, gold hw. Full set with receipt.' },
  { type: 'WTB', product: 'Book Tote Medium', brand: 'Dior', price: 1500, currency: 'GBP', condition: 'Any', party: '@rohankapoor', verified: true, source: 'Buyer Requests', minutesAgo: 2, status: 'active', note: 'Latte or grey preferred. Ready to pay today.' },
  { type: 'WTS', product: 'Neverfull MM', brand: 'Louis Vuitton', price: 1650, currency: 'EUR', condition: 'Very Good', party: '@parisluxe', verified: true, source: 'Sourcing Floor', minutesAgo: 4, status: 'active' },
  { type: 'WTS', product: 'Kelly 28 Retourne', brand: 'Hermès', price: 19500, currency: 'GBP', condition: 'Pristine', party: '@mayfairbags', verified: true, source: 'VIP Desk', minutesAgo: 6, status: 'active', note: 'Gold togo, PHW. Store fresh, 2024.' },
  { type: 'WTB', product: 'GG Marmont Camera', brand: 'Gucci', price: 700, currency: 'USD', condition: 'Any', party: '@nyc_reseller', verified: false, source: 'Buyer Requests', minutesAgo: 8, status: 'active' },
  { type: 'WTS', product: 'Cassette Padded', brand: 'Bottega Veneta', price: 2400, currency: 'EUR', condition: 'Pristine', party: '@milanoedit', verified: true, source: 'Sourcing Floor', minutesAgo: 11, status: 'pending', note: 'On hold for buyer — accepting backups.' },
  { type: 'WTB', product: 'Classic Flap Medium', brand: 'Chanel', price: 6800, currency: 'USD', condition: 'Any', party: '@meera.iyer', verified: true, source: 'Buyer Requests', minutesAgo: 14, status: 'active', note: 'Caviar only. Budget firm.' },
  { type: 'WTS', product: 'Lady Dior Small', brand: 'Dior', price: 3900, currency: 'GBP', condition: 'Excellent', party: '@sourcedbyeve', verified: true, source: 'Sourcing Floor', minutesAgo: 18, status: 'active' },
  { type: 'WTS', product: 'Peekaboo Mini', brand: 'Fendi', price: 2100, currency: 'EUR', condition: 'Good', party: '@romavintage', verified: false, source: 'Sourcing Floor', minutesAgo: 23, status: 'active' },
  { type: 'WTB', product: 'Birkin 25', brand: 'Hermès', price: 22000, currency: 'GBP', condition: 'Any', party: '@collector_kw', verified: true, source: 'VIP Desk', minutesAgo: 27, status: 'active', note: 'Neutral colour, any hardware. Serious buyer.' },
  { type: 'WTS', product: 'Horsebit 1955 Shoulder', brand: 'Gucci', price: 1450, currency: 'USD', condition: 'Excellent', party: '@resell.atl', verified: false, source: 'Sourcing Floor', minutesAgo: 34, status: 'active' },
  { type: 'WTS', product: 'Triomphe Shoulder', brand: 'Celine', price: 2600, currency: 'GBP', condition: 'Very Good', party: '@ashamehta', verified: true, source: 'Sourcing Floor', minutesAgo: 41, status: 'fulfilled' },
  { type: 'WTB', product: 'OnTheGo PM', brand: 'Louis Vuitton', price: 2200, currency: 'USD', condition: 'Any', party: '@miami.luxe', verified: true, source: 'Buyer Requests', minutesAgo: 52, status: 'active' },
  { type: 'WTS', product: 'Galleria Small', brand: 'Prada', price: 1900, currency: 'EUR', condition: 'Excellent', party: '@milanoedit', verified: true, source: 'Sourcing Floor', minutesAgo: 68, status: 'active' },
  { type: 'WTB', product: 'Loulou Puffer', brand: 'Saint Laurent', price: 1200, currency: 'GBP', condition: 'Any', party: '@rohankapoor', verified: true, source: 'Buyer Requests', minutesAgo: 85, status: 'active' },
  { type: 'WTS', product: 'Boy Bag Medium', brand: 'Chanel', price: 5200, currency: 'GBP', condition: 'Very Good', party: '@mayfairbags', verified: true, source: 'Sourcing Floor', minutesAgo: 96, status: 'expired' },
]

// A pool used by the live simulator to inject fresh listings over time.
export const feedPool: Omit<Seed, 'minutesAgo' | 'status'>[] = [
  { type: 'WTS', product: 'Coco Handle Small', brand: 'Chanel', price: 5400, currency: 'GBP', condition: 'Excellent', party: '@ashamehta', verified: true, source: 'Sourcing Floor', note: 'Beige caviar, LGHW.' },
  { type: 'WTB', product: 'Saddle Bag', brand: 'Dior', price: 2600, currency: 'USD', condition: 'Any', party: '@meera.iyer', verified: true, source: 'Buyer Requests' },
  { type: 'WTS', product: 'Pochette Métis', brand: 'Louis Vuitton', price: 1750, currency: 'EUR', condition: 'Pristine', party: '@parisluxe', verified: true, source: 'Sourcing Floor' },
  { type: 'WTS', product: 'Jackie 1961 Mini', brand: 'Gucci', price: 1600, currency: 'GBP', condition: 'Excellent', party: '@resell.atl', verified: false, source: 'Sourcing Floor' },
  { type: 'WTB', product: 'Puzzle Bag Medium', brand: 'Celine', price: 1900, currency: 'GBP', condition: 'Any', party: '@sourcedbyeve', verified: true, source: 'Buyer Requests', note: 'Tan multi preferred.' },
  { type: 'WTS', product: 'Constance Slim Wallet', brand: 'Hermès', price: 3100, currency: 'EUR', condition: 'Very Good', party: '@milanoedit', verified: true, source: 'VIP Desk' },
  { type: 'WTS', product: 'Andiamo Medium', brand: 'Bottega Veneta', price: 4200, currency: 'GBP', condition: 'Pristine', party: '@mayfairbags', verified: true, source: 'Sourcing Floor' },
  { type: 'WTB', product: 'Cleo Satchel', brand: 'Prada', price: 1400, currency: 'USD', condition: 'Any', party: '@nyc_reseller', verified: false, source: 'Buyer Requests' },
  { type: 'WTS', product: 'Baguette Nappa', brand: 'Fendi', price: 2450, currency: 'EUR', condition: 'Excellent', party: '@romavintage', verified: false, source: 'Sourcing Floor' },
  { type: 'WTB', product: 'Kate Small', brand: 'Saint Laurent', price: 1500, currency: 'GBP', condition: 'Any', party: '@rohankapoor', verified: true, source: 'Buyer Requests' },
]

export const sourcingSources = [
  'Sourcing Floor',
  'Buyer Requests',
  'VIP Desk',
] as const

export function buildInitialFeed(now: number = Date.now()): SourcingListing[] {
  return seeds.map((s, i) => ({
    id: `SRC-${9000 + i}`,
    type: s.type,
    product: `${s.brand} ${s.product}`,
    brand: s.brand,
    price: s.price,
    currency: s.currency,
    condition: s.condition,
    party: s.party,
    partyVerified: s.verified,
    source: s.source,
    createdAt: now - s.minutesAgo * 60_000,
    status: s.status,
    note: s.note,
  }))
}
