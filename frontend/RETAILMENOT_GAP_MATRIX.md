# PrimeKortingscode reference audit and implementation matrix

**Audit date:** 2026-10-09

**Scope:** Existing public PrimeKortingscode page templates, Dutch and English routes, shared interactions, SEO endpoints, and desktop/mobile behavior.

## Evidence and limits

The named Bandicam recording was found at `C:\Users\User\Documents\Bandicam\bandicam 2026-10-09 11-04-55-496.mp4`. OpenCV reports a duration of 232.83 seconds, 1920 × 1200 resolution, and 24.76 fps. I sampled frames every eight seconds, reviewed the contact sheet and inspected key frames individually. The contact sheet is saved at [`reference/retailmenot-contact-sheet.jpg`](../reference/retailmenot-contact-sheet.jpg). The live RetailMeNot URL itself could not be opened by the web browser, so details beyond the supplied recording remain unverified.

### Recording inventory

The recording shows the RetailMeNot homepage, navigation hover states, and several inner-page visits. Homepage content appears in this order: dark seasonal message strip; purple main navigation with search; light promotional ticker; wide featured-offer carousel; “The Best Coupons, Promo Codes & Cash Back Offers” feature cards; “What to Buy in October” banner; Big Fall Deals merchant cards in five columns and two rows; Top Deals cards in the same dense format; Popular Categories; editorial/video promotional modules; long category and merchant link groups; purple multi-column footer. The header hover states expose menus for stores, categories and editorial links.

A Beauty and Personal Care category page shows a large heading and all-caps descriptor, then a left-side explanation/link column beside product/deal cards and a horizontal featured-offer rail. The video also shows a BabyQuip coupon/store page with offer rows and reveal buttons, and a Fall Deals listing with a pink banner and travel-deal cards. Blog templates appear in the recording but are explicitly out of scope for this implementation; their existing routes and components were left untouched.

PrimeKortingscode uses fictional seed offers and displays a global demo notice. The implementation borrows the reference's layout patterns while keeping PrimeKortingscode's own brand and existing data. No sample offer should be treated as a live discount or verification claim, and no merchant logo assets were available in the project.

## Page-template matrix

