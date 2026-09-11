import type { OrderSeed } from '../types.js'

interface Seed {
  customer: string
  handle: string
  product: string
  brand: string
  date: string
  amount: number
  profit: number
  status: string
  channel: string
  city: string
  hue: number
}

const seeds: Seed[] = [
  { customer: 'Ira Sharma', handle: '@ira.sharma', product: 'Chanel Classic Flap Medium', brand: 'Chanel', date: '2026-09-10T14:20:00', amount: 8450, profit: 2350, status: 'processing', channel: 'Instagram', city: 'Mumbai', hue: 32 },
  { customer: 'Neha Bansal', handle: '@nehabansal', product: 'Louis Vuitton Neverfull MM', brand: 'Louis Vuitton', date: '2026-09-10T11:05:00', amount: 2190, profit: 740, status: 'paid', channel: 'Website', city: 'New Delhi', hue: 38 },
  { customer: 'Aditya Menon', handle: '@aditya.menon', product: 'Dior Saddle Bag', brand: 'Dior', date: '2026-09-09T18:42:00', amount: 3980, profit: 1330, status: 'shipped', channel: 'WhatsApp', city: 'Kochi', hue: 214 },
  { customer: 'Rhea Desai', handle: '@rhea.desai', product: 'Hermès Twilly Silk Scarf', brand: 'Hermès', date: '2026-09-09T09:15:00', amount: 340, profit: 160, status: 'completed', channel: 'Website', city: 'Ahmedabad', hue: 6 },
  { customer: 'Tanvi Kulkarni', handle: '@tanvi.k', product: 'Gucci Jackie 1961 Small', brand: 'Gucci', date: '2026-09-08T16:30:00', amount: 2760, profit: 780, status: 'completed', channel: 'Marketplace', city: 'Pune', hue: 350 },
  { customer: 'Siddharth Bose', handle: '@sid.bose', product: 'Bottega Veneta Cassette Padded', brand: 'Bottega Veneta', date: '2026-09-08T13:10:00', amount: 3150, profit: 950, status: 'processing', channel: 'Instagram', city: 'Kolkata', hue: 28 },
  { customer: 'Maya Joseph', handle: '@mayajoseph', product: 'Saint Laurent Le 5 à 7 Hobo', brand: 'Saint Laurent', date: '2026-09-07T20:05:00', amount: 2380, profit: 760, status: 'shipped', channel: 'Website', city: 'Chennai', hue: 40 },
  { customer: 'Karan Arora', handle: '@karan.arora', product: 'Prada Galleria Saffiano Medium', brand: 'Prada', date: '2026-09-07T10:48:00', amount: 3050, profit: 950, status: 'paid', channel: 'WhatsApp', city: 'Gurugram', hue: 220 },
  { customer: 'Pooja Nair', handle: '@pooja.nair', product: 'Louis Vuitton Pochette Métis', brand: 'Louis Vuitton', date: '2026-09-06T15:22:00', amount: 2740, profit: 760, status: 'completed', channel: 'Instagram', city: 'Bengaluru', hue: 36 },
  { customer: 'Varun Khanna', handle: '@varun.khanna', product: 'Dior Lady Dior Medium', brand: 'Dior', date: '2026-09-06T08:30:00', amount: 5200, profit: 1350, status: 'completed', channel: 'Website', city: 'Jaipur', hue: 44 },
  { customer: 'Simran Kaur', handle: '@simrankaur', product: 'Gucci Ophidia GG Belt Bag', brand: 'Gucci', date: '2026-09-05T19:12:00', amount: 980, profit: 360, status: 'completed', channel: 'Marketplace', city: 'Chandigarh', hue: 36 },
  { customer: 'Aarohi Shah', handle: '@aarohi.shah', product: 'Louis Vuitton Zippy Wallet', brand: 'Louis Vuitton', date: '2026-09-05T12:40:00', amount: 820, profit: 280, status: 'completed', channel: 'Website', city: 'Surat', hue: 26 },
  { customer: 'Nikhil Verma', handle: '@nikhil.verma', product: 'Chanel Boy Bag Old Medium', brand: 'Chanel', date: '2026-09-04T17:55:00', amount: 6650, profit: 1850, status: 'completed', channel: 'Instagram', city: 'Lucknow', hue: 220 },
  { customer: 'Diya Fernandes', handle: '@diya.fernandes', product: 'Hermès Oran Sandals', brand: 'Hermès', date: '2026-09-04T09:00:00', amount: 940, profit: 320, status: 'shipped', channel: 'Website', city: 'Goa', hue: 42 },
  { customer: 'Manav Rao', handle: '@manav.rao', product: 'Celine Puzzle Bag Small', brand: 'Celine', date: '2026-09-03T21:30:00', amount: 2680, profit: 700, status: 'completed', channel: 'WhatsApp', city: 'Bengaluru', hue: 28 },
  { customer: 'Zara Mirza', handle: '@zara.mirza', product: 'Gucci GG Marmont Mini', brand: 'Gucci', date: '2026-09-03T11:18:00', amount: 1780, profit: 600, status: 'completed', channel: 'Instagram', city: 'Mumbai', hue: 340 },
  { customer: 'Kritika Joshi', handle: '@kritika.joshi', product: 'Prada Rockstud Pumps', brand: 'Prada', date: '2026-09-02T14:05:00', amount: 760, profit: 280, status: 'cancelled', channel: 'Website', city: 'Indore', hue: 20 },
  { customer: 'Ritvik Sen', handle: '@ritvik.sen', product: 'Dior CD Navy Earrings', brand: 'Dior', date: '2026-09-02T10:22:00', amount: 420, profit: 180, status: 'completed', channel: 'Marketplace', city: 'Kolkata', hue: 46 },
  { customer: 'Anushka Pillai', handle: '@anushka.pillai', product: 'Bottega Veneta Intrecciato Card Case', brand: 'Bottega Veneta', date: '2026-09-01T16:44:00', amount: 460, profit: 180, status: 'completed', channel: 'Website', city: 'Chennai', hue: 150 },
  { customer: 'Harsh Vardhan', handle: '@harsh.vardhan', product: 'Louis Vuitton Dauphine Belt', brand: 'Louis Vuitton', date: '2026-09-01T08:50:00', amount: 590, profit: 230, status: 'completed', channel: 'Instagram', city: 'New Delhi', hue: 38 },
  { customer: 'Mitali Ghosh', handle: '@mitali.ghosh', product: 'Chanel Coco Crush Ring', brand: 'Chanel', date: '2026-08-31T13:30:00', amount: 3850, profit: 950, status: 'completed', channel: 'WhatsApp', city: 'Kolkata', hue: 44 },
  { customer: 'Raghav Menon', handle: '@raghav.menon', product: 'Gucci Jackie 1961 Small', brand: 'Gucci', date: '2026-08-31T09:10:00', amount: 2760, profit: 780, status: 'completed', channel: 'Website', city: 'Bengaluru', hue: 350 },
  { customer: 'Sana Qureshi', handle: '@sana.qureshi', product: 'Louis Vuitton Neverfull MM', brand: 'Louis Vuitton', date: '2026-08-30T18:20:00', amount: 2190, profit: 740, status: 'completed', channel: 'Marketplace', city: 'Hyderabad', hue: 38 },
  { customer: 'Esha Mukherjee', handle: '@esha.mukherjee', product: 'Fendi Baguette Sequin', brand: 'Fendi', date: '2026-08-30T11:00:00', amount: 2590, profit: 840, status: 'completed', channel: 'Instagram', city: 'Kolkata', hue: 330 },
  { customer: 'Yash Thakur', handle: '@yash.thakur', product: 'Celine Luco Tote', brand: 'Celine', date: '2026-08-29T15:15:00', amount: 1640, profit: 660, status: 'completed', channel: 'Website', city: 'Shimla', hue: 30 },
  { customer: 'Aditi Chawla', handle: '@aditi.chawla', product: 'Dior Saddle Bag', brand: 'Dior', date: '2026-08-29T09:40:00', amount: 3980, profit: 1330, status: 'completed', channel: 'Instagram', city: 'Gurugram', hue: 214 },
  { customer: 'Rehan Siddiqui', handle: '@rehan.siddiqui', product: 'Chanel Classic Flap Medium', brand: 'Chanel', date: '2026-08-28T20:10:00', amount: 8450, profit: 2350, status: 'completed', channel: 'WhatsApp', city: 'Lucknow', hue: 32 },
  { customer: 'Kavya Reddy', handle: '@kavya.reddy', product: 'Prada Galleria Saffiano Medium', brand: 'Prada', date: '2026-08-28T12:25:00', amount: 3050, profit: 950, status: 'completed', channel: 'Website', city: 'Hyderabad', hue: 220 },
  { customer: 'Aman Batra', handle: '@aman.batra', product: 'Louis Vuitton Pochette Métis', brand: 'Louis Vuitton', date: '2026-08-27T17:35:00', amount: 2740, profit: 760, status: 'completed', channel: 'Marketplace', city: 'Amritsar', hue: 36 },
  { customer: 'Ishani Roy', handle: '@ishani.roy', product: 'Saint Laurent Le 5 à 7 Hobo', brand: 'Saint Laurent', date: '2026-08-27T10:05:00', amount: 2380, profit: 760, status: 'pending', channel: 'Instagram', city: 'Kolkata', hue: 40 },
]

export const orders: OrderSeed[] = seeds.map((s, i) => ({
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
