# PrimeKortingscode — Backend Contract (placeholder)

> **This directory contains contracts only. There is no backend implementation here.**

The frontend in `frontend/` currently runs on typed local mock data served through a
service layer (`frontend/services/`). When the real backend (WordPress + REST API or a
headless service) is built, only the service layer is swapped — no UI code changes.

## Contents

| Path | Purpose |
| --- | --- |
| `docs/api-contract.md` | REST endpoint contract, conventions, error model, pagination |
| `schemas/*.schema.json` | JSON Schema for each resource (store, category, coupon, deal, blog) |
| `README.md` | This file |

## Integration notes for the future backend team

1. **Base URL comes from configuration only** (`API_BASE_URL` in `.env`), never from UI code.
2. **The frontend only calls the service layer** (`frontend/services/*.ts`). Components never
   fetch from WordPress/`wp-json` endpoints directly.
3. **Every response must match the JSON schemas in `schemas/`**, which are kept in sync with
   the TypeScript models in `frontend/types/index.ts`.
4. **Validation happens at the service boundary.** The service layer validates/normalises
   incoming payloads (dates ISO-8601, slugs stable, `redirectUrl` http(s) only) before it
   reaches the UI.
5. **Slugs are permanent.** Changing a slug requires a 301 redirect entry (the frontend ships
   redirect support in `next.config.ts`).
6. **Affiliate URLs (`redirectUrl`) are data, never markup.** They must be validated against
   an allowlist server-side and rendered only through the coupon/deal redirect components.

## Expected future endpoints

```
GET /stores
GET /stores/{slug}
GET /categories
GET /categories/{slug}
GET /coupons
GET /coupons/{slug}
GET /deals
GET /deals/{slug}
GET /blog
GET /blog/{slug}
```

Full details: [`docs/api-contract.md`](docs/api-contract.md).

## Status

- [x] API contract documented
- [x] JSON schemas defined
- [x] TypeScript domain models defined (`frontend/types`)
- [ ] Backend implementation (**out of scope — deliberately not written**)
- [ ] Authentication / admin dashboard (**out of scope**)
- [ ] Scraping / coupon automation (**out of scope**)
