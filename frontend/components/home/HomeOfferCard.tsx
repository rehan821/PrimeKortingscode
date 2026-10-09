import Link from "next/link";
import Image from "next/image";
import type { CouponWithRelations, DealWithRelations, Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { GetCodeButton } from "@/components/coupon/GetCodeButton";
import { GetDealButton } from "@/components/coupon/GetDealButton";
import { getBrandForegroundColor } from "@/components/store/StoreLogo";

type Offer = CouponWithRelations | DealWithRelations;

const artColors = ["#d9e8e1", "#f4ded3", "#dbe5f7", "#f4e7b9", "#eadcf1"];
const coloredLogoPanels = new Set(["bol.com", "coolblue", "mediamarkt", "booking.com", "gnc", "walmart", "shein", "ulta", "home depot", "at&t wireless", "macy's", "lane bryant"]);

export function HomeOfferCard({ offer, locale, dict, index = 0, orientation = "vertical", showAction = true }: { offer: Offer; locale: Locale; dict: Dictionary; index?: number; orientation?: "vertical" | "horizontal"; showAction?: boolean }) {
  const isDeal = offer.type === "deal";
  const detailHref = pathFor(locale, isDeal ? "deal" : "coupon", offer.slug);
  const storeHref = pathFor(locale, "store", offer.store.slug);
  const useBrandPanel = coloredLogoPanels.has(offer.store.name.toLowerCase());
  const brandForeground = offer.store.brandColor ? getBrandForegroundColor(offer.store.brandColor) : "#27232d";
  const logoTextColor = useBrandPanel ? brandForeground : brandForeground === "#ffffff" ? "#27232d" : offer.store.brandColor ?? "#27232d";
  const featurePhoto = orientation === "horizontal" && index === 0
    ? "/images/home/feature-ancestry.webp"
    : orientation === "horizontal" && index === 1
      ? "/images/home/feature-wine.webp"
      : undefined;

  return (
    <article className={`group flex h-full overflow-hidden rounded-xl border border-ink-200 bg-white shadow-[0_3px_14px_rgba(27,23,34,.05)] transition duration-200 hover:-translate-y-1 hover:shadow-pop ${orientation === "horizontal" ? "min-h-[220px] flex-row" : "min-h-[17.375rem] flex-col"}`}>
      <Link href={detailHref} className={`relative flex items-center justify-center overflow-hidden ${orientation === "horizontal" ? "order-2 min-w-0 flex-[.82]" : "h-[8.25rem] after:absolute after:inset-x-7 after:bottom-0 after:border-b after:border-ink-200"}`} style={{ backgroundColor: orientation === "vertical" ? useBrandPanel ? offer.store.brandColor ?? "#27232d" : "#ffffff" : artColors[index % artColors.length] }} aria-label={offer.title}>
        {featurePhoto ? <Image src={featurePhoto} alt="" fill sizes="(min-width: 768px) 18vw, 50vw" className="object-cover" /> : null}
        {!featurePhoto ? <>
          <div className="relative flex max-w-[88%] items-center justify-center px-4 text-center transition group-hover:scale-105">
            <span className="line-clamp-2 text-3xl font-black leading-[.95] tracking-[-.06em] sm:text-4xl" style={{ color: orientation === "vertical" ? logoTextColor : "#27232d" }}>{offer.store.name}</span>
          </div>
        </> : null}
        {offer.discountLabel && !featurePhoto ? <span className="absolute left-3 top-3 max-w-[75%] rounded-md bg-white px-3 py-1.5 text-xs font-black text-ink-950 shadow-card">{offer.discountLabel}</span> : null}
      </Link>

      <div className={`flex flex-1 flex-col p-3 ${orientation === "horizontal" ? "order-1 justify-center sm:p-5" : ""}`}>
        <Link href={storeHref} className="text-[0.68rem] font-extrabold uppercase tracking-[.12em] text-ink-500 hover:text-brand-700">{offer.store.name}</Link>
        <h3 className="mt-2 line-clamp-3 text-base font-extrabold leading-snug text-ink-950 group-hover:text-brand-700">
          <Link href={detailHref}>{offer.title}</Link>
        </h3>
        {showAction ? <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          {isDeal ? <GetDealButton redirectUrl={offer.redirectUrl} fallbackHref={storeHref} storeName={offer.store.name} dict={dict} size="sm" className={orientation === "horizontal" ? "w-full justify-center" : "w-fit justify-center"} /> : <GetCodeButton coupon={offer as CouponWithRelations} locale={locale} dict={dict} size="sm" className={orientation === "horizontal" ? "w-full justify-center" : "w-fit justify-center"} />}
        </div> : null}
      </div>
    </article>
  );
}
