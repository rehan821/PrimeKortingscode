import { getCoupons } from "@/services/coupons";
import { getDeals } from "@/services/deals";
import { getStores } from "@/services/stores";
import { pathFor } from "@/lib/routes";
import type { Locale } from "@/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
  const localeParam = url.searchParams.get("locale");
  const locale: Locale = localeParam === "en" ? "en" : "nl";

  if (q.length < 2) return Response.json({ items: [] });

  const [stores, coupons, deals] = await Promise.all([
    getStores({ locale, q, perPage: 4, sort: "popular" }),
    getCoupons({ locale, q, perPage: 4, sort: "popular" }),
    getDeals({ locale, q, perPage: 4, sort: "popular" }),
  ]);

  const items = [
    ...stores.items.map((store) => ({
      id: store.id,
      kind: "store" as const,
      title: store.name,
      href: pathFor(locale, "store", store.slug),
    })),
    ...coupons.items.map((coupon) => ({
      id: coupon.id,
      kind: "coupon" as const,
      title: coupon.title,
      storeName: coupon.store.name,
      discountLabel: coupon.discountLabel,
      href: pathFor(locale, "coupon", coupon.slug),
    })),
    ...deals.items.map((deal) => ({
      id: deal.id,
      kind: "deal" as const,
      title: deal.title,
      storeName: deal.store.name,
      discountLabel: deal.discountLabel,
      href: pathFor(locale, "deal", deal.slug),
    })),
  ].slice(0, 8);

  return Response.json({ items }, { headers: { "Cache-Control": "no-store" } });
}
