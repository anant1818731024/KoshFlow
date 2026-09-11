import { useEffect, useState } from 'react'

/** Returns a value that only updates after `delay` ms of quiet — for search. */
export function useDebouncedValue<T>(value: T, delay = 220): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(t)
  }, [value, delay])
  return debounced
}
