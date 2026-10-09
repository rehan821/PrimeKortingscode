# PrimeKortingscode — frontend

Next.js (App Router) + TypeScript + Tailwind CSS frontend for **PrimeKortingscode**, a
Dutch-first coupon & deals platform. See the [root README](../README.md) for project scope,
architecture and the backend contract.

## Scripts

```bash
npm run dev        # start the dev server (http://localhost:3000)
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint (flat config)
npm run typecheck  # tsc --noEmit
```

Copy the root `.env.example` to `.env.local` before running. All secrets/config are read from
there and `config/site.ts` — never hardcoded.

## Routing & i18n

* **Dutch (default)** lives at the root: `/winkels`, `/kortingscodes`, `/deals`, `/blog`.
* **English** lives under `/en`: `/en/stores`, `/en/coupons`, `/en/deals`, `/en/blog`.
* Both locales share one internal tree, `app/[locale]/…`. The public Dutch URLs are rewritten
  onto `/nl/…` in `next.config.ts` (`beforeFiles`), and direct `/nl/…` requests are permanently
  redirected back to the public URLs.
* Locale segments are guarded: Dutch-named folders call `notFound()` for `locale !== "nl"` (and
  vice-versa), so the two languages never leak into each other.
* All user-facing strings come from `i18n/nl.json` / `i18n/en.json`. Components stay
  dictionary-driven; `nl.json` is the source of truth for the `Dictionary` type.

## Data flow

```text
app/[locale]/…        route files: params, generateMetadata, generateStaticParams
        ↓
features/…            page-level composition (server components)
        ↓
services/…            the ONLY layer that reads data (typed, locale-aware, expiry-filtered)
        ↓
data/mock/…           development mock data  →  future WordPress/REST API
```

Components never call an API directly. Swapping mock data for a real backend means editing one
file per domain; the UI and types stay unchanged.

## Rendering

* Listing pages are **Partial Prerender** (`◐`): a static header shell streams a filtered grid
  inside `<Suspense>`. Search, sort and pagination are real, crawlable URLs read from
  `searchParams`.
* Detail pages are **statically generated** (`○`) from `generateStaticParams`, with `"use cache"`
  on time-dependent service readers.
* Unmatched single-segment paths and unknown detail slugs are rewritten by `proxy.ts` to a real,
  server-rendered localized 404 (`app/global-not-found.tsx`, `app/[locale]/not-found.tsx`).
* SEO: per-page `generateMetadata` (canonical + `hreflang`), JSON-LD, `app/sitemap.ts` and
  `app/robots.ts`.

## Assets

`public/og-default.png` and `public/images/blog/*.png` are generated raster assets (Open Graph +
article covers). SVG uploads are intentionally disabled in `next.config.ts`.
