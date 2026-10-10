import Link from "next/link";
import Image from "next/image";
import type { CouponWithRelations, DealWithRelations, Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { getPopularStores } from "@/services/stores";
import { getPopularCategories } from "@/services/categories";
import { getFeaturedCoupons } from "@/services/coupons";
import { getLatestDeals } from "@/services/deals";
import { HomeSectionHeading } from "@/components/ui/SectionHeading";
import { HomeHeroCarousel, type HomeHeroItem } from "@/components/home/HomeHeroCarousel";
import { HomeDealRail, type HomeDealRailItem } from "@/components/home/HomeDealRail";
import { HomeOfferCard } from "@/components/home/HomeOfferCard";
import { ArrowRightIcon, SearchIcon, SparkIcon, TagIcon } from "@/components/ui/icons";

interface HomePageProps { locale: Locale; dict: Dictionary; }

type HomeOffer = CouponWithRelations | DealWithRelations;

function offerPath(locale: Locale, offer: HomeOffer) {
  return pathFor(locale, offer.type === "deal" ? "deal" : "coupon", offer.slug);
}

/** Homepage following the reference's centered, image-led editorial rhythm. */
export async function HomePage({ locale, dict }: HomePageProps) {
  const [stores, categories, coupons, deals] = await Promise.all([
    getPopularStores(16, locale),
    getPopularCategories(12, locale),
    getFeaturedCoupons(16, locale),
    getLatestDeals(24, locale),
  ]);

  const allOffers: HomeOffer[] = [...deals, ...coupons];
  const heroItems: HomeHeroItem[] = allOffers.slice(0, 6).map((offer) => ({
    id: offer.id,
    storeName: offer.store.name,
    title: offer.title,
    discountLabel: offer.discountLabel,
    href: offerPath(locale, offer),
    storeHref: pathFor(locale, "store", offer.store.slug),
    brandColor: offer.store.brandColor,
  }));
  const featuredOffers = coupons.slice(0, 3);
  const bigOffers = [...deals.slice(0, 5), ...coupons.slice(0, 5)].slice(0, 10);
  const railDeals: HomeDealRailItem[] = deals.slice(0, 9).map((deal) => ({
    id: deal.id,
    storeName: deal.store.name,
    title: deal.title,
    discountLabel: deal.discountLabel,
    href: pathFor(locale, "deal", deal.slug),
    brandColor: deal.store.brandColor,
  }));
  const topOffers = [...deals.slice(10, 15), ...coupons.slice(3, 8)].slice(0, 10);
  const dealPresenter = deals[0]?.store;

  return (
    <div className="home-page">
      {/* Wide peek carousel, centered like the first screen of the reference. */}
      <div className="overflow-hidden bg-white pb-1 pt-5 sm:pt-6">
        <HomeHeroCarousel
          items={heroItems}
          labels={{
            previous: locale === "nl" ? "Vorige aanbieding" : "Previous offer",
            next: locale === "nl" ? "Volgende aanbieding" : "Next offer",
            view: locale === "nl" ? "Aanbiedingen" : "Featured offers",
          }}
        />
      </div>

      <p className="home-shell py-7 text-center text-sm text-ink-600 sm:py-9">
        {locale === "nl" ? "Als je via links op deze website iets koopt, kunnen wij een commissie ontvangen." : "We may earn a commission when you buy through links on this site."}
      </p>

      {/* Sign-in / sign-up call to action — homepage only. */}
      <div className="home-shell pb-1">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-brand-50 px-5 py-4 text-center sm:flex-row sm:justify-between sm:gap-4 sm:text-left">
          <div>
            <p className="text-[15px] font-bold text-ink-900">
              {locale === "nl" ? "Inloggen of registreren" : "Log in or Sign up"}
            </p>
            <p className="mt-0.5 text-sm text-ink-600">
              {locale === "nl" ? "Bewaar je favoriete winkels en mis geen enkele deal." : "Save your favourite stores and never miss a deal."}
            </p>
          </div>
          <Link
            href={pathFor(locale, "signin")}
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-brand-600 px-6 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            {locale === "nl" ? "Doorgaan" : "Sign up / Log in"}
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <section className="bg-white" aria-labelledby="home-featured">
        <div className="home-shell pb-12 pt-2 sm:pb-16">
          <HomeSectionHeading id="home-featured" title={locale === "nl" ? "De beste kortingscodes en aanbiedingen" : "The Best Coupons, Promo Codes & Cash Back Offers"} href={pathFor(locale, "coupons")} viewAllLabel={dict.common.viewAll} />
          <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
            {featuredOffers.map((coupon, index) => <HomeOfferCard key={coupon.id} offer={coupon} locale={locale} dict={dict} index={index} orientation="horizontal" />)}
          </div>
        </div>
      </section>

      {/* Circular store directory row; rates are omitted because this demo has no cashback feed. */}
      {stores.length > 0 ? <section className="bg-white" aria-labelledby="home-stores-we-love">
        <div className="home-shell py-10 sm:py-14">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.17em] text-brand-700">{locale === "nl" ? "Populaire winkels" : "Popular stores"}</p>
              <h2 id="home-stores-we-love" className="mt-1 text-2xl font-black tracking-tight text-ink-950 sm:text-3xl">{locale === "nl" ? "Winkels waar je graag shopt" : "Stores we love"}</h2>
            </div>
            <Link href={pathFor(locale, "stores")} className="hidden items-center gap-2 border-b border-ink-800 pb-1 text-xs font-extrabold uppercase tracking-[.12em] text-ink-900 hover:text-brand-700 sm:flex">{locale === "nl" ? "Alle winkels" : "All stores"}<ArrowRightIcon size={14} /></Link>
          </div>
          <ul className="grid grid-cols-4 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {stores.slice(0, 8).map((store) => {
              const count = (store.activeCouponCount ?? 0) + (store.activeDealCount ?? 0);
              return <li key={store.id} className="text-center">
                <Link href={pathFor(locale, "store", store.slug)} className="group flex flex-col items-center">
                  <span className="flex size-[4.8rem] items-center justify-center rounded-full border border-ink-300 bg-white p-2 text-center text-[.7rem] font-black leading-tight text-ink-800 shadow-sm transition group-hover:border-brand-500 group-hover:shadow-card sm:size-[6.3rem] lg:size-[8rem] sm:text-xs" style={store.brandColor ? { boxShadow: `inset 0 -4px 0 ${store.brandColor}` } : undefined}>
                    <span className="line-clamp-3">{store.name}</span>
                  </span>
                  <span className="mt-2 text-xs font-bold text-ink-700 group-hover:text-brand-700">{store.name}</span>
                  <span className="mt-0.5 text-xs text-ink-500">{count} {locale === "nl" ? "aanbiedingen" : "offers"}</span>
                </Link>
              </li>;
            })}
          </ul>
        </div>
      </section> : null}

      {/* Original editorial promo: uses a drawn coupon illustration, not a fake video. */}
      <section className="bg-white" aria-labelledby="home-how-to-save">
        <div className="home-shell py-11 sm:py-16">
          <div className="grid overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card lg:grid-cols-[1.35fr_1fr]">
            <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden bg-[#e8f3f1] p-8 sm:min-h-[440px] lg:min-h-[520px]">
              <Image src="/images/home/editorial-video.webp" alt="Retailers sharing offers and shopping ideas" fill sizes="(min-width: 1024px) 58vw, 100vw" className="absolute inset-0 object-cover" />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand-700">{locale === "nl" ? "Slim besparen" : "A smarter way to save"}</p>
              <h2 id="home-how-to-save" className="mt-3 text-3xl font-black leading-tight text-ink-950 sm:text-4xl">{locale === "nl" ? "Zo vind je een passende aanbieding" : "Find an offer that fits"}</h2>
              <p className="mt-4 text-base leading-7 text-ink-600">{locale === "nl" ? "Bekijk de voorwaarden, kies een kortingscode of deal en ga daarna naar de winkel om je aankoop af te ronden." : "Review the terms, choose a coupon or deal, then visit the store to complete your purchase."}</p>
              <Link href={pathFor(locale, "deals")} className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-brand-800">{locale === "nl" ? "Bekijk deals" : "Browse deals"}<ArrowRightIcon size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Wide seasonal-style banner, adapted to the site's own identity and current demo. */}
      <section className="home-shell pb-12 sm:pb-16" aria-label={locale === "nl" ? "Ontdek het aanbod" : "Explore the offers"}>
        <div className="relative flex min-h-[130px] items-center justify-center overflow-hidden rounded-xl bg-[#1b145a] px-6 py-8 text-center text-white shadow-card sm:min-h-[165px]">
          <span aria-hidden="true" className="absolute -left-8 top-1/2 size-36 -translate-y-1/2 rounded-full border-[20px] border-white/10" />
          <span aria-hidden="true" className="absolute -right-8 top-1/2 size-36 -translate-y-1/2 rounded-full border-[20px] border-white/10" />
          <div className="relative flex flex-col items-center gap-3 sm:flex-row sm:gap-8">
            <h2 className="text-2xl font-black uppercase tracking-[.06em] sm:text-4xl">{locale === "nl" ? "Dit seizoen slim besparen" : "Make this season a little smarter"}</h2>
            <Link href={pathFor(locale, "deals")} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-brand-800 transition hover:bg-brand-50">{locale === "nl" ? "Ontdek deals" : "Explore deals"}<ArrowRightIcon size={15} /></Link>
          </div>
        </div>
      </section>

      {/* Five-column, two-row merchant card section like the repeated deal grids in the reference. */}
      {bigOffers.length > 0 ? <section className="bg-white" aria-labelledby="home-big-deals">
        <div className="home-shell pb-12 sm:pb-16">
          <HomeSectionHeading id="home-big-deals" title={locale === "nl" ? "Grote aanbiedingen" : "Big Fall Deals"} href={pathFor(locale, "deals")} viewAllLabel={locale === "nl" ? "Alle aanbiedingen" : "All big fall deals"} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {bigOffers.slice(0, 5).map((offer, index) => <HomeOfferCard key={`big-${offer.id}`} offer={offer} locale={locale} dict={dict} index={index + 1} showAction={false} />)}
          </div>
          {bigOffers.length > 5 ?
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {bigOffers.slice(5, 10).map((offer, index) => <HomeOfferCard key={`big-${offer.id}`} offer={offer} locale={locale} dict={dict} index={index + 6} />)}
            </div>
          : null}
        </div>
      </section> : null}

      {/* Editorial feature block: the large story tile and three compact side stories follow the reference. */}
      <section className="home-shell py-10 sm:py-14" aria-labelledby="home-real-deal">
        <div className="overflow-hidden rounded-[1.75rem] bg-[#edf9fa] p-5 sm:p-8 lg:p-10">
          <div className="mb-7 text-center sm:mb-9">
            <p className="inline-block rounded-full bg-[#c9f3f5] px-6 py-2 text-xs font-black uppercase tracking-[.18em] text-brand-700">The Real Deal</p>
            <p className="mt-1 text-[11px] font-bold text-brand-700">by PrimeKortingscode</p>
          </div>
          <div className="grid gap-7 lg:grid-cols-[1.8fr_1fr] lg:gap-10">
            <div>
              <Link href={pathFor(locale, "deals")} className="group relative flex min-h-[340px] overflow-hidden rounded-[1.75rem] bg-[#f6dfb9] p-7 text-center sm:min-h-[450px] sm:p-10 lg:min-h-[500px]">
                <span aria-hidden="true" className="absolute -left-10 -top-12 size-64 rounded-full border-[32px] border-[#e9b768]/40" />
                <span aria-hidden="true" className="absolute -bottom-24 -right-14 size-80 rounded-full bg-[#edc178]/45" />
                <span aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(#ad6839 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                <span className="relative m-auto max-w-3xl text-[#432a1e]">
                  <span className="block text-xs font-black uppercase tracking-[.18em] text-[#8b451f] sm:text-base">Seasonal shopping guide</span>
                  <span id="home-real-deal" className="mt-5 block text-5xl font-black uppercase leading-[.95] tracking-[-.05em] sm:text-7xl lg:text-8xl">The Real<br />Deals</span>
                  <span className="mx-auto mt-5 block max-w-xl text-sm leading-6 sm:text-lg sm:leading-8">Fresh picks, useful finds and offers worth a closer look.</span>
                  <span className="mt-6 inline-flex rounded-full bg-[#1b1722] px-6 py-3 text-xs font-black uppercase tracking-[.12em] text-white transition group-hover:bg-brand-700">Explore the edit</span>
                </span>
              </Link>
              <p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-ink-800">The seasonal edit</p>
              <h3 className="mt-1 text-xl font-black text-ink-950">Top picks for smarter shopping</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">A hand-picked collection of timely finds, store offers and savings ideas.</p>
            </div>
            <div className="flex flex-col justify-between gap-4">
              {[
                { title: "Seasonal style", text: "Fresh finds for the new season", tone: "bg-[#17675f]", mark: "STYLE" },
                { title: "Tech worth a look", text: "Useful upgrades at better prices", tone: "bg-[#155987]", mark: "TECH" },
                { title: "Gifts made easy", text: "Ideas for everyone on your list", tone: "bg-[#db8795]", mark: "GIFT" },
              ].map((story) => <Link key={story.title} href={pathFor(locale, "deals")} className="group flex min-h-28 items-center gap-5 rounded-2xl transition hover:bg-white/70">
                <span className={`flex size-28 shrink-0 items-center justify-center rounded-2xl ${story.tone} text-xs font-black tracking-[.2em] text-white shadow-card`}>{story.mark}</span>
                <span><span className="block text-xs font-black uppercase tracking-[.08em] text-ink-900">{story.title}</span><span className="mt-2 block text-sm leading-6 text-ink-600">{story.text}</span></span>
              </Link>)}
            </div>
          </div>
        </div>
      </section>

      {/* Top-deals horizontal product rail */}
      {railDeals.length > 0 ? <section className="bg-white" aria-labelledby="home-today-deals">
        <div className="home-shell py-10 sm:py-14">
          <div className="mb-6 flex items-center gap-4 sm:mb-8">
            <div className="flex size-[4.6rem] shrink-0 items-center justify-center rounded-full bg-ink-950 p-2 text-center text-xs font-black leading-tight text-white sm:size-[5.5rem]">{dealPresenter?.name ?? (locale === "nl" ? "Deals" : "Deals")}</div>
            <div className="min-w-0 flex-1">
              <h2 id="home-today-deals" className="text-2xl font-black text-ink-950 sm:text-3xl">{locale === "nl" ? "De beste deals van vandaag" : "Today's Top Deals"}</h2>
              <p className="mt-1 text-xs font-bold uppercase tracking-[.11em] text-ink-500">{locale === "nl" ? "Uitgelichte aanbiedingen" : "Featured offers"}</p>
            </div>
            <Link href={pathFor(locale, "deals")} className="hidden shrink-0 rounded-full border border-ink-900 px-5 py-3 text-sm font-extrabold text-ink-900 transition hover:bg-ink-900 hover:text-white sm:inline-flex">{locale === "nl" ? "Meer deals" : "View more deals"}</Link>
          </div>
          <HomeDealRail items={railDeals} locale={locale} />
        </div>
      </section> : null}

      {/* Dense offer grid and popular links */}
      {topOffers.length > 0 ? <section className="bg-white" aria-labelledby="home-top-deals">
        <div className="home-shell py-10 sm:py-14">
          <HomeSectionHeading id="home-top-deals" title={locale === "nl" ? "Populaire deals en kortingscodes" : "Top Deals"} href={pathFor(locale, "coupons")} viewAllLabel={dict.common.viewAll} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {topOffers.slice(0, 5).map((offer, index) => <HomeOfferCard key={`top-${offer.id}`} offer={offer} locale={locale} dict={dict} index={index + 2} showAction={false} />)}
          </div>
          {topOffers.length > 5 ?
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {topOffers.slice(5, 10).map((offer, index) => <HomeOfferCard key={`top-${offer.id}`} offer={offer} locale={locale} dict={dict} index={index + 7} />)}
            </div>
          : null}
        </div>
      </section> : null}

      {/* Accordion link directories */}
      <section className="bg-white" aria-label={locale === "nl" ? "Winkels en categorieën" : "Stores and categories"}>
        <div className="home-shell py-3 sm:py-7">
          <details className="group border-b border-ink-200 py-3 sm:py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-sm font-extrabold uppercase tracking-[.08em] text-ink-900 marker:hidden">
              {locale === "nl" ? "Populaire categorieën" : "Popular categories"}<span aria-hidden="true" className="text-2xl font-normal"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span></span>
            </summary>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 pb-2 sm:mt-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3 sm:pb-3 lg:grid-cols-4">
              {categories.map((category) => <li key={category.id}><Link href={pathFor(locale, "category", category.slug)} className="flex min-h-9 items-center gap-1.5 py-1 text-sm leading-5 text-ink-700 hover:text-brand-700"><span>{category.name}</span><ArrowRightIcon size={12} /></Link></li>)}
            </ul>
          </details>
          <details open className="group border-b border-ink-200 py-3 sm:py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-sm font-extrabold uppercase tracking-[.08em] text-ink-900 marker:hidden">
              {locale === "nl" ? "Populaire winkels" : "Popular stores"}<span aria-hidden="true" className="text-2xl font-normal"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span></span>
            </summary>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 pb-2 sm:mt-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3 sm:pb-3 lg:grid-cols-5">
              {stores.slice(0, 25).map((store) => <li key={store.id}><Link href={pathFor(locale, "store", store.slug)} className="flex min-h-9 items-center py-1 text-sm leading-5 text-ink-700 hover:text-brand-700">{store.name}</Link></li>)}
            </ul>
          </details>
        </div>
      </section>

      {/* Clear, truthful explanation of the available tools */}
      <section className="bg-white" aria-labelledby="home-saving-tools">
        <div className="home-shell py-12 sm:py-16">
          <h2 id="home-saving-tools" className="text-2xl font-black text-ink-950 sm:text-3xl">{locale === "nl" ? "3 manieren om een aanbieding te vinden" : "3 ways to find an offer"}</h2>
          <div className="mt-7 grid gap-7 md:grid-cols-3 md:gap-8">
            <div className="flex gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#d8f6f4] text-brand-800"><TagIcon size={23} /></span><div><h3 className="font-extrabold uppercase tracking-wide text-ink-900">{locale === "nl" ? "Kortingscodes" : "Coupons"}</h3><p className="mt-1 text-sm leading-6 text-ink-600">{locale === "nl" ? "Bekijk een code en controleer de voorwaarden bij de winkel." : "Reveal a code and review the store’s terms."}</p><Link href={pathFor(locale, "coupons")} className="mt-3 inline-block text-xs font-extrabold uppercase tracking-wide text-ink-900 underline underline-offset-4">{locale === "nl" ? "Bekijk codes" : "Browse coupons"}</Link></div></div>
            <div className="flex gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800"><SparkIcon size={23} /></span><div><h3 className="font-extrabold uppercase tracking-wide text-ink-900">{locale === "nl" ? "Deals" : "Deals"}</h3><p className="mt-1 text-sm leading-6 text-ink-600">{locale === "nl" ? "Ga rechtstreeks naar een aanbieding bij de winkel." : "Go directly to an offer at the store."}</p><Link href={pathFor(locale, "deals")} className="mt-3 inline-block text-xs font-extrabold uppercase tracking-wide text-ink-900 underline underline-offset-4">{locale === "nl" ? "Bekijk deals" : "Browse deals"}</Link></div></div>
            <div className="flex gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#fcead8] text-accent-700"><SearchIcon size={23} /></span><div><h3 className="font-extrabold uppercase tracking-wide text-ink-900">{locale === "nl" ? "Winkels" : "Stores"}</h3><p className="mt-1 text-sm leading-6 text-ink-600">{locale === "nl" ? "Bekijk alle beschikbare codes en deals per winkel." : "Browse available coupons and deals by store."}</p><Link href={pathFor(locale, "stores")} className="mt-3 inline-block text-xs font-extrabold uppercase tracking-wide text-ink-900 underline underline-offset-4">{locale === "nl" ? "Ontdek winkels" : "Explore stores"}</Link></div></div>
          </div>
        </div>
      </section>

      <section className="bg-white" aria-labelledby="home-faq">
        <div className="home-shell py-11 sm:py-14">
          <h2 id="home-faq" className="mb-4 text-2xl font-black text-ink-950 sm:text-3xl">{locale === "nl" ? "Veelgestelde vragen" : "Frequently asked questions"}</h2>
          <details className="group border-b border-ink-200 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold text-ink-900 marker:hidden">
              <span>{locale === "nl" ? "Hoe gebruik ik een kortingscode?" : "How do I use a coupon code?"}</span>
              <span aria-hidden="true" className="shrink-0 text-2xl font-normal leading-none">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-ink-600">{locale === "nl" ? "Open de code, kopieer deze en vul hem in tijdens het afrekenen bij de winkel. De voorwaarden van de winkel zijn leidend." : "Reveal and copy the code, then enter it at checkout. The store’s terms apply."}</p>
          </details>
          <details className="group border-b border-ink-200 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold text-ink-900 marker:hidden">
              <span>{locale === "nl" ? "Wat is het verschil tussen een kortingscode en een deal?" : "What is the difference between a coupon and a deal?"}</span>
              <span aria-hidden="true" className="shrink-0 text-2xl font-normal leading-none">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-ink-600">{locale === "nl" ? "Een kortingscode vul je meestal zelf in bij het afrekenen. Een deal brengt je direct naar een aanbieding bij de winkel." : "A coupon is usually entered at checkout. A deal takes you directly to an offer at the store."}</p>
          </details>
          <details className="group border-b border-ink-200 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold text-ink-900 marker:hidden">
              <span>{locale === "nl" ? "Zijn de aanbiedingen op deze website live?" : "Are the offers on this website live?"}</span>
              <span aria-hidden="true" className="shrink-0 text-2xl font-normal leading-none">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-ink-600">{locale === "nl" ? "Dit is een demo-website met fictieve aanbiedingen. De winkel bepaalt altijd de beschikbaarheid en voorwaarden." : "This is a demo website with fictional offers. The store always controls availability and terms."}</p>
          </details>
        </div>
      </section>

      <section className="bg-white" aria-label={locale === "nl" ? "Over deze website" : "About this website"}>
        <div className="home-shell py-8 sm:py-10">
          <p className="max-w-5xl text-sm leading-6 text-ink-600">{locale === "nl" ? "PrimeKortingscode helpt je winkels, kortingscodes en aanbiedingen overzichtelijk te bekijken. Vergelijk de beschikbare informatie en lees de voorwaarden voordat je bij een winkel afrekent. Deze demo gebruikt fictieve gegevens; controleer aanbiedingen altijd bij de winkel." : "PrimeKortingscode helps you browse stores, coupons and deals in one place. Compare the available information and review the terms before checking out with a store. This demo uses fictional data; always confirm offers with the store."}</p>
        </div>
      </section>
    </div>
  );
}
