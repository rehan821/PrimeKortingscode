import Link from "next/link";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { getPopularStores } from "@/services/stores";
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
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterSection } from "@/components/marketing/NewsletterSection";
import { SparkIcon } from "@/components/ui/icons";

interface HomePageProps {
  locale: Locale;
  dict: Dictionary;
}

/** Homepage — hero search plus the six core discovery sections. */
export async function HomePage({ locale, dict }: HomePageProps) {
  const [stores, categories, coupons, deals, posts] = await Promise.all([
    getPopularStores(8, locale),
    getPopularCategories(8, locale),
    getFeaturedCoupons(6, locale),
    getLatestDeals(6, locale),
    getFeaturedPosts(3, locale),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink-100 bg-brand-50/70">
        <div className="shell mx-auto max-w-4xl py-12 text-center sm:py-16 lg:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-bold text-brand-700">
            <SparkIcon size={14} />
            {dict.home.hero.badge}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {dict.home.hero.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            {dict.home.hero.subtitle}
          </p>

          <SearchForm
            locale={locale}
            dict={dict}
            id="hero-search"
            className="mx-auto mt-7 max-w-xl [&_input]:h-12 [&_input]:bg-white [&_input]:shadow-card"
          />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="font-medium text-ink-500">{dict.home.hero.popular}</span>
            {stores.slice(0, 5).map((store) => (
              <Link
                key={store.id}
                href={pathFor(locale, "store", store.slug)}
                className="rounded-full border border-brand-200 bg-white px-3 py-1 text-sm font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-brand-50"
              >
                {store.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular stores */}
      <section className="shell py-10 sm:py-12" aria-labelledby="home-stores">
        <SectionHeading
          id="home-stores"
          title={dict.home.storesTitle}
          subtitle={dict.home.storesSubtitle}
          href={pathFor(locale, "stores")}
          viewAllLabel={dict.common.viewAll}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} locale={locale} dict={dict} />
          ))}
        </div>
      </section>

      {/* Popular categories */}
      <section className="border-y border-ink-100 bg-ink-50/70" aria-labelledby="home-categories">
        <div className="shell py-10 sm:py-12">
          <SectionHeading
            id="home-categories"
            title={dict.home.categoriesTitle}
            subtitle={dict.home.categoriesSubtitle}
            href={pathFor(locale, "categories")}
            viewAllLabel={dict.common.viewAll}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured coupons */}
      <section className="shell py-10 sm:py-12" aria-labelledby="home-coupons">
        <SectionHeading
          id="home-coupons"
          title={dict.home.couponsTitle}
          subtitle={dict.home.couponsSubtitle}
          href={pathFor(locale, "coupons")}
          viewAllLabel={dict.common.viewAll}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} locale={locale} dict={dict} />
          ))}
        </div>
      </section>

      {/* Latest deals */}
      <section className="shell pb-10 sm:pb-12" aria-labelledby="home-deals">
        <SectionHeading
          id="home-deals"
          title={dict.home.dealsTitle}
          subtitle={dict.home.dealsSubtitle}
          href={pathFor(locale, "deals")}
          viewAllLabel={dict.common.viewAll}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} locale={locale} dict={dict} />
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="border-t border-ink-100 bg-ink-50/70" aria-labelledby="home-blog">
        <div className="shell py-10 sm:py-12">
          <SectionHeading
            id="home-blog"
            title={dict.home.blogTitle}
            subtitle={dict.home.blogSubtitle}
            href={pathFor(locale, "blog")}
            viewAllLabel={dict.common.viewAll}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="shell py-10 sm:py-12" aria-labelledby="home-newsletter">
        <div className="rounded-2xl bg-ink-900 px-6 py-10 text-center sm:px-10">
          <h2 id="home-newsletter" className="text-2xl font-bold text-white">
            {dict.newsletter.title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-300">
            {dict.newsletter.description}
          </p>
          <div className="mt-6 flex justify-center">
            <NewsletterSection dict={dict} />
          </div>
          <p className="mt-3 text-xs text-ink-500">{dict.newsletter.demoHint}</p>
        </div>
      </section>
    </>
  );
}
