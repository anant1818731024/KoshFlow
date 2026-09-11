# KoshFlow — Luxury Resale OS

**An operating system for independent luxury & resale sellers.**
Manage inventory, track orders and profit, discover stock from verified
suppliers, watch a live sourcing feed, and get AI-assisted buying guidance —
in one considered, product-led interface.

> **Personal Concept Project.** KoshFlow is a self-directed portfolio project
> built to demonstrate product thinking and frontend engineering. It is not a
> real company, has no real users, and every figure, seller, supplier and
> listing is fictional demo data. It is inspired by the category of tools
> independent resellers use, but the name, brand, UI, UX and content are
> original.

---

## Why this project

I built KoshFlow to answer a single question a hiring team might have about a
**Creative Frontend Developer (React & Figma)**: *can this person take a
data-heavy product from concept, through interface design, to a polished,
responsive React application?*

So rather than a to-do app or a generic admin template, KoshFlow is a plausible
SaaS product with real product surfaces — a dashboard, inventory management, a
marketplace, a supplier hub, a **live** sourcing feed, analytics, and an AI
assistant — each designed with its own states, interactions and responsive
behaviour.

---

## The role I played

- **Product concept** — defined the problem, the personas (independent
  resellers & personal shoppers) and the nine core surfaces.
- **UI / UX & Figma-style design thinking** — a bespoke design system: type
  scale, spacing, colour, elevation, and a full set of component states
  (hover, active, focus, disabled, loading, empty, error).
- **Frontend engineering** — React 18 + TypeScript, a reusable component
  library, custom dependency-free SVG charts, a simulated real-time feed, and
  client-side search/filter/sort throughout.
- **Responsive design** — purpose-built layouts for desktop, laptop, tablet
  and mobile (not a shrunk desktop).

---

## The problem (fictional)

Independent luxury resellers run their business across a patchwork of tools:
spreadsheets for inventory and margin, DMs and group chats for sourcing,
screenshots for supplier catalogues, and gut feel for what to buy next. The
information they need to make a fast, confident buying decision — *what do I
hold, what's it worth, who wants it, and where can I get more* — is scattered
and never in one place.

## The solution

KoshFlow unifies the reseller's workflow into one calm, premium interface:

- A **dashboard** that leads with revenue, profit and the day's most important
  signals.
- **Inventory** with margin baked into every row and fast, real filtering.
- A **marketplace** and **supplier hub** to discover authenticated stock from
  verified partners.
- A **live sourcing feed** (WTS / WTB) that mirrors how sourcing actually
  happens in reseller communities — but structured and searchable.
- **Analytics** to understand what's driving profit and sell-through.
- An **AI assistant** that answers sourcing and performance questions inside
  the product, returning structured results rather than a wall of text.

---

## Key features

| Surface | What it demonstrates |
| --- | --- |
| **Dashboard** | Information hierarchy, KPI design with context deltas & sparklines, at-a-glance triage |
| **Inventory** | Data tables, real search / filter / sort / pagination, full CRUD, a detail drawer, responsive table → card |
| **Orders** | Status pipeline, tabbed filtering, order detail with a timeline and inline status changes |
| **Marketplace** | Product-grid commerce UI, verification badges, availability states, add-to-sourcing-list |
| **Supplier Hub** | Profile cards, ratings & reviews, per-supplier catalogue, trust signals |
| **Source (live feed)** | Simulated real-time updates, "Live" indicator, pause/resume, multi-axis filtering — the hardest UX to get right |
| **Analytics** | Custom SVG area / bar / donut charts, date-range controls, brand performance |
| **AI Assistant** | A considered chat UX with suggested prompts, typing indicator, and *structured* AI responses (product cards, insights) |
| **Settings** | Sectioned settings with toggles and form patterns |

---

## Design approach

- **A restrained, "ink & paper" system.** A warm neutral foundation with a
  single deep-emerald accent and a sparing gold for verification / premium
  marks. No neon, no gratuitous gradients or glass. The intent is *premium
  commerce*, not "dashboard template".
- **Editorial typography.** A serif display face (Fraunces) for headings and
  figures paired with Inter for UI, plus tabular numbers everywhere financial
  data appears.
- **Every component has states.** Buttons, inputs, tables, modals, drawers,
  toasts, tabs, tooltips, pagination and badges each ship with hover, focus,
  active, disabled, loading, empty and error treatments.
- **Real responsive design.** Tables collapse into cards on mobile, filters
  fold behind a control, the sidebar becomes a bottom bar plus a slide-over
  menu, and detail views use a right-hand drawer that goes full-width on phones.
- **Motion with restraint.** Subtle, premium transitions that respect
  `prefers-reduced-motion`.

## Technical approach

- **React 18 + TypeScript + Vite + Tailwind CSS** on the front end;
  **Node + Express + Prisma + Postgres** on the back end.
- **Clean component architecture** — `ui/` primitives, `charts/`, `layout/`,
  `shared/` composite pieces, and thin `pages/` that compose them.
- **A real API + database.** Inventory, orders, suppliers, marketplace and
  sourcing data live in Postgres, exposed by a typed Express API and consumed
  through a single data-access layer (`src/lib/api.ts` → `useAppStore`). No
  data is baked into the client; the app loads everything from the API and
  shows proper loading/error states.
- **Provider-agnostic Postgres** — one `DATABASE_URL` env var. Built and
  documented for **Neon** (serverless Postgres), and works unchanged with
  Supabase, Railway, or a local database.
