import { useCallback, useEffect, useRef, useState } from 'react'
import type { SourcingListing } from '@/types'
import { feedPool } from '@/data/sourcing'

interface LiveFeedState {
  listings: SourcingListing[]
  live: boolean
  lastEventAt: number
  toggleLive: () => void
}

let idCounter = 9500

/**
 * Simulates a live WTS/WTB sourcing feed on top of the initial listings loaded
 * from the API. Every few seconds it either injects a fresh listing from the
 * pool or advances an existing one's status, then prunes so the feed never
 * grows unbounded. The injected activity is ephemeral (not persisted) — it
 * represents live market chatter layered over the real database records.
 */
export function useLiveFeed(initial: SourcingListing[]): LiveFeedState {
  const [listings, setListings] = useState<SourcingListing[]>(initial)
  const [live, setLive] = useState(true)
  const [ready, setReady] = useState(initial.length > 0)
  const [lastEventAt, setLastEventAt] = useState(() => Date.now())
  const poolIndex = useRef(0)

  // Seed from the API data once it arrives.
  useEffect(() => {
    if (!ready && initial.length > 0) {
      setListings(initial)
      setReady(true)
      setLastEventAt(Date.now())
    }
  }, [initial, ready])

  const tick = useCallback(() => {
    setListings((prev) => {
      const roll = Math.random()
      let next = [...prev]

      if (roll < 0.62 || prev.length === 0) {
        const seed = feedPool[poolIndex.current % feedPool.length]
        poolIndex.current += 1
        const fresh: SourcingListing = {
          id: `SRC-${++idCounter}`,
          type: seed.type,
          product: `${seed.brand} ${seed.product}`,
          brand: seed.brand,
          price: seed.price,
          currency: seed.currency,
          condition: seed.condition,
          party: seed.party,
          partyVerified: seed.verified,
          source: seed.source,
          createdAt: Date.now(),
          status: 'active',
          note: seed.note,
          isNew: true,
        }
        next = [fresh, ...prev.map((l) => ({ ...l, isNew: false }))]
      } else {
        const activeIdx = next
          .map((l, i) => (l.status === 'active' ? i : -1))
          .filter((i) => i >= 0)
        if (activeIdx.length) {
          const idx = activeIdx[Math.floor(Math.random() * activeIdx.length)]
          const promote = Math.random()
          next[idx] = {
            ...next[idx],
            status: promote < 0.5 ? 'pending' : 'fulfilled',
            isNew: false,
          }
        }
      }

      return next.slice(0, 40)
    })
    setLastEventAt(Date.now())
  }, [])

  useEffect(() => {
    if (!live || !ready) return
    let timer = 0
    const schedule = () => {
      const delay = 3500 + Math.random() * 2500
      timer = window.setTimeout(() => {
        tick()
        schedule()
      }, delay)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [live, ready, tick])

  const toggleLive = useCallback(() => setLive((v) => !v), [])

  return { listings, live, lastEventAt, toggleLive }
}
