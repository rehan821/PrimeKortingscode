# PrimeKortingscode reference audit and implementation matrix

**Audit date:** 2026-10-09

**Scope:** Existing public PrimeKortingscode page templates, Dutch and English routes, shared interactions, SEO endpoints, and desktop/mobile behavior.

## Evidence and limits

The supplied brief identifies `https://www.retailmenot.com/` as the reference. The browser safety policy blocked opening that site during this audit. I did not inspect its pages, use another route to reach them, or infer its page layouts from the brand name. As a result, the reference-side layout and interaction for every row below is **unverified**. The brief names page families to inspect, but it does not supply screenshots or page contents. A genuine side-by-side visual gap assessment requires accessible reference evidence.

PrimeKortingscode observations below come from the checked-in route tree, shared components, current demo configuration and local browser inspection. The app displays a global notice that its content is fictional. No sample offer should be treated as a live discount or verification claim.

## Page-template matrix

| Template / reference URL | PrimeKortingscode routes (NL / EN) | Local layout and behavior observed | Material gap / action | Files and status |
|---|---|---|---|---|
| Shared header, nav, search, language switch | Every route; language switch maps equivalent routes | Branded header with search, desktop nav, active route, demo banner and Dutch/English switch. Mobile menu includes search, links and locale switch. Search is a GET form routed to a directory listing. | RetailMeNot hierarchy, search suggestions, and cross-site search scope are unverified. Existing search has no autocomplete and global search defaults to stores; retain as a known functional limitation pending requirements/reference evidence. | `components/layout/{Header,Logo,NavLinks,MobileNav,LanguageSwitcher}.tsx`, `components/search/SearchForm.tsx`, `app/globals.css` — revised and locally inspected; mobile menu was exercised in the prior visual QA pass. |
| Homepage (`https://www.retailmenot.com/`) | `/` / `/en` | Search-led editorial hero, featured article image, popular stores, coupon and deal grids, categories, recently updated stores, editorial cards and newsletter demo form. | Reference sections/order, promotional modules, card density and desktop/mobile differences are unverified. | `features/home/HomePage.tsx`, `components/marketing/NewsletterSection.tsx`, shared cards/styles — revised; local homepage rendered. |
| Store directory | `/winkels` / `/en/stores` | Search, A–Z filter, sort links, responsive store grid, pagination and empty state. | Reference directory presentation and filter behavior unverified. Merchant-logo asset coverage is absent; current store model uses names, initials and brand colors rather than fabricated logos. | `features/stores/StoresPage.tsx`, `components/store/{StoreCard,StoreLogo}.tsx`, `components/common/{ListControls,Pagination}.tsx` — revised/retained; local listing inspected. |
| Store detail | `/winkels/[slug]` / `/en/stores/[slug]` | Breadcrumb, store identity and summary, store coupons, deals, related merchants and FAQ disclosures. No-related-content state is handled. | Reference detail-page hierarchy, sidebar, tabs and merchant branding unverified. Real logos and offer data require legitimate source assets/data. | `features/stores/StoreDetailPage.tsx`, `components/store/*`, coupon/deal cards — revised; Zalando detail rendered locally. |
| Category directory | `/categorieen` / `/en/categories` | Search, sort, responsive category cards and pagination/empty state. | Reference category navigation and imagery unverified. | `features/categories/CategoriesPage.tsx`, `components/category/{CategoryCard,CategoryIcon}.tsx` — shared design applied. |
| Category detail | `/categorieen/[slug]` / `/en/categories/[slug]` | Breadcrumb, category summary, related stores and offers, with empty states for absent offers. | Reference category-specific layout and filters unverified. | `features/categories/CategoryDetailPage.tsx`, category/store/offer cards — revised; `/categorieen/mode` inspected locally. |
| Coupon directory | `/kortingscodes` / `/en/coupons` | Instruction panel, query search, sort links, coupon cards, pagination and empty state. Reveal action opens modal with code, copy control, outbound store link and expandable terms. | Reference coupon-card imagery, savings hierarchy and filtering unverified. Search remains scoped to the current directory. | `features/coupons/CouponsPage.tsx`, `components/coupon/{CouponCard,CouponModal,GetCodeButton,CouponRevealButton,CopyCodeButton}.tsx` — revised; NL and EN listings rendered locally. |
| Coupon detail | `/kortingscodes/[slug]` / `/en/coupons/[slug]` | Breadcrumb, merchant, expiry, discount, description, reveal CTA, terms and related coupons/empty state. Copy and safe outbound redirect components are preserved. | Reference detail layout and offer states unverified. No real usage counts or trust data are shown. | `features/coupons/CouponDetailPage.tsx`, coupon components — revised; multiple detail routes were inspected in the previous local QA pass. |
| Deals directory | `/deals` / `/en/deals` | Query search, sort links, deal cards, pagination and empty state are defined by the page template. Deal CTA is a safe outbound link, with store fallback for invalid destinations. | Reference deal imagery, list controls and expired/empty presentation unverified. Local browser reached the route during prior QA but the first view was still in its streaming fallback; listing settlement was not confirmed. | `features/deals/DealsPage.tsx`, `components/coupon/DealCard.tsx`, `GetDealButton.tsx` — shared design applied; async listing state remains to verify. |
| Deal detail | `/deals/[slug]` / `/en/deals/[slug]` | Breadcrumb, offer and expiry summary, merchant CTA, terms and related deals/empty state. | Reference deal-detail hierarchy unverified. | `features/deals/DealDetailPage.tsx`, deal components — revised; `/deals/bol-com-dagdeals` inspected locally. |
| Blog listing | `/blog` / `/en/blog` | Editorial cards with local cover images, article metadata and pagination/empty state. | Reference editorial modules and tag controls unverified; current tags are query links on articles, with no listing tag selector. | `features/blog/BlogPage.tsx`, `components/blog/BlogCard.tsx` — revised; local listing inspected. |
| Blog article | `/blog/[slug]` / `/en/blog/[slug]` | Breadcrumb, article content, metadata/tags, related articles and return-to-blog link. | Reference reading layout, author treatment and related-story modules unverified. | `features/blog/PostDetailPage.tsx`, `components/blog/BlogCard.tsx` — retained/revised; article rendered locally. |
| Contact | `/contact` / `/en/contact` | Contact details and validated contact form. Client validation is available; there is no sending backend. | Reference contact options unverified. Backend submission cannot be implemented honestly without a configured endpoint. The UI now reports demo-only behavior rather than claiming a successful send. | `features/pages/ContactPage.tsx`, `components/marketing/ContactForm.tsx` — demo state corrected. |
| Privacy policy | `/privacybeleid` / `/en/privacy` | Structured policy sections and shared shell. Copy now reflects that this demo does not submit or store form data, and distinguishes app behavior from hosting/external-store behavior. | Reference policy content/structure unverified. The production administrator must review and replace demo/host-specific statements with the actual deployed data practices. | `features/pages/PrivacyPage.tsx`, `i18n/{nl,en}.json` — policy copy aligned to current demo behavior. |
| Localized not-found / global 404 | Unknown local URL / unknown English URL | Locale-aware not-found page plus global fallback. | Reference error page is unverified. | `app/[locale]/not-found.tsx`, `app/global-not-found.tsx` — route behavior preserved. |
| Crawler endpoints | `/sitemap.xml`, `/robots.txt` | Sitemap enumerates public NL/EN list and detail routes with language alternates; robots points to sitemap and excludes internal `/nl`. | Reference crawler policy is outside visual comparison and unverified. | `app/sitemap.ts`, `app/robots.ts`, `lib/routes.ts`, `next.config.ts` — preserved. |