| Template / reference URL | PrimeKortingscode routes (NL / EN) | Local layout and behavior observed | Material gap / action | Files and status |
|---|---|---|---|---|
| Shared header, nav, search, language switch | Every route; language switch maps equivalent routes | Dark demo strip, purple bar with brand/nav/search/language controls, and a light offer ticker. Mobile menu retains search, links and locale switch. Search remains a GET form. | The clip shows a purple one-row navigation, store/category hover menus and a promo ticker. Cross-site autocomplete is not shown; existing search remains scoped to stores. | `components/layout/{Header,Logo,NavLinks,MobileNav,LanguageSwitcher}.tsx`, `components/search/SearchForm.tsx`, `app/globals.css` — revised and locally inspected; mobile menu was exercised in the prior visual QA pass. |
| Homepage (`https://www.retailmenot.com/`) | `/` / `/en` | Wide centered offer carousel; commission note; featured offer cards; circular store directory; editorial promo; seasonal banner; five-column offer grids; horizontal deal rail; accordion link directories; save-guide and FAQ sections. | Rebuilt in the same full-page order and spacing rhythm using PrimeKortingscode copy, route-aware actions, and original CSS artwork. Product photography, cashback rates and merchant logos are not available in the local demo data. | `features/home/HomePage.tsx`, `components/home/{HomeHeroCarousel,HomeDealRail,HomeOfferCard}.tsx` — rebuilt and rendered locally. |
| Store directory | `/winkels` / `/en/stores` | Search, A–Z filter, sort links, responsive store grid, pagination and empty state. | Reference directory presentation and filter behavior unverified. Merchant-logo asset coverage is absent; current store model uses names, initials and brand colors rather than fabricated logos. | `features/stores/StoresPage.tsx`, `components/store/{StoreCard,StoreLogo}.tsx`, `components/common/{ListControls,Pagination}.tsx` — revised/retained; local listing inspected. |
| Store detail | `/winkels/[slug]` / `/en/stores/[slug]` | Breadcrumb and title/count header, circular text identity, left description/count/popular-store sidebar, and one vertical list of horizontal coupon/deal rows with reveal or merchant actions and terms. FAQ remains below. | Matches the BabyQuip hierarchy in the recording. Merchant logo art and live offers are not available in the local project. | `features/stores/StoreDetailPage.tsx`, `components/coupon/MerchantOfferRow.tsx` — revised; bol.com detail rendered locally. |
| Category directory | `/categorieen` / `/en/categories` | Search, sort, responsive category cards and pagination/empty state. | Reference category navigation and imagery unverified. | `features/categories/CategoriesPage.tsx`, `components/category/{CategoryCard,CategoryIcon}.tsx` — shared design applied. |
| Category detail | `/categorieen/[slug]` / `/en/categories/[slug]` | Breadcrumb and heading, left about/related-category column, top featured offer rows, then merchant, coupon and deal sections on the right at desktop widths. | Follows the side-column composition and featured offer sequence shown in the recording; mobile stacks the column above the offers. Product photography is unavailable locally. | `features/categories/CategoryDetailPage.tsx`, `components/coupon/MerchantOfferRow.tsx`, category/store/offer cards — revised; `/categorieen/mode` inspected locally. |
| Coupon directory | `/kortingscodes` / `/en/coupons` | Instruction panel, query search, sort links, branded merchant offer cards, pagination and empty state. Reveal opens the code modal with copy, merchant link and terms. | Card hierarchy now emphasizes merchant color band, discount, offer title and CTA. Search remains scoped to coupons. | `features/coupons/CouponsPage.tsx`, `components/coupon/{CouponCard,CouponModal,GetCodeButton,CouponRevealButton,CopyCodeButton}.tsx` — revised; NL and EN listings rendered locally. |
| Coupon detail | `/kortingscodes/[slug]` / `/en/coupons/[slug]` | Breadcrumb, merchant, expiry, discount, description, reveal CTA, terms and related coupons/empty state. Copy and safe outbound redirect components are preserved. | Reference detail layout and offer states unverified. No real usage counts or trust data are shown. | `features/coupons/CouponDetailPage.tsx`, coupon components — revised; multiple detail routes were inspected in the previous local QA pass. |
| Deals directory | `/deals` / `/en/deals` | Pink title banner, horizontal category tabs, search, sort links, three-column deal cards, pagination and empty state. Deal CTA remains a safe outbound link with store fallback for invalid destinations. | Follows the banner/tabs/offer sequence from the Fall Deals page; season-specific editorial text and travel photography are unavailable locally. | `features/deals/DealsPage.tsx`, `components/coupon/DealCard.tsx`, `GetDealButton.tsx` — revised; async results rendered locally. |
| Deal detail | `/deals/[slug]` / `/en/deals/[slug]` | Breadcrumb, offer and expiry summary, merchant CTA, terms and related deals/empty state. | Reference deal-detail hierarchy unverified. | `features/deals/DealDetailPage.tsx`, deal components — revised; `/deals/bol-com-dagdeals` inspected locally. |
| Blog listing | `/blog` / `/en/blog` | Editorial cards with local cover images, article metadata and pagination/empty state. | Reference editorial modules and tag controls unverified; current tags are query links on articles, with no listing tag selector. | `features/blog/BlogPage.tsx`, `components/blog/BlogCard.tsx` — revised; local listing inspected. |
| Blog article | `/blog/[slug]` / `/en/blog/[slug]` | Breadcrumb, article content, metadata/tags, related articles and return-to-blog link. | Reference reading layout, author treatment and related-story modules unverified. | `features/blog/PostDetailPage.tsx`, `components/blog/BlogCard.tsx` — retained/revised; article rendered locally. |
| Contact | `/contact` / `/en/contact` | Contact details and validated contact form. Client validation is available; there is no sending backend. | Reference contact options unverified. Backend submission cannot be implemented honestly without a configured endpoint. The UI now reports demo-only behavior rather than claiming a successful send. | `features/pages/ContactPage.tsx`, `components/marketing/ContactForm.tsx` — demo state corrected. |
| Privacy policy | `/privacybeleid` / `/en/privacy` | Structured policy sections and shared shell. Copy now reflects that this demo does not submit or store form data, and distinguishes app behavior from hosting/external-store behavior. | Reference policy content/structure unverified. The production administrator must review and replace demo/host-specific statements with the actual deployed data practices. | `features/pages/PrivacyPage.tsx`, `i18n/{nl,en}.json` — policy copy aligned to current demo behavior. |
| Localized not-found / global 404 | Unknown local URL / unknown English URL | Locale-aware not-found page plus global fallback. | Reference error page is unverified. | `app/[locale]/not-found.tsx`, `app/global-not-found.tsx` — route behavior preserved. |
| Crawler endpoints | `/sitemap.xml`, `/robots.txt` | Sitemap enumerates public NL/EN list and detail routes with language alternates; robots points to sitemap and excludes internal `/nl`. | Reference crawler policy is outside visual comparison and unverified. | `app/sitemap.ts`, `app/robots.ts`, `lib/routes.ts`, `next.config.ts` — preserved. |

