import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
        <Compass className="h-7 w-7" />
      </span>
      <p className="mt-6 font-display text-5xl font-medium text-ink-900">404</p>
      <h1 className="mt-2 text-lg font-semibold text-ink-800">
        This page went out of stock
      </h1>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary">Back to dashboard</Button>
      </Link>
    </div>
  )
}
