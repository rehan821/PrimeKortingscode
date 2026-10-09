"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/lib/navigation";
import { ChevronDownIcon } from "@/components/ui/icons";

import { toPublicPathname } from "@/lib/routes";

/** Desktop primary navigation with active-state highlighting. */
export function NavLinks({
  items,
  label,
  className,
}: {
  items: NavItem[];
  label: string;
  className?: string;
}) {
  const pathname = toPublicPathname(usePathname());
  const stores = items.find((item) => item.key === "stores");
  const categories = items.find((item) => item.key === "categories");
  const deals = items.find((item) => item.key === "deals");
  const coupons = items.find((item) => item.key === "coupons");
  const blog = items.find((item) => item.key === "blog");
  const primary = [deals, stores, coupons, blog].filter((item): item is NavItem => Boolean(item));

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-1">
        {primary.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          if (item.key === "stores" || item.key === "blog") {
            const isStores = item.key === "stores";
            const subItem = isStores ? categories : undefined;
            return (
              <li key={item.key} className="relative">
                <details className="group relative">
                  <summary className={cn(
                    "inline-flex h-11 cursor-pointer list-none items-center gap-1.5 border-b-2 px-3 text-[13px] font-bold text-white/95 transition hover:border-white/55 hover:text-white marker:hidden",
                    active || (subItem && (pathname === subItem.href || pathname.startsWith(`${subItem.href}/`))) ? "border-white" : "border-transparent",
                  )}>
                    {item.label}<ChevronDownIcon size={14} className="transition group-open:rotate-180" />
                  </summary>
                  <div className="absolute left-0 top-[calc(100%+0.65rem)] z-[70] min-w-52 rounded-xl border border-ink-200 bg-white p-2 text-ink-900 shadow-[0_12px_34px_rgba(27,23,34,.2)]">
                    <Link href={item.href} className="block rounded-lg px-3 py-2.5 text-sm font-bold text-ink-800 hover:bg-brand-50 hover:text-brand-700">
                      {isStores ? (item.label) : (item.label)}
                    </Link>
                    {subItem ? <Link href={subItem.href} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700">{subItem.label}</Link> : null}
                  </div>
                </details>
              </li>
            );
          }
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 items-center border-b-2 px-3 text-[13px] font-bold transition-colors",
                  active
                    ? "border-white text-white"
                    : "border-transparent text-white/90 hover:border-white/55 hover:text-white",
                )}
              >
                  {item.key === "deals" ? (item.label === "Aanbiedingen" ? "Najaarsdeals" : "Fall Deals") : item.key === "coupons" ? (item.label === "Kortingscodes" ? "Cashback" : "Cash Back") : item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
