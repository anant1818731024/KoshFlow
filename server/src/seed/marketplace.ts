import type { MarketplaceListingSeed } from '../types.js'

interface Seed {
  name: string
  brand: string
  category: string
  price: number
  currency: MarketplaceListingSeed['currency']
  supplierId: string
  supplierName: string
  availability: string
  verified: boolean
  condition: string
  location: string
  hue: number
}

const seeds: Seed[] = [
  { name: 'Chanel 19 Large Flap', brand: 'Chanel', category: 'Handbags', price: 7100, currency: 'USD', supplierId: 'SUP-02', supplierName: 'Rohan Kapoor', availability: 'available', verified: true, condition: 'Pristine', location: 'New Delhi', hue: 32 },
  { name: 'Hermès Birkin 30 Togo', brand: 'Hermès', category: 'Handbags', price: 24500, currency: 'USD', supplierId: 'SUP-03', supplierName: 'Nandini Rao', availability: 'limited', verified: true, condition: 'Excellent', location: 'Bengaluru', hue: 34 },
  { name: 'Dior Book Tote Medium', brand: 'Dior', category: 'Handbags', price: 3150, currency: 'USD', supplierId: 'SUP-05', supplierName: 'Farah Khan', availability: 'available', verified: true, condition: 'New', location: 'Kochi', hue: 214 },
  { name: 'Louis Vuitton OnTheGo GM', brand: 'Louis Vuitton', category: 'Handbags', price: 3280, currency: 'USD', supplierId: 'SUP-04', supplierName: 'Vikram Sethi', availability: 'available', verified: true, condition: 'Excellent', location: 'Hyderabad', hue: 38 },
  { name: 'Gucci Bamboo 1947 Small', brand: 'Gucci', category: 'Handbags', price: 2450, currency: 'USD', supplierId: 'SUP-01', supplierName: 'Asha Mehta', availability: 'available', verified: true, condition: 'Very Good', location: 'Mumbai', hue: 40 },
  { name: 'Bottega Veneta Andiamo', brand: 'Bottega Veneta', category: 'Handbags', price: 4100, currency: 'USD', supplierId: 'SUP-01', supplierName: 'Asha Mehta', availability: 'limited', verified: true, condition: 'Pristine', location: 'Mumbai', hue: 28 },
  { name: 'Prada Cleo Brushed', brand: 'Prada', category: 'Handbags', price: 1980, currency: 'USD', supplierId: 'SUP-06', supplierName: 'Arjun Malhotra', availability: 'available', verified: false, condition: 'Excellent', location: 'Pune', hue: 220 },
  { name: 'Saint Laurent Kate Tassel', brand: 'Saint Laurent', category: 'Handbags', price: 2050, currency: 'USD', supplierId: 'SUP-08', supplierName: 'Kabir Bhatia', availability: 'available', verified: true, condition: 'Very Good', location: 'Chandigarh', hue: 40 },
  { name: 'Celine Triomphe Teen', brand: 'Celine', category: 'Handbags', price: 3400, currency: 'USD', supplierId: 'SUP-07', supplierName: 'Meera Iyer', availability: 'pre_order', verified: true, condition: 'New', location: 'Chennai', hue: 30 },
  { name: 'Fendi Peekaboo ISeeU', brand: 'Fendi', category: 'Handbags', price: 4600, currency: 'USD', supplierId: 'SUP-07', supplierName: 'Meera Iyer', availability: 'limited', verified: true, condition: 'Excellent', location: 'Chennai', hue: 330 },
  { name: 'Chanel Classic Wallet on Chain', brand: 'Chanel', category: 'Small Leather Goods', price: 3650, currency: 'USD', supplierId: 'SUP-10', supplierName: 'Sanjay Deshmukh', availability: 'available', verified: true, condition: 'Excellent', location: 'Ahmedabad', hue: 32 },
  { name: 'Hermès Constance 18', brand: 'Hermès', category: 'Handbags', price: 16800, currency: 'USD', supplierId: 'SUP-05', supplierName: 'Farah Khan', availability: 'limited', verified: true, condition: 'Pristine', location: 'Kochi', hue: 34 },
  { name: 'Dior Caro Medium', brand: 'Dior', category: 'Handbags', price: 3900, currency: 'USD', supplierId: 'SUP-02', supplierName: 'Rohan Kapoor', availability: 'available', verified: true, condition: 'New', location: 'New Delhi', hue: 46 },
  { name: 'Louis Vuitton Capucines BB', brand: 'Louis Vuitton', category: 'Handbags', price: 5400, currency: 'USD', supplierId: 'SUP-04', supplierName: 'Vikram Sethi', availability: 'available', verified: true, condition: 'Excellent', location: 'Hyderabad', hue: 350 },
  { name: 'Gucci Horsebit 1955 Mini', brand: 'Gucci', category: 'Small Leather Goods', price: 1450, currency: 'USD', supplierId: 'SUP-09', supplierName: 'Leena Thomas', availability: 'available', verified: false, condition: 'Very Good', location: 'Goa', hue: 40 },
  { name: 'Prada Symbole Sunglasses', brand: 'Prada', category: 'Accessories', price: 420, currency: 'USD', supplierId: 'SUP-01', supplierName: 'Asha Mehta', availability: 'available', verified: true, condition: 'New', location: 'Mumbai', hue: 20 },
  { name: 'Bottega Veneta Sardine Bag', brand: 'Bottega Veneta', category: 'Handbags', price: 3900, currency: 'USD', supplierId: 'SUP-06', supplierName: 'Arjun Malhotra', availability: 'available', verified: false, condition: 'Excellent', location: 'Pune', hue: 150 },
  { name: 'Hermès Garden Party 36', brand: 'Hermès', category: 'Handbags', price: 5200, currency: 'USD', supplierId: 'SUP-03', supplierName: 'Nandini Rao', availability: 'available', verified: true, condition: 'Very Good', location: 'Bengaluru', hue: 42 },
  { name: 'Chanel Reissue 2.55 226', brand: 'Chanel', category: 'Handbags', price: 8900, currency: 'USD', supplierId: 'SUP-07', supplierName: 'Meera Iyer', availability: 'limited', verified: true, condition: 'Excellent', location: 'Chennai', hue: 220 },
  { name: 'Celine Ava Triomphe', brand: 'Celine', category: 'Handbags', price: 2200, currency: 'USD', supplierId: 'SUP-10', supplierName: 'Sanjay Deshmukh', availability: 'available', verified: true, condition: 'New', location: 'Ahmedabad', hue: 30 },
  { name: 'Saint Laurent Loulou Medium', brand: 'Saint Laurent', category: 'Handbags', price: 2350, currency: 'USD', supplierId: 'SUP-08', supplierName: 'Kabir Bhatia', availability: 'available', verified: true, condition: 'Excellent', location: 'Chandigarh', hue: 350 },
  { name: 'Louis Vuitton Coussin PM', brand: 'Louis Vuitton', category: 'Handbags', price: 4700, currency: 'USD', supplierId: 'SUP-05', supplierName: 'Farah Khan', availability: 'pre_order', verified: true, condition: 'New', location: 'Kochi', hue: 38 },
  { name: 'Dior 30 Montaigne Chain', brand: 'Dior', category: 'Handbags', price: 3800, currency: 'USD', supplierId: 'SUP-04', supplierName: 'Vikram Sethi', availability: 'available', verified: true, condition: 'Pristine', location: 'Hyderabad', hue: 44 },
  { name: 'Gucci Diana Small Tote', brand: 'Gucci', category: 'Handbags', price: 2650, currency: 'USD', supplierId: 'SUP-09', supplierName: 'Leena Thomas', availability: 'sold', verified: false, condition: 'Excellent', location: 'Goa', hue: 36 },
]

export const marketplaceListings: MarketplaceListingSeed[] = seeds.map((s, i) => ({
  id: `MKT-${3200 + i}`,
  name: s.name,
  brand: s.brand,
  category: s.category,
  price: s.price,
  currency: s.currency,
  supplierId: s.supplierId,
  supplierName: s.supplierName,
  availability: s.availability,
  verified: s.verified,
  condition: s.condition,
  location: s.location,
  imageHue: s.hue,
}))