## Implementation and preserved behavior

- Added the reference's purple navigation, dark demo strip, light ticker, centered homepage carousel, editorial offer sections, horizontal merchant offer rows, pink deals banner/tabs, and purple footer while retaining PrimeKortingscode branding.
- Reworked store details into a sidebar and stacked offer rows, and category details into a left description/related-category column beside featured offers and merchant cards.
- Blog listing and article components were intentionally left untouched. Existing blog URLs remain available; no new blog page work was part of this pass.
- Retained Dutch root routes, English `/en` routes, canonical/hreflang metadata, robots.txt, sitemap, services/data contracts, GET search, sorting, filters, pagination, coupon reveal/copy, terms disclosures, safe outbound links and FAQ disclosures.
- Merchant names use the available text and brand-color data. No merchant logo assets were present, so no logos were fabricated.
- The global demo notice remains visible; offers and expiry dates are mock data. The redesign does not add verification badges, usage counts, cashback figures or trust statistics.

## Files changed in this redesign

- **Design and shell:** `app/globals.css`, `components/ui/button.ts`, `components/ui/SectionHeading.tsx`, `components/layout/{Footer,Header,NavLinks,PageHeader}.tsx`, `components/search/SearchForm.tsx`.
- **Offer/store presentation:** `components/coupon/{CouponCard,DealCard,GetDealButton,CouponRevealButton}.tsx`, `components/store/{StoreCard,StoreLogo}.tsx`.
- **Page templates:** `features/home/HomePage.tsx`, `features/categories/CategoryDetailPage.tsx`, `features/deals/DealsPage.tsx`, `features/stores/StoreDetailPage.tsx`, `features/coupons/CouponDetailPage.tsx`, `features/deals/DealDetailPage.tsx`.
- **Reference record:** `reference/retailmenot-contact-sheet.jpg`, this audit matrix.

## Verification record

- Inspected the 232.83-second recording (1920 × 1200, 24.76 fps) with an eight-second sampling interval and individual full-resolution frames. The supplied video was the primary reference. Direct live-site comparison remains unavailable because the RetailMeNot URL could not be opened.
- Rendered the homepage at a 1280-pixel desktop viewport and at the available narrow mobile viewport. Also rendered `/categorieen/mode`, `/kortingscodes`, `/kortingscodes/zalando-15-procent-korting`, and `/winkels/zalando`. The coupon reveal opened and displayed its code.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; Next.js generated 247 static pages and retained the Dutch/English route families, including blog URLs.
- `frontend/package.json` has no test script, so no automated test suite was available.

## Remaining limitations

1. Direct comparison against the live RetailMeNot website remains unavailable; the supplied recording covers the homepage and selected inner pages only.
2. Store/deal/coupon records remain fictional demo data. Production requires a verified offer feed before showing real prices, discount claims, expiry or verification states.
3. No merchant logo assets are available in the project. Text names and brand colors remain the honest fallback.
4. Newsletter/contact forms do not transmit data; production delivery requires a backend endpoint.
5. Search remains scoped to the selected directory and has no global autocomplete.