## Shared visual and functional implementation

- Unified purple/neutral tokens, surfaces, focus treatment, card borders/shadows, badges, page headings, spacing and responsive grids across shared templates.
- Updated home composition and reusable store, category, coupon, deal and blog cards while preserving existing service/data contracts and route generation.
- Kept Dutch root URLs and English `/en` URLs, canonical/hreflang metadata, sitemap, robots policy and internal links in the existing routing architecture.
- Preserved GET search, A–Z store filter, sort, pagination, coupon reveal/copy, FAQ/terms disclosure and validated outbound destinations.
- Store presentation uses text names/initials and available brand colors; no merchant logo assets were found in the repository, so no logos were invented.
- Suppressed “verified” badges while `siteConfig.showDemoNotice` is true. These seed records are fictional and cannot substantiate a verification claim.
- Newsletter and contact forms still validate locally but do not transmit data. Valid submission now displays a neutral demo notice, not a success confirmation. A backend endpoint is required for real signup or contact delivery.
- Split the async server expiry calculation from the client coupon reveal control. The expiry state is computed on the server and passed as serializable data into the modal, so the reveal interaction no longer imports an async server component into its client bundle.
- Removed unsupported promises about one-day contact response, newsletter delivery/unsubscribe, and configured analytics from the demo copy. The privacy page now tells users what this frontend does and flags hosting/production behavior for the site operator.

