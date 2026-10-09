import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { getPopularStores, getStores } from "@/services/stores";
import { getPopularCategories } from "@/services/categories";
import { getFeaturedCoupons } from "@/services/coupons";
import { getLatestDeals } from "@/services/deals";
import { getFeaturedPosts } from "@/services/blog";
import { SearchForm } from "@/components/search/SearchForm";
import { StoreCard } from "@/components/store/StoreCard";
import { CategoryCard } from "@/components/category/CategoryCard";
import { CouponCard } from "@/components/coupon/CouponCard";
import { DealCard } from "@/components/coupon/DealCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { HomeSectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterSection } from "@/components/marketing/NewsletterSection";
import { ArrowRightIcon } from "@/components/ui/icons";

interface HomePageProps { locale: Locale; dict: Dictionary; }

/** Homepage — editorial search hero followed by distinct shopping departments. */
export async function HomePage({ locale, dict }: HomePageProps) {
  const [stores, latestStores, categories, coupons, deals, posts] = await Promise.all([
    getPopularStores(8, locale),
    getStores({ locale, perPage: 100 }),
    getPopularCategories(8, locale),
    getFeaturedCoupons(6, locale),
    getLatestDeals(6, locale),
    getFeaturedPosts(3, locale),
  ]);
  const feature = posts[0];
  const recentlyUpdatedStores = [...latestStores.items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);

  return (
    <>
      <section className="hero-band border-b border-ink-200">
        <div className="shell py-7 sm:py-10 lg:py-12">
          <div className="grid items-center gap-7 lg:grid-cols-[1.12fr_.88fr] lg:gap-12">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-700">{dict.home.hero.badge}</p>
              <h1 className="mt-3 max-w-xl text-[2rem] font-black leading-[1.08] tracking-[-.04em] text-ink-950 sm:text-4xl lg:text-[3.2rem]">
                {dict.home.hero.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink-600 sm:text-base">{dict.home.hero.subtitle}</p>
              <SearchForm locale={locale} dict={dict} id="hero-search" variant="hero" className="mt-5 max-w-xl" />
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-ink-500">{dict.home.hero.popular}</span>
                {stores.slice(0, 4).map((store) => (
                  <Link key={store.id} href={pathFor(locale, "store", store.slug)} className="rounded-full border border-ink-200 bg-white px-3 py-1.5 font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700">{store.name}</Link>
                ))}
              </div>
            </div>

            {feature ? (
              <Link href={pathFor(locale, "post", feature.slug)} aria-label={feature.title} className="group relative aspect-[2/1] overflow-hidden rounded-xl bg-ink-900 shadow-pop">
                {feature.coverImage ? <Image src={feature.coverImage} alt="" fill priority sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" /> : null}
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white px-5 py-3 text-sm font-bold text-brand-800 sm:px-6">
                  <span>{feature.category ?? dict.home.blogTitle}</span>
                  <span className="inline-flex items-center gap-2">{dict.buttons.readMore}<ArrowRightIcon size={16} /></span>
                </span>
              </Link>
            ) : (
              <div className="flex min-h-64 items-end rounded-xl bg-brand-800 p-7 text-white"><p className="text-2xl font-bold">{dict.home.hero.title}</p></div>
            )}
          </div>
        </div>
      </section>

      {stores.length > 0 ? <section className="bg-white" aria-labelledby="home-stores">
        <div className="shell py-8 sm:py-10">
          <HomeSectionHeading id="home-stores" title={dict.home.storesTitle} subtitle={dict.home.storesSubtitle} href={pathFor(locale, "stores")} viewAllLabel={dict.common.viewAll} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {stores.map((store) => <StoreCard key={store.id} store={store} locale={locale} dict={dict} />)}
          </div>
        </div>
      </section> : null}

      {coupons.length > 0 ? <section className="bg-ink-50" aria-labelledby="home-coupons">
        <div className="shell py-9 sm:py-12">
          <HomeSectionHeading id="home-coupons" title={dict.home.couponsTitle} subtitle={dict.home.couponsSubtitle} href={pathFor(locale, "coupons")} viewAllLabel={dict.common.viewAll} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.slice(0, 6).map((coupon) => <CouponCard key={coupon.id} coupon={coupon} locale={locale} dict={dict} />)}
          </div>
        </div>
      </section> : null}

      {deals.length > 0 ? <section className="bg-white" aria-labelledby="home-deals">
        <div className="shell py-9 sm:py-12">
          <HomeSectionHeading id="home-deals" title={dict.home.dealsTitle} subtitle={dict.home.dealsSubtitle} href={pathFor(locale, "deals")} viewAllLabel={dict.common.viewAll} />
          <div className="grid gap-3 lg:grid-cols-2">
            {deals.slice(0, 4).map((deal) => <DealCard key={deal.id} deal={deal} locale={locale} dict={dict} />)}
          </div>
        </div>
      </section> : null}

      {categories.length > 0 ? <section className="bg-brand-50" aria-labelledby="home-categories">
        <div className="shell py-9 sm:py-12">
          <HomeSectionHeading id="home-categories" title={dict.home.categoriesTitle} subtitle={dict.home.categoriesSubtitle} href={pathFor(locale, "categories")} viewAllLabel={dict.common.viewAll} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => <CategoryCard key={category.id} category={category} locale={locale} dict={dict} />)}
          </div>
        </div>
      </section> : null}

      {latestStores.items.length > 0 ? <section className="bg-white" aria-labelledby="home-recent-stores">
        <div className="shell py-9 sm:py-12">
          <HomeSectionHeading id="home-recent-stores" title={locale === "nl" ? "Recent bijgewerkte winkels" : "Recently updated stores"} subtitle={locale === "nl" ? "Bekijk winkelpagina’s die het laatst zijn bijgewerkt." : "Browse the store pages updated most recently."} href={pathFor(locale, "stores")} viewAllLabel={dict.common.viewAll} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {recentlyUpdatedStores.map((store) => <StoreCard key={store.id} store={store} locale={locale} dict={dict} showUpdatedAt />)}
          </div>
        </div>
      </section> : null}

      {posts.length > 0 ? <section className="bg-ink-50" aria-labelledby="home-blog">
        <div className="shell py-9 sm:py-12">
          <HomeSectionHeading id="home-blog" title={dict.home.blogTitle} subtitle={dict.home.blogSubtitle} href={pathFor(locale, "blog")} viewAllLabel={dict.common.viewAll} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <BlogCard key={post.id} post={post} locale={locale} dict={dict} />)}</div>
        </div>
      </section> : null}

      <section className="bg-brand-900" aria-labelledby="home-newsletter">
        <div className="shell py-10 sm:py-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-brand-200">{dict.newsletter.eyebrow ?? dict.home.hero.badge}</p>
            <h2 id="home-newsletter" className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">{dict.newsletter.title}</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-brand-100/80">{dict.newsletter.description}</p>
            <div className="mt-6 flex justify-center"><NewsletterSection dict={dict} /></div>
            <p className="mt-3 text-xs text-brand-200/75">{dict.newsletter.demoHint}</p>
          </div>
        </div>
      </section>
    </>
  );
}
