# PrimeKortingscode

**Dutch-first coupon & deals platform** — kortingscodes, deals en winkels voor Nederland.

Production-ready **frontend** built with Next.js (App Router), TypeScript and Tailwind CSS.
SEO, performance and a clean service/architecture layer are first-class requirements.

> **Scope:** frontend only. The backend (WordPress/API), authentication, admin dashboard and
> coupon automation are *deliberately not implemented* — `backend/` contains API contracts and
> JSON schemas only, so the future backend can plug in without a frontend rewrite.

---

## Repository layout

```text
PrimeKortingscode/
├── frontend/               # Next.js App Router application
│   ├── app/                # Routes, metadata, sitemap, robots, structured data
│   ├── components/         # Reusable UI (header, cards, coupon modal, …)
│   ├── features/           # Page-level server components per domain
│   ├── services/           # Data access — the ONLY place that talks to a data source
│   ├── types/              # Typed domain models (Store, Coupon, Deal, …)
│   ├── data/               # Development mock data (clearly separated)
│   ├── i18n/               # nl/en dictionaries + locale routing config
│   ├── lib/                # SEO, routing, url-safety, date helpers
│   ├── config/             # Central site configuration
│   └── public/             # Static assets
├── backend/                # API contract + JSON schemas (NO implementation)
├── .env.example
├── .gitignore
└── README.md
```

## Quick start

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000  (Dutch default)
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Architecture

```text
UI (server components by default)
   ↓
feature/domain layer  (frontend/features — page composition)
   ↓
service layer         (frontend/services — typed functions: getStores(), getCouponBySlug() …)
   ↓
data source           (mock data today  →  WordPress/REST API tomorrow)
```

* Components **never** call `wp-json` or any API directly.
* Services accept a `locale` + query, validate at the boundary and return typed models.
* Swapping mock → API = editing one file per domain, zero UI changes.

## Internationalisation

* Dutch is the default language and lives at the root: `/winkels`, `/kortingscodes`, `/deals`.
* English lives under a prefix: `/en/stores`, `/en/coupons`, `/en/deals`.
* All user-facing chrome strings come from `frontend/i18n/nl.json` / `en.json` — never from
  hardcoded component text. Adding German/French = new JSON + one route tree.
* Locale-aware `<html lang>`, canonical URLs and `hreflang` alternates are generated per page.

## SEO

Semantic HTML, server rendering, dynamic `generateMetadata`, canonical URLs, Open Graph +
Twitter cards, `hreflang` alternates, `sitemap.xml`, `robots.txt`, JSON-LD
(Organization/WebSite, BreadcrumbList, FAQPage, BlogPosting), stable slugs, clean URLs,
404 handling and a ready-made 301 redirect table in `next.config.ts`.

## Performance

Server Components by default, Client Components only for genuine interaction (search input,
coupon modal, copy button, mobile nav), `next/image`, `next/font`, no UI framework, code-split
routes, paginated list queries (no full-dataset downloads) and a static-first rendering
strategy.

## Data

`frontend/data/` contains **realistic Dutch development mock data** (bol.com, Zalando,
Coolblue, MediaMarkt, …) for structure and layout only. It is **not** real, verified or
live coupon data.

## Environment

Copy `.env.example` → `.env.local`. Secrets are never committed; all URLs/config are
centralised (`.env` + `frontend/config/site.ts`).
