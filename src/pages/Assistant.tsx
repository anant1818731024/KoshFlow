import { useEffect, useRef, useState } from 'react'
import {
  Sparkles,
  ArrowUp,
  TrendingUp,
  TrendingDown,
  Plus,
  Package,
  ListPlus,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProductThumb } from '@/components/shared/ProductThumb'
import { suggestedPrompts, resolveAiResponse } from '@/data/ai'
import { useToast } from '@/hooks/useToast'
import type { AiResponse, ChatMessage } from '@/types'
import { cn, currencySymbol } from '@/lib/utils'

let msgId = 0

export default function Assistant() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, thinking])

  useEffect(() => {
    const t = timers.current
    return () => t.forEach((id) => window.clearTimeout(id))
  }, [])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || thinking) return
    const userMsg: ChatMessage = {
      id: `m${++msgId}`,
      role: 'user',
      text: trimmed,
      time: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)

    // Simulate model latency, then stream in the resolved response.
    const delay = 700 + Math.random() * 700
    const id = window.setTimeout(() => {
      const response = resolveAiResponse(trimmed)
      setThinking(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `m${++msgId}`,
          role: 'assistant',
          response,
          time: Date.now(),
        },
      ])
    }, delay)
    timers.current.push(id)
  }

  const started = messages.length > 0

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col lg:h-[calc(100vh-7rem)]">
      <PageHeader
        title="AI Assistant"
        description="Ask about your inventory, sourcing opportunities and performance."
        actions={
          started ? (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setMessages([])
                setThinking(false)
              }}
            >
              New chat
            </Button>
          ) : (
            <Badge tone="gold" dot>
              Beta
            </Badge>
          )
        }
      />

      <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ink-200/70 bg-white shadow-card">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {!started && !thinking ? (
            <Welcome onPick={send} />
          ) : (
            <div className="mx-auto max-w-2xl space-y-6">
              {messages.map((m) =>
                m.role === 'user' ? (
                  <UserBubble key={m.id} text={m.text ?? ''} />
                ) : (
                  <AssistantBubble
                    key={m.id}
                    response={m.response!}
                    onAction={(label) =>
                      toast({ title: label, description: 'Demo action', tone: 'success' })
                    }
                  />
                ),
              )}
              {thinking && <Typing />}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-ink-100 bg-white px-4 py-3 sm:px-6">
          {started && (
            <div className="mx-auto mb-2 flex max-w-2xl flex-wrap gap-1.5">
              {suggestedPrompts.slice(0, 3).map((p) => (
                <button
                  key={p.label}
                  onClick={() => send(p.query)}
                  disabled={thinking}
                  className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-2xs font-medium text-ink-500 transition-colors hover:bg-ink-50 disabled:opacity-50"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <form
            className="mx-auto flex max-w-2xl items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(input)
                  }
                }}
                rows={1}
                placeholder="Ask KoshFlow anything about your business…"
                aria-label="Message the assistant"
                className="max-h-32 w-full resize-none rounded-xl border border-ink-200 bg-white px-4 py-2.5 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/15"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="icon"
              className="h-[42px] w-[42px] shrink-0 rounded-xl"
              disabled={!input.trim() || thinking}
              aria-label="Send message"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </form>
          <p className="mx-auto mt-2 max-w-2xl text-center text-2xs text-ink-400">
                KoshFlow AI is a demo experience with pre-modelled responses.
          </p>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function Welcome({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center pt-6 text-center sm:pt-12">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-950 text-accent-400">
        <Sparkles className="h-7 w-7" />
      </span>
      <h2 className="mt-5 font-display text-2xl font-medium text-ink-900">
        How can I help you source today?
      </h2>
      <p className="mt-2 max-w-md text-sm text-ink-500">
        I can find products across your suppliers, surface live buying demand,
        and read your performance. Try one of these:
      </p>
      <div className="mt-6 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
        {suggestedPrompts.map((p) => (
          <button
            key={p.label}
            onClick={() => onPick(p.query)}
            className="group flex items-center gap-3 rounded-xl border border-ink-200/70 bg-white px-4 py-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-elevated"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-medium text-ink-700">
              {p.query}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end animate-fade-in-up">
      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-ink-950 px-4 py-2.5 text-sm text-ink-50">
        {text}
      </div>
    </div>
  )
}

function AssistantBubble({
  response,
  onAction,
}: {
  response: AiResponse
  onAction: (label: string) => void
}) {
  return (
    <div className="flex gap-3 animate-fade-in-up">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-accent-400">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <p className="text-sm leading-relaxed text-ink-800">{response.intro}</p>

        {response.products && (
          <div className="space-y-2">
            {response.products.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-ink-200/70 bg-white p-3"
              >
                <ProductThumb brand={p.brand} hue={(i * 47 + 20) % 360} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-ink-900">
                    {p.name}
                  </p>
                  <p className="text-xs text-ink-400">
                    {p.brand}
                    {p.supplier ? ` · ${p.supplier}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold tabular-nums text-ink-900">
                    {currencySymbol(p.currency)}
                    {p.price.toLocaleString()}
                  </p>
                  <p className="text-2xs font-medium text-accent-600 tabular-nums">
                    {p.margin.toFixed(1)}% margin
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {response.insights && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {response.insights.map((ins, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 rounded-xl border border-ink-200/70 bg-ink-50/60 px-3 py-2.5"
              >
                <span className="text-[13px] font-medium text-ink-700">
                  {ins.label}
                </span>
                <span className="inline-flex items-center gap-1 text-[13px] font-semibold tabular-nums text-ink-900">
                  {ins.trend === 'up' && (
                    <TrendingUp className="h-3.5 w-3.5 text-positive-600" />
                  )}
                  {ins.trend === 'down' && (
                    <TrendingDown className="h-3.5 w-3.5 text-negative-600" />
                  )}
                  {ins.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {response.footnote && (
          <p className="text-xs leading-relaxed text-ink-500">
            {response.footnote}
          </p>
        )}

        {response.products && (
          <div className="flex flex-wrap gap-2 pt-0.5">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ListPlus className="h-4 w-4" />}
              onClick={() => onAction('Added to sourcing list')}
            >
              Add to sourcing list
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Package className="h-4 w-4" />}
              onClick={() => onAction('Opened in marketplace')}
            >
              View in marketplace
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function Typing() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-accent-400">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-ink-200/70 bg-white px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-ink-300"
            style={{
              animation: 'pulse-dot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
