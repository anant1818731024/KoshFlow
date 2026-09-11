import { AlertTriangle, RefreshCw, ServerCrash } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'

/** Skeleton shown while the initial data loads from the API. */
export function PageLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}

/** Error state with a retry action — shown when the API can't be reached. */
export function PageError({
  message,
  onRetry,
}: {
  message?: string | null
  onRetry: () => void
}) {
  return (
    <Card>
      <EmptyState
        icon={<ServerCrash className="h-6 w-6" />}
        title="Couldn't load your data"
        description={
          message ??
          'The KoshFlow API could not be reached. Make sure the server is running and try again.'
        }
        action={
          <Button
            variant="primary"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={onRetry}
          >
            Retry
          </Button>
        }
      />
      <div className="flex items-start gap-2 border-t border-ink-100 px-5 py-3 text-xs text-ink-400">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          KoshFlow requires its API and Postgres database. Start it with{' '}
          <code className="rounded bg-ink-100 px-1 py-0.5 font-mono text-[11px] text-ink-600">
            npm run dev
          </code>{' '}
          inside the <span className="font-medium">server</span> folder.
        </span>
      </div>
    </Card>
  )
}
