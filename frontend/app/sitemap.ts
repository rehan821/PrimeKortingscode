import type { MetadataRoute } from "next";
import type { Locale } from "@/types";
import { siteUrl } from "@/config/site";
import { pathFor, type RouteKey } from "@/lib/routes";
import { getStoreSlugs } from "@/services/stores";
import { getCategorySlugs } from "@/services/categories";
import { getCouponSlugs } from "@/services/coupons";
import { getDealSlugs } from "@/services/deals";
import { getPostSlugs } from "@/services/blog";

const LOCALES: Locale[] = ["nl", "en"];
const LIST_KEYS: RouteKey[] = [
  "home",
  "stores",
  "categories",
  "coupons",
  "deals",
  "blog",
  "contact",
  "privacy",
];

const PRIORITY: Partial<Record<RouteKey, number>> = {
  home: 1,
  stores: 0.9,
  categories: 0.9,
  coupons: 0.9,
  deals: 0.9,
  blog: 0.7,
  contact: 0.3,
  privacy: 0.3,
};

function alternatesFor(key: RouteKey, slug?: string) {
  return {
    languages: Object.fromEntries(
      LOCALES.map((locale) => [locale, siteUrl(pathFor(locale, key, slug))]),
    ),
  };
}

/** Fully static sitemap covering every public URL in both locales. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stores, categories, coupons, deals, postsNl, postsEn] = await Promise.all([
    getStoreSlugs(),
    getCategorySlugs(),
    getCouponSlugs(),
    getDealSlugs(),
    getPostSlugs("nl"),
    getPostSlugs("en"),
  ]);
  const posts = [...new Set([...postsNl, ...postsEn])];

  const entries: MetadataRoute.Sitemap = [];

  for (const key of LIST_KEYS) {
    for (const locale of LOCALES) {
      entries.push({
        url: siteUrl(pathFor(locale, key)),
        changeFrequency: key === "home" ? "hourly" : "daily",
        priority: PRIORITY[key] ?? 0.5,
        alternates: alternatesFor(key),
      });
    }
  }

  const detailGroups: Array<{ key: RouteKey; slugs: string[] }> = [
    { key: "store", slugs: stores },
    { key: "category", slugs: categories },
    { key: "coupon", slugs: coupons },
    { key: "deal", slugs: deals },
    { key: "post", slugs: posts },
  ];

  for (const { key, slugs } of detailGroups) {
    for (const locale of LOCALES) {
      for (const slug of slugs) {
        entries.push({
          url: siteUrl(pathFor(locale, key, slug)),
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: alternatesFor(key, slug),
        });
      }
    }
  }

  return entries;
}