## Changed files

- **Design system:** `app/globals.css`, `components/ui/SectionHeading.tsx`, `components/ui/icons.tsx`.
- **Shared shell:** `components/layout/Footer.tsx`, `Header.tsx`, `Logo.tsx`, `NavLinks.tsx`, `PageHeader.tsx`, `components/search/SearchForm.tsx`.
- **Reusable cards and statuses:** `components/blog/BlogCard.tsx`, `components/category/CategoryCard.tsx`, `components/coupon/CouponCard.tsx`, `CouponModal.tsx`, `CouponRevealButton.tsx`, `DealCard.tsx`, `components/common/Status.tsx`, `ExpiryIndicator.tsx`, `ExpiryStatus.tsx`, `VerifiedBadge.tsx`, `components/store/StoreCard.tsx`, `StoreLogo.tsx`.
- **Page templates:** `features/categories/CategoryDetailPage.tsx`, `features/coupons/CouponDetailPage.tsx`, `features/deals/DealDetailPage.tsx`, `features/home/HomePage.tsx`, `features/stores/StoreDetailPage.tsx`.
- **Demo forms and copy:** `components/coupon/GetCodeButton.tsx`, `components/marketing/ContactForm.tsx`, `NewsletterSection.tsx`, `i18n/en.json`, `i18n/nl.json`.
- **Audit deliverable:** `RETAILMENOT_GAP_MATRIX.md`.

## Verification record

- Local browser: homepage, `/winkels/zalando`, and `/en/coupons` rendered; global demo notice, localized navigation, store content and English coupon pagination were present. In the prior visual QA pass, store/coupon listings and details, category pages, blog pages, and deal detail were also visited. The deals listing initially showed its streaming fallback and was not confirmed after settling.
- Coupon interaction: English listing reveal opened the modal, copy showed “Copied!”, and Escape closed the dialog. Browser runtime inspection found and fixed an async server component pulled into the client modal; the reveal flow was rechecked after the fix.
- Contact form: valid test input produced the demo-only “nothing is sent” state; the form did not claim a delivered message.
- Responsive browser QA: desktop and 390 × 844 mobile layouts and the mobile menu were inspected during the prior visual QA pass. The browser screenshot API failed in this audit, so no new screenshot artifacts were captured here.
- `npm run typecheck`: passed after the final copy and component updates.
- `npm run lint`: passed after the final copy and component updates.
- `npm run build`: passed after the final copy and component updates; 247 static pages were generated.
- No `test` script or test files were found in the frontend package; no automated tests are configured.
- No test script exists in `frontend/package.json`; there is no configured automated test suite to run.

## Remaining issues

1. **Reference comparison remains blocked:** the browser safety policy rejected opening RetailMeNot. No route-by-route competitor claims or visual parity scores are made in this report.
2. **No real offer feed:** visible offers are fictional seed data and the site displays a demo notice. Production needs verified source data before discounts, expiry dates or verification claims can be presented as real.
3. **No merchant logos:** no legitimate logo assets are present. Add them only from an authorized asset source and wire them through the store model with the existing fallback.
4. **No newsletter/contact delivery:** the UI accurately identifies the demo state; production requires a backend endpoint and privacy-consistent processing.
5. **No global autocomplete search:** current GET search filters the selected directory. Cross-entity results and suggestions need a defined search contract and can be added when that behavior is desired.