- **Lightweight client state** — React Context for the app store (inventory,
  orders, analytics, sourcing-list) and toasts; local component state for
  everything else. Mutations are optimistic and reconciled against the API.
- **Dependency-light** — the only runtime dependencies are `react`,
  `react-dom`, `react-router-dom` and `lucide-react` (icons). **Charts are
  hand-built SVG** — no charting library — which keeps the bundle small and the
  visuals perfectly on-brand.
- **Custom hooks** — `useLiveFeed` (real-time simulation), `useDebouncedValue`
  (search), `useMediaQuery`, `useToast`, and the `useAppStore` store.
- **Accessibility** — semantic HTML, labelled controls, keyboard-navigable
  menus and dialogs, visible focus states, `aria-*` where it earns its place,
  and reduced-motion support.

## Interesting challenges

- **Simulating a live feed** over real data: initial listings load from the
  database, then a randomized-cadence scheduler layers ephemeral "market
  chatter" on top — new rows animate in and are flagged, timestamps re-render
  on an interval, and the feed is prunable, pausable and filterable.
- **Data-heavy layouts that stay legible** on a phone: the same inventory and
  orders data reads as a sophisticated table on desktop and as a scannable card
  list on mobile, from one component.
- **AI UX that feels native to the product** rather than a chatbot bolted on:
  responses are typed structures (`intro`, `products`, `insights`, `footnote`)
  rendered as product cards and insight tiles, with a keyword intent-matcher
  standing in for a model.
- **Charts on-brand:** building area, bar and donut charts by hand in SVG so
  they share the exact palette, type and interaction language as the rest of
  the app.

---

## Tech stack

**Frontend:** `React 18` · `TypeScript` · `Vite` · `Tailwind CSS` ·
`React Router` · `lucide-react` · hand-authored `SVG` charts
**Backend:** `Node` · `Express` · `Prisma` · `PostgreSQL` (built for `Neon`)

---

## Architecture

```
┌──────────────────────┐        HTTP / JSON        ┌──────────────────────┐
│  React + Vite client │  ───────────────────────► │  Express + Prisma API │
│  (useAppStore →      │  ◄─────────────────────── │  /api/products …      │
│   src/lib/api.ts)    │                           └──────────┬───────────┘
└──────────────────────┘                                      │ Prisma
                                                              ▼
                                                    ┌──────────────────────┐
                                                    │   PostgreSQL (Neon)  │
                                                    └──────────────────────┘
```

The client never holds its own data — it fetches products, orders, suppliers,
marketplace listings, the sourcing feed and analytics from the API, which reads
and writes Postgres through Prisma. Analytics (KPIs, brand performance,
category distribution) are **computed server-side from live data** plus a
seeded 12-month history.

---

## Getting started

Requires **Node 18+** and a **PostgreSQL** database (a free
[Neon](https://neon.tech) project works perfectly).

### 1 — Back end (`/server`)

```bash
cd server
cp .env.example .env         # then paste your DATABASE_URL (and DIRECT_URL for Neon)
npm install                  # also runs `prisma generate`
npm run setup                # prisma migrate dev + seed the database
npm run dev                  # API on http://localhost:4000
```

`npm run setup` is a shortcut for `prisma generate && prisma migrate dev && prisma db seed`.
You can also run those individually (`npm run prisma:migrate`, `npm run db:seed`).

**Using Neon:** create a project, copy the **pooled** connection string into
`DATABASE_URL` and the **direct** one into `DIRECT_URL` (both shown in the Neon
dashboard). Everything else is identical.

### 2 — Front end (repo root)

```bash
cd ..
cp .env.example .env         # VITE_API_URL defaults to http://localhost:4000
npm install
npm run dev                  # app on http://localhost:5173
```

Open the URL Vite prints. The app requires the API to be running — if it can't
reach it you'll see a clear "Couldn't load your data" screen with a retry.

### Handy scripts

| Location | Command | What it does |
| --- | --- | --- |
| root | `npm run build` | Type-check + production build to `/dist` |
| root | `npm run preview` | Preview the production build |
| server | `npm run db:studio` | Open Prisma Studio to browse the data |
| server | `npm run db:seed` | Re-seed the database |
| server | `npm run build && npm start` | Compile and run the API for production |

---

## Project structure

```
cachet/
  src/                      # ── Frontend (React + Vite)
    components/
      ui/       # design-system primitives (Button, Input, Modal, …)
      charts/   # custom SVG charts (Area, Bar, Donut, Sparkline)
      layout/   # sidebar, topbar, mobile nav, app shell
      shared/   # composite pieces (KpiCard, PageHeader, ProductThumb, forms)
    pages/      # the nine product surfaces + 404
    hooks/      # useAppStore (API-backed), useToast, useLiveFeed, …
    lib/        # api.ts (API client) + formatting helpers
    data/       # UI constants (brand/category lists, prompts, feed pool)
    types/      # single source of truth for domain types
  server/                   # ── Backend (Express + Prisma)
    prisma/
      schema.prisma  # Product, Order, Supplier, Review, Marketplace, Sourcing…
      seed.ts        # seeds Postgres from src/seed
    src/
      routes/    # products, orders, suppliers, marketplace, sourcing, analytics
      seed/      # the canonical seed records
      lib/       # serializers + helpers
      app.ts, index.ts, db.ts, env.ts
```

---

## Outcome

This is a **personal concept project** created to demonstrate product design
and frontend engineering capabilities for Creative Frontend Developer
(React & Figma) roles. Everything in it — sellers, suppliers, prices, orders
and analytics — is fictional demo data. There are no real users, no real
business, and no affiliation with any brand referenced.
