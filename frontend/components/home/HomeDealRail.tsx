"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "@/components/ui/icons";

export interface HomeDealRailItem {
  id: string;
  storeName: string;
  title: string;
  discountLabel?: string;
  href: string;
  brandColor?: string;
}

export function HomeDealRail({ items, locale }: { items: HomeDealRailItem[]; locale: "nl" | "en" }) {
  const rail = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;

  const scroll = (direction: -1 | 1) => rail.current?.scrollBy({ left: direction * Math.max(rail.current.clientWidth * 0.8, 400), behavior: "smooth" });

  return (
    <section aria-labelledby="home-today-deals" className="group relative">
      <div ref={rail} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => (
          <article key={item.id} className="flex w-[300px] flex-none snap-start overflow-hidden rounded-xl bg-white shadow-card sm:w-[350px]">
            <Link href={item.href} className={`relative flex w-[118px] shrink-0 items-center justify-center overflow-hidden ${index % 2 ? "bg-[#e8edf7]" : "bg-[#f5e8dd]"}`} aria-label={item.title}>
              <span aria-hidden="true" className="absolute -left-8 -top-8 size-28 rounded-full border-[18px] border-white/50" />
              <span aria-hidden="true" className="absolute -bottom-7 -right-8 size-28 rounded-full" style={{ backgroundColor: item.brandColor ?? (index % 2 ? "#7b8fb7" : "#d0936a"), opacity: 0.35 }} />
              <span className="relative flex size-16 items-center justify-center rounded-full border-4 border-white bg-white text-center text-[0.62rem] font-black leading-tight text-ink-800 shadow-md">{item.storeName}</span>
            </Link>
            <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
              {item.discountLabel ? <p className="text-[0.67rem] font-black uppercase tracking-[.1em] text-brand-700">{item.discountLabel}</p> : null}
              <h3 className="mt-1.5 line-clamp-3 text-sm font-bold leading-snug text-ink-900"><Link href={item.href} className="hover:text-brand-700">{item.title}</Link></h3>
              <Link href={item.href} className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-ink-100 px-3 py-1.5 text-xs font-extrabold text-ink-800 transition hover:bg-brand-100 hover:text-brand-800">{locale === "nl" ? "Bekijk deal" : "View deal"}<ArrowRightIcon size={12} /></Link>
            </div>
          </article>
        ))}
      </div>
      {items.length > 2 ? <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 hidden items-center justify-between sm:flex">
        <button type="button" aria-label={locale === "nl" ? "Vorige deals" : "Previous deals"} onClick={() => scroll(-1)} className="pointer-events-none flex size-12 items-center justify-center rounded-full border border-ink-200 bg-white/95 text-ink-900 opacity-0 shadow-pop transition duration-200 hover:border-brand-500 hover:bg-white hover:text-brand-700 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"><ChevronLeftIcon size={21} /></button>
        <button type="button" aria-label={locale === "nl" ? "Volgende deals" : "Next deals"} onClick={() => scroll(1)} className="pointer-events-none flex size-12 items-center justify-center rounded-full border border-ink-200 bg-white/95 text-ink-900 opacity-0 shadow-pop transition duration-200 hover:border-brand-500 hover:bg-white hover:text-brand-700 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"><ChevronRightIcon size={21} /></button>
      </div> : null}
    </section>
  );
}
