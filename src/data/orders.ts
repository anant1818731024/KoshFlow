import type { Order, OrderStatus } from '@/types'

interface Seed {
  customer: string
  handle: string
  product: string
  brand: Order['brand']
  date: string
  amount: number
  profit: number
  status: OrderStatus
  channel: Order['channel']
  city: string
  hue: number
}

const seeds: Seed[] = [
  { customer: 'Isabelle Moreau', handle: '@isa.moreau', product: 'Chanel Classic Flap Medium', brand: 'Chanel', date: '2026-09-10T14:20:00', amount: 8450, profit: 2350, status: 'processing', channel: 'Instagram', city: 'Paris', hue: 32 },
  { customer: 'Grace Whitfield', handle: '@gracewhit', product: 'Louis Vuitton Neverfull MM', brand: 'Louis Vuitton', date: '2026-09-10T11:05:00', amount: 2190, profit: 740, status: 'paid', channel: 'Website', city: 'London', hue: 38 },
  { customer: 'Amara Okafor', handle: '@amara.o', product: 'Dior Saddle Bag', brand: 'Dior', date: '2026-09-09T18:42:00', amount: 3980, profit: 1330, status: 'shipped', channel: 'WhatsApp', city: 'Lagos', hue: 214 },
  { customer: 'Sofia Ricci', handle: '@sofia.r', product: 'Hermès Twilly Silk Scarf', brand: 'Hermès', date: '2026-09-09T09:15:00', amount: 340, profit: 160, status: 'completed', channel: 'Website', city: 'Milan', hue: 6 },
  { customer: 'Chloé Bernard', handle: '@chloeb', product: 'Gucci Jackie 1961 Small', brand: 'Gucci', date: '2026-09-08T16:30:00', amount: 2760, profit: 780, status: 'completed', channel: 'Marketplace', city: 'Lyon', hue: 350 },
  { customer: 'Hana Kim', handle: '@hana.kim', product: 'Bottega Veneta Cassette Padded', brand: 'Bottega Veneta', date: '2026-09-08T13:10:00', amount: 3150, profit: 950, status: 'processing', channel: 'Instagram', city: 'Seoul', hue: 28 },
  { customer: 'Elena Popova', handle: '@elena.pv', product: 'Saint Laurent Le 5 à 7 Hobo', brand: 'Saint Laurent', date: '2026-09-07T20:05:00', amount: 2380, profit: 760, status: 'shipped', channel: 'Website', city: 'Dubai', hue: 40 },
  { customer: 'Mei Lin', handle: '@mei.lin', product: 'Prada Galleria Saffiano Medium', brand: 'Prada', date: '2026-09-07T10:48:00', amount: 3050, profit: 950, status: 'paid', channel: 'WhatsApp', city: 'Singapore', hue: 220 },
  { customer: 'Farah Haddad', handle: '@farah.h', product: 'Louis Vuitton Pochette Métis', brand: 'Louis Vuitton', date: '2026-09-06T15:22:00', amount: 2740, profit: 760, status: 'completed', channel: 'Instagram', city: 'Doha', hue: 36 },
  { customer: 'Victoria Sterling', handle: '@vsterling', product: 'Dior Lady Dior Medium', brand: 'Dior', date: '2026-09-06T08:30:00', amount: 5200, profit: 1350, status: 'completed', channel: 'Website', city: 'New York', hue: 44 },
  { customer: 'Nadia Reyes', handle: '@nadiar', product: 'Gucci Ophidia GG Belt Bag', brand: 'Gucci', date: '2026-09-05T19:12:00', amount: 980, profit: 360, status: 'completed', channel: 'Marketplace', city: 'Madrid', hue: 36 },
  { customer: 'Priya Nair', handle: '@priya.nair', product: 'Louis Vuitton Zippy Wallet', brand: 'Louis Vuitton', date: '2026-09-05T12:40:00', amount: 820, profit: 280, status: 'completed', channel: 'Website', city: 'Mumbai', hue: 26 },
  { customer: 'Camille Fontaine', handle: '@camille.f', product: 'Chanel Boy Bag Old Medium', brand: 'Chanel', date: '2026-09-04T17:55:00', amount: 6650, profit: 1850, status: 'completed', channel: 'Instagram', city: 'Geneva', hue: 220 },
  { customer: 'Olivia Barnes', handle: '@olivia.b', product: 'Hermès Oran Sandals', brand: 'Hermès', date: '2026-09-04T09:00:00', amount: 940, profit: 320, status: 'shipped', channel: 'Website', city: 'Sydney', hue: 42 },
  { customer: 'Yuki Tanaka', handle: '@yuki.t', product: 'Celine Puzzle Bag Small', brand: 'Celine', date: '2026-09-03T21:30:00', amount: 2680, profit: 700, status: 'completed', channel: 'WhatsApp', city: 'Tokyo', hue: 28 },
  { customer: 'Rania Aziz', handle: '@rania.az', product: 'Gucci GG Marmont Mini', brand: 'Gucci', date: '2026-09-03T11:18:00', amount: 1780, profit: 600, status: 'completed', channel: 'Instagram', city: 'Cairo', hue: 340 },
  { customer: 'Beatrice Conti', handle: '@bea.conti', product: 'Prada Rockstud Pumps', brand: 'Prada', date: '2026-09-02T14:05:00', amount: 760, profit: 280, status: 'cancelled', channel: 'Website', city: 'Rome', hue: 20 },
  { customer: 'Ritvik Sen', handle: '@ritvik.sen', product: 'Dior CD Navy Earrings', brand: 'Dior', date: '2026-09-02T10:22:00', amount: 420, profit: 180, status: 'completed', channel: 'Marketplace', city: 'Kolkata', hue: 46 },
  { customer: 'Lena Schulz', handle: '@lena.s', product: 'Bottega Veneta Intrecciato Card Case', brand: 'Bottega Veneta', date: '2026-09-01T16:44:00', amount: 460, profit: 180, status: 'completed', channel: 'Website', city: 'Berlin', hue: 150 },
  { customer: 'Tamara Novak', handle: '@tamara.n', product: 'Louis Vuitton Dauphine Belt', brand: 'Louis Vuitton', date: '2026-09-01T08:50:00', amount: 590, profit: 230, status: 'completed', channel: 'Instagram', city: 'Vienna', hue: 38 },
  { customer: 'Sara Bianchi', handle: '@sara.bi', product: 'Chanel Coco Crush Ring', brand: 'Chanel', date: '2026-08-31T13:30:00', amount: 3850, profit: 950, status: 'completed', channel: 'WhatsApp', city: 'Florence', hue: 44 },
  { customer: 'Divya Menon', handle: '@divya.m', product: 'Gucci Jackie 1961 Small', brand: 'Gucci', date: '2026-08-31T09:10:00', amount: 2760, profit: 780, status: 'completed', channel: 'Website', city: 'Bengaluru', hue: 350 },
  { customer: 'Klara Nowak', handle: '@klara.nk', product: 'Louis Vuitton Neverfull MM', brand: 'Louis Vuitton', date: '2026-08-30T18:20:00', amount: 2190, profit: 740, status: 'completed', channel: 'Marketplace', city: 'Warsaw', hue: 38 },
  { customer: 'Zoe Alexander', handle: '@zoe.alex', product: 'Fendi Baguette Sequin', brand: 'Fendi', date: '2026-08-30T11:00:00', amount: 2590, profit: 840, status: 'completed', channel: 'Instagram', city: 'Los Angeles', hue: 330 },
  { customer: 'Marta Silva', handle: '@marta.sv', product: 'Celine Luco Tote', brand: 'Celine', date: '2026-08-29T15:15:00', amount: 1640, profit: 660, status: 'completed', channel: 'Website', city: 'Lisbon', hue: 30 },
  { customer: 'Ava Thompson', handle: '@ava.t', product: 'Dior Saddle Bag', brand: 'Dior', date: '2026-08-29T09:40:00', amount: 3980, profit: 1330, status: 'completed', channel: 'Instagram', city: 'Toronto', hue: 214 },
  { customer: 'Noor Al-Sayed', handle: '@noor.as', product: 'Chanel Classic Flap Medium', brand: 'Chanel', date: '2026-08-28T20:10:00', amount: 8450, profit: 2350, status: 'completed', channel: 'WhatsApp', city: 'Abu Dhabi', hue: 32 },
  { customer: 'Emma Larsen', handle: '@emma.l', product: 'Prada Galleria Saffiano Medium', brand: 'Prada', date: '2026-08-28T12:25:00', amount: 3050, profit: 950, status: 'completed', channel: 'Website', city: 'Copenhagen', hue: 220 },
  { customer: 'Ingrid Berg', handle: '@ingrid.b', product: 'Louis Vuitton Pochette Métis', brand: 'Louis Vuitton', date: '2026-08-27T17:35:00', amount: 2740, profit: 760, status: 'completed', channel: 'Marketplace', city: 'Oslo', hue: 36 },
  { customer: 'Bianca Rossi', handle: '@bianca.r', product: 'Saint Laurent Le 5 à 7 Hobo', brand: 'Saint Laurent', date: '2026-08-27T10:05:00', amount: 2380, profit: 760, status: 'pending', channel: 'Instagram', city: 'Naples', hue: 40 },
]

export const orders: Order[] = seeds.map((s, i) => ({
  id: `CH-${20841 - i}`,
  customer: s.customer,
  customerHandle: s.handle,
  productName: s.product,
  brand: s.brand,
  date: s.date,
  amount: s.amount,
  profit: s.profit,
  status: s.status,
  channel: s.channel,
  city: s.city,
  imageHue: s.hue,
}))

export const orderStatuses: OrderStatus[] = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
]
