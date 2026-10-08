# PrimeKortingscode — API Contract (v1 draft)

Status: **placeholder contract**, not implemented.
Consumer: `frontend/services/*.ts` (mock implementation today, HTTP implementation tomorrow).
Representation: JSON, `application/json; charset=utf-8`.

---

## 1. Conventions

- Base URL: taken exclusively from `API_BASE_URL` env var.
- All endpoints are **read-only** (`GET`) for v1.
- All timestamps are **ISO-8601 UTC strings** (`2026-10-08T09:00:00.000Z`).
- All slugs are **stable, lowercase, ASCII**, `^[a-z0-9]+(-[a-z0-9]+)*$`.
- List endpoints are **paginated** and never return unbounded datasets.
- Responses are `{ meta, data }` for lists and the resource object for single reads.
- Unknown/invalid resources return `404` with the error model below.

### 1.1 Pagination & filtering (list endpoints)

| Query param | Type | Default | Notes |
| --- | --- | --- | --- |
| `page` | int ≥ 1 | `1` | |
| `perPage` | int 1–100 | `24` | |
| `sort` | enum | endpoint specific | e.g. `popular`, `newest`, `title` |
| `q` | string | — | plain-text search |
| `letter` | `A`–`Z` | — | stores index alphabet filter |
| `featured` | bool | — | featured items only |
| `storeId` / `categorySlug` | string | — | cross-filtering |

Response envelope:

```json
{
  "meta": { "page": 1, "perPage": 24, "total": 132, "totalPages": 6 },
  "data": [ /* resource objects */ ]
}
```

### 1.2 Error model

```json
{ "error": { "code": "not_found", "message": "Coupon not found" } }
```

Codes: `bad_request`, `not_found`, `rate_limited`, `server_error`.

### 1.3 HATEOAS-ish links (recommended)

```json
{ "meta": { "...": "...", "self": "/coupons?page=2", "first": "/coupons", "last": "/coupons?page=6" } }
```

---

## 2. Endpoints

### 2.1 Stores

```
GET /stores
GET /stores/{slug}
```

Query: `page`, `perPage`, `q`, `letter`, `sort=title|popular`, `featured`.
List item = full store object (schema: `schemas/store.schema.json`).
`GET /stores/{slug}` returns the store plus the server-side prepared relations used by the
store detail page:

```json
{
  "...store fields...": "...",
  "coupons":  [ /* active coupons only */ ],
  "deals":    [ /* active deals only */ ],
  "categories": [ /* category summary objects */ ],
  "relatedStores": [ /* store summary objects */ ],
  "faq": [ { "question": "...", "answer": "..." } ]
}
```

> The frontend never assembles these relations from N+1 calls; the detail endpoint (or a
> single aggregated query in the service layer) provides them.

### 2.2 Categories

```
GET /categories
GET /categories/{slug}
```

Query: `page`, `perPage`, `q`, `sort=title|popular`.
Detail payload includes `stores`, `coupons`, `deals`, `relatedCategories`.

### 2.3 Coupons

```
GET /coupons
GET /coupons/{slug}
```

Query: `page`, `perPage`, `q`, `storeId`, `categorySlug`, `sort=newest|popular|expiring`, `featured=true`.

> **`code` may be omitted in list responses** (only returned on the detail endpoint) if the
> future backend chooses to gate code reveal. The frontend already treats `code` as optional.

### 2.4 Deals

```
GET /deals
GET /deals/{slug}
```

Query: `page`, `perPage`, `q`, `storeId`, `categorySlug`, `sort=newest|popular|price`, `featured=true`.

### 2.5 Blog

```
GET /blog
GET /blog/{slug}
```

Query: `page`, `perPage`, `q`, `tag`, `category`.
Detail payload includes `author`, `publishedAt`, `body` (HTML), `tags`, `relatedPosts`.

---

## 3. Data integrity rules

1. `redirectUrl` **must** be absolute `http`/`https`. The backend should validate against an
   affiliate/store domain allowlist; the frontend re-validates at the service boundary.
2. `expiresAt` in the past ⇒ the coupon/deal must not appear in `is:active` listings.
3. `isVerified` may only be `true` after a human/automated verification step.
4. Slugs never change silently — slug changes require a 301 (`next.config.ts` redirects).
5. Localisation: resources are **locale-neutral content**; user-facing chrome strings live in
   `frontend/i18n/{nl,en}.json`. If translated fields are added later (e.g. `titleEn`), the
   schemas must be extended rather than the UI guessing.

---

## 4. Future webhook (out of scope, reserved)

```
POST /revalidate  (secret-protected)  → purge Next.js cache for a given path/tag
```

Reserved so the frontend's caching/revalidation strategy can be wired up later without
architecture changes.
