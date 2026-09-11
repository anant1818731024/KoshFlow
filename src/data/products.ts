import type { Product, StockStatus } from '@/types'

function statusFor(stock: number, reserved = false): StockStatus {
  if (reserved) return 'reserved'
  if (stock === 0) return 'out_of_stock'
  if (stock <= 2) return 'low_stock'
  return 'in_stock'
}

interface Seed {
  name: string
  brand: Product['brand']
  category: Product['category']
  purchasePrice: number
  sellingPrice: number
  stock: number
  condition: Product['condition']
  color: string
  addedAt: string
  soldUnits30d: number
  hue: number
  reserved?: boolean
}

const seeds: Seed[] = [
  { name: 'Classic Flap Medium', brand: 'Chanel', category: 'Handbags', purchasePrice: 6100, sellingPrice: 8450, stock: 3, condition: 'Excellent', color: 'Black Caviar', addedAt: '2026-07-28', soldUnits30d: 4, hue: 32 },
  { name: 'Neverfull MM', brand: 'Louis Vuitton', category: 'Handbags', purchasePrice: 1450, sellingPrice: 2190, stock: 6, condition: 'Very Good', color: 'Monogram', addedAt: '2026-08-02', soldUnits30d: 7, hue: 38 },
  { name: 'Saddle Bag', brand: 'Dior', category: 'Handbags', purchasePrice: 2650, sellingPrice: 3980, stock: 2, condition: 'Pristine', color: 'Oblique Blue', addedAt: '2026-08-11', soldUnits30d: 3, hue: 214 },
  { name: 'Twilly Silk Scarf', brand: 'Hermès', category: 'Accessories', purchasePrice: 180, sellingPrice: 340, stock: 12, condition: 'New', color: 'Rouge', addedAt: '2026-08-18', soldUnits30d: 9, hue: 6 },
  { name: 'Jackie 1961 Small', brand: 'Gucci', category: 'Handbags', purchasePrice: 1980, sellingPrice: 2760, stock: 1, condition: 'Excellent', color: 'Rosso Ancora', addedAt: '2026-06-30', soldUnits30d: 2, hue: 350 },
  { name: 'Cassette Padded', brand: 'Bottega Veneta', category: 'Handbags', purchasePrice: 2200, sellingPrice: 3150, stock: 4, condition: 'Pristine', color: 'Fondant', addedAt: '2026-08-06', soldUnits30d: 5, hue: 28 },
  { name: 'Le 5 à 7 Hobo', brand: 'Saint Laurent', category: 'Handbags', purchasePrice: 1620, sellingPrice: 2380, stock: 3, condition: 'Very Good', color: 'Noir', addedAt: '2026-07-19', soldUnits30d: 3, hue: 40 },
  { name: 'Kelly 25 Sellier', brand: 'Hermès', category: 'Handbags', purchasePrice: 21500, sellingPrice: 28900, stock: 1, condition: 'Pristine', color: 'Étoupe', addedAt: '2026-05-24', soldUnits30d: 1, hue: 34, reserved: true },
  { name: 'Galleria Saffiano Medium', brand: 'Prada', category: 'Handbags', purchasePrice: 2100, sellingPrice: 3050, stock: 5, condition: 'Excellent', color: 'Nero', addedAt: '2026-08-14', soldUnits30d: 4, hue: 220 },
  { name: 'Luco Tote', brand: 'Celine', category: 'Handbags', purchasePrice: 980, sellingPrice: 1640, stock: 2, condition: 'Good', color: 'Tan', addedAt: '2026-07-05', soldUnits30d: 2, hue: 30 },
  { name: 'Baguette Sequin', brand: 'Fendi', category: 'Handbags', purchasePrice: 1750, sellingPrice: 2590, stock: 0, condition: 'Excellent', color: 'Pink', addedAt: '2026-06-12', soldUnits30d: 3, hue: 330 },
  { name: 'Boy Bag Old Medium', brand: 'Chanel', category: 'Handbags', purchasePrice: 4800, sellingPrice: 6650, stock: 2, condition: 'Very Good', color: 'Ruthenium', addedAt: '2026-07-22', soldUnits30d: 2, hue: 220 },
  { name: 'Pochette Métis', brand: 'Louis Vuitton', category: 'Handbags', purchasePrice: 1980, sellingPrice: 2740, stock: 4, condition: 'Excellent', color: 'Reverse Monogram', addedAt: '2026-08-09', soldUnits30d: 6, hue: 36 },
  { name: 'Lady Dior Medium', brand: 'Dior', category: 'Handbags', purchasePrice: 3850, sellingPrice: 5200, stock: 1, condition: 'Pristine', color: 'Latte Cannage', addedAt: '2026-07-14', soldUnits30d: 2, hue: 44 },
  { name: 'Ophidia GG Belt Bag', brand: 'Gucci', category: 'Small Leather Goods', purchasePrice: 620, sellingPrice: 980, stock: 8, condition: 'New', color: 'Beige/Ebony', addedAt: '2026-08-20', soldUnits30d: 11, hue: 36 },
  { name: 'Zippy Wallet', brand: 'Louis Vuitton', category: 'Small Leather Goods', purchasePrice: 540, sellingPrice: 820, stock: 9, condition: 'Excellent', color: 'Damier Ebène', addedAt: '2026-08-16', soldUnits30d: 8, hue: 26 },
  { name: 'Intrecciato Card Case', brand: 'Bottega Veneta', category: 'Small Leather Goods', purchasePrice: 280, sellingPrice: 460, stock: 14, condition: 'New', color: 'Parakeet', addedAt: '2026-08-21', soldUnits30d: 7, hue: 150 },
  { name: 'Oran Sandals', brand: 'Hermès', category: 'Shoes', purchasePrice: 620, sellingPrice: 940, stock: 6, condition: 'New', color: 'Gold', addedAt: '2026-08-04', soldUnits30d: 5, hue: 42 },
  { name: 'Rockstud Pumps', brand: 'Prada', category: 'Shoes', purchasePrice: 480, sellingPrice: 760, stock: 3, condition: 'Very Good', color: 'Poudre', addedAt: '2026-07-17', soldUnits30d: 3, hue: 20 },
  { name: 'Dauphine Belt', brand: 'Louis Vuitton', category: 'Accessories', purchasePrice: 360, sellingPrice: 590, stock: 2, condition: 'Excellent', color: 'Monogram', addedAt: '2026-07-26', soldUnits30d: 4, hue: 38 },
  { name: 'CD Navy Earrings', brand: 'Dior', category: 'Jewelry', purchasePrice: 240, sellingPrice: 420, stock: 7, condition: 'New', color: 'Gold-Finish', addedAt: '2026-08-19', soldUnits30d: 6, hue: 46 },
  { name: 'Coco Crush Ring', brand: 'Chanel', category: 'Jewelry', purchasePrice: 2900, sellingPrice: 3850, stock: 1, condition: 'Pristine', color: 'Beige Gold', addedAt: '2026-06-28', soldUnits30d: 1, hue: 44 },
  { name: 'GG Marmont Mini', brand: 'Gucci', category: 'Handbags', purchasePrice: 1180, sellingPrice: 1780, stock: 5, condition: 'Excellent', color: 'Dusty Pink', addedAt: '2026-08-13', soldUnits30d: 5, hue: 340 },
  { name: 'Puzzle Bag Small', brand: 'Celine', category: 'Handbags', purchasePrice: 1980, sellingPrice: 2680, stock: 2, condition: 'Very Good', color: 'Tan Multi', addedAt: '2026-07-31', soldUnits30d: 2, hue: 28 },
]

export const products: Product[] = seeds.map((s, i) => ({
  id: `PRD-${String(1042 + i)}`,
  name: `${s.brand} ${s.name}`,
  brand: s.brand,
  category: s.category,
  sku: `${s.brand.slice(0, 3).toUpperCase()}-${String(1042 + i)}-${s.color
    .slice(0, 2)
    .toUpperCase()}`,
  purchasePrice: s.purchasePrice,
  sellingPrice: s.sellingPrice,
  stock: s.stock,
  status: statusFor(s.stock, s.reserved),
  condition: s.condition,
  color: s.color,
  addedAt: s.addedAt,
  soldUnits30d: s.soldUnits30d,
  imageHue: s.hue,
}))

export const brands = [
  'Chanel',
  'Louis Vuitton',
  'Dior',
  'Hermès',
  'Gucci',
  'Prada',
  'Bottega Veneta',
  'Saint Laurent',
  'Celine',
  'Fendi',
] as const

export const categories = [
  'Handbags',
  'Small Leather Goods',
  'Shoes',
  'Accessories',
  'Jewelry',
  'Ready-to-Wear',
] as const

export const conditions = [
  'New',
  'Pristine',
  'Excellent',
  'Very Good',
  'Good',
] as const
