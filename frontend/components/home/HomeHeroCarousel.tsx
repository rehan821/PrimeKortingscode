"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, SparkIcon } from "@/components/ui/icons";

export interface HomeHeroItem {
  id: string;
  storeName: string;
  title: string;
  discountLabel?: string;
  href: string;
  storeHref: string;
  brandColor?: string;
}

const artworkPalettes = [
  { background: "#f6e4d7", accent: "#e47848", secondary: "#f6bd89" },
  { background: "#e3eaf4", accent: "#4665a8", secondary: "#9cb2df" },
  { background: "#f2e8f3", accent: "#8a4d9d", secondary: "#d3a8df" },
  { background: "#e5f1e8", accent: "#387c5a", secondary: "#95c8a5" },
  { background: "#f9edcf", accent: "#9a6623", secondary: "#e9c16f" },
];

function PromoArtwork({ item, index, side }: { item: HomeHeroItem; index: number; side: "left" | "right" }) {
  const palette = artworkPalettes[index % artworkPalettes.length];
  const photo = side === "left"
    ? index === 3 ? "/images/home/hero-beauty.webp" : index === 4 ? "/images/home/hero-phone.webp" : undefined
    : index === 5 ? "/images/home/hero-serum.webp" : index === 4 ? "/images/home/hero-flowers.webp" : undefined;

  return (
    <div className={`relative min-h-[180px] overflow-hidden sm:min-h-[390px] lg:min-h-[430px] ${side === "right" ? "hidden sm:block" : "rounded-l-[2.25rem]"} ${side === "right" ? "rounded-r-[2.25rem]" : ""}`} style={{ backgroundColor: palette.background }} aria-hidden="true">
      {photo ? <Image src={photo} alt="" fill sizes="(min-width: 1024px) 42vw, 80vw" className="object-cover" /> : null}
      {!photo ? <>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(${palette.accent} 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
      <div className="absolute -left-10 top-8 size-52 rounded-full border-[34px] opacity-30" style={{ borderColor: palette.secondary }} />
      <div className="absolute -bottom-16 right-[-2.5rem] size-64 rounded-full" style={{ backgroundColor: palette.secondary }} />
      <div className="absolute left-[18%] top-[24%] flex h-44 w-36 rotate-[-8deg] flex-col justify-between rounded-[1.35rem] border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-sm">
        <span className="flex size-9 items-center justify-center rounded-full text-white" style={{ backgroundColor: item.brandColor ?? palette.accent }}><SparkIcon size={19} /></span>
        <span className="line-clamp-3 text-sm font-black leading-tight text-ink-900">{item.title}</span>
        <span className="text-[0.65rem] font-bold uppercase tracking-[.13em] text-ink-500">{item.storeName}</span>
      </div>
      <div className="absolute bottom-[14%] right-[12%] flex size-28 rotate-[10deg] items-center justify-center rounded-full border-[7px] border-white text-center text-xs font-black uppercase leading-tight text-white shadow-lg" style={{ backgroundColor: item.brandColor ?? palette.accent }}>
        {item.discountLabel ?? "Shop & save"}
      </div>
      <span className="absolute right-[18%] top-[14%] size-5 rounded-full" style={{ backgroundColor: palette.accent }} />
      </> : null}
    </div>
  );
}

/** Wide, horizontally browsable homepage promo cards with original CSS artwork. */
export function HomeHeroCarousel({ items, labels }: { items: HomeHeroItem[]; labels: { previous: string; next: string; view: string } }) {
  const rail = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(() => Math.min(3, Math.max(items.length - 1, 0)));

  useEffect(() => {
    const container = rail.current;
    const firstSlide = Math.min(3, Math.max(items.length - 1, 0));
    const slide = container?.children.item(firstSlide) as HTMLElement | null;
    if (!container || !slide) return;
    container.scrollLeft = slide.offsetLeft - (container.clientWidth - slide.clientWidth) / 2;
  }, [items.length]);

  if (items.length === 0) return null;

  const scroll = (direction: -1 | 1) => rail.current?.scrollBy({ left: direction * Math.max(rail.current.clientWidth * 0.82, 420), behavior: "smooth" });
  const goTo = (index: number) => {
    const slide = rail.current?.children.item(index) as HTMLElement | null;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };
  const updateActive = () => {
    if (!rail.current) return;
    const center = rail.current.scrollLeft + rail.current.clientWidth / 2;
    const slides = Array.from(rail.current.children) as HTMLElement[];
    const nearest = slides.reduce((best, slide, index) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    setActiveIndex(nearest.index);
  };

  return (
    <section aria-label={labels.view} className="relative">
      <div ref={rail} onScroll={updateActive} className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1.5rem,calc((100vw-1560px)/2))] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => (
          <article key={item.id} className="grid w-[84vw] max-w-[1560px] flex-none snap-center grid-cols-[.62fr_1fr] overflow-hidden rounded-[2.25rem] bg-white shadow-[0_12px_38px_rgba(27,23,34,.09)] sm:grid-cols-[.72fr_.76fr_1.35fr]">
            <PromoArtwork item={item} index={index} side="left" />
            <div className="flex min-h-[310px] flex-col justify-center px-5 py-7 sm:px-7 lg:px-10">
              <Link href={item.storeHref} className="mb-6 w-fit rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm font-extrabold text-ink-700 hover:border-brand-300 hover:text-brand-700">{item.storeName}</Link>
              {item.discountLabel ? <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-700">{item.discountLabel}</p> : null}
              <h2 className="mt-3 line-clamp-4 text-2xl font-semibold leading-[1.2] tracking-tight text-ink-950 sm:text-3xl">{item.title}</h2>
              <Link href={item.href} className="mt-7 inline-flex w-fit items-center gap-2 border-b-2 border-ink-900 pb-1 text-sm font-extrabold uppercase tracking-[.12em] text-ink-950 transition hover:border-brand-700 hover:text-brand-700">
                {labels.view}<ArrowRightIcon size={16} />
              </Link>
            </div>
            <PromoArtwork item={item} index={index + 2} side="right" />
          </article>
        ))}
      </div>
      {items.length > 1 ? <div className="pointer-events-none absolute inset-x-4 top-1/2 hidden -translate-y-1/2 justify-between sm:flex">
        <button type="button" onClick={() => scroll(-1)} aria-label={labels.previous} className="pointer-events-auto flex size-12 items-center justify-center rounded-full bg-ink-950 text-white shadow-xl transition hover:scale-105 hover:bg-brand-700"><ChevronLeftIcon size={22} /></button>
        <button type="button" onClick={() => scroll(1)} aria-label={labels.next} className="pointer-events-auto flex size-12 items-center justify-center rounded-full bg-ink-950 text-white shadow-xl transition hover:scale-105 hover:bg-brand-700"><ChevronRightIcon size={22} /></button>
      </div> : null}
      {items.length > 1 ? <div className="mt-2 flex justify-center gap-2" aria-label={labels.view}>{items.slice(0, 7).map((item, index) => <button type="button" key={item.id} onClick={() => goTo(index)} aria-label={`${labels.view}: ${item.storeName}`} aria-current={activeIndex === index ? "true" : undefined} className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-6 bg-brand-700" : "w-2.5 bg-ink-200 hover:bg-ink-400"}`} />)}</div> : null}
    </section>
  );
}
