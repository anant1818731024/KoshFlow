import type { AiResponse, SuggestedPrompt } from '@/types'

export const suggestedPrompts: SuggestedPrompt[] = [
  { label: 'Chanel bags under $8k', query: 'Find Chanel bags under $8,000' },
  { label: 'Fastest-selling brands', query: 'Which brands are selling fastest?' },
  { label: 'WTB opportunities for Dior', query: 'Show me WTB opportunities for Dior' },
  { label: 'Highest margin products', query: 'Which products have the highest profit margin?' },
  { label: 'Restock recommendations', query: 'What should I restock this week?' },
]

// A tiny intent matcher over a handful of demo answers. Keyword scoring keeps
// it feeling responsive to free text without pretending to be a real model.
interface Intent {
  keywords: string[]
  response: AiResponse
}

const intents: Intent[] = [
  {
    keywords: ['chanel', 'under', '8', '8000', '8,000', 'flap'],
    response: {
      intro:
        'I found 3 Chanel pieces under $8,000 across your verified suppliers. Nandini Rao has the strongest condition grade of the set.',
      products: [
        { name: 'Classic Flap Medium', brand: 'Chanel', price: 7100, currency: 'USD', margin: 27.8, supplier: 'Rue Saint-Honoré' },
        { name: 'Reissue 2.55 226', brand: 'Chanel', price: 8900, currency: 'USD', margin: 24.5, supplier: 'Meera Iyer' },
        { name: 'Wallet on Chain', brand: 'Chanel', price: 3650, currency: 'USD', margin: 31.0, supplier: 'Sanjay Deshmukh' },
      ],
      footnote: 'Prices reflect current supplier asks. Margins are estimated against your recent sell-through.',
    },
  },
  {
    keywords: ['fast', 'fastest', 'selling', 'sell-through', 'velocity', 'moving'],
    response: {
      intro:
        'Over the last 30 days, Gucci and Louis Vuitton are your fastest movers by unit velocity, while Chanel leads on revenue per unit.',
      insights: [
        { label: 'Gucci', value: '18 units · 4.2 day avg', trend: 'up' },
        { label: 'Louis Vuitton', value: '21 units · 5.1 day avg', trend: 'up' },
        { label: 'Dior', value: '11 units · 6.8 day avg', trend: 'up' },
        { label: 'Hermès', value: '7 units · 11.4 day avg', trend: 'down' },
      ],
      footnote: 'Velocity = median days from listing to sale. Consider reallocating capital toward Gucci small leather goods.',
    },
  },
  {
    keywords: ['wtb', 'dior', 'buy', 'buyer', 'opportunit', 'demand'],
    response: {
      intro:
        'There are 2 active WTB requests for Dior on the sourcing floor right now. Both buyers are verified and one is ready to transact today.',
      products: [
        { name: 'Book Tote Medium (WTB £1,500)', brand: 'Dior', price: 1500, currency: 'GBP', margin: 18.0, supplier: '@rohankapoor' },
        { name: 'Saddle Bag (WTB $2,600)', brand: 'Dior', price: 2600, currency: 'USD', margin: 22.5, supplier: '@meera.iyer' },
      ],
      footnote: 'You hold 1 Saddle Bag in inventory at a $1,330 profit spread against the @meera.iyer budget.',
    },
  },
  {
    keywords: ['margin', 'profit', 'highest', 'best', 'markup'],
    response: {
      intro:
        'Your highest-margin inventory sits in small leather goods and accessories, where sourcing spreads are widest relative to sell price.',
      insights: [
        { label: 'Gucci Ophidia Belt Bag', value: '36.7% margin', trend: 'up' },
        { label: 'BV Intrecciato Card Case', value: '39.1% margin', trend: 'up' },
        { label: 'Dior CD Navy Earrings', value: '42.9% margin', trend: 'up' },
        { label: 'Hermès Twilly', value: '47.1% margin', trend: 'up' },
      ],
      footnote: 'Accessories turn faster and carry the least authentication risk — a good place to scale volume.',
    },
  },
  {
    keywords: ['restock', 'reorder', 'buy more', 'low', 'sourcing', 'source'],
    response: {
      intro:
        'Based on 30-day sell-through and current stock, 3 lines are worth restocking before the weekend surge.',
      products: [
        { name: 'Ophidia GG Belt Bag', brand: 'Gucci', price: 620, currency: 'USD', margin: 36.7, supplier: 'Asha Mehta' },
        { name: 'Neverfull MM', brand: 'Louis Vuitton', price: 1450, currency: 'USD', margin: 33.8, supplier: 'Vikram Sethi' },
        { name: 'Twilly Silk Scarf', brand: 'Hermès', price: 180, currency: 'USD', margin: 47.1, supplier: 'Farah Khan' },
      ],
      footnote: 'These three sold 27 units combined last month against thin remaining stock.',
    },
  },
]

const fallback: AiResponse = {
  intro:
    "I can help you source products, spot buying opportunities, and read your performance. Try asking about a brand, a price ceiling, profit margins, or live WTB demand.",
  insights: [
    { label: 'Inventory value', value: '$92,430', trend: 'down' },
    { label: 'Active WTB requests', value: '6 matching your stock', trend: 'up' },
    { label: 'Best margin category', value: 'Accessories · 41% avg', trend: 'up' },
  ],
}

export function resolveAiResponse(query: string): AiResponse {
  const q = query.toLowerCase()
  let best: { score: number; response: AiResponse } | null = null
  for (const intent of intents) {
    const score = intent.keywords.reduce(
      (acc, kw) => (q.includes(kw) ? acc + 1 : acc),
      0,
    )
    if (score > 0 && (!best || score > best.score)) {
      best = { score, response: intent.response }
    }
  }
  return best?.response ?? fallback
}
