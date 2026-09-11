export function statusForStock(stock: number): string {
  if (stock === 0) return 'out_of_stock'
  if (stock <= 2) return 'low_stock'
  return 'in_stock'
}

let counter = 0
/** Short unique-ish id with a resource prefix, e.g. PRD-8F3K2. */
export function genId(prefix: string): string {
  counter += 1
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  const tail = (Date.now() % 100000).toString(36).toUpperCase()
  return `${prefix}-${tail}${counter}${rand}`.slice(0, prefix.length + 9)
}

export function skuFor(brand: string, id: string, color: string): string {
  return `${brand.slice(0, 3).toUpperCase()}-${id.split('-')[1] ?? id}-${color
    .slice(0, 2)
    .toUpperCase()}`
}

/** A small async wrapper so route handlers can throw and hit the error mw. */
export function asyncHandler<T extends (...args: any[]) => Promise<unknown>>(
  fn: T,
) {
  return (req: any, res: any, next: any) => fn(req, res, next).catch(next)
}
